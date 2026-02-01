'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@src/lib/db/supabase';
import { useUser } from '@src/hooks/use-user';
import { toast } from 'sonner';
import {
  ChevronUp,
  MessageSquare,
  Eye,
  ExternalLink,
  Rocket,
  Award,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchCardProps {
  launch: {
    id: string;
    title: string;
    tagline: string;
    thumbnail_url: string | null;
    upvote_count: number;
    comment_count: number;
    view_count: number;
    launch_date: string;
    status: string;
    is_featured: boolean;
    featured_badge: string | null;
    startup: {
      id: string;
      name: string;
      logo_url: string | null;
      slug: string;
      industry: string;
      stage: string;
    };
  };
  userUpvoted?: boolean;
  rank?: number;
  onUpvote?: () => void;
}

export function LaunchCard({ launch, userUpvoted = false, rank, onUpvote }: LaunchCardProps) {
  const { user, isAuthenticated } = useUser();
  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvoteCount, setUpvoteCount] = useState(launch.upvote_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }

    setIsLoading(true);

    try {
      if (upvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('launch_id', launch.id)
          .eq('user_id', user?.id);

        if (error) throw error;
        setUpvoted(false);
        setUpvoteCount((prev) => prev - 1);
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({ launch_id: launch.id, user_id: user?.id });

        if (error) throw error;
        setUpvoted(true);
        setUpvoteCount((prev) => prev + 1);
      }
      onUpvote?.();
    } catch (error: any) {
      toast.error('Failed to update vote');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'series_a':
        return 'bg-blue-100 text-blue-800';
      case 'series_b':
        return 'bg-green-100 text-green-800';
      case 'series_c':
        return 'bg-purple-100 text-purple-800';
      case 'series_d':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStage = (stage: string) => {
    return stage.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Link href={`/launches/${launch.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Rank */}
            {rank && (
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-2xl font-bold text-muted-foreground">
                  {rank}
                </span>
              </div>
            )}

            {/* Thumbnail */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
              {launch.thumbnail_url ? (
                <img
                  src={launch.thumbnail_url}
                  alt={launch.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={launch.startup.logo_url || ''} />
                    <AvatarFallback>
                      {launch.startup.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                      {launch.title}
                    </h3>
                    {launch.is_featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {launch.featured_badge && (
                      <Badge variant="outline" className="text-xs">
                        {launch.featured_badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                    {launch.tagline}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Rocket className="w-3 h-3" />
                      {launch.startup.name}
                    </span>
                    <Badge variant="secondary" className={cn('text-xs', getStageColor(launch.startup.stage))}>
                      {formatStage(launch.startup.stage)}
                    </Badge>
                    <span>{launch.startup.industry}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {launch.comment_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {launch.view_count}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(launch.launch_date), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Upvote Button */}
                <Button
                  variant={upvoted ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'flex-shrink-0 flex-col h-auto py-2 px-3 min-w-[60px]',
                    upvoted && 'bg-primary text-primary-foreground'
                  )}
                  onClick={handleUpvote}
                  disabled={isLoading}
                >
                  <ChevronUp className={cn('w-4 h-4', upvoted && 'fill-current')} />
                  <span className="text-sm font-semibold">{upvoteCount}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
