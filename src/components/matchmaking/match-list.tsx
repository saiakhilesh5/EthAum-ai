'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@src/lib/db/supabase';
import { DEMO_MODE, DEMO_MATCHES } from '@src/lib/demo-data';
import MatchCard from './match-card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

interface Match {
  id: string;
  match_score: number;
  match_reasons: string[];
  status: 'pending' | 'interested' | 'connected' | 'declined';
  created_at: string;
  startup?: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    logo_url: string | null;
    industry: string;
    stage: string;
    arr_range: string;
    credibility_score: number;
    is_verified: boolean;
  };
  enterprise?: {
    id: string;
    company_name: string;
    logo_url: string | null;
    industry: string;
    company_size: string;
    headquarters: string;
    is_verified: boolean;
  };
}

interface MatchListProps {
  userId: string;
  userType: 'startup' | 'enterprise';
  status?: 'all' | 'pending' | 'interested' | 'connected' | 'declined';
  minScore?: number;
}

export default function MatchList({
  userId,
  userType,
  status = 'all',
  minScore = 0,
}: MatchListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [userId, userType, status, minScore]);

  const fetchMatches = async () => {
    setIsLoading(true);
    
    try {
      // Always try to fetch real data first
      // First get the user's startup or enterprise ID
      let profileId: string | null = null;
      
      if (userType === 'startup') {
        const { data } = await supabase
          .from('startups')
          .select('id')
          .eq('user_id', userId)
          .single();
        profileId = data?.id;
      } else {
        const { data } = await supabase
          .from('enterprises')
          .select('id')
          .eq('user_id', userId)
          .single();
        profileId = data?.id;
      }

      if (!profileId) {
        // Fall back to demo data if no profile and DEMO_MODE enabled
        if (DEMO_MODE) {
          let demoData = [...DEMO_MATCHES] as any[];
          if (status !== 'all') {
            demoData = demoData.filter(m => m.status === status);
          }
          demoData = demoData.filter(m => m.match_score >= minScore);
          setMatches(demoData);
        } else {
          setMatches([]);
        }
        setIsLoading(false);
        return;
      }

      // Fetch matches
      let query = supabase
        .from('matches')
        .select(`
          id,
          match_score,
          match_reasons,
          status,
          created_at,
          startups (
            id,
            name,
            slug,
            tagline,
            logo_url,
            industry,
            stage,
            arr_range,
            credibility_score,
            is_verified
          ),
          enterprises (
            id,
            company_name,
            logo_url,
            industry,
            company_size,
            headquarters,
            is_verified
          )
        `)
        .gte('match_score', minScore)
        .order('match_score', { ascending: false });

      if (userType === 'startup') {
        query = query.eq('startup_id', profileId);
      } else {
        query = query.eq('enterprise_id', profileId);
      }

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Use real data if available, otherwise fall back to demo
      if (data && data.length > 0) {
        const formattedMatches = data.map((match: any) => ({
          ...match,
          startup: match.startups,
          enterprise: match.enterprises,
        }));
        setMatches(formattedMatches);
      } else if (DEMO_MODE) {
        // Fall back to demo data if empty
        let demoData = [...DEMO_MATCHES] as any[];
        if (status !== 'all') {
          demoData = demoData.filter(m => m.status === status);
        }
        demoData = demoData.filter(m => m.match_score >= minScore);
        setMatches(demoData);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Fall back to demo data on error if DEMO_MODE enabled
      if (DEMO_MODE) {
        let demoData = [...DEMO_MATCHES] as any[];
        if (status !== 'all') {
          demoData = demoData.filter(m => m.status === status);
        }
        setMatches(demoData);
      } else {
        setMatches([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterest = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'interested' })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(
        matches.map((m) =>
          m.id === matchId ? { ...m, status: 'interested' } : m
        )
      );

      toast.success('Interest shown! We\'ll notify them.');
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error('Failed to update match');
    }
  };

  const handleDecline = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'declined' })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(
        matches.map((m) =>
          m.id === matchId ? { ...m, status: 'declined' } : m
        )
      );

      toast.success('Match declined');
    } catch (error) {
      console.error('Error declining match:', error);
      toast.error('Failed to decline match');
    }
  };

  const handleView = (matchId: string) => {
    // Navigate to match detail
    window.location.href = `/matchmaking/${matchId}`;
  };

  const handleMessage = (matchId: string) => {
    // Open messaging
    toast.info('Messaging coming soon!');
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-lg text-muted-foreground">No matches found</p>
        <p className="text-sm text-muted-foreground mt-2">
          {status === 'pending'
            ? 'Check back later for new matches!'
            : 'Try adjusting your filters'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          userType={userType}
          onInterest={handleInterest}
          onDecline={handleDecline}
          onView={handleView}
          onMessage={handleMessage}
        />
      ))}
    </div>
  );
}
