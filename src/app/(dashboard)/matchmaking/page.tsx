'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { DEMO_MODE, DEMO_MATCHES } from '@src/lib/demo-data';
import { MatchList, MatchFilters, FilterState } from '@src/components/matchmaking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Sparkles,
  Users,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function MatchmakingPage() {
  const { user, isLoading: userLoading } = useUser();
  const [userType, setUserType] = useState<'startup' | 'enterprise' | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interested: 0,
    connected: 0,
  });
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    minScore: 50,
    industry: 'all',
    stage: 'all',
    arrRange: 'all',
  });

  useEffect(() => {
    if (user) {
      determineUserType();
    }
  }, [user]);

  const determineUserType = async () => {
    if (!user) return;

    // In demo mode, default to enterprise for better demo experience
    if (DEMO_MODE) {
      setUserType('enterprise');
      setProfileId('demo-enterprise-1');
      setStats({
        total: DEMO_MATCHES.length,
        pending: DEMO_MATCHES.filter(m => m.status === 'pending').length,
        interested: DEMO_MATCHES.filter(m => m.status === 'interested').length,
        connected: DEMO_MATCHES.filter(m => m.status === 'connected').length,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Check if user has a startup
      const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (startup) {
        setUserType('startup');
        setProfileId(startup.id);
        await fetchStats(startup.id, 'startup');
        setIsLoading(false);
        return;
      }

      // Check if user has an enterprise
      const { data: enterprise } = await supabase
        .from('enterprises')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (enterprise) {
        setUserType('enterprise');
        setProfileId(enterprise.id);
        await fetchStats(enterprise.id, 'enterprise');
      } else {
        // Fall back to demo mode if no profile
        setUserType('enterprise');
        setProfileId('demo-enterprise-1');
        setStats({
          total: DEMO_MATCHES.length,
          pending: DEMO_MATCHES.filter(m => m.status === 'pending').length,
          interested: DEMO_MATCHES.filter(m => m.status === 'interested').length,
          connected: DEMO_MATCHES.filter(m => m.status === 'connected').length,
        });
      }
    } catch (error) {
      console.error('Error determining user type:', error);
      // Fall back to demo data
      setUserType('enterprise');
      setProfileId('demo-enterprise-1');
      setStats({
        total: DEMO_MATCHES.length,
        pending: DEMO_MATCHES.filter(m => m.status === 'pending').length,
        interested: DEMO_MATCHES.filter(m => m.status === 'interested').length,
        connected: DEMO_MATCHES.filter(m => m.status === 'connected').length,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async (id: string, type: 'startup' | 'enterprise') => {
    const column = type === 'startup' ? 'startup_id' : 'enterprise_id';

    const { data } = await supabase
      .from('matches')
      .select('status')
      .eq(column, id);

    if (data) {
      setStats({
        total: data.length,
        pending: data.filter((m) => m.status === 'pending').length,
        interested: data.filter((m) => m.status === 'interested').length,
        connected: data.filter((m) => m.status === 'connected').length,
      });
    }
  };

  const generateNewMatches = async () => {
    if (!profileId || !userType) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/matchmaking/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          userType,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate matches');

      const result = await response.json();
      toast.success(`Generated ${result.matchCount} new AI matches!`);

      // Refresh stats
      await fetchStats(profileId, userType);
    } catch (error) {
      console.error('Error generating matches:', error);
      toast.error('Failed to generate matches');
    } finally {
      setIsGenerating(false);
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
        <Skeleton className="h-64 md:h-96" />
      </div>
    );
  }

  if (!userType) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg md:text-xl font-semibold mb-2">Complete Your Profile</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Create your startup or enterprise profile to access AI matchmaking.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild>
                <a href="/profile/startup">I&apos;m a Startup</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/profile/enterprise">I&apos;m an Enterprise</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            AI Matchmaking
          </h1>
          <p className="text-sm text-muted-foreground">
            {userType === 'startup'
              ? 'Discover enterprise partners'
              : 'Find validated startups'}
          </p>
        </div>
        <Button size="sm" onClick={generateNewMatches} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="w-4 h-4 md:mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 md:mr-2" />
          )}
          <span className="hidden md:inline">Find New Matches</span>
          <span className="md:hidden">Find</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <Users className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-primary" />
            <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <Clock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-yellow-500" />
            <p className="text-xl md:text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <Star className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-blue-500" />
            <p className="text-xl md:text-2xl font-bold">{stats.interested}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Interested</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-green-500" />
            <p className="text-xl md:text-2xl font-bold">{stats.connected}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Connected</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <MatchFilters
            userType={userType}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Match List */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All Matches
                <Badge variant="secondary" className="ml-2">
                  {stats.total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                {stats.pending > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {stats.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="interested">
                Interested
                {stats.interested > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {stats.interested}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="connected">
                Connected
                {stats.connected > 0 && (
                  <Badge className="ml-2 bg-green-500">
                    {stats.connected}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <MatchList
                userId={user?.id || ''}
                userType={userType}
                minScore={filters.minScore}
              />
            </TabsContent>

            <TabsContent value="pending">
              <MatchList
                userId={user?.id || ''}
                userType={userType}
                status="pending"
                minScore={filters.minScore}
              />
            </TabsContent>

            <TabsContent value="interested">
              <MatchList
                userId={user?.id || ''}
                userType={userType}
                status="interested"
                minScore={filters.minScore}
              />
            </TabsContent>

            <TabsContent value="connected">
              <MatchList
                userId={user?.id || ''}
                userType={userType}
                status="connected"
                minScore={filters.minScore}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
