"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Loader2,
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
  { icon: typeof Bot; color: string; label: string }
> = {
  weather: { icon: Cloud, color: "#3b82f6", label: "Weather" },
  agro: { icon: Sprout, color: "#22c55e", label: "Agro" },
  market: { icon: ShoppingCart, color: "#eab308", label: "Market" },
  vision: { icon: Camera, color: "#8b5cf6", label: "Vision" },
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
                content: "Error analyzing the image. Please try again.",
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
            content: "Connection error. Make sure the backend is running.",
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
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>
            AgriAgent Chat
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: showHistory ? "#166534" : "#ffffff",
              color: showHistory ? "#ffffff" : "#6b7280",
              border: "1px solid #d1d5db",
            }}
            title="Chat history"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="text-sm border rounded-lg px-3 py-2"
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              borderColor: "#d1d5db",
            }}
          >
            <option value="dakar">Dakar</option>
            <option value="kaolack">Kaolack</option>
            <option value="saint-louis">Saint-Louis</option>
            <option value="ziguinchor">Ziguinchor</option>
            <option value="touba">Touba</option>
            <option value="thies">Thies</option>
            <option value="tambacounda">Tambacounda</option>
            <option value="kolda">Kolda</option>
            <option value="fatick">Fatick</option>
            <option value="louga">Louga</option>
          </select>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid #d1d5db" }}
          >
            {LANG_BUTTONS.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setLanguage(btn.key)}
                className="px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor:
                    language === btn.key ? btn.activeColor : "#ffffff",
                  color: language === btn.key ? "#ffffff" : "#374151",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div
          className="mb-4 rounded-xl p-4 max-h-64 overflow-y-auto"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="font-semibold text-sm"
              style={{ color: "#111827" }}
            >
              Conversation History
            </h3>
            <div className="flex gap-2">
              <button
                onClick={newChat}
                className="text-xs px-3 py-1 rounded-lg"
                style={{ backgroundColor: "#166534", color: "#ffffff" }}
              >
                New Chat
              </button>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded"
                style={{ color: "#6b7280" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {sessions.length === 0 ? (
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              No saved conversations yet.
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
                      style={{ color: "#111827" }}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>
                      {new Date(s.timestamp).toLocaleDateString("en-US", {
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
                    style={{ color: "#9ca3af" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#86efac" }}
            />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "#374151" }}
            >
              Welcome to AgriAgent SN
            </h2>
            <p className="mb-6" style={{ color: "#6b7280" }}>
              Ask a question about weather, crops or market prices
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {(SUGGESTIONS[language] || SUGGESTIONS.en).map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSend(s.text)}
                  className="px-4 py-2 rounded-full text-sm transition-colors"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                  }}
                >
                  {s.text}
                </button>
              ))}
            </div>
            {/* Photo upload CTA */}
            <div className="mt-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "#ffffff",
                }}
              >
                <Camera className="w-4 h-4" />
                {language === "fr"
                  ? "Diagnostiquer une photo de culture"
                  : language === "wo"
                    ? "Yonnee nataal sa tool"
                    : "Diagnose a crop photo"}
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <Bot className="w-5 h-5" style={{ color: "#166534" }} />
              </div>
            )}
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3"
              style={
                msg.role === "user"
                  ? {
                      backgroundColor: "#166534",
                      color: "#ffffff",
                      borderBottomRightRadius: "6px",
                    }
                  : {
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      borderBottomLeftRadius: "6px",
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
                    style={{ color: "#111827" }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Action buttons: TTS + Agent badges */}
                  <div
                    className="flex items-center gap-1 mt-2 pt-2"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                  >
                    <button
                      onClick={() => speak(msg.content, i)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{
                        color: speakingIdx === i ? "#dc2626" : "#9ca3af",
                        backgroundColor:
                          speakingIdx === i ? "#fef2f2" : "transparent",
                      }}
                      title={
                        speakingIdx === i ? "Stop speaking" : "Read aloud"
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
                              className="inline-flex items-center gap-1 text-xs font-medium"
                              style={{ color: info.color }}
                            >
                              <Icon className="w-3 h-3" />
                              {info.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: "#16a34a" }}
                  />
                  {routingAgents.length > 0 ? (
                    <span className="text-xs" style={{ color: "#6b7280" }}>
                      Calling{" "}
                      {routingAgents
                        .map((a) => AGENT_ICONS[a]?.label || a)
                        .join(" + ")}{" "}
                      agent{routingAgents.length > 1 ? "s" : ""}...
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "#6b7280" }}>
                      Analyzing photo...
                    </span>
                  )}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#166534" }}
              >
                <User className="w-5 h-5" style={{ color: "#ffffff" }} />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

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

      {/* Input */}
      <div className="flex gap-2">
        <button
          onClick={toggleVoice}
          className="px-3 py-3 rounded-xl transition-colors"
          style={{
            backgroundColor: listening ? "#dc2626" : "#ffffff",
            color: listening ? "#ffffff" : "#6b7280",
            border: listening ? "none" : "1px solid #d1d5db",
          }}
          title={listening ? "Stop recording" : "Voice input"}
        >
          {listening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="px-3 py-3 rounded-xl transition-colors disabled:opacity-50"
          style={{
            backgroundColor: "#ffffff",
            color: "#8b5cf6",
            border: "1px solid #d1d5db",
          }}
          title="Upload crop photo for diagnosis"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={PLACEHOLDERS[language] || PLACEHOLDERS.en}
          className="flex-1 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          style={{
            backgroundColor: "#ffffff",
            color: "#111827",
            border: "1px solid #d1d5db",
          }}
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: "#166534", color: "#ffffff" }}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
