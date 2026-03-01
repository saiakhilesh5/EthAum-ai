import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createServerSupabaseClient } from '@src/lib/db/supabase-server';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { profileId, userType } = await request.json();

    if (!profileId || !userType) {
      return NextResponse.json(
        { error: 'Profile ID and user type are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get the user's profile
    let userProfile;
    if (userType === 'startup') {
      const { data } = await supabase
        .from('startups')
        .select('*')
        .eq('id', profileId)
        .single();
      userProfile = data;
    } else {
      const { data } = await supabase
        .from('enterprises')
        .select('*')
        .eq('id', profileId)
        .single();
      userProfile = data;
    }

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get potential matches
    let potentialMatches;
    if (userType === 'startup') {
      // Startups get matched with enterprises
      const { data } = await supabase
        .from('enterprises')
        .select('*')
        .limit(20);
      potentialMatches = data;
    } else {
      // Enterprises get matched with startups
      const { data } = await supabase
        .from('startups')
        .select('*')
        .limit(20);
      potentialMatches = data;
    }

    if (!potentialMatches || potentialMatches.length === 0) {
      return NextResponse.json({ matchCount: 0, matches: [] });
    }

    // Filter out already-matched profiles in one batch query
    const existingMatchFilter = userType === 'startup'
      ? supabase.from('matches').select('enterprise_id').eq('startup_id', profileId)
      : supabase.from('matches').select('startup_id').eq('enterprise_id', profileId);

    const { data: existingMatches } = await existingMatchFilter;
    const existingIds = new Set((existingMatches || []).map((m: any) =>
      userType === 'startup' ? m.enterprise_id : m.startup_id
    ));

    const newPotentials = (potentialMatches || []).filter((p: any) => !existingIds.has(p.id));

    if (newPotentials.length === 0) {
      return NextResponse.json({ matchCount: 0, matches: [] });
    }

    // Single AI call to score ALL potential matches at once

    const batchPrompt = `Analyze compatibility between the following ${userType === 'startup' ? 'startup' : 'enterprise'} profile and multiple ${userType === 'startup' ? 'enterprise' : 'startup'} profiles.
Return ONLY valid JSON (no markdown).

${userType === 'startup' ? 'Startup' : 'Enterprise'} Profile:
${JSON.stringify(userProfile, null, 2)}

Potential ${userType === 'startup' ? 'Enterprise' : 'Startup'} Profiles:
${JSON.stringify(newPotentials.map((p: any) => ({ id: p.id, ...p })), null, 2)}

For each potential profile, consider:
1. Industry alignment
2. Technology/use case fit
3. Stage/budget compatibility
4. Geographic considerations
5. Potential synergies

Return this exact JSON format (array of results):
[
  {
    "id": "profile_id",
    "matchScore": 0-100,
    "matchReasons": ["reason1", "reason2", "reason3"],
    "aiAnalysis": "Brief analysis"
  }
]`;

    let scoredMatches: any[] = [];
    try {
      const result = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: batchPrompt }],
      });
      const text = result.choices[0]?.message?.content || '';
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      scoredMatches = JSON.parse(cleanedText);
    } catch (aiError) {
      console.error('AI batch analysis error:', aiError);
      return NextResponse.json({ matchCount: 0, matches: [] });
    }

    // Insert all qualifying matches in parallel
    const matches: any[] = [];
    await Promise.all(
      scoredMatches
        .filter((s: any) => s.matchScore >= 40)
        .map(async (analysis: any) => {
          const potential = newPotentials.find((p: any) => p.id === analysis.id);
          if (!potential) return;
          const matchData = {
            startup_id: userType === 'startup' ? profileId : potential.id,
            enterprise_id: userType === 'enterprise' ? profileId : potential.id,
            match_score: analysis.matchScore,
            match_reasons: analysis.matchReasons,
            ai_analysis: analysis.aiAnalysis,
            status: 'pending',
          };
          const { data: newMatch, error } = await supabase
            .from('matches')
            .insert(matchData)
            .select()
            .single();
          if (!error && newMatch) matches.push(newMatch);
        })
    );

    return NextResponse.json({
      matchCount: matches.length,
      matches,
    });
  } catch (error) {
    console.error('Error generating matches:', error);
    return NextResponse.json(
      { error: 'Failed to generate matches' },
      { status: 500 }
    );
  }
}
