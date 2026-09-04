/**
 * src/ui/components/chatbot/AIChatbot.tsx
 *
 * Salvo AI Assistant - Floating Chatbot Widget powered by Gemini/Groq LLM
 * Real AI responses via POST /api/chat endpoint
 * Institutional design: no cartoonish elements, deep-space command center aesthetic
 */
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../ui/button.js';
import { cn } from '../../lib/utils.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  className?: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Salvo AI Assistant, powered by advanced AI. I can help you understand recovery strategies, diagnose transactions, navigate the platform, and answer any questions you have. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('[AIChatbot] Error calling /api/chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to the AI service. Please check your connection and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'h-14 w-14 rounded-full',
            'bg-primary hover:bg-primary-hover',
            'shadow-glow-primary hover:shadow-glow-primary-intense',
            'flex items-center justify-center',
            'transition-all duration-200 group',
            className
          )}
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'w-[380px] h-[600px]',
            'bg-surface-base border border-border-hairline rounded-[24px]',
            'shadow-elevation-high flex flex-col animate-scale-in',
            className
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border-hairline">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-ai-signal" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Salvo AI Assistant</h3>
                <p className="text-xs text-text-tertiary font-mono">Always available</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-[8px] flex items-center justify-center hover:bg-surface-elevated transition-colors text-text-secondary hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-[16px] px-4 py-3 text-sm whitespace-pre-line',
                    message.role === 'user'
                      ? 'bg-primary text-white ml-8'
                      : 'bg-surface-elevated text-text-primary border border-border-hairline mr-8'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-[16px] px-4 py-3 bg-surface-elevated border border-border-hairline flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-ai-signal animate-spin" />
                  <span className="text-sm text-text-secondary">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border-hairline">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className={cn(
                  'flex-1 h-10 px-4 rounded-[12px]',
                  'bg-surface-elevated border border-border-hairline',
                  'text-sm text-white placeholder:text-text-tertiary',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                  'disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                )}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-text-tertiary text-center mt-2 font-mono">
              Powered by AI • Press Enter to send
            </p>
          </div>
        </div>
      )}
    </>
  );
};

