'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@src/lib/db/supabase';
import { useUser } from '@src/hooks/use-user';
import { toast } from 'sonner';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpvoteButtonProps {
  launchId: string;
  initialCount: number;
  initialUpvoted: boolean;
  size?: 'sm' | 'lg';
  onUpvote?: () => void;
}

export function UpvoteButton({
  launchId,
  initialCount,
  initialUpvoted,
  size = 'sm',
  onUpvote,
}: UpvoteButtonProps) {
  const { user, isAuthenticated } = useUser();
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }

    setIsLoading(true);

    try {
      if (upvoted) {
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('launch_id', launchId)
          .eq('user_id', user?.id);

        if (error) throw error;
        setUpvoted(false);
        setCount((prev) => prev - 1);
      } else {
        const { error } = await supabase
          .from('upvotes')
          .insert({ launch_id: launchId, user_id: user?.id });

        if (error) throw error;
        setUpvoted(true);
        setCount((prev) => prev + 1);
      }
      onUpvote?.();
    } catch (error: any) {
      toast.error('Failed to update vote');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (size === 'lg') {
    return (
      <Button
        variant={upvoted ? 'default' : 'outline'}
        className={cn(
          'flex-col h-auto py-4 px-6',
          upvoted && 'bg-primary text-primary-foreground'
        )}
        onClick={handleUpvote}
        disabled={isLoading}
      >
        <ChevronUp className={cn('w-6 h-6', upvoted && 'fill-current')} />
        <span className="text-xl font-bold">{count}</span>
        <span className="text-xs">UPVOTES</span>
      </Button>
    );
  }

  return (
    <Button
      variant={upvoted ? 'default' : 'outline'}
      size="sm"
      className={cn(
        'flex-col h-auto py-2 px-3',
        upvoted && 'bg-primary text-primary-foreground'
      )}
      onClick={handleUpvote}
      disabled={isLoading}
    >
      <ChevronUp className={cn('w-4 h-4', upvoted && 'fill-current')} />
      <span className="text-sm font-semibold">{count}</span>
    </Button>
  );
}
