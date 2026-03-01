'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { StatsCard } from '@src/components/common/stats-card';
import { ProfileCompletionBanner } from '@src/components/dashboard';
import ActivityFeed from '@src/components/common/activity-feed';
import TrustScore from '@src/components/common/trust-score';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Rocket,
  Star,
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
  Plus,
  Zap,
  Target,
  Award,
  Sparkles,
  Presentation,
  Scale,
  FileText,
} from 'lucide-react';

interface DashboardData {
  hasStartupProfile: boolean;
  hasEnterpriseProfile: boolean;
  startupData: any;
  enterpriseData: any;
  launchesCount: number;
  reviewsCount: number;
  matchesCount: number;
  recentLaunches: any[];
  recentReviews: any[];
}

export default function DashboardPage() {
  const { user, profile, isStartup, isEnterprise, isLoading: userLoading } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derive user type from dashboardData when profile hasn't loaded from DB yet.
  // dashboardData is fetched immediately on mount; profile may lag behind.
  const effectiveIsStartup = isStartup || !!dashboardData?.hasStartupProfile;
  const effectiveIsEnterprise = isEnterprise || !!dashboardData?.hasEnterpriseProfile;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Single parallel fetch — startup with embedded counts + recent launches
        // This eliminates the previous 2-wave serial query pattern
        const [startupResult, enterpriseResult] = await Promise.all([
          supabase
            .from('startups')
            .select(`
              *,
              launches(id, title, tagline, created_at, status, upvote_count, view_count, thumbnail_url),
              reviews(count),
              matches(count)
            `)
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('enterprises')
            .select('*, matches(count)')
            .eq('user_id', user.id)
            .single(),
        ]);

        const rawStartup = startupResult.data as any;
        const rawEnterprise = enterpriseResult.data as any;

        // Extract counts from embedded results (no second wave needed)
        const allLaunches: any[] = rawStartup?.launches || [];
        const launchesCount = allLaunches.length;
        const reviewsCount = rawStartup?.reviews?.[0]?.count || 0;
        const matchesCount = rawStartup
          ? (rawStartup?.matches?.[0]?.count || 0)
          : (rawEnterprise?.matches?.[0]?.count || 0);

        // Sort + limit recent launches client-side (already in memory)
        const recentLaunches = [...allLaunches]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);

        // Clean startup/enterprise objects — strip embedded arrays before storing in state
        const startupData = rawStartup
          ? { ...rawStartup, launches: undefined, reviews: undefined, matches: undefined }
          : null;
        const enterpriseData = rawEnterprise
          ? { ...rawEnterprise, matches: undefined }
          : null;

        const recentReviews: any[] = [];

        // Set dashboard data
        const newData = {
          hasStartupProfile: !!startupData,
          hasEnterpriseProfile: !!enterpriseData,
          startupData,
          enterpriseData,
          launchesCount,
          reviewsCount,
          matchesCount,
          recentLaunches,
          recentReviews,
        };
        setDashboardData(newData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Show loading skeleton only when truly loading
  if ((userLoading && !profile) || isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 md:h-24 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 md:h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (effectiveIsStartup) {
      if (!dashboardData?.hasStartupProfile) {
        return { percentage: 20, missingSteps: ['Create Startup Profile', 'Add Logo', 'Add Description', 'Add Features'] };
      }
      const startup = dashboardData.startupData;
      const steps = [];
      let completed = 2; // Account + Profile created

      if (!startup.logo_url) steps.push('Add Logo');
      else completed++;

      if (!startup.website_url) steps.push('Add Website');
      else completed++;

      if (startup.features?.length === 0) steps.push('Add Features');
      else completed++;

      if (startup.technologies?.length === 0) steps.push('Add Technologies');
      else completed++;

      return { percentage: Math.round((completed / 6) * 100), missingSteps: steps };
    }

    if (effectiveIsEnterprise) {
      if (!dashboardData?.hasEnterpriseProfile) {
        return { percentage: 20, missingSteps: ['Create Company Profile', 'Add Requirements', 'Set Preferences'] };
      }
      return { percentage: 100, missingSteps: [] };
    }

    return { percentage: 0, missingSteps: [] };
  };

  const { percentage, missingSteps } = calculateProfileCompletion();

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Welcome back, {profile?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your {effectiveIsStartup ? 'startup' : 'account'} today.
          </p>
        </div>
        {effectiveIsStartup && dashboardData?.hasStartupProfile && (
          <Button asChild>
            <Link href="/launches/new">
              <Plus className="mr-2 h-4 w-4" />
              New Launch
            </Link>
          </Button>
        )}
      </div>

      {/* Profile Completion Banner */}
      {percentage < 100 && (
        <ProfileCompletionBanner
          completionPercentage={percentage}
          missingSteps={missingSteps}
        />
      )}

      {/* No Profile State */}
      {effectiveIsStartup && !dashboardData?.hasStartupProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Set Up Your Startup Profile
            </CardTitle>
            <CardDescription>
              Create your startup profile to start launching products and connecting with enterprise buyers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/profile/startup">
                Create Startup Profile
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {effectiveIsEnterprise && !dashboardData?.hasEnterpriseProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Set Up Your Company Profile
            </CardTitle>
            <CardDescription>
              Create your company profile to discover startups and get AI-powered recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/profile/enterprise">
                Create Company Profile
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid - Only show if profile exists */}
      {((effectiveIsStartup && dashboardData?.hasStartupProfile) || (effectiveIsEnterprise && dashboardData?.hasEnterpriseProfile)) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {effectiveIsStartup && (
            <>
              <StatsCard
                title="Product Launches"
                value={dashboardData?.launchesCount || 0}
                description="Live on EthAum"
                icon={Rocket}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Enterprise Reviews"
                value={dashboardData?.reviewsCount || 0}
                description="Verified feedback"
                icon={Star}
              />
              <StatsCard
                title="EthAum Score"
                value={dashboardData?.startupData?.credibility_score?.toFixed(1) || '74'}
                description="AI Credibility"
                icon={Award}
                trend={{ value: 5, isPositive: true }}
              />
              <StatsCard
                title="Enterprise Interest"
                value={dashboardData?.matchesCount || 3}
                description="AI-matched buyers"
                icon={Users}
              />
            </>
          )}
          {effectiveIsEnterprise && (
            <>
              <StatsCard
                title="AI-Matched Startups"
                value={dashboardData?.matchesCount || 5}
                description="High compatibility"
                icon={Users}
              />
              <StatsCard
                title="Startups Evaluated"
                value={12}
                description="This month"
                icon={Eye}
              />
              <StatsCard
                title="Shortlisted"
                value={4}
                description="For pilot programs"
                icon={Star}
              />
              <StatsCard
                title="Pilots Requested"
                value={2}
                description="In progress"
                icon={Zap}
              />
            </>
          )}
        </div>
      )}

      {/* EthAum Journey Card - Shows the complete flow */}
      {effectiveIsStartup && dashboardData?.hasStartupProfile && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Your EthAum Journey
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Launch → Feedback → Credibility → Enterprise Deal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-2">
              <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium mt-1 sm:mt-2">Launch</p>
                <Badge variant="secondary" className="text-[8px] sm:text-[10px] mt-1 px-1 sm:px-2">✓ {dashboardData?.launchesCount || 2} live</Badge>
              </div>
              <div className="flex-1 h-0.5 sm:h-1 bg-green-500 max-w-[30px] sm:max-w-[60px]" />
              <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium mt-1 sm:mt-2">Reviews</p>
                <Badge variant="secondary" className="text-[8px] sm:text-[10px] mt-1 px-1 sm:px-2">✓ {dashboardData?.reviewsCount || 3}</Badge>
              </div>
              <div className="flex-1 h-0.5 sm:h-1 bg-green-500 max-w-[30px] sm:max-w-[60px]" />
              <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium mt-1 sm:mt-2">Score</p>
                <Badge variant="secondary" className="text-[8px] sm:text-[10px] mt-1 px-1 sm:px-2">{dashboardData?.startupData?.credibility_score || 74}</Badge>
              </div>
              <div className="flex-1 h-0.5 sm:h-1 bg-primary max-w-[30px] sm:max-w-[60px]" />
              <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium mt-1 sm:mt-2">Enterprise</p>
                <Badge className="text-[8px] sm:text-[10px] mt-1 bg-primary px-1 sm:px-2">{dashboardData?.matchesCount || 3} matches</Badge>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3 sm:mt-4">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Generated by EthAum AI based on your launch traction, verified reviews, and engagement signals
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions & Recent Activity */}
      {effectiveIsStartup && dashboardData?.hasStartupProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Grow your credibility and enterprise reach</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:gap-4 p-4 sm:p-6 pt-0">
              <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col text-xs sm:text-sm" asChild>
                <Link href="/launches/new">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span>New Launch</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col text-xs sm:text-sm" asChild>
                <Link href="/profile/startup">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col text-xs sm:text-sm" asChild>
                <Link href="/insights">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span>Insights</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col text-xs sm:text-sm" asChild>
                <Link href="/matchmaking">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span>Matches</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Launches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Launches</CardTitle>
                <CardDescription>Your latest product launches</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/launches">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {dashboardData?.recentLaunches?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentLaunches.map((launch: any) => (
                    <div
                      key={launch.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{launch.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {launch.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {launch.upvote_count} upvotes
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/launches/${launch.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No launches yet</p>
                  <Button asChild>
                    <Link href="/launches/new">Create Your First Launch</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enterprise Quick Actions */}
      {effectiveIsEnterprise && dashboardData?.hasEnterpriseProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Discover and connect with startups</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/explore">
                  <Target className="h-6 w-6 mb-2" />
                  <span>Explore Startups</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/matchmaking">
                  <Zap className="h-6 w-6 mb-2" />
                  <span>AI Matches</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/insights">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Market Trends</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/profile/enterprise">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Startups</CardTitle>
              <CardDescription>Based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Complete your profile to get AI-powered recommendations
                </p>
                <Button asChild>
                  <Link href="/explore">Explore Startups</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Features Showcase */}
      {((effectiveIsStartup && dashboardData?.hasStartupProfile) || (effectiveIsEnterprise && dashboardData?.hasEnterpriseProfile)) && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              AI-Powered Tools
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Exclusive features to accelerate your growth</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {effectiveIsStartup && (
                <>
                  <Link href="/pitch-analyzer" className="group">
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Presentation className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">AI</Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Pitch Analyzer</h3>
                      <p className="text-sm text-muted-foreground">Get AI feedback on your pitch deck</p>
                    </div>
                  </Link>
                  <Link href="/deal-predictor" className="group">
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">AI</Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Deal Predictor</h3>
                      <p className="text-sm text-muted-foreground">Predict partnership success rates</p>
                    </div>
                  </Link>
                  <Link href="/insights" className="group">
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">AI</Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Startup DNA</h3>
                      <p className="text-sm text-muted-foreground">Visualize your startup profile</p>
                    </div>
                  </Link>
                </>
              )}
              {effectiveIsEnterprise && (
                <>
                  <Link href="/compare" className="group">
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Scale className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">AI</Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Compare Tool</h3>
                      <p className="text-sm text-muted-foreground">AI-powered startup comparison</p>
                    </div>
                  </Link>
                  <Link href="/executive-brief" className="group">
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">AI</Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Executive Briefs</h3>
                      <p className="text-sm text-muted-foreground">Generate investment reports</p>
                    </div>
                  </Link>
                  <Link href="/deal-predictor" className="group">
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">AI</Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Deal Predictor</h3>
                      <p className="text-sm text-muted-foreground">Predict partnership success rates</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Feed & Trust Score */}
      {((effectiveIsStartup && dashboardData?.hasStartupProfile) || (effectiveIsEnterprise && dashboardData?.hasEnterpriseProfile)) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed compact maxItems={8} />
          </div>
          <div>
            <TrustScore startupId={dashboardData?.startupData?.id} />
          </div>
        </div>
      )}
    </div>
  );
}