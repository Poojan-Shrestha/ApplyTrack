import { geminiAI } from '../config/gemini';

const GEMINI_MODELS = [
  'gemini-3-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-Lite',
] as const;

const cleanAndParseJSON = (raw?: string) => {
  if (!raw) {
    throw new Error('Empty AI response');
  }

  let cleaned = raw.trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```\n?/g, '').replace(/```\n?$/g, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Invalid JSON returned by AI');
  }
};


export class GeminiService {
  // INTERNAL: Try models one by one
  private static async generateWithFallback(
    contents: any
  ): Promise<string> {
    for (const model of GEMINI_MODELS) {
      try {
        console.log(`Gemini model attempt: ${model}`);

        const response = await geminiAI.models.generateContent({
          model,
          contents,
        });

        if (!response.text) {
          throw new Error('Empty response text');
        }

        return response.text;
      } catch (error: any) {
        console.error(`Gemini model failed: ${model}`);
        console.error(error?.message || error);
        continue;
      }
    }

    throw new Error(
      'All free Gemini models are unavailable. Please try again later.'
    );
  }

  /**
   * Generate content with Gemini AI
   */
  static async generateContent(prompt: string): Promise<string> {
    const text = await this.generateWithFallback(prompt);
    return text;
  }

  /**
   * ATS Resume Analysis with direct PDF
   * @param pdfBuffer - Resume PDF buffer
   * @param jobDescription - Job description text
   */
  static async analyzeATSWithPDF(
    pdfBuffer: Buffer,
    jobDescription: string
  ): Promise<any> {
    try {
      console.log('Analyzing resume with Gemini (direct PDF)...');

      const base64PDF = pdfBuffer.toString('base64');

      const response = await this.generateWithFallback([
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: base64PDF,
                },
              },
              {
                text: `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume PDF against the following job description and provide a detailed assessment.

JOB DESCRIPTION:
${jobDescription}

Please analyze and provide your response in VALID JSON format only (no markdown, no code blocks, just pure JSON):
{
  "overall_score": <number between 0-100>,
  "keyword_match": <number between 0-100>,
  "formatting_score": <number between 0-100>,
  "matched_keywords": [<array of 5-10 matched keyword strings>],
  "missing_keywords": [<array of 3-5 missing keyword strings>],
  "strengths": [<array of 3-5 strength strings>],
  "suggestions": [<array of 3-5 actionable suggestion strings>],
  "experience_match": "<brief 1-2 sentence assessment>"
}

Important: Return ONLY valid JSON, no additional text or formatting.`,
              },
            ],
          },
        ],
      );

      // Parse response
      return cleanAndParseJSON(response);

    } catch (error) {
      console.error('Gemini ATS analysis error:', error);
      throw new Error('Failed to analyze resume with Gemini AI');
    }
  }

  /**
   * Interview Preparation Generator
   */
  static async generateInterviewPrep(
    jobTitle: string,
    company: string,
    jobDescription: string
  ): Promise<any> {
    const prompt = `Generate comprehensive interview preparation for the following position:

JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION: ${jobDescription}

Provide the response in VALID JSON format only (no markdown, no code blocks):
{
  "behavioral": [
    {
      "question": "<behavioral interview question>",
      "why_asked": "<why this question is asked>",
      "answer_framework": "<STAR method guidance>"
    }
  ],
  "technical": [
    {
      "question": "<technical question>",
      "key_points": [<array of key points to mention>]
    }
  ],
  "questionsToAsk": [
    {
      "question": "<question to ask interviewer>",
      "purpose": "<why this question is important>"
    }
  ],
  "tips": [<array of 5 interview tips>],
  "mistakesToAvoid": [<array of 5 common mistakes>]
}

Generate exactly 5 questions for each category. Return ONLY valid JSON.`;

    try {
      const response = await this.generateContent(prompt);

      return cleanAndParseJSON(response);
    } catch (error) {
      console.error('Gemini interview prep error:', error);
      throw new Error('Failed to generate interview prep with Gemini AI');
    }
  }

  /**
   * General Resume Analysis with direct PDF
   */
  static async analyzeResumeWithPDF(pdfBuffer: Buffer): Promise<any> {
    try {
      const base64PDF = pdfBuffer.toString('base64');

      const response = await this.generateWithFallback([
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: base64PDF,
                },
              },
              {
                text: `Analyze this resume PDF and provide feedback on structure, content, and missing sections.

Provide response in VALID JSON format only:
{
  "structureScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "missingSections": [<array of missing section names>],
  "suggestions": [<array of 5-7 improvement suggestions>]
}

Return ONLY valid JSON.`,
              },
            ],
          },
        ],
      );

      return cleanAndParseJSON(response);
    } catch (error) {
      console.error('Gemini resume analysis error:', error);
      throw new Error('Failed to analyze resume with Gemini AI');
    }
  }
}