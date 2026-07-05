import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  MessageSquare, 
  Info, 
  ChevronRight, 
  HelpCircle,
  RefreshCw,
  MapPin,
  Compass,
  AlertTriangle,
  Coins,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PolicyInputs, SimulationResult } from "../types";

interface HeritageChatBotProps {
  activeCity: string | null;
  inputs: PolicyInputs;
  metrics: SimulationResult;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function HeritageChatBot({ activeCity, inputs, metrics }: HeritageChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting based on active city
  useEffect(() => {
    const cityLabel = activeCity 
      ? activeCity.charAt(0).toUpperCase() + activeCity.slice(1)
      : "Indian Corridor";

    setMessages([
      {
        id: "welcome-msg",
        sender: "bot",
        text: activeCity 
          ? `Pranam! Welcome to **${cityLabel}**. I am your Swadeshi AI Heritage Concierge. Ask me anything about local weaver co-ops, walking guides, safety parameters, or how your policy sliders will shape our grassroots economy!`
          : `Pranam! Welcome to the Indian Heritage Corridor. I am your Swadeshi AI Concierge. Please select and activate an ancient city corridor (like Varanasi, Jaipur, Kochi, or Hampi) to unlock localized intelligence, or feel free to ask general questions about Swadeshi design!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeCity]);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Suggested Prompts
  const getSuggestedPrompts = () => {
    if (activeCity === "varanasi") {
      return [
        "🗺️ Suggest an authentic Assi Ghat boat itinerary",
        "⚖️ Analyze weavers middlemen commission cap impact",
        "⚠️ Flood hazard and wooden boat guidelines",
        "🧵 Tell me about the Madanpura silk co-op"
      ];
    } else if (activeCity === "jaipur") {
      return [
        "🗺️ Suggest Hawa Mahal & Amber Fort guide walk",
        "⚖️ How does the commission cap help pottery guilds?",
        "⚠️ High desert heat transit impact",
        "🏺 Tell me about blue pottery craft safety"
      ];
    } else if (activeCity === "kochi") {
      return [
        "🗺️ Recommend a Fort Kochi beach tour route",
        "⚖️ How do coir weavers feel about active rates?",
        "⚠️ Ocean tide environmental warning advice",
        "🥥 Tell me about the Kalady coir co-operative"
      ];
    } else if (activeCity === "hampi") {
      return [
        "🗺️ Suggest a solar shuttle tour of Virupaksha",
        "⚖️ How does safety patrol impact tourist complaints?",
        "🍌 What is the Anegundi banana fiber loom?",
        "🏺 Tell me about miniature carver workshops"
      ];
    } else {
      return [
        "🗺️ What are the active heritage corridors?",
        "⚖️ How does the policy simulator work?",
        "💡 How to support genuine Indian micro-artisans?"
      ];
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map historical messages into role formatting
      const chatHistory = messages
        .filter(m => m.id !== "welcome-msg")
        .slice(-6) // Keep the last 6 messages as context
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text
        }));

      const response = await fetch("/api/chatbot/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          city: activeCity || "varanasi",
          inputs,
          metrics,
          query: textToSend,
          chatHistory
        })
      });

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-bot`,
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("Failed to retrieve chat response");
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-err`,
        sender: "bot",
        text: "My apologies, but our Swadeshi telemetry link is temporarily experiencing atmospheric static. Let's try once more shortly!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple custom renderer to convert basic Markdown to styled elements
  const formatText = (rawText: string) => {
    // Split lines
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers (e.g. ### Header)
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-xs font-black uppercase text-brand-rose tracking-wider mt-4 mb-2 first:mt-0 font-display">
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={idx} className="text-sm font-black text-brand-teal uppercase tracking-widest mt-4 mb-2 first:mt-0 font-display">
            {trimmed.replace(/^##\s*/, '')}
          </h3>
        );
      }

      // Bullets (e.g. - Bullet)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const cleanContent = trimmed.replace(/^[\*\-]\s+/, '');
        return (
          <div key={idx} className="flex gap-1.5 items-start pl-2 text-[11px] leading-relaxed my-1 font-medium text-slate-300">
            <span className="text-brand-rose mt-1 select-none">•</span>
            <span>{parseBoldText(cleanContent)}</span>
          </div>
        );
      }

      // Tables
      if (trimmed.startsWith('|') && idx < lines.length - 1 && lines[idx].includes('---') === false) {
        // Simple line parser for markdown tables
        const cols = trimmed.split('|').map(c => c.trim()).filter(Boolean);
        if (cols.length > 0 && !trimmed.includes('---') && !lines[idx-1]?.includes('---')) {
          const isHeader = idx === 0 || lines[idx+1]?.startsWith('| :---');
          return (
            <div key={idx} className={`grid grid-cols-${cols.length} gap-2 p-1.5 text-[10px] font-mono border-b border-brand-teal/10 ${isHeader ? 'bg-brand-bg/40 font-extrabold text-brand-teal uppercase' : 'text-slate-300'}`}>
              {cols.map((col, cIdx) => (
                <span key={cIdx} className="truncate">{parseBoldText(col)}</span>
              ))}
            </div>
          );
        }
      }

      // Empty line
      if (trimmed === "") {
        return <div key={idx} className="h-1.5" />;
      }

      // Normal paragraph
      return (
        <p key={idx} className="text-[11px] leading-relaxed my-1.5 font-medium text-slate-200">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  // Helper to parse **bold** tags
  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, i) => {
      // Odd indices are inside the asterisks
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-brand-rose">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="heritage-concierge-chat">
      {/* 1. Floating Action Button (FAB) */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNotificationBadge(false);
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#E64833] hover:bg-[#E64833]/90 text-white shadow-[0_0_20px_rgba(230,72,51,0.45)] border border-white/20 flex items-center justify-center cursor-pointer relative overflow-hidden group"
        title="Open Swadeshi AI Concierge"
      >
        {/* Ambient background rotate */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-rose to-brand-teal opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 animate-pulse text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Ring when unread */}
        {!isOpen && showNotificationBadge && (
          <>
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-teal rounded-full border-2 border-brand-dark animate-ping" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-teal rounded-full border-2 border-brand-dark" />
          </>
        )}
      </motion.button>

      {/* 2. Interactive Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[550px] bg-brand-deep/95 backdrop-blur-xl border border-brand-teal/20 rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden text-slate-100"
          >
            {/* Header */}
            <div className="p-4 bg-[#1C3334] border-b border-brand-teal/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose border border-brand-rose/20">
                  <Sparkles className="h-4.5 w-4.5 text-brand-rose" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5 font-display">
                    Swadeshi AI Concierge
                  </h3>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-brand-teal uppercase font-bold">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {activeCity 
                        ? `STATIONED IN ${activeCity}` 
                        : "BROADCASTING ONLINE"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metrics HUD overview badge inside chat */}
            {activeCity && (
              <div className="px-4 py-2 bg-brand-dark/50 border-b border-brand-teal/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Coins className="h-3 w-3 text-brand-rose" />
                  Co-op Growth: <strong className="text-brand-rose font-bold">+{metrics.weaverCooperativeIncome}%</strong>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-brand-teal" />
                  Trust Level: <strong className="text-brand-teal font-bold">{metrics.safetyTrustRating}/100</strong>
                </span>
              </div>
            )}

            {/* Message Body Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-brand-bg/25">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`max-w-[85%] flex flex-col gap-1 ${isBot ? "items-start" : "items-end"}`}>
                        <div 
                          className={`px-4 py-3 rounded-2xl shadow-sm border ${
                            isBot 
                              ? "bg-brand-dark/80 border-brand-teal/10 text-slate-100 rounded-tl-none" 
                              : "bg-[#2E151B] border-[#DA7B93]/20 text-white rounded-tr-none"
                          }`}
                        >
                          {isBot ? formatText(msg.text) : (
                            <p className="text-[11px] leading-relaxed font-semibold font-sans">{msg.text}</p>
                          )}
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 px-1 uppercase tracking-widest">{msg.timestamp}</span>
                      </div>
                    </motion.div>
                  );
                })}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-brand-dark/80 border border-brand-teal/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                      <span className="text-[9px] font-mono font-bold uppercase text-brand-teal tracking-widest animate-pulse">Syncing Swadeshi Knowledge base</span>
                      <div className="flex gap-1">
                        <motion.span 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1 h-1 bg-brand-rose rounded-full" 
                        />
                        <motion.span 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1 h-1 bg-brand-rose rounded-full" 
                        />
                        <motion.span 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1 h-1 bg-brand-rose rounded-full" 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt suggestions chips */}
            <div className="px-4 py-2 border-t border-brand-teal/10 bg-brand-deep/40 space-y-1.5">
              <span className="text-[8px] font-extrabold uppercase tracking-widest font-mono text-slate-500 block">Suggested Queries</span>
              <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto custom-scrollbar pb-1">
                {getSuggestedPrompts().map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.replace(/^[\s\S]*?\s/, ''))}
                    disabled={isLoading}
                    className="px-2.5 py-1 bg-brand-bg/80 border border-brand-teal/10 hover:border-brand-rose/40 text-slate-300 hover:text-white rounded-lg text-[9.5px] font-bold transition-all cursor-pointer truncate max-w-full disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-[#1C3334]/80 border-t border-brand-teal/15 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "Please wait..." : `Ask about ${activeCity ? activeCity : "heritage"}...`}
                disabled={isLoading}
                className="flex-1 bg-brand-bg border border-brand-teal/15 hover:border-brand-teal/30 focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/25 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 bg-brand-rose hover:bg-brand-rose/90 disabled:bg-brand-bg disabled:opacity-40 disabled:border-brand-teal/10 border border-brand-rose/15 hover:shadow-[0_0_8px_rgba(230,72,51,0.25)] text-brand-deep font-bold rounded-xl transition-all cursor-pointer shrink-0"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
