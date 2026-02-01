import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert startup pitch deck analyst and venture capital advisor. Analyze this pitch deck and provide detailed feedback.

Return your analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "investorReadiness": "<'ready' | 'almost' | 'needs-work'>",
  "sections": {
    "problemStatement": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "solution": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "marketSize": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "businessModel": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "traction": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "team": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "financials": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "askUse": {
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>", "<weakness 4>"],
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>", "<rec 4>"],
  "competitorInsights": ["<insight 1>", "<insight 2>", "<insight 3>", "<insight 4>"]
}

Be thorough, specific, and actionable in your feedback. Score sections that are missing as 0.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing pitch:', error);
    return NextResponse.json(
      { error: 'Failed to analyze pitch deck' },
      { status: 500 }
    );
  }
}
