import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const geminiAI = ai;