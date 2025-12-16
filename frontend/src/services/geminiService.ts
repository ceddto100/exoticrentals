import { API_BASE_URL } from './apiClient';

export const getCarRecommendation = async (userPrompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gemini/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userPrompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data.error);
      return data.response || "I apologize, but our AI concierge is currently offline. Please browse our collection above.";
    }

    return data.response || "I'm having trouble connecting to the concierge service right now. Please browse our inventory manually.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I apologize, but our AI concierge is currently offline. Please browse our collection above.";
  }
};
