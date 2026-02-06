'use client';

import { useState, useEffect } from 'react';
import { LaunchCard } from './launch-card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@src/lib/db/supabase';
import { useUser } from '@src/hooks/use-user';
import { DEMO_MODE, DEMO_LAUNCHES } from '@src/lib/demo-data';

interface LaunchListProps {
  filter?: 'today' | 'week' | 'month' | 'all';
  limit?: number;
  showRank?: boolean;
}

export function LaunchList({ filter = 'all', limit, showRank = true }: LaunchListProps) {
  const { user } = useUser();
  const [launches, setLaunches] = useState<any[]>([]);
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLaunches();
  }, [filter, limit]);

  useEffect(() => {
    if (user && !DEMO_MODE) {
      fetchUserUpvotes();
    }
  }, [user, launches]);

  const fetchLaunches = async () => {
    // Use demo data in demo mode
    if (DEMO_MODE) {
      let demoData = [...DEMO_LAUNCHES];
      
      // Apply date filters for demo
      const now = new Date();
      if (filter === 'today') {
        const today = new Date(now.setHours(0, 0, 0, 0));
        demoData = demoData.filter(l => new Date(l.launch_date) >= today);
      } else if (filter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        demoData = demoData.filter(l => new Date(l.launch_date) >= weekAgo);
      }
      
      if (limit) {
        demoData = demoData.slice(0, limit);
      }
      
      setLaunches(demoData);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('launches')
        .select(`
          id,
          title,
          tagline,
          thumbnail_url,
          upvote_count,
          comment_count,
          view_count,
          launch_date,
          status,
          is_featured,
          featured_badge,
          startup:startups(id, name, logo_url, slug, industry, stage)
        `)
        .eq('status', 'live')
        .order('is_featured', { ascending: false })
        .order('upvote_count', { ascending: false });

      // Apply date filters
      const now = new Date();
      if (filter === 'today') {
        const today = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        query = query.gte('launch_date', today);
      } else if (filter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte('launch_date', weekAgo);
      } else if (filter === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        query = query.gte('launch_date', monthAgo);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fall back to demo data if empty
      if (!data || data.length === 0) {
        setLaunches(DEMO_LAUNCHES);
      } else {
        setLaunches(data);
      }
    } catch (error) {
      console.error('Error fetching launches:', error);
      // Fall back to demo data on error
      setLaunches(DEMO_LAUNCHES);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserUpvotes = async () => {
    if (!user) return;

    const launchIds = launches.map((l) => l.id);
    if (launchIds.length === 0) return;

    const { data } = await supabase
      .from('upvotes')
      .select('launch_id')
      .eq('user_id', user.id)
      .in('launch_id', launchIds);

    if (data) {
      setUserUpvotes(new Set(data.map((u) => u.launch_id)));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (launches.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No launches found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {launches.map((launch, index) => (
        <LaunchCard
          key={launch.id}
          launch={launch}
          rank={showRank ? index + 1 : undefined}
          userUpvoted={userUpvotes.has(launch.id)}
          onUpvote={fetchLaunches}
        />
      ))}
    </div>
  );
}
