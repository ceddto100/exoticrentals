import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Zap } from 'lucide-react';
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
    { role: 'assistant', content: 'Hello! I\'m your AI Concierge powered by Gemini. I can help you find the perfect exotic car for your trip. What are you looking for?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      {/* Modal Container */}
      <div className="glass-card w-full sm:w-[480px] sm:rounded-2xl shadow-2xl pointer-events-auto flex flex-col h-[600px] sm:max-h-[80vh] m-0 sm:m-4 overflow-hidden relative border border-red-500/30">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-900/90 via-red-800/80 to-red-900/90 p-4 flex justify-between items-center border-b border-red-500/30">
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10 pointer-events-none"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30 animate-pulse-glow">
              <Sparkles className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">AI Concierge</h3>
              <div className="flex items-center gap-1.5 text-red-300 text-xs">
                <Zap className="h-3 w-3" />
                <span>Powered by Gemini</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-lg bg-red-500/10 text-red-300 hover:text-white hover:bg-red-500/30 transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-red-400" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-sm shadow-lg shadow-red-500/20'
                  : 'glass-card text-gray-100 rounded-bl-sm border border-red-500/20'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="h-4 w-4 text-red-400" />
              </div>
              <div className="glass-card p-4 rounded-2xl rounded-bl-sm border border-red-500/20">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-red-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/60 border-t border-red-500/20">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about our exotic fleet..."
              className="flex-1 px-4 py-3 bg-black/60 border border-red-500/30 rounded-xl text-white placeholder-gray-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 outline-none transition-all duration-300"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 primary-gradient-btn text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-3">
            AI recommendations based on your preferences
          </p>
        </div>
      </div>
    </div>
  );
};
