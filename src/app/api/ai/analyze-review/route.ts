import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { content, pros, cons } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Review content is required' },
        { status: 400 }
      );
    }

    const prompt = `Analyze this product review and provide a JSON response with sentiment analysis and improvement suggestions.

Review Content:
${content}

${pros && pros.length > 0 ? `Pros mentioned: ${pros.join(', ')}` : ''}
${cons && cons.length > 0 ? `Cons mentioned: ${cons.join(', ')}` : ''}

Analyze and return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0-1.0,
  "isGenuine": true | false,
  "genuineConfidence": 0.0-1.0,
  "suggestions": ["suggestion1", "suggestion2"],
  "keyTopics": ["topic1", "topic2"],
  "emotionalTone": "satisfied" | "frustrated" | "neutral" | "enthusiastic" | "disappointed",
  "helpfulness": 0.0-1.0,
  "potentialBias": {
    "detected": true | false,
    "type": "none" | "promotional" | "competitor_attack" | "fake_positive" | "fake_negative",
    "confidence": 0.0-1.0
  }
}

Be strict about detecting fake or biased reviews. Look for:
- Overly promotional language
- Lack of specific details
- Competitor mentions in negative reviews
- Template-like writing
- Inconsistencies between rating and content`;

    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = result.choices[0]?.message?.content || '';

    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Error analyzing review:', error);
    const is429 = error?.status === 429 || String(error?.message).includes('429') || String(error?.message).includes('quota');
    return NextResponse.json(
      { error: is429 ? 'AI quota exceeded. Please try again in a few seconds.' : 'Failed to analyze review' },
      { status: is429 ? 429 : 500 }
    );
  }
}
