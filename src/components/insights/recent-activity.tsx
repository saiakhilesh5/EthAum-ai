'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ThumbsUp,
  Star,
  MessageSquare,
  Users,
  Rocket,
  Award,
  TrendingUp,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'upvote' | 'review' | 'comment' | 'match' | 'launch' | 'badge' | 'mention';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  activities: Activity[];
  maxHeight?: number;
}

export default function RecentActivity({ activities, maxHeight = 400 }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'upvote':
        return <ThumbsUp className="w-4 h-4 text-primary" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'match':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'launch':
        return <Rocket className="w-4 h-4 text-purple-500" />;
      case 'badge':
        return <Award className="w-4 h-4 text-orange-500" />;
      case 'mention':
        return <TrendingUp className="w-4 h-4 text-pink-500" />;
    }
  };

  const getActivityBadge = (type: Activity['type']) => {
    switch (type) {
      case 'upvote':
        return <Badge variant="secondary">Upvote</Badge>;
      case 'review':
        return <Badge variant="secondary">Review</Badge>;
      case 'comment':
        return <Badge variant="secondary">Comment</Badge>;
      case 'match':
        return <Badge className="bg-green-500 text-white">Match</Badge>;
      case 'launch':
        return <Badge className="bg-purple-500 text-white">Launch</Badge>;
      case 'badge':
        return <Badge className="bg-orange-500 text-white">Badge</Badge>;
      case 'mention':
        return <Badge variant="outline">Mention</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ maxHeight }} className="px-6 pb-6">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {activity.user && (
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-sm font-medium truncate">
                        {activity.title}
                      </span>
                      {getActivityBadge(activity.type)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
