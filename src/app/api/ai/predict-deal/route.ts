import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { userProfile, partnerProfile, userType } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert B2B sales strategist and deal analyst. Analyze the compatibility between these two companies and predict the likelihood of a successful partnership.

User Profile (${userType}):
${JSON.stringify(userProfile, null, 2)}

Partner Profile (${userType === 'startup' ? 'enterprise' : 'startup'}):
${JSON.stringify(partnerProfile, null, 2)}

Provide your analysis in the following JSON format:
{
  "successProbability": <number 0-100>,
  "confidenceLevel": "<'high' | 'medium' | 'low'>",
  "estimatedTimeToClose": "<e.g., '4-6 weeks'>",
  "dealValueRange": "<e.g., '$50,000 - $150,000'>",
  "positiveFactors": ["<factor 1>", "<factor 2>", "<factor 3>", "<factor 4>", "<factor 5>"],
  "riskFactors": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "nextSteps": ["<step 1>", "<step 2>", "<step 3>", "<step 4>", "<step 5>"],
  "similarDeals": [
    { "company": "<name>", "outcome": "<'success' | 'failed'>", "timeline": "<e.g., '5 weeks'>" },
    { "company": "<name>", "outcome": "<'success' | 'failed'>", "timeline": "<e.g., '3 weeks'>" },
    { "company": "<name>", "outcome": "<'success' | 'failed'>", "timeline": "<e.g., '8 weeks'>" }
  ]
}

Consider factors like:
- Industry alignment
- Company size compatibility
- Technology requirements vs capabilities
- Budget alignment
- Geographic considerations
- Growth stage compatibility
- Use case relevance

Be realistic and specific in your predictions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const prediction = JSON.parse(jsonMatch[0]);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error predicting deal:', error);
    return NextResponse.json(
      { error: 'Failed to predict deal' },
      { status: 500 }
    );
  }
}
