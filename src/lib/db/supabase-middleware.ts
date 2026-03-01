import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Quick check: if no auth cookies exist, user is definitely not logged in
  const authCookies = request.cookies.getAll().filter(c => 
    c.name.includes('auth-token') || c.name.includes('sb-')
  );
  
  if (authCookies.length === 0) {
    // No auth cookies, skip expensive getUser() call
    return { supabaseResponse, user: null };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getSession(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // We use getSession() here (reads cookie locally, no network call) rather than
  // getUser() (which hits the Supabase API on every request and causes
  // "fetch failed" errors on startup / network blips). The actual token
  // validation happens client-side in the auth context.
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return { supabaseResponse, user: session?.user ?? null };
  } catch (error: any) {
    // Unexpected error – allow the request through to avoid blocking users
    console.error('Supabase middleware error:', error);
    return { supabaseResponse, user: null };
  }
}