'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@src/hooks/use-user';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProfileCompletionBannerProps {
  completionPercentage: number;
  missingSteps: string[];
}

export function ProfileCompletionBanner({
  completionPercentage,
  missingSteps,
}: ProfileCompletionBannerProps) {
  const { isStartup, isEnterprise } = useUser();

  if (completionPercentage >= 100) {
    return null;
  }

  const profileLink = isStartup ? '/profile/startup' : '/profile/enterprise';

  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Complete Your Profile
                </h3>
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex flex-wrap gap-2 mt-2">
                {missingSteps.map((step) => (
                  <span
                    key={step}
                    className="inline-flex items-center text-xs text-yellow-700 dark:text-yellow-300"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5" />
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={profileLink}>
              Complete Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}