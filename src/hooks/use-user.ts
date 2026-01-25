'use client';

import { useAuth } from '@src/context/auth-context';

export function useUser() {
  const { user, profile, isLoading } = useAuth();

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isStartup: profile?.user_type === 'startup',
    isEnterprise: profile?.user_type === 'enterprise',
    isAdmin: profile?.user_type === 'admin',
  };
}