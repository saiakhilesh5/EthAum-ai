import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert audio to base64
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Audio = buffer.toString('base64');

    // Use Gemini to transcribe (Gemini supports audio)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: audioFile.type || 'audio/webm',
          data: base64Audio,
        },
      },
      {
        text: `Transcribe this audio recording of a product/service review. 
        
Please provide:
1. The exact transcription of what was said
2. A brief analysis of the sentiment (positive, negative, neutral)
3. Key points mentioned

Return in JSON format:
{
  "transcription": "exact text of what was said",
  "sentiment": "positive/negative/neutral",
  "keyPoints": ["point 1", "point 2"],
  "suggestedRating": 4.5
}`,
      },
    ]);

    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      // If parsing fails, return the raw text as transcription
      parsed = {
        transcription: text,
        sentiment: 'neutral',
        keyPoints: [],
        suggestedRating: 3,
      };
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
