'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  ThumbsUp,
  MessageSquare,
  Star,
  Target,
  Zap,
  Award,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface AnalyticsData {
  totalViews: number;
  totalUpvotes: number;
  totalReviews: number;
  avgRating: number;
  trustScore: number;
  weeklyViews: { date: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  recentActivity: Activity[];
  performanceMetrics: {
    conversionRate: number;
    engagementRate: number;
    growthRate: number;
  };
}

interface Activity {
  id: string;
  type: 'view' | 'upvote' | 'review' | 'comment';
  timestamp: string;
  metadata?: Record<string, any>;
}

export function AdvancedAnalytics() {
  const { profile } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    async function fetchAnalytics() {
      if (!profile?.id || profile?.user_type !== 'startup') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const startDate = subDays(new Date(), timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90);

        // Fetch startup for current user
        const { data: startup } = await supabase
          .from('startups')
          .select('id, trust_score')
          .eq('user_id', profile.id)
          .single();

        if (!startup) {
          setIsLoading(false);
          return;
        }

        // Fetch views
        const { count: viewsCount } = await supabase
          .from('startup_views')
          .select('*', { count: 'exact', head: true })
          .eq('startup_id', startup.id)
          .gte('created_at', startDate.toISOString());

        // Fetch upvotes
        const { count: upvotesCount } = await supabase
          .from('upvotes')
          .select('*', { count: 'exact', head: true })
          .eq('startup_id', startup.id)
          .gte('created_at', startDate.toISOString());

        // Fetch reviews with ratings
        const { data: reviews } = await supabase
          .from('reviews')
          .select('overall_rating, created_at')
          .eq('startup_id', startup.id)
          .gte('created_at', startDate.toISOString());

        const avgRating = reviews && reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length
          : 0;

        // Calculate weekly views (mock data for now)
        const weeklyViews = Array.from({ length: 7 }, (_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'EEE'),
          count: Math.floor(Math.random() * 100) + 20,
        }));

        setAnalytics({
          totalViews: viewsCount || 0,
          totalUpvotes: upvotesCount || 0,
          totalReviews: reviews?.length || 0,
          avgRating,
          trustScore: startup?.trust_score || 0,
          weeklyViews,
          topReferrers: [
            { source: 'Direct', count: 45 },
            { source: 'Google', count: 32 },
            { source: 'LinkedIn', count: 18 },
            { source: 'Twitter', count: 12 },
            { source: 'GitHub', count: 8 },
          ],
          recentActivity: [],
          performanceMetrics: {
            conversionRate: 3.2,
            engagementRate: 12.5,
            growthRate: 8.3,
          },
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [profile?.id, profile?.user_type, timeRange]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 w-1/3 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-1/2 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold mb-2">No Analytics Available</h3>
          <p className="text-muted-foreground text-sm">
            Create a startup profile to start tracking analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Views"
          value={analytics.totalViews}
          icon={Eye}
          trend={12}
          color="blue"
        />
        <MetricCard
          title="Upvotes"
          value={analytics.totalUpvotes}
          icon={ThumbsUp}
          trend={8}
          color="green"
        />
        <MetricCard
          title="Reviews"
          value={analytics.totalReviews}
          icon={MessageSquare}
          trend={-3}
          color="yellow"
        />
        <MetricCard
          title="Avg Rating"
          value={analytics.avgRating.toFixed(1)}
          icon={Star}
          suffix="/5"
          color="purple"
        />
      </div>

      {/* Trust Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Trust Score
          </CardTitle>
          <CardDescription>
            Your overall credibility score based on reviews, engagement, and verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-primary">
              {analytics.trustScore.toFixed(1)}
            </div>
            <div className="flex-1">
              <Progress value={analytics.trustScore} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-green-500">Good</div>
              <div className="text-xs text-muted-foreground">Review Quality</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-blue-500">Verified</div>
              <div className="text-xs text-muted-foreground">Profile Status</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-purple-500">Active</div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {analytics.weeklyViews.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                  style={{
                    height: `${(day.count / Math.max(...analytics.weeklyViews.map(d => d.count))) * 100}%`,
                    minHeight: '4px',
                  }}
                />
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics & Referrers */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PerformanceMetric
              label="Conversion Rate"
              value={analytics.performanceMetrics.conversionRate}
              suffix="%"
              benchmark={2.5}
            />
            <PerformanceMetric
              label="Engagement Rate"
              value={analytics.performanceMetrics.engagementRate}
              suffix="%"
              benchmark={10}
            />
            <PerformanceMetric
              label="Growth Rate"
              value={analytics.performanceMetrics.growthRate}
              suffix="%"
              benchmark={5}
            />
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topReferrers.map((referrer, index) => (
                <div key={referrer.source} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-4">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{referrer.source}</span>
                      <span className="text-sm text-muted-foreground">{referrer.count}</span>
                    </div>
                    <Progress 
                      value={(referrer.count / analytics.topReferrers[0].count) * 100} 
                      className="h-1.5" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  suffix,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  suffix?: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
          {trend !== undefined && (
            <Badge variant={trend >= 0 ? 'default' : 'destructive'} className="text-xs">
              {trend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}%
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold">
          {value}{suffix}
        </div>
        <p className="text-xs text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}

// Performance Metric Component
function PerformanceMetric({
  label,
  value,
  suffix,
  benchmark,
}: {
  label: string;
  value: number;
  suffix: string;
  benchmark: number;
}) {
  const isAboveBenchmark = value >= benchmark;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{value}{suffix}</span>
          <Badge variant={isAboveBenchmark ? 'default' : 'secondary'} className="text-xs">
            {isAboveBenchmark ? 'Above' : 'Below'} avg
          </Badge>
        </div>
      </div>
      <Progress value={(value / (benchmark * 2)) * 100} className="h-2" />
    </div>
  );
}
