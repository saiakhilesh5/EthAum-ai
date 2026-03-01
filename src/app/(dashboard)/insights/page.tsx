'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import {
  CredibilityWidget,
  TrendingChart,
  StatsOverview,
  RecentActivity,
} from '@src/components/insights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Star,
  ThumbsUp,
  Eye,
  Users,
  MessageSquare,
  Download,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function InsightsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [startup, setStartup] = useState<any>(null);
  const [credibility, setCredibility] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [statsChanges, setStatsChanges] = useState({ upvotes: 0, reviews: 0, views: 0, matches: 0 });
  const [trendData, setTrendData] = useState({
    upvotes: [] as any[],
    views: [] as any[],
    reviews: [] as any[],
  });

  useEffect(() => {
    // Always fetch fresh data
    if (user) {
      fetchData();
    } else if (!userLoading) {
      setIsLoading(false);
    }
  }, [user, userLoading]);

  const fetchData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch startup — use limit(1) to gracefully handle duplicate rows
      const { data: startupRows, error: startupError } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (startupError) {
        console.error('Error fetching startup:', startupError);
        setIsLoading(false);
        return;
      }

      const startupData = startupRows?.[0] ?? null;

      if (!startupData) {
        // No startup found
        setIsLoading(false);
        return;
      }

      setStartup(startupData);

      // Fetch credibility, launches, reviews, and matches in parallel
      const [credResult, launchesResult, reviewsResult, matchesResult, profileViewsResult] = await Promise.all([
        supabase
          .from('credibility_scores')
          .select('*')
          .eq('startup_id', startupData.id)
          .single(),
        supabase
          .from('launches')
          .select('id, title, created_at, upvote_count')
          .eq('startup_id', startupData.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('reviews')
          .select('id, title, created_at, users(full_name, avatar_url)')
          .eq('startup_id', startupData.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('matches')
          .select('id, created_at')
          .eq('startup_id', startupData.id),
        supabase
          .from('profile_views')
          .select('id, created_at')
          .eq('startup_id', startupData.id),
      ]);

      // Use credibility data or generate default
      setCredibility(credResult.data || {
        overall_score: startupData.credibility_score || 0,
        review_quality: 0,
        engagement_level: 0,
        verification_status: 0,
        consistency_score: 0,
      });

      // Set match and view counts
      const matches = matchesResult.data || [];
      const views = profileViewsResult.data || [];
      setMatchCount(matches.length);
      setViewCount(views.length);

      // Calculate changes (this month vs last month)
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const thisMonthLaunches = (launchesResult.data || []).filter((l: any) => new Date(l.created_at) >= thisMonth);
      const lastMonthLaunches = (launchesResult.data || []).filter((l: any) => {
        const d = new Date(l.created_at);
        return d >= lastMonth && d < thisMonth;
      });

      const thisMonthUpvotes = thisMonthLaunches.reduce((sum: number, l: any) => sum + (l.upvote_count || 0), 0);
      const lastMonthUpvotes = lastMonthLaunches.reduce((sum: number, l: any) => sum + (l.upvote_count || 0), 0);

      const thisMonthReviews = (reviewsResult.data || []).filter((r: any) => new Date(r.created_at) >= thisMonth).length;
      const lastMonthReviews = (reviewsResult.data || []).filter((r: any) => {
        const d = new Date(r.created_at);
        return d >= lastMonth && d < thisMonth;
      }).length;

      const thisMonthViews = views.filter((v: any) => new Date(v.created_at) >= thisMonth).length;
      const lastMonthViews = views.filter((v: any) => {
        const d = new Date(v.created_at);
        return d >= lastMonth && d < thisMonth;
      }).length;

      const thisWeekMatches = matches.filter((m: any) => {
        const d = new Date(m.created_at);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }).length;

      setStatsChanges({
        upvotes: lastMonthUpvotes > 0 ? Math.round(((thisMonthUpvotes - lastMonthUpvotes) / lastMonthUpvotes) * 100) : thisMonthUpvotes > 0 ? 100 : 0,
        reviews: lastMonthReviews > 0 ? Math.round(((thisMonthReviews - lastMonthReviews) / lastMonthReviews) * 100) : thisMonthReviews > 0 ? 100 : 0,
        views: lastMonthViews > 0 ? Math.round(((thisMonthViews - lastMonthViews) / lastMonthViews) * 100) : thisMonthViews > 0 ? 100 : 0,
        matches: thisWeekMatches,
      });

      // Build real trend data from DB records
      const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (29 - i));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      const upvotesByDay: Record<string, number> = {};
      const reviewsByDay: Record<string, number> = {};
      for (const launch of launchesResult.data || []) {
        const day = new Date(launch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        upvotesByDay[day] = (upvotesByDay[day] || 0) + ((launch as any).upvote_count || 0);
      }
      for (const review of reviewsResult.data || []) {
        const day = new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        reviewsByDay[day] = (reviewsByDay[day] || 0) + 1;
      }

      const viewsByDay: Record<string, number> = {};
      for (const view of views) {
        const day = new Date(view.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        viewsByDay[day] = (viewsByDay[day] || 0) + 1;
      }

      const realTrendData = {
        upvotes: days.map((date) => ({ date, value: upvotesByDay[date] || 0 })),
        views: days.map((date) => ({ date, value: viewsByDay[date] || 0 })),
        reviews: days.map((date) => ({ date, value: reviewsByDay[date] || 0 })),
      };
      setTrendData(realTrendData);

      const formattedActivities = [
        ...(launchesResult.data || []).slice(0, 5).map((l: any) => ({
          id: l.id,
          type: 'launch' as const,
          title: 'New Launch',
          description: l.title,
          timestamp: l.created_at,
        })),
        ...(reviewsResult.data || []).slice(0, 5).map((r: any) => ({
          id: r.id,
          type: 'review' as const,
          title: 'New Review',
          description: r.title,
          timestamp: r.created_at,
          user: r.users ? {
            name: r.users.full_name,
            avatar: r.users.avatar_url,
          } : undefined,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 md:h-24" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 md:h-96" />
          </div>
          <Skeleton className="h-64 md:h-96" />
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg md:text-xl font-semibold mb-2">No Startup Profile</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Create your startup profile to view analytics and insights.
            </p>
            <Button asChild>
              <a href="/profile/startup">Create Profile</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Upvotes',
      value: startup.total_upvotes || 0,
      change: statsChanges.upvotes,
      changeLabel: 'vs last month',
      icon: <ThumbsUp className="w-5 h-5" />,
      color: 'text-primary',
    },
    {
      label: 'Total Reviews',
      value: startup.total_reviews || 0,
      change: statsChanges.reviews,
      changeLabel: 'vs last month',
      icon: <Star className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: 'Profile Views',
      value: viewCount > 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount,
      change: statsChanges.views,
      changeLabel: 'vs last month',
      icon: <Eye className="w-5 h-5 text-blue-500" />,
    },
    {
      label: 'AI Matches',
      value: matchCount,
      change: statsChanges.matches,
      changeLabel: 'new this week',
      icon: <Users className="w-5 h-5 text-green-500" />,
    },
  ];

  const credibilityBreakdown = credibility || {
    review_score: 70,
    verification_score: 85,
    engagement_score: 60,
    longevity_score: 75,
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
            AI-Generated Credibility Signals
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Real-time market validation replacing Gartner/G2 reports
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            AI-Powered
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Export</span>
          </Button>
        </div>
      </div>
      
      {/* AI Explainability Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Generated by EthAum AI</p>
              <p className="text-xs text-muted-foreground">
                These credibility signals are computed from launch traction, verified enterprise reviews, 
                engagement patterns, and market signals. Updated in real-time to replace static analyst reports.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Trend Charts */}
          <Tabs defaultValue="upvotes">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="upvotes" className="text-xs sm:text-sm">
                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Upvotes
              </TabsTrigger>
              <TabsTrigger value="views" className="text-xs sm:text-sm">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Views
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upvotes" className="mt-4">
              <TrendingChart
                title="Upvotes Over Time"
                description="Track your launch upvotes"
                data={trendData.upvotes}
                type="upvotes"
                currentValue={startup.total_upvotes || 0}
                previousValue={Math.floor((startup.total_upvotes || 0) * 0.85)}
              />
            </TabsContent>

            <TabsContent value="views" className="mt-4">
              <TrendingChart
                title="Profile Views"
                description="Track who's viewing your profile"
                data={trendData.views}
                type="views"
                currentValue={viewCount}
                previousValue={Math.floor(viewCount * 0.8)}
              />
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <TrendingChart
                title="Reviews Over Time"
                description="Track customer reviews"
                data={trendData.reviews}
                type="reviews"
                currentValue={startup.total_reviews || 0}
                previousValue={Math.floor((startup.total_reviews || 0) * 0.9)}
              />
            </TabsContent>
          </Tabs>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Recommendations based on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsChanges.upvotes > 0 ? (
                  <div className="p-4 rounded-lg bg-muted/50 border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-green-500/10">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Upvotes Growing!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your upvotes increased by {statsChanges.upvotes}% this month. 
                          Keep the momentum by launching new features regularly.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted/50 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Launch Timing Optimization</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tuesday mornings (9-11 AM EST) typically show higher upvote rates. 
                          Consider scheduling your next launch then.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(startup.total_reviews || 0) < 10 && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-yellow-500/10">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium">More Reviews Needed</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You have {startup.total_reviews || 0} reviews. Startups with 10+ reviews 
                          get 3x more enterprise interest. Reach out to happy customers!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {matchCount > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-green-500/10">
                        <Users className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Enterprise Interest Growing</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You have {matchCount} AI matches with enterprises. 
                          {statsChanges.matches > 0 && ` ${statsChanges.matches} new this week!`}
                          {' '}Review your matches to start conversations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {viewCount > 0 && statsChanges.views > 10 && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-500/10">
                        <Eye className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Profile Visibility Up</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Profile views increased by {statsChanges.views}% this month. 
                          Your improvements are paying off!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Credibility Widget */}
          <CredibilityWidget
            score={startup.credibility_score || 0}
            breakdown={{
              reviewScore: credibilityBreakdown.review_score || 0,
              verificationScore: credibilityBreakdown.verification_score || 0,
              engagementScore: credibilityBreakdown.engagement_score || 0,
              longevityScore: credibilityBreakdown.longevity_score || 0,
            }}
            trend={statsChanges.upvotes >= 0 ? 'up' : 'down'}
            trendValue={Math.abs(statsChanges.upvotes)}
            badges={[
              ...(startup.is_verified ? ['Verified'] : []),
              ...(startup.total_reviews >= 10 ? ['Top Rated'] : []),
              ...(startup.total_upvotes >= 50 ? ['Popular'] : []),
              ...((new Date().getTime() - new Date(startup.created_at).getTime()) < 90 * 24 * 60 * 60 * 1000 ? ['Early Adopter'] : []),
            ].slice(0, 3)}
            recommendations={[
              ...((startup.total_reviews || 0) < 10 ? ['Add more customer testimonials to boost review score'] : []),
              ...(!startup.is_verified ? ['Complete verification to increase trust'] : []),
              ...(statsChanges.upvotes < 10 ? ['Launch a new product update to improve engagement'] : []),
            ].slice(0, 3)}
            showEmbed
            startupName={startup.name}
          />

          {/* Recent Activity */}
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
