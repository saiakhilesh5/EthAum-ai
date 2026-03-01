'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { LaunchForm } from '@src/components/launches';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewLaunchPage() {
  const { user, profile, isStartup, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [startup, setStartup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('startups')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setStartup(data);
        }
      } catch (error) {
        console.error('Error fetching startup:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userLoading) {
      fetchStartup();
    }
  }, [user, userLoading]);

  // Show skeleton while auth loads, startup data loads,
  // or while user is known but profile hasn't arrived yet (background fetch race)
  if (userLoading || isLoading || (user && !profile)) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] md:h-[600px] w-full" />
      </div>
    );
  }

  if (!isStartup) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-md mx-auto text-center py-8 md:py-12">
          <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Only startup accounts can create launches.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-md mx-auto text-center py-8 md:py-12">
          <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">Complete Your Profile First</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            You need to create your startup profile before launching a product.
          </p>
          <Link href="/profile/startup">
            <Button>Create Startup Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Link href="/launches" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-3 md:mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Launches
        </Link>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Create New Launch</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Launch your product to gain visibility
        </p>
      </div>

      {/* Launch Form */}
      <LaunchForm startup={startup} />
    </div>
  );
}
