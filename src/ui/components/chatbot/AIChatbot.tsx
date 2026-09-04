/**
 * src/ui/components/chatbot/AIChatbot.tsx
 *
 * Salvo AI Assistant - Professional Chat Interface
 * Real AI responses via POST /api/chat endpoint
 * Solid, non-transparent design with high contrast for readability
 */
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';
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
      content: 'Hello! I\'m your Salvo AI Assistant. I can help you with:\n\n• **Dashboard Navigation** - Overview, Diagnosis, Simulator, Execution, Audit, Launch screens\n• **Recovery Strategies** - Smart Retry, Payment Links, Method Switch, Reminders\n• **AI Diagnosis** - How the 4-stage pipeline works (Observe → Diagnose → Policy → Execute)\n• **Metrics & KPIs** - Recovery Rate, ROI, Success Rate, Revenue at Risk\n• **Policy Rules** - Amount thresholds, risk scores, confidence levels\n• **Razorpay Integration** - Connection setup, payment sync, webhooks\n\nAsk me anything about the platform!',
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('[AIChatbot] Error calling /api/chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ I apologize, but I encountered an error processing your request.\n\n**Common issues:**\n• AI service temporarily unavailable\n• Network connectivity problem\n• API rate limit reached\n\nPlease try again in a moment. If the issue persists, check the console for details.\n\n**Technical error:** ' + (error instanceof Error ? error.message : 'Unknown error'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hello! I\'m your Salvo AI Assistant, powered by Gemini AI. I can help you:\n\n• Understand recovery strategies and best practices\n• Analyze failed transactions and suggest solutions\n• Navigate platform features and workflows\n• Answer questions about payment recovery\n\nHow can I assist you today?',
        timestamp: new Date(),
      },
    ]);
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

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a0f1e]">
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
                    'max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line',
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg shadow-primary/20'
                      : 'bg-[#151d2f] text-gray-100 border-2 border-[#1e2839] shadow-lg'
                  )}
                >
                  {message.content}
                  <div className={cn(
                    'text-[10px] mt-2 font-mono',
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-text-tertiary'
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#151d2f] border-2 border-[#1e2839] flex items-center gap-3 shadow-lg">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm text-gray-300 font-medium">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-2 border-border-hairline bg-gradient-to-r from-[#0f1628] to-[#0d1220]">
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className={cn(
                  'flex-1 min-h-[44px] px-4 py-3 rounded-xl',
                  'bg-[#151d2f] border-2 border-[#1e2839]',
                  'text-sm text-white placeholder:text-text-tertiary',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                  'disabled:opacity-50 disabled:cursor-not-allowed transition-all',
                  'hover:border-[#2a3548]'
                )}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-[11px] text-text-tertiary text-center mt-3 font-mono">
              Press <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded text-[10px]">Enter</kbd> to send
            </p>
          </div>
        </div>
      )}
    </>
  );
};

