/**
 * src/ui/components/chatbot/AIChatbot.tsx
 *
 * Salvo AI Assistant - Enterprise Autonomous Recovery Intelligence
 *
 * Built for Razorpay AI Buildathon 2026.
 * Features:
 *  - Fixed, viewport-contained floating panel with independent message scroll
 *  - Non-clipping, responsive layout (mobile & desktop friendly)
 *  - Direct real-time backend integration via POST /api/chat with live metrics
 *  - Authenticated session binding (Razorpay & Google SSO context)
 *  - High contrast deep-space aesthetic (#050914 / #0c1222 / #1e2839)
 *  - Rich message formatting with bolding, lists, and break-word wrapping
 *  - Quick prompt recommendation chips
 *  - Resilient error handling without raw 500 crashes
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button.js';
import { cn } from '../../lib/utils.js';
import { SalvoAuth } from '../../lib/auth.js';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface AIChatbotProps {
  className?: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'assistant',
  content: `Hello! I'm your **Salvo Autonomous Recovery AI Assistant**.

I am connected to your live merchant telemetry and payment operations engine. I can help you with:

• **Revenue at Risk** — Live failed payment volume and breakdown
• **Failure Root Causes** — Real error codes and gateway drop-offs
• **Recovery Pipeline** — Observe → Diagnose → Policy Gate → Execute
• **Policy Gates** — Safety invariants (amount, risk ≤ 0.40, confidence ≥ 65%, max 3 attempts)
• **Recovery Strategies** — Smart Retry, Payment Links, Method Switch, and Reminders
• **Razorpay Integration** — Live webhooks, sync state, and test keys

What insights or recovery actions would you like to review?`,
  timestamp: new Date(),
};

const SUGGESTED_QUESTIONS = [
  'What is my revenue at risk?',
  'Why are payments failing?',
  'Explain recovery strategies',
  'What does the policy gate do?',
];

/**
 * Clean markdown formatter for assistant responses.
 * Parses bold text, lists, and paragraphs into readable TSX without external dependencies.
 */
const FormattedMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-[13px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Parse inline bolding **text**
        const renderInline = (text: string) => {
          const parts = text.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });
        };

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[•\-*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-primary text-[10px] mt-1 shrink-0 font-bold">●</span>
              <span className="flex-1 text-slate-200">{renderInline(bulletText)}</span>
            </div>
          );
        }

        // Numbered list item
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-primary font-mono text-[11px] mt-0.5 shrink-0 font-bold">
                {numMatch[1]}.
              </span>
              <span className="flex-1 text-slate-200">{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        // Header style ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-semibold text-white text-[13px] pt-1">
              {renderInline(trimmed.slice(4))}
            </h4>
          );
        }

        return (
          <p key={idx} className="text-slate-200">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
};

export const AIChatbot: React.FC<AIChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [providerTag, setProviderTag] = useState<string | null>('groq');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) {
      setInputValue('');
    }
    setIsLoading(true);

    try {
      // Build conversation history payload
      const historyPayload = messages
        .filter((m) => !m.isError)
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // Retrieve authenticated session token
      const session = SalvoAuth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        const errorMsg = data.response || data.error || 'AI service is temporarily unavailable. Please try again.';
        const assistantErrorMessage: Message = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: errorMsg,
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, assistantErrorMessage]);
        return;
      }

      if (data.provider) {
        setProviderTag(data.provider);
      }

      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'No response generated. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('[AIChatbot] Network error during /api/chat call:', err);
      const networkErrorMessage: Message = {
        id: `net-err-${Date.now()}`,
        role: 'assistant',
        content: 'AI service is temporarily unavailable. Please check your connection and try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, networkErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputValue('');
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Activation Pill / Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'h-14 w-14 rounded-full',
            'bg-gradient-to-tr from-primary to-indigo-600 hover:from-primary-hover hover:to-indigo-500',
            'shadow-glow-primary hover:shadow-glow-primary-intense hover:scale-105',
            'flex items-center justify-center',
            'transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary',
            className
          )}
          aria-label="Open Salvo AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal / Assistant Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'w-[calc(100vw-2rem)] sm:w-[440px]',
            'h-[640px] max-h-[calc(100vh-5rem)]',
            'flex flex-col min-h-0 overflow-hidden',
            'bg-[#060a17] border border-[#1e2839] rounded-2xl',
            'shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(79,70,229,0.15)]',
            'animate-in fade-in zoom-in-95 duration-200',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Salvo AI Assistant Window"
        >
          {/* Header - Fixed & Stable */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1b2438] bg-[#0c1224] shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-inner">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-wide">Salvo AI Assistant</h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Institutional Payment Recovery {providerTag ? `(${providerTag.toUpperCase()})` : ''}
                </p>
              </div>
            </div>

            {/* Controls: Reset + Close */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart conversation"
                aria-label="Reset conversation"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#161f36] transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#161f36] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area - Independently Scrolling */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 bg-[#050914]">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex w-full',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed',
                      'break-words [overflow-wrap:anywhere] [word-break:break-word] shadow-md',
                      isUser
                        ? 'bg-gradient-to-br from-primary to-indigo-600 text-white rounded-br-none shadow-primary/20'
                        : message.isError
                        ? 'bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-bl-none'
                        : 'bg-[#0f1629] border border-[#1e293b] text-slate-100 rounded-bl-none'
                    )}
                  >
                    {message.isError && (
                      <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1 text-xs">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>Service Alert</span>
                      </div>
                    )}
                    <FormattedMessage content={message.content} isUser={isUser} />
                    <div
                      className={cn(
                        'text-[10px] mt-2 font-mono flex items-center justify-end gap-1',
                        isUser ? 'text-primary-foreground/70' : 'text-slate-400'
                      )}
                    >
                      <span>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-none px-4 py-3 bg-[#0f1629] border border-[#1e293b] flex items-center gap-3 shadow-md">
                  <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                  <span className="text-xs text-slate-300 font-medium tracking-wide">
                    Salvo AI is analyzing live telemetry...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-[#090e1e] border-t border-[#162035] shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#121a30] hover:bg-[#1a2542] border border-[#1e2d4d] text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Composer - Sticky Bottom */}
          <div className="p-3 border-t border-[#162035] bg-[#0c1224] shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about revenue at risk, failure reasons, policy rules..."
                disabled={isLoading}
                className={cn(
                  'flex-1 min-h-[44px] max-h-[100px] resize-none px-3.5 py-2.5 rounded-xl',
                  'bg-[#060a17] border border-[#1e293b]',
                  'text-sm text-white placeholder:text-slate-400 leading-normal',
                  'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
                  'disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                )}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className={cn(
                  'h-11 w-11 shrink-0 rounded-xl',
                  'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/30',
                  'disabled:opacity-40 disabled:cursor-not-allowed transition-all'
                )}
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1 font-mono">
              <span>Press <kbd className="px-1 py-0.5 bg-[#162035] rounded text-[9px] text-slate-300">Enter</kbd> to send</span>
              <span><kbd className="px-1 py-0.5 bg-[#162035] rounded text-[9px] text-slate-300">Shift+Enter</kbd> for line</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
