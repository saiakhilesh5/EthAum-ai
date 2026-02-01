import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // requests per minute for general API
const MAX_REQUESTS_AI = 20; // requests per minute for AI endpoints

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

function rateLimit(
  identifier: string,
  maxRequests: number = MAX_REQUESTS_PER_WINDOW
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    // New window
    rateLimitStore.set(identifier, { count: 1, timestamp: now });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: now + RATE_LIMIT_WINDOW,
    };
  }

  if (entry.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: entry.timestamp + RATE_LIMIT_WINDOW,
    };
  }

  entry.count++;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - entry.count,
    reset: entry.timestamp + RATE_LIMIT_WINDOW,
  };
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  maxRequests?: number
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Get identifier (IP or user ID from auth)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'anonymous';
    
    // Check if it's an AI endpoint
    const isAIEndpoint = req.nextUrl.pathname.startsWith('/api/ai');
    const limit = maxRequests || (isAIEndpoint ? MAX_REQUESTS_AI : MAX_REQUESTS_PER_WINDOW);
    
    const identifier = `${ip}:${req.nextUrl.pathname}`;
    const result = rateLimit(identifier, limit);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests', 
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(req);

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toString());

    return response;
  };
}

// Security headers for API responses
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(self), geolocation=()'
  );

  return response;
}

// Input sanitization helper
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  
  // Timing-safe comparison
  if (token.length !== storedToken.length) return false;
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
}

// API response helpers
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return addSecurityHeaders(
    NextResponse.json({ success: true, data }, { status })
  );
}

export function errorResponse(
  message: string,
  status: number = 400,
  details?: any
): NextResponse {
  return addSecurityHeaders(
    NextResponse.json(
      { 
        success: false, 
        error: message,
        ...(details && { details })
      },
      { status }
    )
  );
}
