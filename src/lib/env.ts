// Environment variable validation
// This ensures all required environment variables are set before the app runs

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const serverOnlyEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY',
  'GOOGLE_GEMINI_API_KEY',
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV',
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];
type ServerEnvVar = typeof serverOnlyEnvVars[number];
type OptionalEnvVar = typeof optionalEnvVars[number];

interface EnvConfig {
  // Public (available on client)
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY?: string;
  NEXT_PUBLIC_APP_URL?: string;
  
  // Server only
  SUPABASE_SERVICE_ROLE_KEY?: string;
  GOOGLE_GEMINI_API_KEY?: string;
  
  // System
  NODE_ENV: 'development' | 'production' | 'test';
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

function validateEnv(): EnvConfig {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  // Check required public variables
  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
    }
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('supabase.co') && !supabaseUrl.includes('localhost')) {
    invalidVars.push(`NEXT_PUBLIC_SUPABASE_URL: Invalid URL format (${supabaseUrl})`);
  }

  // Validate Supabase key format (should be a JWT)
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseKey && !supabaseKey.startsWith('eyJ')) {
    invalidVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY: Invalid key format (should be a JWT starting with "eyJ")');
  }

  // Check server-only variables (only on server)
  if (typeof window === 'undefined') {
    for (const varName of serverOnlyEnvVars) {
      const value = process.env[varName];
      if (!value) {
        console.warn(`⚠️  Optional server env var ${varName} is not set`);
      }
    }

    // Validate service role key if present
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey && !serviceRoleKey.startsWith('eyJ')) {
      invalidVars.push('SUPABASE_SERVICE_ROLE_KEY: Invalid key format (should be a JWT starting with "eyJ")');
    }
  }

  // Report errors
  if (missingVars.length > 0 || invalidVars.length > 0) {
    const errorMessages: string[] = [];
    
    if (missingVars.length > 0) {
      errorMessages.push(`Missing required environment variables:\n  - ${missingVars.join('\n  - ')}`);
    }
    
    if (invalidVars.length > 0) {
      errorMessages.push(`Invalid environment variables:\n  - ${invalidVars.join('\n  - ')}`);
    }

    const fullMessage = `
╔══════════════════════════════════════════════════════════════╗
║                    ENVIRONMENT ERROR                          ║
╠══════════════════════════════════════════════════════════════╣

${errorMessages.join('\n\n')}

To fix this:
1. Copy .env.example to .env.local
2. Fill in the required values from your Supabase dashboard
3. Restart the development server

Need help? Visit: https://supabase.com/dashboard/project/_/settings/api

╚══════════════════════════════════════════════════════════════╝
`;

    // In development, show warning but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.error(fullMessage);
    } else {
      throw new EnvironmentError(fullMessage);
    }
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  };
}

// Export validated config
export const env = validateEnv();

// Helper to check if running on server
export const isServer = typeof window === 'undefined';

// Helper to check if in production
export const isProd = process.env.NODE_ENV === 'production';

// Helper to check if in development
export const isDev = process.env.NODE_ENV === 'development';

// Get the app URL
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

// Export type for use in other files
export type { EnvConfig };
