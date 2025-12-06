import { GoogleGenAI } from "@google/genai";
import { MOCK_CARS } from "../constants";

const getGeminiClient = () => {
    const apiKey = process.env.API_KEY || ''; 
    return new GoogleGenAI({ apiKey });
};

export const getCarRecommendation = async (userPrompt: string): Promise<string> => {
    try {
        const ai = getGeminiClient();
        
        // Prepare context about inventory
        const inventoryContext = MOCK_CARS.map(c => 
            `${c.year} ${c.make} ${c.model} (${c.category}, $${c.pricePerDay}/day, ${c.seats} seats)`
        ).join('\n');

        const systemInstruction = `
        You are a helpful car rental concierge for 'Velocita Rentals'.
        Your goal is to recommend the best vehicle from our inventory based on the user's request.
        
        Our Current Inventory:
        ${inventoryContext}
        
        Rules:
        1. Only recommend cars from the list above.
        2. Be enthusiastic and professional.
        3. If no car perfectly fits, suggest the closest match.
        4. Keep the response short (under 100 words).
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text || "I'm having trouble connecting to the concierge service right now. Please browse our inventory manually.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I apologize, but our AI concierge is currently offline. Please browse our collection above.";
    }
};