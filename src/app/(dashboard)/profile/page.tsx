'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@src/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { isStartup, isEnterprise, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isStartup) {
        router.replace('/profile/startup');
      } else if (isEnterprise) {
        router.replace('/profile/enterprise');
      }
    }
  }, [isStartup, isEnterprise, isLoading, router]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Skeleton className="h-8 w-32 sm:w-48" />
      <Skeleton className="h-48 sm:h-64 w-full" />
    </div>
  );
}