
import { GoogleGenAI, Type } from "@google/genai";

export const getExchangeRate = async (from: string, to: string): Promise<number> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `What is the current exchange rate from ${from} to ${to}?`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rate: {
              type: Type.NUMBER,
              description: `A single number representing how many units of ${to} you get for one unit of ${from}.`
            }
          },
          required: ["rate"],
        },
        temperature: 0,
      },
    });

    const jsonString = response.text;
    if (!jsonString) {
        throw new Error("AI returned an empty response.");
    }

    const result = JSON.parse(jsonString);
    
    if (result && typeof result.rate === 'number') {
      return result.rate;
    } else {
      throw new Error("Invalid response format from AI. Could not find a numeric rate.");
    }
  } catch (error) {
    console.error("Error fetching exchange rate from Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The API key is invalid. Please check your configuration.");
    }
    throw new Error("Could not fetch the exchange rate from the AI service. Please try again later.");
  }
};
