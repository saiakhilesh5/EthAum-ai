'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@src/lib/db/supabase';
import { useRouter } from 'next/navigation';

interface UserProfile {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache keys for session storage
const PROFILE_CACHE_KEY = 'ethaum_profile_cache';
const CACHE_EXPIRY_KEY = 'ethaum_cache_expiry';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter for fresher data)

// Get cached profile from sessionStorage
const getCachedProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const expiry = sessionStorage.getItem(CACHE_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
      sessionStorage.removeItem(PROFILE_CACHE_KEY);
      sessionStorage.removeItem(CACHE_EXPIRY_KEY);
      return null;
    }
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

// Cache profile to sessionStorage
const setCachedProfile = (profile: UserProfile | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (profile) {
      sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
      sessionStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION));
    } else {
      sessionStorage.removeItem(PROFILE_CACHE_KEY);
      sessionStorage.removeItem(CACHE_EXPIRY_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with cached profile for faster hydration
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => getCachedProfile());
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      setCachedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      setCachedProfile(null);
    }
  }, []);

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Initialize auth state - optimized for speed
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for cached profile first - show immediately
        const cachedProfile = getCachedProfile();
        if (cachedProfile && mounted) {
          setProfile(cachedProfile);
          // If we have cached profile, we can assume user is logged in
          // Set loading false early for better UX
          setIsLoading(false);
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch fresh profile if no cache or cache expired
          if (!cachedProfile) {
            await fetchProfile(session.user.id);
          } else {
            // Refresh profile in background
            fetchProfile(session.user.id);
          }
        } else {
          // No session, clear cache
          setProfile(null);
          setCachedProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setCachedProfile(null);
        }

        // Refresh router to update server components on auth changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          router.refresh();
        }

        if (event === 'SIGNED_OUT') {
          setCachedProfile(null);
          router.refresh();
          router.push('/');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, fetchProfile]);

  // Sign up function
  const signUp = async (email: string, password: string, fullName: string, userType: string) => {
    try {
      // Get the current origin for email redirect (works for both localhost and production)
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/login?confirmed=true`
        : process.env.NEXT_PUBLIC_SITE_URL 
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/login?confirmed=true`
          : 'http://localhost:3000/login?confirmed=true';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string, expectedUserType?: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      // Validate user type if expected type is provided
      if (expectedUserType && data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.user_type !== expectedUserType) {
          await supabase.auth.signOut();
          return { 
            error: { 
              message: `This email is registered as a ${profile.user_type}. Please use the correct login option.` 
            } 
          };
        }
      }

      // Update state immediately so UI reflects logged-in state
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        // Fetch and set profile immediately
        await fetchProfile(data.user.id);
      }

      // Refresh router to update server components after sign in
      router.refresh();

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Sign out function
  const signOut = useCallback(async () => {
    setCachedProfile(null);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    router.refresh();
    router.push('/');
  }, [router]);

  const value = {
    user,
    profile,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}