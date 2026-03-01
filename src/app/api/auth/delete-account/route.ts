import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();

  // Get the currently authenticated user via SSR client
  const supabaseSSR = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only in route handler
      },
    }
  );

  const { data: { user }, error: authError } = await supabaseSSR.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service role for cascading deletes
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const userId = user.id;

    // 1. Get startup & enterprise IDs for the user
    const [startupRes, enterpriseRes] = await Promise.all([
      supabaseAdmin.from('startups').select('id').eq('user_id', userId),
      supabaseAdmin.from('enterprises').select('id').eq('user_id', userId),
    ]);

    const startupIds = (startupRes.data || []).map((s: any) => s.id);
    const enterpriseIds = (enterpriseRes.data || []).map((e: any) => e.id);

    // 2. Delete all data cascading from startups
    for (const startupId of startupIds) {
      // Launches for this startup
      const { data: launches } = await supabaseAdmin
        .from('launches')
        .select('id')
        .eq('startup_id', startupId);

      const launchIds = (launches || []).map((l: any) => l.id);

      if (launchIds.length > 0) {
        // Upvotes & comments on launches
        await Promise.all([
          supabaseAdmin.from('upvotes').delete().in('launch_id', launchIds),
          supabaseAdmin.from('comments').delete().in('launch_id', launchIds),
        ]);
        // Launches themselves
        await supabaseAdmin.from('launches').delete().in('id', launchIds);
      }

      // Reviews for this startup
      await supabaseAdmin.from('reviews').delete().eq('startup_id', startupId);

      // Matches involving this startup
      await supabaseAdmin.from('matches').delete().eq('startup_id', startupId);

      // Credibility scores
      await supabaseAdmin.from('credibility_scores').delete().eq('startup_id', startupId);

      // Profile views
      await supabaseAdmin.from('profile_views').delete().eq('startup_id', startupId);
    }

    // 3. Delete enterprise-side data
    for (const enterpriseId of enterpriseIds) {
      await supabaseAdmin.from('matches').delete().eq('enterprise_id', enterpriseId);
      await supabaseAdmin.from('reviews').delete().eq('enterprise_id', enterpriseId);
    }

    // 4. Delete reviews WRITTEN by this user
    await supabaseAdmin.from('reviews').delete().eq('reviewer_id', userId);

    // 5. Delete upvotes / comments made by this user
    await Promise.all([
      supabaseAdmin.from('upvotes').delete().eq('user_id', userId),
      supabaseAdmin.from('comments').delete().eq('user_id', userId),
    ]);

    // 6. Delete startup & enterprise profiles
    if (startupIds.length > 0) {
      await supabaseAdmin.from('startups').delete().in('id', startupIds);
    }
    if (enterpriseIds.length > 0) {
      await supabaseAdmin.from('enterprises').delete().in('id', enterpriseIds);
    }

    // 7. Delete user row in `users` table
    await supabaseAdmin.from('users').delete().eq('id', userId);

    // 8. Delete Supabase Auth user (requires service role)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error('Failed to delete auth user:', deleteAuthError);
      // Non-fatal — data is already cleaned up
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    );
  }
}
