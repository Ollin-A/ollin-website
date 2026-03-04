import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Bot, ArrowLeft } from 'lucide-react';
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

const TypingIndicator = () => (
  <div className="flex space-x-1.5 items-center h-6 px-2">
    <motion.div className="w-2 h-2 bg-ollin-black/50 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
    <motion.div className="w-2 h-2 bg-ollin-black/50 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
    <motion.div className="w-2 h-2 bg-ollin-black/50 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
  </div>
);

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm the Ollin Strategic Assistant. How can I help you grow your business today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.ollin.agency/api';
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
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
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/media/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-white/10 backdrop-blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full flex items-center justify-between p-6 md:p-8 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-ollin-black/60 hover:text-ollin-black bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all rounded-full"
        >
          <ArrowLeft size={20} />
          <span className="font-medium text-sm">Back</span>
        </button>
      </div>

      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto flex flex-col px-4 md:px-8 mt-4 md:mt-12 overflow-hidden">
        
        <div className="flex flex-col items-center justify-center mb-12 shrink-0">
          <div className="w-16 h-16 rounded-full bg-ollin-black flex items-center justify-center text-white mb-4 shadow-lg">
            <Bot size={32} />
          </div>
          <h2 className="font-montserrat font-semibold text-ollin-black text-2xl md:text-3xl">Ollin AI</h2>
          <p className="text-sm text-ollin-black/60 uppercase tracking-[0.2em] font-medium mt-2">Strategic Assistant</p>
        </div>

        <div className="flex-1 w-full overflow-y-auto flex flex-col gap-8 custom-scrollbar pb-8 px-2">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-ollin-black/10 flex items-center justify-center text-ollin-black mr-4 shrink-0 mt-1">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[90%] md:max-w-[85%] px-6 py-4 rounded-3xl text-[16px] md:text-lg ${
                msg.role === 'user' ? 'bg-ollin-black text-white rounded-br-md' : 'bg-white/60 backdrop-blur-xl text-ollin-black/90 rounded-bl-md border border-black/5'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="flex flex-col gap-3">
                    <ReactMarkdown 
                      components={{
                        p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-5 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-5 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-ollin-black">{children}</strong>,
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex w-full justify-start">
              <div className="w-8 h-8 rounded-full bg-ollin-black/10 flex items-center justify-center text-ollin-black mr-4 shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="px-6 py-5 rounded-3xl bg-white/60 backdrop-blur-xl text-ollin-black/90 rounded-bl-md border border-black/5">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>

        <div className="shrink-0 w-full pb-8 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {messages.length === 1 && SUGGESTED_PROMPTS.map((prompt, index) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => handleSubmit(undefined, prompt)}
                className="px-4 py-2 bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/50 rounded-full text-sm font-medium text-ollin-black/80 transition-colors"
              >
                {prompt}
              </motion.button>
            ))}
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="flex gap-4 items-end relative w-full">
            <div className="flex-1 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white overflow-hidden shadow-sm flex items-center">
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
                className="w-full bg-transparent text-ollin-black py-5 px-6 resize-none outline-none custom-scrollbar"
                rows={1}
                style={{ minHeight: '64px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-3xl bg-ollin-black text-white flex items-center justify-center disabled:opacity-50 transition-all shadow-xl hover:bg-ollin-black/90"
            >
              <Send size={24} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;