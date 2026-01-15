import { GoogleGenAI, Type } from "@google/genai";
import { Submission, ActionPlanResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateActionPlan = async (submissions: Submission[]): Promise<ActionPlanResponse> => {
  if (submissions.length === 0) {
    return {
      summary: "No feedback available yet.",
      points: ["Collect more feedback to generate an action plan."]
    };
  }

  // Prepare the data for the prompt
  const feedbackText = submissions.map(s => `Mood: ${s.mood}/5, Comment: "${s.feedback}"`).join("\n");

  const prompt = `
    You are an expert HR consultant and team culture specialist. 
    Analyze the following anonymous employee feedback and mood ratings.
    
    Data:
    ${feedbackText}
    
    Task:
    1. Write a 1-sentence summary of the overall team sentiment.
    2. Create a specific, actionable 3-point plan for management to improve or maintain the culture based on this feedback.
    
    Keep the tone constructive, empathetic, and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            points: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of exactly 3 actionable steps."
            }
          },
          required: ["summary", "points"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as ActionPlanResponse;
  } catch (error) {
    console.error("Error generating action plan:", error);
    throw error;
  }
};
