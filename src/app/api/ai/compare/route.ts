import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { startups } = await request.json();

    if (!startups || startups.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 startups are required for comparison' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a SaaS analyst comparing multiple startups/products for enterprise buyers.

Compare these startups:
${startups.map((s: any, i: number) => `
${i + 1}. ${s.name}
   - Category: ${s.category}
   - Tagline: ${s.tagline}
   - Score: ${s.score}/100
   - Pricing: ${s.pricing}
   - Features: ${s.features.join(', ')}
   - Founded: ${s.founded}
   - Team Size: ${s.teamSize}
   - Funding: ${s.funding}
   - Pros: ${s.pros.join(', ')}
   - Cons: ${s.cons.join(', ')}
   - Ratings: Overall ${s.ratings.overall}, Ease of Use ${s.ratings.easeOfUse}, Support ${s.ratings.support}, Value ${s.ratings.value}, Features ${s.ratings.features}
`).join('\n')}

Provide a detailed comparison analysis covering:
1. How they differ in approach and target market
2. Strengths and weaknesses relative to each other
3. Value for money analysis
4. Which scenarios each is best suited for
5. Overall recommendation

Return in JSON format:
{
  "comparison": "detailed paragraph analysis (200-300 words)",
  "recommendation": {
    "winner": "name of recommended startup",
    "reason": "brief explanation why",
    "bestFor": {
      "use case 1": "startup name",
      "use case 2": "startup name",
      "use case 3": "startup name"
    }
  }
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      parsed = {
        comparison: text,
        recommendation: {
          winner: startups[0].name,
          reason: 'Based on overall score and ratings',
          bestFor: {
            'General use': startups[0].name,
            'Budget-conscious': startups[0].name,
            'Enterprise': startups[0].name,
          },
        },
      };
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to generate comparison' },
      { status: 500 }
    );
  }
}
