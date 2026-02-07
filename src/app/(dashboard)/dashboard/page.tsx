'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { DEMO_MODE, DEMO_STARTUPS, DEMO_LAUNCHES, DEMO_REVIEWS, DEMO_MATCHES, DEMO_ENTERPRISES } from '@src/lib/demo-data';
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user && !DEMO_MODE) return;

      try {
        // If user is logged in, always try to fetch real data first
        if (user) {
          // Check for startup profile
          const { data: startupData } = await supabase
            .from('startups')
            .select('*')
            .eq('user_id', user.id)
            .single();

          // Check for enterprise profile
          const { data: enterpriseData } = await supabase
            .from('enterprises')
            .select('*')
            .eq('user_id', user.id)
            .single();

          // Get counts based on profile type
          let launchesCount = 0;
          let reviewsCount = 0;
          let matchesCount = 0;
          let recentLaunches: any[] = [];
          let recentReviews: any[] = [];

          if (startupData) {
            // Get launches count
            const { count: lCount } = await supabase
              .from('launches')
              .select('*', { count: 'exact', head: true })
              .eq('startup_id', startupData.id);
            launchesCount = lCount || 0;

            // Get reviews count
            const { count: rCount } = await supabase
              .from('reviews')
              .select('*', { count: 'exact', head: true })
              .eq('startup_id', startupData.id);
            reviewsCount = rCount || 0;

            // Get matches count
            const { count: mCount } = await supabase
              .from('matches')
              .select('*', { count: 'exact', head: true })
              .eq('startup_id', startupData.id);
            matchesCount = mCount || 0;

            // Get recent launches
            const { data: launches } = await supabase
              .from('launches')
              .select('*')
              .eq('startup_id', startupData.id)
              .order('created_at', { ascending: false })
              .limit(3);
            recentLaunches = launches || [];
          }

          if (enterpriseData) {
            // Get matches count for enterprise
            const { count: mCount } = await supabase
              .from('matches')
              .select('*', { count: 'exact', head: true })
              .eq('enterprise_id', enterpriseData.id);
            matchesCount = mCount || 0;
          }

          // If user has no profile yet and DEMO_MODE is on, show demo data
          if (!startupData && !enterpriseData && DEMO_MODE) {
            const demoStartup = DEMO_STARTUPS[0];
            const demoEnterprise = DEMO_ENTERPRISES[0];
            
            setDashboardData({
              hasStartupProfile: true,
              hasEnterpriseProfile: true,
              startupData: demoStartup,
              enterpriseData: demoEnterprise,
              launchesCount: DEMO_LAUNCHES.length,
              reviewsCount: DEMO_REVIEWS.length,
              matchesCount: DEMO_MATCHES.length,
              recentLaunches: DEMO_LAUNCHES.slice(0, 3),
              recentReviews: DEMO_REVIEWS.slice(0, 3),
            });
          } else {
            setDashboardData({
              hasStartupProfile: !!startupData,
              hasEnterpriseProfile: !!enterpriseData,
              startupData,
              enterpriseData,
              launchesCount,
              reviewsCount,
              matchesCount,
              recentLaunches,
              recentReviews,
            });
          }
          setIsLoading(false);
          return;
        }

        // If no user but DEMO_MODE is enabled, show demo data
        if (DEMO_MODE) {
          const demoStartup = DEMO_STARTUPS[0];
          const demoEnterprise = DEMO_ENTERPRISES[0];
          
          setDashboardData({
            hasStartupProfile: true,
            hasEnterpriseProfile: true,
            startupData: demoStartup,
            enterpriseData: demoEnterprise,
            launchesCount: DEMO_LAUNCHES.length,
            reviewsCount: DEMO_REVIEWS.length,
            matchesCount: DEMO_MATCHES.length,
            recentLaunches: DEMO_LAUNCHES.slice(0, 3),
            recentReviews: DEMO_REVIEWS.slice(0, 3),
          });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fall back to demo data on error if DEMO_MODE enabled
        if (DEMO_MODE) {
          const demoStartup = DEMO_STARTUPS[0];
          const demoEnterprise = DEMO_ENTERPRISES[0];
          
          setDashboardData({
            hasStartupProfile: true,
            hasEnterpriseProfile: true,
            startupData: demoStartup,
            enterpriseData: demoEnterprise,
            launchesCount: DEMO_LAUNCHES.length,
            reviewsCount: DEMO_REVIEWS.length,
            matchesCount: DEMO_MATCHES.length,
            recentLaunches: DEMO_LAUNCHES.slice(0, 3),
            recentReviews: DEMO_REVIEWS.slice(0, 3),
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user || DEMO_MODE) {
      fetchDashboardData();
    }
  }, [user]);

  if (userLoading || isLoading) {
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
    if (isStartup) {
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

    if (isEnterprise) {
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
            Here's what's happening with your {isStartup ? 'startup' : 'account'} today.
          </p>
        </div>
        {isStartup && dashboardData?.hasStartupProfile && (
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
      {isStartup && !dashboardData?.hasStartupProfile && (
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

      {isEnterprise && !dashboardData?.hasEnterpriseProfile && (
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
      {((isStartup && dashboardData?.hasStartupProfile) || (isEnterprise && dashboardData?.hasEnterpriseProfile)) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {isStartup && (
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
          {isEnterprise && (
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
      {isStartup && dashboardData?.hasStartupProfile && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your EthAum Journey
            </CardTitle>
            <CardDescription>
              Launch → Feedback → Credibility → Enterprise Deal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium mt-2">Launch</p>
                <Badge variant="secondary" className="text-[10px] mt-1">✓ {dashboardData?.launchesCount || 2} live</Badge>
              </div>
              <div className="flex-1 h-1 bg-green-500 max-w-[60px]" />
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium mt-2">Reviews</p>
                <Badge variant="secondary" className="text-[10px] mt-1">✓ {dashboardData?.reviewsCount || 3} verified</Badge>
              </div>
              <div className="flex-1 h-1 bg-green-500 max-w-[60px]" />
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium mt-2">Credibility</p>
                <Badge variant="secondary" className="text-[10px] mt-1">Score: {dashboardData?.startupData?.credibility_score || 74}</Badge>
              </div>
              <div className="flex-1 h-1 bg-primary max-w-[60px]" />
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium mt-2">Enterprise</p>
                <Badge className="text-[10px] mt-1 bg-primary">{dashboardData?.matchesCount || 3} interested</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Generated by EthAum AI based on your launch traction, verified reviews, and engagement signals
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions & Recent Activity */}
      {isStartup && dashboardData?.hasStartupProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Grow your credibility and enterprise reach</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/launches/new">
                  <Rocket className="h-6 w-6 mb-2" />
                  <span>New Launch</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/profile/startup">
                  <Star className="h-6 w-6 mb-2" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/insights">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Credibility Signals</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/matchmaking">
                  <Users className="h-6 w-6 mb-2" />
                  <span>View Matches</span>
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
      {isEnterprise && dashboardData?.hasEnterpriseProfile && (
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
      {((isStartup && dashboardData?.hasStartupProfile) || (isEnterprise && dashboardData?.hasEnterpriseProfile)) && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Powered Tools
            </CardTitle>
            <CardDescription>Exclusive features to accelerate your growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isStartup && (
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
              {isEnterprise && (
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
      {((isStartup && dashboardData?.hasStartupProfile) || (isEnterprise && dashboardData?.hasEnterpriseProfile)) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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