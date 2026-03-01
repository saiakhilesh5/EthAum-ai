import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a smart search assistant for a B2B SaaS marketplace platform.

User search query: "${query}"

Analyze this query and:
1. Interpret what the user is looking for (be helpful and natural)
2. Generate relevant mock search results

Return JSON:
{
  "interpretation": "Natural language explanation of what you understood from the query and what you're searching for",
  "intent": "discover|compare|research|specific",
  "filters": {
    "category": "detected category or null",
    "minRating": "number or null",
    "hasRecentFunding": "boolean or null",
    "stage": "detected stage or null"
  },
  "results": [
    {
      "id": "1",
      "type": "startup|launch|review|category",
      "title": "Name",
      "description": "Brief description",
      "category": "Category name",
      "score": 85,
      "relevance": 95,
      "link": "/startups/1"
    }
  ]
}

Generate 3-5 realistic results that would match this query in a SaaS marketplace context.`;

    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = result.choices[0]?.message?.content || '';

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
        interpretation: `Searching for "${query}"...`,
        results: [],
      };
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('Smart search error:', error);
    const is429 = error?.status === 429 || String(error?.message).includes('429') || String(error?.message).includes('quota');
    return NextResponse.json(
      { error: is429 ? 'AI quota exceeded. Please try again in a few seconds.' : 'Search failed' },
      { status: is429 ? 429 : 500 }
    );
  }
}
