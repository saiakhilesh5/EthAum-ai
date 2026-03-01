import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { startupId, sections, format } = await request.json();

    if (!startupId || !sections?.length) {
      return NextResponse.json(
        { error: 'Startup ID and sections are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional business analyst creating an executive brief for investors and partners.

Generate a comprehensive executive brief for a SaaS startup with the following sections: ${sections.join(', ')}

For each section, provide:
1. Detailed analysis with specific metrics and insights
2. Key highlights and takeaways
3. Professional language suitable for C-level executives

Return in JSON format:
{
  "title": "Executive Brief: [Company Name]",
  "generatedAt": "${new Date().toISOString()}",
  "sections": {
    "overview": {
      "title": "Executive Summary",
      "content": "comprehensive paragraph",
      "highlights": ["metric 1", "metric 2", "metric 3", "metric 4"]
    },
    "market": {
      "title": "Market Analysis",
      "content": "market analysis paragraph",
      "size": "$XB TAM",
      "growth": "X% CAGR"
    },
    "team": {
      "title": "Team Profile",
      "content": "team analysis paragraph",
      "size": 0,
      "keyHires": ["notable hire 1", "notable hire 2"]
    },
    "financials": {
      "title": "Financial Overview",
      "content": "financial analysis paragraph",
      "arr": "$X.XM",
      "growth": "X% YoY",
      "margin": "X%"
    },
    "product": {
      "title": "Product Deep Dive",
      "content": "product analysis paragraph"
    },
    "traction": {
      "title": "Traction & Metrics",
      "content": "traction analysis paragraph"
    },
    "reviews": {
      "title": "Customer Reviews",
      "content": "reviews analysis paragraph"
    },
    "risks": {
      "title": "Risk Assessment",
      "content": "risk analysis paragraph"
    },
    "recommendation": "Overall investment recommendation (STRONG BUY/BUY/HOLD/PASS) with brief justification"
  }
}

Only include the sections that were requested. Make the data realistic and professional.`;

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
        title: 'Executive Brief',
        generatedAt: new Date().toISOString(),
        sections: {
          overview: {
            title: 'Executive Summary',
            content: text.substring(0, 500),
            highlights: ['Data-driven insights', 'Strong growth metrics'],
          },
        },
        recommendation: 'See full analysis for recommendation.',
      };
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('Brief generation error:', error);
    const is429 = error?.status === 429 || String(error?.message).includes('429') || String(error?.message).includes('quota');
    return NextResponse.json(
      { error: is429 ? 'AI quota exceeded. Please try again in a few seconds.' : 'Failed to generate brief' },
      { status: is429 ? 429 : 500 }
    );
  }
}
