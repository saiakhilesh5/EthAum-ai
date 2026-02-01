import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { content, pros, cons } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Review content is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing review:', error);
    return NextResponse.json(
      { error: 'Failed to analyze review' },
      { status: 500 }
    );
  }
}
