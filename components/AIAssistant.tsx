import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What is the Baseline vs. Growth framework?",
  "How can automation increase my business ROI?",
  "Show me examples of your design systems."
];

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const AillinSymbol = ({ size = 24, animated = false }: { size?: number, animated?: boolean }) => (
  <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
    <motion.div
      className="absolute w-[20%] h-[20%] bg-[#F2EFE9] rounded-full"
      animate={animated ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[50%] h-[50%] border border-[#F2EFE9]/30 rounded-full"
      animate={animated ? { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3], rotate: 180 } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute w-[90%] h-[90%] border border-[#F2EFE9]/10 rounded-full"
      animate={animated ? { scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1], rotate: -180 } : {}}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [sessionId] = useState(() => generateId());

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    const scrollContainer = document.getElementById('chat-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => { 
      document.body.style.overflow = ''; 
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages, isLoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  };

  const resetInput = () => {
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
    }
  };

  const handleSubmit = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const messageText = promptOverride || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = { id: generateId(), role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);

    if (!promptOverride) {
      resetInput();
    }

    setIsLoading(true);
    setTimeout(scrollToBottom, 50);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.ollin.agency/api';
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          sessionId: sessionId 
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.text || data.message || "I'm sorry, I couldn't process that request.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: generateId(), role: 'assistant', content: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full h-[100dvh] flex flex-col overflow-hidden bg-[#050505] z-0"
    >
      <div className="w-full h-[80px] md:h-[100px] shrink-0 pointer-events-none bg-transparent" />

      <div
        className={`absolute -bottom-[20vh] left-1/2 -translate-x-1/2 w-[120vw] h-[40vh] bg-[#F2EFE9] blur-[120px] rounded-[100%] mix-blend-screen transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${isLoading ? 'opacity-[0.14] scale-110' : 'opacity-[0.05] scale-100'}`}
      />

      <div
        id="chat-scroll-container"
        className="relative z-10 flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar flex flex-col"
      >
        <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col px-4 md:px-8 pb-4 pt-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 pb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center mb-16"
              >
                <div className="mb-10">
                  <AillinSymbol size={48} animated />
                </div>
                <h1 className="font-montserrat text-[#F2EFE9] text-3xl md:text-[40px] tracking-tight font-light text-center">
                  Hi, I'm Aillin. Let's chat.
                </h1>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col gap-8 md:gap-10 pb-6 pt-2">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`w-fit max-w-[95%] md:max-w-[85%] text-[15px] md:text-[16px] leading-relaxed ${msg.role === 'user'
                    ? 'py-3 px-1 text-[#F2EFE9]/90 font-light'
                    : 'bg-[#080808] border border-white/5 px-6 md:px-10 py-7 md:py-10 rounded-sm shadow-2xl'
                    }`}>
                    {msg.role === 'assistant' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-5">
                          <AillinSymbol size={16} />
                          <span className="text-[11px] uppercase tracking-[0.2em] text-[#F2EFE9]/40 font-medium pt-[2px]">Aillin</span>
                        </div>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-5 last:mb-0 text-[#F2EFE9]/80 font-light leading-[1.8]">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc ml-5 mb-5 space-y-3">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-5 mb-5 space-y-3">{children}</ol>,
                            li: ({ children }) => <li className="pl-2 text-[#F2EFE9]/80 font-light leading-[1.8]">{children}</li>,
                            strong: ({ children }) => <strong className="font-medium text-[#F2EFE9]">{children}</strong>,
                            h1: ({ children }) => <h1 className="text-xl font-medium text-white mb-4 mt-8 first:mt-0 tracking-tight">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-medium text-white mb-3 mt-6 first:mt-0 tracking-tight">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-medium text-white mb-3 mt-5 first:mt-0 tracking-tight">{children}</h3>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div id="thinking-indicator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex w-full justify-start mt-2">
                  <div className="w-fit max-w-[95%] md:max-w-[85%] bg-[#080808] border border-white/5 px-6 md:px-10 py-6 md:py-8 rounded-sm shadow-2xl flex items-center gap-5">
                    <AillinSymbol size={18} animated={true} />
                    <span className="font-light tracking-wide text-[15px] text-[#F2EFE9]/60">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 shrink-0 w-full bg-[#050505] border-t border-white/5 pt-5 pb-6 px-4 md:px-8 shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
        <div className="w-full max-w-5xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center justify-center gap-3 mb-6 w-full">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={(e) => { e.preventDefault(); handleSubmit(undefined, prompt); }}
                  className="w-full md:w-auto px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[13px] md:text-sm font-medium text-[#F2EFE9]/80 transition-colors text-left"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-3 w-full mx-auto relative">
            <div className="flex items-end bg-[#0A0A0A] rounded-sm border border-white/10 overflow-hidden focus-within:border-white/20 transition-colors shadow-2xl">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask about design, systems, or growth..."
                className="w-full bg-transparent text-[#F2EFE9] text-sm md:text-[15px] leading-snug py-3 md:py-4 px-4 md:px-5 resize-none outline-none custom-scrollbar placeholder:text-white/30 transition-[height] duration-75 ease-out"
                rows={1}
                style={{ 
                  minHeight: '52px',
                  overflowY: input.length > 0 && textareaRef.current && textareaRef.current.scrollHeight > 160 ? 'auto' : 'hidden'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 w-[52px] h-[52px] text-[#F2EFE9]/50 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:text-[#F2EFE9]/50 transition-all hover:bg-white/5"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-xs text-white/40 tracking-wide font-medium">
              Built by Ollin for clearer business decisions.
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;