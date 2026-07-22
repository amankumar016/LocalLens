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
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX
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
  mapsSources?: Array<{ title: string; uri: string; reviewSnippets?: string[] }>;
}

export default function HeritageChatBot({ activeCity, inputs, metrics }: HeritageChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Voice Conversation States
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "connecting" | "listening" | "speaking" | "error">("idle");
  const [liveTranscript, setLiveTranscript] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cleanup voice session on component unmount
  useEffect(() => {
    return () => {
      cleanupVoice();
    };
  }, []);

  const cleanupVoice = () => {
    setIsVoiceActive(false);
    setVoiceStatus("idle");
    setLiveTranscript("");

    if (wsRef.current) {
      try {
        wsRef.current.send(JSON.stringify({ type: "close" }));
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {}
      processorRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch (e) {}
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch (e) {}
      outputAudioCtxRef.current = null;
    }

    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (e) {}
      micStreamRef.current = null;
    }

    activeSourcesRef.current.forEach(s => {
      try {
        s.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
  };

  const startVoiceSession = async () => {
    try {
      setVoiceStatus("connecting");
      setIsVoiceActive(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        throw new Error("Web Audio API not supported.");
      }

      inputAudioCtxRef.current = new AudioCtx({ sampleRate: 16000 });
      outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/voice-live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setVoiceStatus("listening");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "audio") {
            setVoiceStatus("speaking");
            playAudioChunk(msg.audio);
          } else if (msg.type === "text") {
            setLiveTranscript(prev => prev ? `${prev} ${msg.text}` : msg.text);
          } else if (msg.type === "interrupted") {
            handleInterrupt();
          } else if (msg.type === "status" && msg.status === "ready") {
            setupMicStreaming(stream);
          } else if (msg.type === "error") {
            console.error("Live API voice error:", msg.error);
            setVoiceStatus("error");
          }
        } catch (err) {
          console.error("Error parsing voice message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setVoiceStatus("error");
      };

      ws.onclose = () => {
        cleanupVoice();
      };

    } catch (err: any) {
      console.error("Failed to start voice session:", err);
      setVoiceStatus("error");
      cleanupVoice();
    }
  };

  const setupMicStreaming = (stream: MediaStream) => {
    const inputCtx = inputAudioCtxRef.current;
    if (!inputCtx) return;

    const source = inputCtx.createMediaStreamSource(stream);
    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    source.connect(processor);
    processor.connect(inputCtx.destination);

    processor.onaudioprocess = (e) => {
      const channelData = e.inputBuffer.getChannelData(0);
      const pcmBuffer = new ArrayBuffer(channelData.length * 2);
      const view = new DataView(pcmBuffer);
      for (let i = 0; i < channelData.length; i++) {
        const s = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }

      let binary = "";
      const bytes = new Uint8Array(pcmBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Audio = btoa(binary);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ audio: base64Audio }));
      }
    };
  };

  const playAudioChunk = (base64Data: string) => {
    const ctx = outputAudioCtxRef.current;
    if (!ctx) return;

    const binary = atob(base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const samplesCount = len / 2;
    const floatSamples = new Float32Array(samplesCount);
    const view = new DataView(bytes.buffer);
    for (let i = 0; i < samplesCount; i++) {
      const val = view.getInt16(i * 2, true);
      floatSamples[i] = val / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, samplesCount, 24000);
    audioBuffer.getChannelData(0).set(floatSamples);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
      if (activeSourcesRef.current.length === 0) {
        setVoiceStatus("listening");
      }
    };
    activeSourcesRef.current.push(source);

    const currentTime = ctx.currentTime;
    let playTime = nextPlayTimeRef.current;
    if (playTime < currentTime) {
      playTime = currentTime + 0.05;
    }

    source.start(playTime);
    nextPlayTimeRef.current = playTime + audioBuffer.duration;
  };

  const handleInterrupt = () => {
    activeSourcesRef.current.forEach(s => {
      try {
        s.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
    setVoiceStatus("listening");
  };

  const toggleVoiceMode = async () => {
    if (isVoiceActive) {
      cleanupVoice();
    } else {
      await startVoiceSession();
    }
  };

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

      // Fetch dynamic user geolocation coordinates if available
      let latLng = null;
      try {
        if (navigator.geolocation) {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          });
          latLng = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        }
      } catch (geoErr) {
        console.warn("Geolocation coordinate acquisition skipped or timed out:", geoErr);
      }

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
          chatHistory,
          latLng
        })
      });

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-bot`,
          sender: "bot",
          text: data.reply,
          mapsSources: data.mapsSources || [],
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
              <div className="flex items-center gap-2">
                {/* Voice toggle button */}
                <button
                  onClick={toggleVoiceMode}
                  className={`p-1.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isVoiceActive 
                      ? "bg-brand-rose text-brand-deep border-brand-rose shadow-[0_0_10px_rgba(230,72,51,0.3)] animate-pulse" 
                      : "bg-brand-bg/50 text-slate-400 border-brand-teal/15 hover:border-brand-rose hover:text-white"
                  }`}
                  title={isVoiceActive ? "Close Voice Link" : "Establish Real-Time Voice Link"}
                >
                  <Mic className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-brand-bg/25 relative">
              
              {/* Real-time Voice Link Overlay */}
              {isVoiceActive && (
                <div className="absolute inset-0 bg-[#162C2D]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in">
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                    <div className={`absolute inset-0 rounded-full bg-brand-rose/20 animate-ping ${voiceStatus === "speaking" ? "duration-500" : "duration-1000"}`} />
                    <div className={`absolute w-16 h-16 rounded-full bg-brand-teal/20 animate-pulse ${voiceStatus === "listening" ? "duration-700" : "duration-1000"}`} />
                    
                    <div className="w-12 h-12 rounded-full bg-brand-rose flex items-center justify-center text-brand-deep z-10 border border-white/20 shadow-lg">
                      {voiceStatus === "speaking" ? (
                        <Volume2 className="h-5.5 w-5.5 animate-bounce" />
                      ) : (
                        <Mic className="h-5.5 w-5.5 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-black uppercase tracking-widest text-brand-teal font-display">
                    {voiceStatus === "connecting" && "Initializing Audio Bridge..."}
                    {voiceStatus === "listening" && "Listening... Speak Now"}
                    {voiceStatus === "speaking" && "Swadeshi Concierge Speaking"}
                    {voiceStatus === "error" && "Telemetry Static Encountered"}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-wider">
                    Live Voice Session Active
                  </p>

                  {liveTranscript && (
                    <div className="mt-6 px-4 py-3 bg-brand-dark/80 border border-brand-teal/10 rounded-2xl max-w-full max-h-[100px] overflow-y-auto custom-scrollbar">
                      <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                        {liveTranscript}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setLiveTranscript("")}
                      className="px-3.5 py-2 bg-brand-bg/60 border border-brand-teal/10 hover:border-brand-teal/30 text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Clear Text
                    </button>
                    <button
                      onClick={cleanupVoice}
                      className="px-4 py-2 bg-[#E64833] text-white hover:bg-[#E64833]/90 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(230,72,51,0.25)] border border-white/10 cursor-pointer"
                    >
                      <VolumeX className="h-3.5 w-3.5" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}

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
                              ? "bg-brand-dark/80 border-brand-teal/10 text-slate-100 rounded-tl-none w-full animate-fade-in" 
                              : "bg-[#2E151B] border-[#DA7B93]/20 text-white rounded-tr-none"
                          }`}
                        >
                          {isBot ? formatText(msg.text) : (
                            <p className="text-[11px] leading-relaxed font-semibold font-sans">{msg.text}</p>
                          )}

                          {/* Render Google Maps Grounding Sources */}
                          {isBot && msg.mapsSources && msg.mapsSources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-brand-teal/15 space-y-2 w-full">
                              <span className="text-[9px] font-black uppercase tracking-wider text-brand-teal flex items-center gap-1">
                                <Compass className="h-3 w-3 text-brand-rose animate-spin-slow" />
                                Google Maps Grounded Places
                              </span>
                              <div className="grid grid-cols-1 gap-1.5">
                                {msg.mapsSources.map((source, sIdx) => (
                                  <a
                                    key={sIdx}
                                    href={source.uri}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col p-2 bg-brand-bg/50 border border-brand-teal/10 hover:border-brand-rose/30 rounded-xl transition-all group/link cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black text-slate-100 group-hover/link:text-brand-rose transition-colors truncate max-w-[85%]">
                                        {source.title}
                                      </span>
                                      <MapPin className="h-3 w-3 text-slate-400 group-hover/link:text-brand-rose transition-colors" />
                                    </div>
                                    {source.reviewSnippets && source.reviewSnippets.length > 0 && (
                                      <p className="text-[9px] italic text-slate-400 mt-0.5 line-clamp-1">
                                        "{source.reviewSnippets[0]}"
                                      </p>
                                    )}
                                  </a>
                                ))}
                              </div>
                            </div>
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
