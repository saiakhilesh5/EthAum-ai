import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createServerSupabaseClient } from '@src/lib/db/supabase-server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

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

    // Use AI to score matches
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const matches = [];

    for (const potential of potentialMatches) {
      // Check if match already exists
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('id')
        .eq(userType === 'startup' ? 'startup_id' : 'enterprise_id', profileId)
        .eq(userType === 'startup' ? 'enterprise_id' : 'startup_id', potential.id)
        .single();

      if (existingMatch) continue;

      // Generate AI match score
      const prompt = `Analyze the compatibility between these two profiles and return ONLY valid JSON (no markdown).

${userType === 'startup' ? 'Startup' : 'Enterprise'} Profile:
${JSON.stringify(userProfile, null, 2)}

${userType === 'startup' ? 'Enterprise' : 'Startup'} Profile:
${JSON.stringify(potential, null, 2)}

Consider:
1. Industry alignment
2. Technology/use case fit
3. Stage/budget compatibility
4. Geographic considerations
5. Potential synergies

Return this exact JSON format:
{
  "matchScore": 0-100,
  "matchReasons": ["reason1", "reason2", "reason3"],
  "aiAnalysis": "Brief analysis of why these profiles match or don't match"
}`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        const analysis = JSON.parse(cleanedText);

        // Only create matches with score >= 40
        if (analysis.matchScore >= 40) {
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

          if (!error && newMatch) {
            matches.push(newMatch);
          }
        }
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        continue;
      }
    }

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
