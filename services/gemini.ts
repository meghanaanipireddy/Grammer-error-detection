
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

export const analyzeText = async (text: string): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following English text for syntactic structure and grammatical correctness: "${text}"`,
    config: {
      systemInstruction: `You are a world-class NLP-based writing assistant.
Perform deep syntactic analysis including tokenization, POS tagging, and dependency identification (Subject, Verb, Object, Modifiers).
Evaluate subject-verb agreement, tense, missing components, and word order.

Your response MUST follow the specified JSON schema strictly.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalSentence: { type: Type.STRING },
          tokens: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                pos: { type: Type.STRING, description: "Part of speech (e.g., Noun, Verb, Adjective)" },
                dependency: { type: Type.STRING, description: "The grammatical relation" },
                role: { 
                  type: Type.STRING, 
                  enum: ["Subject", "Verb", "Object", "Modifier", "Other"] 
                }
              },
              required: ["word", "pos", "dependency", "role"]
            }
          },
          syntacticSummary: { type: Type.STRING },
          grammarIssues: {
            type: Type.OBJECT,
            properties: {
              detected: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING },
              correctedSentence: { type: Type.STRING }
            },
            required: ["detected", "explanation", "correctedSentence"]
          },
          improvedSuggestion: { type: Type.STRING }
        },
        required: ["originalSentence", "tokens", "syntacticSummary", "grammarIssues", "improvedSuggestion"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    return result as AnalysisResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze text structure.");
  }
};
