import React, { useState } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { getCarRecommendation } from '../services/geminiService';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I can help you find the perfect car for your trip. What are you looking for?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getCarRecommendation(input);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="bg-white w-full sm:w-[450px] sm:rounded-2xl shadow-2xl pointer-events-auto flex flex-col h-[600px] sm:max-h-[80vh] m-0 sm:m-4 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
                <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Concierge</h3>
              <p className="text-indigo-200 text-xs">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="E.g., I need a fast SUV for the weekend..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              autoFocus
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};