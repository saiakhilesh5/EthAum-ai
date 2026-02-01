'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { LaunchList } from '@src/components/launches';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Rocket, Calendar, TrendingUp, Award } from 'lucide-react';

export default function LaunchesPage() {
  const { isStartup, isLoading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('today');
  const [stats, setStats] = useState({
    totalLaunches: 0,
    totalUpvotes: 0,
    featuredCount: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: totalLaunches } = await supabase
        .from('launches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'live');

      const { data: upvoteData } = await supabase
        .from('launches')
        .select('upvote_count')
        .eq('status', 'live');

      const totalUpvotes = upvoteData?.reduce((acc, l) => acc + (l.upvote_count || 0), 0) || 0;

      const { count: featuredCount } = await supabase
        .from('launches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'live')
        .eq('is_featured', true);

      setStats({
        totalLaunches: totalLaunches || 0,
        totalUpvotes,
        featuredCount: featuredCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (userLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Rocket className="h-7 w-7 text-primary" />
            Launches
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and upvote the latest product launches
          </p>
        </div>
        {isStartup && (
          <Link href="/launches/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Launch
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Launches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.totalLaunches}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Upvotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.totalUpvotes}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Featured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.featuredCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launches List with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="today">
            <LaunchList filter="today" />
          </TabsContent>
          <TabsContent value="week">
            <LaunchList filter="week" />
          </TabsContent>
          <TabsContent value="month">
            <LaunchList filter="month" />
          </TabsContent>
          <TabsContent value="all">
            <LaunchList filter="all" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
