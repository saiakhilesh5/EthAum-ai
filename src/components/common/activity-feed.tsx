'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  Star,
  Heart,
  MessageSquare,
  UserPlus,
  Rocket,
  TrendingUp,
  Award,
  Zap,
  RefreshCw,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'review' | 'upvote' | 'match' | 'launch' | 'milestone' | 'funding' | 'feature' | 'comment';
  user: {
    name: string;
    avatar?: string;
    company?: string;
  };
  target?: {
    name: string;
    link?: string;
  };
  content?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  isNew?: boolean;
}

// Demo activities generator
const generateDemoActivities = (): ActivityItem[] => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'review',
      user: { name: 'Sarah Chen', company: 'TechCorp', avatar: '' },
      target: { name: 'CloudSync Pro', link: '/startups/1' },
      content: 'Left a 5-star review',
      metadata: { rating: 5 },
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isNew: true,
    },
    {
      id: '2',
      type: 'match',
      user: { name: 'DataFlow AI', company: 'Startup' },
      target: { name: 'Enterprise Solutions Inc', link: '/matchmaking' },
      content: 'New partnership match',
      metadata: { compatibility: 94 },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isNew: true,
    },
    {
      id: '3',
      type: 'launch',
      user: { name: 'SecureVault', company: 'Startup' },
      target: { name: 'Product Hunt', link: '/launches/1' },
      content: 'Launched on Product Hunt',
      metadata: { upvotes: 127 },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: '4',
      type: 'upvote',
      user: { name: 'Mike Johnson', company: 'InnovateCo' },
      target: { name: 'AI Assistant Pro', link: '/startups/2' },
      content: 'Upvoted',
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
    },
    {
      id: '5',
      type: 'funding',
      user: { name: 'GrowthMetrics', company: 'Startup' },
      content: 'Announced Series A funding',
      metadata: { amount: '$5.2M' },
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: '6',
      type: 'milestone',
      user: { name: 'CloudSync Pro', company: 'Startup' },
      content: 'Reached 1,000 customers',
      metadata: { milestone: '1K customers' },
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      id: '7',
      type: 'comment',
      user: { name: 'Lisa Wang', company: 'DataFirst' },
      target: { name: 'API Toolkit', link: '/startups/3' },
      content: 'Commented on review',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
    },
    {
      id: '8',
      type: 'feature',
      user: { name: 'SmartDocs', company: 'Startup' },
      content: 'Featured as Top Pick',
      metadata: { category: 'Productivity' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];
  return activities;
};

const activityConfig = {
  review: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  upvote: { icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  match: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  launch: { icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  milestone: { icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
  funding: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  feature: { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10' },
  comment: { icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
};

interface ActivityFeedProps {
  compact?: boolean;
  maxItems?: number;
  showHeader?: boolean;
}

export default function ActivityFeed({
  compact = false,
  maxItems = 10,
  showHeader = true,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [expanded, setExpanded] = useState(!compact);
  const [newCount, setNewCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initial load
    setTimeout(() => {
      setActivities(generateDemoActivities());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['review', 'upvote', 'match', 'launch', 'comment'][Math.floor(Math.random() * 5)] as any,
        user: {
          name: ['Alex Kim', 'Jordan Lee', 'Casey Smith', 'Morgan Chen'][Math.floor(Math.random() * 4)],
          company: ['TechStart', 'InnovateLab', 'GrowthCo', 'DataDriven'][Math.floor(Math.random() * 4)],
        },
        target: {
          name: ['CloudSync', 'DataFlow', 'SecureVault', 'AI Tools'][Math.floor(Math.random() * 4)],
          link: '/startups/1',
        },
        content: 'Just happened',
        timestamp: new Date(),
        isNew: true,
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, maxItems - 1)]);
      setNewCount((prev) => prev + 1);

      // Play sound if enabled
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      // Remove "new" flag after 5 seconds
      setTimeout(() => {
        setActivities((prev) =>
          prev.map((a) =>
            a.id === newActivity.id ? { ...a, isNew: false } : a
          )
        );
      }, 5000);
    }, 15000); // New activity every 15 seconds

    return () => clearInterval(interval);
  }, [isLive, soundEnabled, maxItems]);

  const refreshFeed = () => {
    setIsLoading(true);
    setNewCount(0);
    setTimeout(() => {
      setActivities(generateDemoActivities());
      setIsLoading(false);
    }, 500);
  };

  const displayedActivities = expanded ? activities.slice(0, maxItems) : activities.slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Notification sound (silent by default) */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {showHeader && (
        <CardHeader className="pb-3 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                Activity Feed
                {newCount > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {newCount} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Real-time updates</CardDescription>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute notifications' : 'Enable sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
                ) : (
                  <VolumeX className="w-3 h-3 md:w-4 md:h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={refreshFeed}
                title="Refresh feed"
              >
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Badge
                variant={isLive ? 'default' : 'secondary'}
                className="cursor-pointer gap-1 text-xs"
                onClick={() => setIsLive(!isLive)}
              >
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                {isLive ? 'Live' : 'Paused'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="space-y-1 p-3 md:p-6 pt-0">
        {displayedActivities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className={`flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all duration-300 hover:bg-muted/50 ${
                activity.isNew ? 'bg-primary/5 animate-pulse' : ''
              }`}
            >
              <div className={`p-1.5 md:p-2 rounded-full ${config.bg} flex-shrink-0`}>
                <Icon className={`w-3 h-3 md:w-4 md:h-4 ${config.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs md:text-sm">
                      <span className="font-medium">{activity.user.name}</span>
                      {activity.user.company && (
                        <span className="text-muted-foreground hidden sm:inline"> from {activity.user.company}</span>
                      )}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {activity.content}
                      {activity.target && (
                        <>
                          {' '}
                          <Link
                            href={activity.target.link || '#'}
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {activity.target.name}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {activity.metadata?.rating && (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {activity.metadata.rating}
                      </Badge>
                    )}
                    {activity.metadata?.compatibility && (
                      <Badge variant="secondary">{activity.metadata.compatibility}% match</Badge>
                    )}
                    {activity.metadata?.upvotes && (
                      <Badge variant="secondary">🔥 {activity.metadata.upvotes}</Badge>
                    )}
                    {activity.metadata?.amount && (
                      <Badge variant="secondary" className="text-green-600">
                        {activity.metadata.amount}
                      </Badge>
                    )}
                    {activity.isNew && (
                      <Badge variant="destructive" className="text-xs">NEW</Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}

        {compact && activities.length > 3 && (
          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show {activities.length - 3} More
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
