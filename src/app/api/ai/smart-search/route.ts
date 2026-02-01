import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
        interpretation: `Searching for "${query}"...`,
        results: [],
      };
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Smart search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
