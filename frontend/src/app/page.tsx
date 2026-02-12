import Link from "next/link";
import {
  Cloud,
  Sprout,
  ShoppingCart,
  MessageSquare,
  Phone,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "Real-Time Weather",
    titleWo: "Taw ci waxtu wi",
    desc: "7-day forecasts for all cities in Senegal. Drought and flood alerts.",
    color: "bg-blue-600",
  },
  {
    icon: Sprout,
    title: "Crop Advisory",
    titleWo: "Ndimbal ci tool",
    desc: "Planting calendar, adapted varieties, disease diagnosis and organic treatments.",
    color: "bg-green-600",
  },
  {
    icon: ShoppingCart,
    title: "Market Prices",
    titleWo: "Njeg ci marche",
    desc: "Real-time prices by city. Best time and place to sell your harvest.",
    color: "bg-amber-600",
  },
  {
    icon: Phone,
    title: "SMS Accessible",
    titleWo: "Jefandikool SMS",
    desc: "Send METEO, TOOL, NJEG by SMS. No internet needed.",
    color: "bg-purple-600",
  },
  {
    icon: Globe,
    title: "French & Wolof",
    titleWo: "Francais ak Wolof",
    desc: "Responses in your language. The AI understands and speaks Wolof.",
    color: "bg-red-600",
  },
  {
    icon: MessageSquare,
    title: "Multi-Agent AI",
    titleWo: "IA yu bari",
    desc: "4 specialized agents collaborate to give you the best possible advice.",
    color: "bg-indigo-600",
  },
];

const stats = [
  { value: "7", label: "Main Crops", labelWo: "Tool yu mag" },
  { value: "6", label: "Agro-Ecological Zones", labelWo: "Gox yi" },
  { value: "16", label: "Cities Covered", labelWo: "Dëkk yi" },
  { value: "4", label: "Specialized AI Agents", labelWo: "Agent IA yi" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #14532d 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#d1fae5" }}>
              <Sprout className="w-4 h-4" />
              Powered by Claude Opus 4.5
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight" style={{ color: "#ffffff" }}>
              AgriAgent SN
            </h1>
            <p className="text-xl sm:text-2xl mb-4" style={{ color: "#d1fae5" }}>
              The Intelligent Agricultural Assistant for Senegal
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: "#bbf7d0" }}>
              Personalized advice on weather, crops, diseases and markets.
              Accessible via SMS in Wolof and French.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#ffffff", color: "#166534" }}
              >
                <MessageSquare className="w-5 h-5" />
                Start Chatting
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#22c55e", color: "#ffffff", border: "2px solid #4ade80" }}
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold" style={{ color: "#166534" }}>
                  {s.value}
                </div>
                <div className="text-sm mt-1" style={{ color: "#374151" }}>{s.label}</div>
                <div className="text-xs" style={{ color: "#92400e" }}>{s.labelWo}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#111827" }}>
              Everything You Need
            </h2>
            <p className="text-lg" style={{ color: "#4b5563" }}>
              4 specialized AI agents working together for you
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1" style={{ color: "#111827" }}>
                    {f.title}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: "#92400e" }}>{f.titleWo}</p>
                  <p className="text-sm" style={{ color: "#4b5563" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SMS Demo */}
      <section style={{ backgroundColor: "#166534" }}>
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#ffffff" }}>As Simple as an SMS</h2>
            <p className="text-lg" style={{ color: "#bbf7d0" }}>
              No internet needed. Send an SMS and receive your advice.
            </p>
          </div>
          <div className="max-w-md mx-auto rounded-2xl p-6 font-mono text-sm space-y-4" style={{ backgroundColor: "#111827" }}>
            <div className="text-right">
              <span className="inline-block px-4 py-2 rounded-2xl rounded-br-md" style={{ backgroundColor: "#22c55e", color: "#ffffff" }}>
                METEO Kaolack
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block px-4 py-2 rounded-2xl rounded-bl-md" style={{ backgroundColor: "#374151", color: "#f3f4f6" }}>
                Kaolack: 35°C, no rain in 5 days. Water your peanuts.
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 rounded-2xl rounded-br-md" style={{ backgroundColor: "#22c55e", color: "#ffffff" }}>
                NJEG gerte
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block px-4 py-2 rounded-2xl rounded-bl-md" style={{ backgroundColor: "#374151", color: "#f3f4f6" }}>
                Peanut: Kaolack 340 FCFA/kg, Dakar 425 FCFA/kg. Wait to sell in Mar-Jun.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#111827" }}>
              Multi-Agent Architecture
            </h2>
            <p className="text-lg" style={{ color: "#4b5563" }}>
              Powered by Claude Opus 4.5 and the Claude Agent SDK
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="px-8 py-4 rounded-2xl font-semibold text-center shadow-lg" style={{ backgroundColor: "#166534", color: "#ffffff" }}>
              Orchestrator
              <div className="text-xs mt-1" style={{ color: "#bbf7d0" }}>
                Routes, synthesizes, translates
              </div>
            </div>
            <div className="w-0.5 h-8" style={{ backgroundColor: "#86efac" }} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
              <div className="rounded-2xl p-5 text-center border-2" style={{ backgroundColor: "#eff6ff", borderColor: "#93c5fd" }}>
                <Cloud className="w-8 h-8 mx-auto mb-2" style={{ color: "#2563eb" }} />
                <div className="font-semibold" style={{ color: "#1e3a5f" }}>Weather Agent</div>
                <div className="text-xs mt-1" style={{ color: "#3b82f6" }}>Open-Meteo API</div>
              </div>
              <div className="rounded-2xl p-5 text-center border-2" style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}>
                <Sprout className="w-8 h-8 mx-auto mb-2" style={{ color: "#16a34a" }} />
                <div className="font-semibold" style={{ color: "#14532d" }}>Agro Agent</div>
                <div className="text-xs mt-1" style={{ color: "#22c55e" }}>Knowledge Base</div>
              </div>
              <div className="rounded-2xl p-5 text-center border-2" style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}>
                <ShoppingCart className="w-8 h-8 mx-auto mb-2" style={{ color: "#d97706" }} />
                <div className="font-semibold" style={{ color: "#78350f" }}>Market Agent</div>
                <div className="text-xs mt-1" style={{ color: "#d97706" }}>Real-Time Prices</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="w-5 h-5" style={{ color: "#22c55e" }} />
            <span className="font-bold" style={{ color: "#ffffff" }}>AgriAgent SN</span>
          </div>
          <p className="text-sm mb-2" style={{ color: "#9ca3af" }}>
            Built with Claude Opus 4.5 | Hackathon Cerebral Valley 2026
          </p>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            Open source - MIT License | Made for Senegalese farmers
          </p>
        </div>
      </footer>
    </div>
  );
}
