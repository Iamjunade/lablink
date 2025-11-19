import { GoogleGenAI, Type } from "@google/genai";
import { Contribution, ContributionType } from "../types";

// Safely access process.env.API_KEY, as 'process' might not be defined in all browser environments
const getApiKey = (): string | undefined => {
  return typeof process !== 'undefined' && process.env && process.env.API_KEY ? process.env.API_KEY : undefined;
};

export const generateVivaQuestions = async (experimentTitle: string, experimentObjective: string): Promise<Contribution[]> => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    console.error("Gemini API key not found or process.env is unavailable. AI features will be disabled.");
    return [];
  }

  // Initialize GoogleGenAI right before making the API call
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const prompt = `
      You are an expert computer science professor. For a lab experiment titled "${experimentTitle}" with the objective "${experimentObjective}", generate 5 insightful viva questions that a student should be prepared for.
      For each question, provide a concise and accurate answer.
      Format the output as a JSON array of objects, where each object has a "question" and "answer" property.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Changed model for complex text tasks
        contents: { parts: [{ text: prompt }] }, // Explicitly define content as parts
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: {
                  type: Type.STRING,
                  description: "The viva question."
                },
                answer: {
                  type: Type.STRING,
                  description: "The concise and accurate answer to the question."
                },
              },
              required: ["question", "answer"],
            },
          }
        }
    });

    const text = response.text; // Access text as a property
    const generatedPairs: { question: string, answer: string }[] = JSON.parse(text);

    return generatedPairs.map((pair, index) => ({
      id: `ai-viva-${Date.now()}-${index}`,
      author: 'Gemini AI',
      type: ContributionType.Viva,
      question: pair.question,
      content: pair.answer,
      upvotes: 0,
      createdAt: new Date(),
      isAiGenerated: true,
    }));
  } catch (error) {
    console.error("Error generating viva questions with Gemini:", error);
    return [];
  }
};