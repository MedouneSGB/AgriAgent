"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Cloud,
  Sprout,
  ShoppingCart,
  Mic,
  MicOff,
  Trash2,
  History,
  X,
  Volume2,
  VolumeX,
  Camera,
} from "lucide-react";
import { sendChatStream, diagnoseCrop } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedPage from "@/components/ui/AnimatedPage";
import SmartSuggestions from "@/components/SmartSuggestions";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/ui/Card";

interface Message {
  role: "user" | "assistant";
  content: string;
  agents_used?: string[];
  language?: string;
  imagePreview?: string; // base64 data URL for user-uploaded images
}

interface SavedSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const AGENT_ICONS: Record<
  string,
  { icon: typeof Bot; color: string; label: Record<string, string> }
> = {
  weather: { icon: Cloud, color: "#3b82f6", label: { en: "Weather", fr: "M\u00e9t\u00e9o", wo: "Asamaan" } },
  agro: { icon: Sprout, color: "#22c55e", label: { en: "Agro", fr: "Agro", wo: "Agro" } },
  market: { icon: ShoppingCart, color: "#eab308", label: { en: "Market", fr: "March\u00e9", wo: "March\u00e9" } },
  vision: { icon: Camera, color: "#8b5cf6", label: { en: "Vision", fr: "Vision", wo: "Vision" } },
};

const CT = {
  en: {
    welcome: "Welcome to",
    askQuestion: "Ask a question about weather, crops or market prices",
    diagnosePhoto: "Diagnose a crop photo",
    history: "Conversation History",
    newChat: "New Chat",
    noHistory: "No saved conversations yet.",
    calling: "Calling",
    agents: "agents",
    agent: "agent",
    analyzingPhoto: "Analyzing photo...",
    stopSpeaking: "Stop speaking",
    readAloud: "Read aloud",
    stopRecording: "Stop recording",
    voiceInput: "Voice input",
    uploadPhoto: "Upload crop photo for diagnosis",
    errorAnalyzing: "Error analyzing the image. Please try again.",
    connectionError: "Connection error. Make sure the backend is running.",
  },
  fr: {
    welcome: "Bienvenue sur",
    askQuestion: "Posez une question sur la m\u00e9t\u00e9o, les cultures ou les prix du march\u00e9",
    diagnosePhoto: "Diagnostiquer une photo de culture",
    history: "Historique des conversations",
    newChat: "Nouvelle discussion",
    noHistory: "Aucune conversation sauvegard\u00e9e.",
    calling: "Appel",
    agents: "agents",
    agent: "agent",
    analyzingPhoto: "Analyse de la photo...",
    stopSpeaking: "Arr\u00eater la lecture",
    readAloud: "Lire \u00e0 voix haute",
    stopRecording: "Arr\u00eater l'enregistrement",
    voiceInput: "Saisie vocale",
    uploadPhoto: "Envoyer une photo pour diagnostic",
    errorAnalyzing: "Erreur lors de l'analyse de l'image. R\u00e9essayez.",
    connectionError: "Erreur de connexion. V\u00e9rifiez que le backend fonctionne.",
  },
  wo: {
    welcome: "Dalal ak diam ci",
    askQuestion: "Laaj laj ci asamaan, tool wala nj\u00ebg march\u00e9",
    diagnosePhoto: "Yonnee nataal sa tool",
    history: "Liggeeyu waxtaan yi",
    newChat: "Waxtaan bu bees",
    noHistory: "Amul waxtaan bu denc.",
    calling: "Woote",
    agents: "agent yi",
    agent: "agent",
    analyzingPhoto: "Xool nataal bi...",
    stopSpeaking: "Tax wax",
    readAloud: "Jang ko",
    stopRecording: "Tax denc",
    voiceInput: "Baat",
    uploadPhoto: "Yonnee nataal ngir xam feebar",
    errorAnalyzing: "Njumte ci xool nataal bi. Jeem-aat.",
    connectionError: "Njumte ci connexion. Saytul backend bi.",
  },
};

const SUGGESTIONS: Record<string, Array<{ text: string }>> = {
  en: [
    { text: "What's the weather in Kaolack?" },
    { text: "When to plant peanuts this year?" },
    { text: "Millet market prices?" },
    { text: "My tomato has brown spots" },
  ],
  fr: [
    { text: "Quel temps fait-il à Kaolack ?" },
    { text: "Quand planter l'arachide cette année ?" },
    { text: "Prix du mil au marché ?" },
    { text: "Ma tomate a des taches brunes" },
  ],
  wo: [
    { text: "Naka taw bi ci Kaolack ?" },
    { text: "NJEG gerte" },
    { text: "Kañ lañu war a bey dugub ?" },
    { text: "Sama tamaate am na tàkk" },
  ],
};

const PLACEHOLDERS: Record<string, string> = {
  en: "Ask your question... (e.g. When to plant millet?)",
  fr: "Posez votre question... (ex: Quand planter le mil ?)",
  wo: "Bind sa laaj fii... (ex: METEO Kaolack)",
};

const LANG_BUTTONS = [
  { key: "en" as const, label: "EN", activeColor: "#2563eb" },
  { key: "fr" as const, label: "FR", activeColor: "#166534" },
  { key: "wo" as const, label: "Wolof", activeColor: "#d97706" },
];

// --- localStorage helpers ---
const STORAGE_KEY = "agriagent_sessions";

function loadSessions(): SavedSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSessions(sessions: SavedSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function saveCurrentSession(messages: Message[], sessionId: string) {
  if (messages.length === 0) return;
  const sessions = loadSessions();
  const firstUserMsg =
    messages.find((m) => m.role === "user")?.content || "New chat";
  const title =
    firstUserMsg.length > 50
      ? firstUserMsg.slice(0, 50) + "..."
      : firstUserMsg;
  const idx = sessions.findIndex((s) => s.id === sessionId);
  const session: SavedSession = {
    id: sessionId,
    title,
    messages,
    timestamp: Date.now(),
  };
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  saveSessions(sessions.slice(0, 20));
}

// --- TTS helper ---
function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*{1,3}(.*?)\*{1,3}/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/[|\-]{2,}/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("kaolack");
  const { language, setLanguage } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Voice
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // TTS
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  // History panel
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState(sessionId);

  // Streaming status
  const [routingAgents, setRoutingAgents] = useState<string[]>([]);

  // Photo upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      saveCurrentSession(messages, activeSessionId);
    }
  }, [messages, activeSessionId]);

  useEffect(() => {
    if (showHistory) setSessions(loadSessions());
  }, [showHistory]);

  // --- TTS ---
  const speak = useCallback(
    (text: string, idx: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const synth = (window as any).speechSynthesis;
      if (!synth) return;

      if (speakingIdx === idx) {
        synth.cancel();
        setSpeakingIdx(null);
        return;
      }

      synth.cancel();
      const plain = stripMarkdown(text);
      const utter = new SpeechSynthesisUtterance(plain);
      utter.lang =
        language === "fr" ? "fr-FR" : language === "wo" ? "fr-FR" : "en-US";
      utter.rate = 0.95;
      utter.onend = () => setSpeakingIdx(null);
      utter.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      synth.speak(utter);
    },
    [speakingIdx, language]
  );

  // --- Photo upload + diagnosis ---
  const handlePhotoUpload = useCallback(
    async (file: File) => {
      if (loading) return;
      setLoading(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const preview = e.target?.result as string;

        // Add user message with image
        const userMsg: Message = {
          role: "user",
          content: language === "fr"
            ? "Diagnostique cette photo de culture"
            : language === "wo"
              ? "Xool bi te wax ma lan la"
              : "Diagnose this crop photo",
          imagePreview: preview,
        };
        setMessages((prev) => [...prev, userMsg]);

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", agents_used: [] },
        ]);

        try {
          const result = await diagnoseCrop(file, language);
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: result.diagnosis,
                agents_used: result.agents_used,
                language: result.language,
              };
            }
            return updated;
          });
        } catch {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: CT[language]?.errorAnalyzing || CT.fr.errorAnalyzing,
              };
            }
            return updated;
          });
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [loading, language]
  );

  // --- Voice input ---
  const toggleVoice = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognitionCtor =
      w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang =
      language === "fr" ? "fr-FR" : language === "wo" ? "wo" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, language]);

  // --- Streaming chat ---
  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setRoutingAgents([]);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", agents_used: [] },
    ]);

    try {
      await sendChatStream(
        msg,
        city,
        language,
        (agents) => setRoutingAgents(agents),
        (token) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + token,
              };
            }
            return updated;
          });
        },
        (agentsUsed, lang) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                agents_used: agentsUsed,
                language: lang,
              };
            }
            return updated;
          });
          setRoutingAgents([]);
        },
        (error) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: "Error: " + error,
              };
            }
            return updated;
          });
          setRoutingAgents([]);
        }
      );
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: CT[language]?.connectionError || CT.fr.connectionError,
          };
        }
        return updated;
      });
    } finally {
      setLoading(false);
      setRoutingAgents([]);
    }
  };

  const loadSession = (session: SavedSession) => {
    setMessages(session.messages);
    setActiveSessionId(session.id);
    setShowHistory(false);
  };

  const newChat = () => {
    setMessages([]);
    setActiveSessionId(crypto.randomUUID());
    setShowHistory(false);
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    saveSessions(updated);
    setSessions(updated);
  };

  return (
    <AnimatedPage className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Senegal Stripe Accent - hidden on mobile */}
      <div
        className="hidden sm:block w-full h-1 rounded-full mb-4"
        style={{
          background:
            "linear-gradient(90deg, #166534 33%, #d97706 33% 66%, #dc2626 66%)",
        }}
      />

      {/* Header - Compact on mobile */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        {/* Left: Title + History */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-2xl font-bold" style={{ color: "var(--text)" }}>
            <span>Agri</span>
            <span style={{ color: "#fbbf24" }}>Agent</span>
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1.5 sm:p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: showHistory ? "#166534" : "var(--bg-card)",
              color: showHistory ? "#ffffff" : "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
            title={CT[language]?.history || "History"}
          >
            <History className="w-4 h-4" />
          </button>
        </div>
        
        {/* Right: City + Lang - Compact layout */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="text-xs sm:text-sm border rounded-lg px-1.5 sm:px-3 py-1.5 sm:py-2 max-w-[100px] sm:max-w-none"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
          >
            <option value="dakar">Dakar</option>
            <option value="kaolack">Kaolack</option>
            <option value="saint-louis">St-Louis</option>
            <option value="ziguinchor">Ziguinchor</option>
            <option value="touba">Touba</option>
            <option value="thies">Thi\u00e8s</option>
            <option value="tambacounda">Tamba</option>
            <option value="kolda">Kolda</option>
            <option value="fatick">Fatick</option>
            <option value="louga">Louga</option>
          </select>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {LANG_BUTTONS.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setLanguage(btn.key)}
                className="px-1.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-sm font-medium transition-colors"
                style={{
                  backgroundColor:
                    language === btn.key ? btn.activeColor : "var(--bg-card)",
                  color: language === btn.key ? "#ffffff" : "var(--text-secondary)",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="rounded-xl p-4 max-h-64 overflow-y-auto"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "var(--text)" }}
                >
                  {CT[language]?.history || CT.fr.history}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={newChat}
                    className="text-xs px-3 py-1 rounded-lg"
                    style={{ backgroundColor: "#166534", color: "#ffffff" }}
                  >
                    {CT[language]?.newChat || CT.fr.newChat}
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {sessions.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {CT[language]?.noHistory || CT.fr.noHistory}
                </p>
              ) : (
                <div className="space-y-1">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      style={{
                        backgroundColor:
                          s.id === activeSessionId ? "#f0fdf4" : "transparent",
                        border:
                          s.id === activeSessionId
                            ? "1px solid #bbf7d0"
                            : "1px solid transparent",
                      }}
                      onClick={() => loadSession(s)}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {s.title}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {new Date(s.timestamp).toLocaleDateString(language === "fr" || language === "wo" ? "fr-FR" : "en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(s.id);
                        }}
                        className="p-1 rounded ml-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-3 sm:mb-4">
        {messages.length === 0 && (
          <div className="text-center py-6 sm:py-12 pattern-adinkra rounded-2xl relative px-2">
            <div className="relative z-10">
              <Bot
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 animate-float"
                style={{
                  color: "#86efac",
                  filter: "drop-shadow(0 0 12px rgba(34,197,94,0.35))",
                }}
              />
              <h2
                className="text-base sm:text-xl font-semibold mb-1 sm:mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {CT[language]?.welcome || CT.fr.welcome}{" "}
                <span style={{ color: "var(--text)" }}>Agri</span>
                <span style={{ color: "#fbbf24" }}>Agent</span>
              </h2>
              <p className="text-xs sm:text-base mb-4 sm:mb-6 px-2" style={{ color: "var(--text-muted)" }}>
                {CT[language]?.askQuestion || CT.fr.askQuestion}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center max-w-lg mx-auto px-1">
                {(SUGGESTIONS[language] || SUGGESTIONS.en).map((s) => (
                  <motion.button
                    key={s.text}
                    onClick={() => handleSend(s.text)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-colors"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {s.text}
                  </motion.button>
                ))}
              </div>
              {/* Photo upload CTA */}
              <div className="mt-4 sm:mt-6">
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "#8b5cf6",
                    color: "#ffffff",
                  }}
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {CT[language]?.diagnosePhoto || CT.fr.diagnosePhoto}
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: msg.role === "user" ? 30 : -30,
            }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex gap-2 sm:gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#166534" }} />
              </div>
            )}
            <div
              className="max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
              style={
                msg.role === "user"
                  ? {
                      backgroundColor: "#166534",
                      color: "#ffffff",
                      borderBottomRightRadius: "6px",
                    }
                  : {
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      borderBottomLeftRadius: "6px",
                      borderLeft: "3px solid #fbbf24",
                    }
              }
            >
              {msg.role === "user" ? (
                <>
                  {msg.imagePreview && (
                    <div className="mb-2 rounded-lg overflow-hidden">
                      <img
                        src={msg.imagePreview}
                        alt="Uploaded crop"
                        className="w-full"
                        style={{ maxHeight: 200, objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <p style={{ color: "#ffffff", margin: 0 }}>{msg.content}</p>
                </>
              ) : msg.content ? (
                <>
                  <div
                    className="prose prose-sm max-w-none"
                    style={{ color: "var(--text)" }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Action buttons: TTS + Agent badges */}
                  <div
                    className="flex items-center gap-1 mt-2 pt-2"
                    style={{ borderTop: "1px solid var(--border-light)" }}
                  >
                    <button
                      onClick={() => speak(msg.content, i)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{
                        color: speakingIdx === i ? "#dc2626" : "var(--text-muted)",
                        backgroundColor:
                          speakingIdx === i ? "#fef2f2" : "transparent",
                      }}
                      title={
                        speakingIdx === i ? (CT[language]?.stopSpeaking || "Stop") : (CT[language]?.readAloud || "Read")
                      }
                    >
                      {speakingIdx === i ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {msg.agents_used && msg.agents_used.length > 0 && (
                      <div className="flex gap-2 ml-auto">
                        {msg.agents_used.map((agent) => {
                          const info = AGENT_ICONS[agent];
                          if (!info) return null;
                          const Icon = info.icon;
                          return (
                            <span
                              key={agent}
                              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{
                                color: info.color,
                                backgroundColor: `${info.color}15`,
                              }}
                            >
                              <Icon className="w-3 h-3" />
                              {info.label[language] || info.label.fr}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Typing indicator: 3 bouncing dots */}
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="block w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: "#16a34a",
                          animation: `typing-bounce 1.2s ease-in-out ${dot * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                  {routingAgents.length > 0 ? (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {CT[language]?.calling || "Calling"}{" "}
                      {routingAgents
                        .map((a) => AGENT_ICONS[a]?.label[language] || AGENT_ICONS[a]?.label.fr || a)
                        .join(" + ")}{" "}
                      {routingAgents.length > 1 ? (CT[language]?.agents || "agents") : (CT[language]?.agent || "agent")}...
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {CT[language]?.analyzingPhoto || CT.fr.analyzingPhoto}
                    </span>
                  )}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#166534" }}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#ffffff" }} />
              </div>
            )}
          </motion.div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Smart Suggestions - Hidden on very small screens when empty */}
      {messages.length === 0 && (
        <div className="px-1 sm:px-4 mb-2 sm:mb-4 hidden sm:block">
          <SmartSuggestions
            onSelect={(text) => {
              setInput(text);
              handleSend(text);
            }}
            city={city}
          />
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoUpload(file);
          e.target.value = "";
        }}
      />

      {/* Input - Compact on mobile */}
      <Card
        variant="glass"
        hover={false}
        padding="0.375rem"
        className="sm:!p-2"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={toggleVoice}
            className="p-2 sm:px-3 sm:py-3 rounded-lg sm:rounded-xl transition-colors"
            style={{
              backgroundColor: listening ? "#dc2626" : "var(--bg-card)",
              color: listening ? "#ffffff" : "var(--text-muted)",
              border: listening ? "none" : "1px solid var(--border)",
              animation: listening ? "glow-pulse 1.5s ease-in-out infinite" : "none",
            }}
            title={listening ? (CT[language]?.stopRecording || "Stop") : (CT[language]?.voiceInput || "Voice")}
          >
            {listening ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="p-2 sm:px-3 sm:py-3 rounded-lg sm:rounded-xl transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "#8b5cf6",
              border: "1px solid var(--border)",
            }}
            title={CT[language]?.uploadPhoto || CT.fr.uploadPhoto}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={PLACEHOLDERS[language] || PLACEHOLDERS.en}
            className="flex-1 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none transition-shadow min-w-0"
            style={{
              backgroundColor: "var(--bg-input)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-glow-primary)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: "#166534", color: "#ffffff" }}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </Card>
    </AnimatedPage>
  );
}
