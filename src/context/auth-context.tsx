'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@src/lib/db/supabase';
import { useRouter } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  user_type: 'startup' | 'enterprise' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, userType: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, expectedUserType?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ─── Profile cache (localStorage) ─────────────────────────────────────────
// Used only for instant first-render while DB fetch is in-flight.
// Never treated as source-of-truth — always verified against DB after init.

const CACHE_KEY = 'ethaum_profile_v2';

function readCache(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch { return null; }
}

function writeCache(p: UserProfile | null) {
  if (typeof window === 'undefined') return;
  try {
    if (p) localStorage.setItem(CACHE_KEY, JSON.stringify(p));
    else localStorage.removeItem(CACHE_KEY);
  } catch {}
}

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => readCache());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const fetchingForRef = useRef<string | null>(null);

  // ── fetchProfile ──────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url, user_type')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      writeCache(data);
      setProfile(data);
      return data;
    } catch { return null; }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // ── Initialization ────────────────────────────────────────────────────────
  // Pattern: getSession() (local read, no network) -> fetch profile -> set isLoading=false
  // isLoading stays true until BOTH session check AND profile fetch are done.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (cancelled) return;

        if (s?.user) {
          setSession(s);
          setUser(s.user);
          fetchingForRef.current = s.user.id;
          await fetchProfile(s.user.id);
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
          writeCache(null);
        }
      } catch (err) {
        console.error('[auth] init error:', err);
        setUser(null);
        setSession(null);
        setProfile(null);
        writeCache(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth state change listener ────────────────────────────────────────────
  // RULE: this listener ONLY updates state variables — it NEVER navigates.
  // Navigation on SIGNED_OUT caused: "clear site data -> auto-redirect away from /login"
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'INITIAL_SESSION') return; // handled in init()

        if (event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          return;
        }

        if (event === 'SIGNED_IN') {
          if (newSession?.user && fetchingForRef.current !== newSession.user.id) {
            setSession(newSession);
            setUser(newSession.user);
            fetchingForRef.current = newSession.user.id;
            await fetchProfile(newSession.user.id);
          }
          return;
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setProfile(null);
          writeCache(null);
          fetchingForRef.current = null;
          // No navigation — only signOut() function navigates
          return;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── signUp ────────────────────────────────────────────────────────────────
  const signUp = useCallback(async (
    email: string, password: string, fullName: string, userType: string
  ): Promise<{ error: any }> => {
    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/login?confirmed=true`
          : `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/login?confirmed=true`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl, data: { full_name: fullName, user_type: userType } },
      });

      return { error: error ? { message: toFriendlyError(error.message) } : null };
    } catch (err: any) {
      return { error: { message: toFriendlyError(err?.message) } };
    }
  }, []);

  // ── signIn ────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (
    email: string, password: string, expectedUserType?: string
  ): Promise<{ error: any }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) return { error: { message: toFriendlyError(error.message) } };
      if (!data.session || !data.user) return { error: { message: 'Sign in failed. Please try again.' } };

      if (expectedUserType) {
        const { data: p } = await supabase.from('users').select('user_type').eq('id', data.user.id).single();
        if (p && p.user_type !== expectedUserType) {
          await supabase.auth.signOut();
          return { error: { message: `This account is a ${p.user_type} account. Please use the correct sign-in option.` } };
        }
      }

      // Set state immediately so UI responds before redirect
      fetchingForRef.current = data.user.id;
      setSession(data.session);
      setUser(data.user);
      await fetchProfile(data.user.id);

      return { error: null };
    } catch (err: any) {
      return { error: { message: toFriendlyError(err?.message) } };
    }
  }, [fetchProfile]);

  // ── signOut ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    writeCache(null);
    fetchingForRef.current = null;
    try { await supabase.auth.signOut(); } catch {}
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Error helpers ─────────────────────────────────────────────────────────

function toFriendlyError(msg?: string): string {
  if (!msg) return 'Something went wrong. Please try again.';
  const m = msg.toLowerCase();
  if (m.includes('fetch') || m.includes('network') || m.includes('failed to fetch') || m.includes('econnrefused'))
    return 'Cannot reach the server. Please check your connection and try again.';
  if (m.includes('invalid login credentials') || m.includes('invalid_grant'))
    return 'Incorrect email or password.';
  if (m.includes('email not confirmed'))
    return 'Please confirm your email before signing in.';
  if (m.includes('too many requests'))
    return 'Too many attempts. Please wait a moment and try again.';
  if (m.includes('user already registered'))
    return 'An account with this email already exists. Please sign in instead.';
  return msg;
}
