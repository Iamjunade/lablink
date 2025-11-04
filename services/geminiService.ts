
import { GoogleGenAI } from "@google/genai";
import { Contribution, ContributionType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd show an error to the user.
  // For this context, we'll log it and the app will have reduced functionality.
  console.error("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateVivaQuestions = async (experimentTitle: string, experimentObjective: string): Promise<Contribution[]> => {
  if (!API_KEY) return [];

  try {
    const prompt = `
      You are an expert computer science professor. For a lab experiment titled "${experimentTitle}" with the objective "${experimentObjective}", generate 5 insightful viva questions that a student should be prepared for.
      For each question, provide a concise and accurate answer.
      Format the output as a JSON array of objects, where each object has a "question" and "answer" property.
      Example: [{"question": "What is a data structure?", "answer": "It is a way of organizing data."}]
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
    });

    const text = response.text;
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
   