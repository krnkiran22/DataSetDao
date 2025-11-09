/**
 * Groq AI Analysis API Route (Server-side)
 * Keeps API key secure on the server
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Groq client on the server (secure)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON data from request
    const { jsonData } = await request.json();

    if (!jsonData) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    console.log('🤖 Starting Groq AI analysis (server-side)...');

    // Convert JSON data to string for analysis (truncate if too large)
    const dataString = JSON.stringify(jsonData, null, 2);
    const truncatedData = dataString.length > 10000 
      ? dataString.substring(0, 10000) + '\n... (truncated for analysis)'
      : dataString;

    // Create the analysis prompt
    const prompt = `You are a data quality expert. Analyze this JSON dataset and provide a comprehensive quality assessment.

Dataset Sample:
${truncatedData}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "qualityScore": <number 0-100>,
  "diversity": <number 0-100>,
  "accuracy": <number 0-100>,
  "completeness": <number 0-100>,
  "consistency": <number 0-100>,
  "bias": "<low|medium|high>",
  "insights": [
    "<insight 1>",
    "<insight 2>",
    "<insight 3>"
  ],
  "recommendations": [
    "<recommendation 1>",
    "<recommendation 2>"
  ],
  "statistics": {
    "totalRecords": <number>,
    "totalFields": <number>,
    "missingDataPercentage": <number>,
    "dataTypes": ["<type1>", "<type2>"]
  }
}

Scoring Guidelines:
- qualityScore: Overall data quality (structure, completeness, consistency)
- diversity: Variety and distribution of data values
- accuracy: Data validity and correctness
- completeness: Percentage of non-missing data
- consistency: Uniformity of data formats and values
- bias: Assess representation bias (low/medium/high)

Provide actionable insights and recommendations based on the data.`;

    console.log('📤 Sending request to Groq...');

    // Call Groq API using llama-3.3-70b-versatile (free, fast, and powerful)
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Free Groq model (replaces deprecated mixtral-8x7b-32768)
      messages: [
        {
          role: "system",
          content: "You are a data quality expert. Analyze datasets and respond ONLY with valid JSON format, no markdown or explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 2000,
    });

    console.log('📨 Received response from Groq');

    // Extract the response content
    const content = response.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const analysis = JSON.parse(cleanedContent);
      console.log('✅ Analysis completed successfully');
      console.log('📊 Quality Score:', analysis.qualityScore);

      return NextResponse.json({ success: true, analysis });
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.log('Raw response:', content);
      
      return NextResponse.json(
        { error: 'Failed to parse AI analysis response', rawResponse: content },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Groq AI analysis failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Groq API key not configured. Please add GROQ_API_KEY to .env.local' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
