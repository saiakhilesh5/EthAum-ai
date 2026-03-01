import { updateSession } from '@src/lib/db/supabase-middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/launches/new',
  '/launches',
  '/profile',
  '/settings',
  '/matchmaking',
  '/reviews',
  '/insights',
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Skip session check for unrelated routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // For RSC / client-side navigation, skip server auth check for speed.
  // The client AuthProvider + page-level guards handle redirects for these.
  const isRSCRequest =
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-State-Tree') !== null;

  if (isRSCRequest) {
    return NextResponse.next();
  }

  // Full page load — validate session via cookie (no network call)
  const { supabaseResponse, user } = await updateSession(request);

  // Unauthenticated user trying to access a protected route
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Authenticated user trying to access login/register
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
