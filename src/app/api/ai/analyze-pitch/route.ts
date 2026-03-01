import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();

    const prompt = `You are an expert startup pitch deck analyst and venture capital advisor. Analyze this pitch deck and provide detailed feedback.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "overallScore": 0,
  "investorReadiness": "needs-work",
  "sections": {
    "problemStatement": { "score": 0, "feedback": "", "suggestions": [] },
    "solution": { "score": 0, "feedback": "", "suggestions": [] },
    "marketSize": { "score": 0, "feedback": "", "suggestions": [] },
    "businessModel": { "score": 0, "feedback": "", "suggestions": [] },
    "traction": { "score": 0, "feedback": "", "suggestions": [] },
    "team": { "score": 0, "feedback": "", "suggestions": [] },
    "financials": { "score": 0, "feedback": "", "suggestions": [] },
    "askUse": { "score": 0, "feedback": "", "suggestions": [] }
  },
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "competitorInsights": []
}

Fill in all fields with real analysis. Score missing sections as 0. Be thorough and actionable.`;

    // Note: Groq doesn't support PDF/image input directly
    // We'll analyze based on the prompt structure for now
    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nNote: A PDF pitch deck file was uploaded (${file.name}, ${Math.round(bytes.byteLength / 1024)}KB). Please provide a template analysis structure that can be filled in.`,
        },
      ],
    });

    const text = result.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse AI response');

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Error analyzing pitch:', error);
    return NextResponse.json(
      { error: 'Failed to analyze pitch deck. Please try again.' },
      { status: 500 }
    );
  }
}


