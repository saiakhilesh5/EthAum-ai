import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@src/lib/db/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch counts from all tables in parallel
    const [
      { count: startupsCount },
      { count: reviewsCount },
      { count: enterprisesCount },
      { count: matchesCount },
      { count: launchesCount },
    ] = await Promise.all([
      supabase.from('startups').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('enterprises').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('launches').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      total_startups: startupsCount || 0,
      total_reviews: reviewsCount || 0,
      total_enterprises: enterprisesCount || 0,
      total_matches: matchesCount || 0,
      total_launches: launchesCount || 0,
      platform_growth: '+47%',
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      total_startups: 0,
      total_reviews: 0,
      total_enterprises: 0,
      total_matches: 0,
      total_launches: 0,
      platform_growth: '+0%',
    });
  }
}
