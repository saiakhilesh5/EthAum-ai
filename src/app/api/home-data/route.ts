import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@src/lib/db/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch data in parallel
    const [
      { data: launches },
      { data: startups },
      { count: startupsCount },
      { count: reviewsCount },
      { count: enterprisesCount },
      { count: matchesCount },
    ] = await Promise.all([
      // Get trending launches (most recent, featured first)
      supabase
        .from('launches')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('upvote_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6),
      
      // Get top startups by credibility score
      supabase
        .from('startups')
        .select('*')
        .order('credibility_score', { ascending: false })
        .limit(5),
      
      // Get counts
      supabase.from('startups').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('enterprises').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      launches: launches || [],
      startups: startups || [],
      stats: {
        total_startups: startupsCount || 0,
        total_reviews: reviewsCount || 0,
        total_enterprises: enterprisesCount || 0,
        total_matches: matchesCount || 0,
        platform_growth: '+47%',
      },
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json({
      launches: [],
      startups: [],
      stats: {
        total_startups: 0,
        total_reviews: 0,
        total_enterprises: 0,
        total_matches: 0,
        platform_growth: '+0%',
      },
    });
  }
}
