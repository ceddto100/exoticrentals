import { GoogleGenerativeAI } from '@google/generative-ai';
import Vehicle from '../models/Vehicle.js';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

export const chatWithConcierge = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get current vehicle inventory for context
    const vehicles = await Vehicle.find({ isAvailable: true }).lean();
    const inventoryContext = vehicles
      .map((v) => `${v.year} ${v.make} ${v.model} (${v.category}, $${v.pricePerDay || v.dailyRate}/day, ${v.seats} seats)`)
      .join('\n');

    const systemInstruction = `
You are a helpful car rental concierge for 'Exotic Rentals'.
Your goal is to recommend the best vehicle from our inventory based on the user's request.

Our Current Inventory:
${inventoryContext || 'No vehicles currently available'}

Rules:
1. Only recommend cars from the list above.
2. Be enthusiastic and professional.
3. If no car perfectly fits, suggest the closest match.
4. Keep the response short (under 100 words).
5. If asked about something unrelated to car rentals, politely redirect the conversation.
`;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    res.json({
      response: text || "I'm having trouble connecting right now. Please browse our inventory manually."
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    if (error.message === 'GEMINI_API_KEY is not configured') {
      return res.status(503).json({
        error: 'AI Concierge is not configured',
        response: "I apologize, but the AI concierge is currently unavailable. Please browse our collection above or contact support."
      });
    }

    res.status(500).json({
      error: 'Failed to get AI response',
      response: "I apologize, but our AI concierge is currently offline. Please browse our collection above."
    });
  }
};
