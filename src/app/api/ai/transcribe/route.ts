import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Groq supports Whisper for audio transcription
    // Use Groq's Whisper model for transcription
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
    });

    // Analyze the transcription for sentiment
    const analysisResult = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Analyze this transcribed audio review and return ONLY valid JSON:

Transcription: "${transcription.text}"

Return this JSON format:
{
  "transcription": "<the transcription>",
  "sentiment": "positive" | "negative" | "neutral",
  "keyPoints": ["point1", "point2"],
  "suggestedRating": 4.0
}`,
        },
      ],
    });

    const text = analysisResult.choices[0]?.message?.content || '';

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    return NextResponse.json(
      parsed || {
        transcription: text,
        sentiment: 'neutral',
        keyPoints: [],
        suggestedRating: 3,
      }
    );
  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio. Please try again.' },
      { status: 500 }
    );
  }
}
