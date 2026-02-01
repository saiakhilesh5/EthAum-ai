import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { startupName, industry, description } = await request.json();

    if (!startupName || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a marketing expert helping startups craft compelling product launch content. 

Based on the following startup information:
- Name: ${startupName}
- Industry: ${industry}
- Description: ${description}

Generate the following in JSON format:
1. "taglines": An array of 3 catchy taglines (max 100 characters each) that would work well for a Product Hunt-style launch
2. "launchDescription": A compelling launch description (200-300 words) that highlights the value proposition, key benefits, and why people should care
3. "keyFeatures": An array of 5 key features/benefits that should be highlighted

The tone should be professional yet engaging, focusing on the value delivered to users. Avoid buzzwords and focus on concrete benefits.

Return ONLY valid JSON, no markdown or explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const content = JSON.parse(jsonMatch[0]);

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
