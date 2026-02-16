"use client";

import Link from "next/link";
import {
  Cloud,
  Sprout,
  ShoppingCart,
  MessageSquare,
  Phone,
  Globe,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/ui/AnimatedPage";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";

const T = {
  en: {
    badge: "Powered by Claude Opus 4.5",
    subtitle: "The Global Intelligent Agricultural Assistant",
    desc: "Personalized advice on weather, crops, diseases and markets worldwide. AI-powered, multilingual, accessible everywhere.",
    startChat: "Start Chatting",
    viewDashboard: "View Dashboard",
    featuresTitle: "Everything You Need",
    featuresSubtitle: "4 specialized AI agents working together for you",
    smsTitle: "As Simple as an SMS",
    smsSubtitle: "No internet needed. Send an SMS and receive your advice.",
    archTitle: "Multi-Agent Architecture",
    archSubtitle: "Powered by Claude Opus 4.5 and the Claude Agent SDK",
    orchestrator: "Orchestrator",
    orchDesc: "Routes, synthesizes, translates",
    footer: "Open source - MIT License | Made for farmers worldwide 🌍",
  },
  fr: {
    badge: "Propulsé par Claude Opus 4.5",
    subtitle: "L'Assistant Agricole Intelligent Global",
    desc: "Conseils personnalisés sur la météo, les cultures, les maladies et les marchés dans le monde entier. IA, multilingue, accessible partout.",
    startChat: "Commencer à discuter",
    viewDashboard: "Voir le tableau de bord",
    featuresTitle: "Tout ce dont vous avez besoin",
    featuresSubtitle: "4 agents IA spécialisés qui collaborent pour vous",
    smsTitle: "Aussi simple qu'un SMS",
    smsSubtitle: "Pas besoin d'internet. Envoyez un SMS et recevez vos conseils.",
    archTitle: "Architecture Multi-Agent",
    archSubtitle: "Propulsé par Claude Opus 4.5 et le Claude Agent SDK",
    orchestrator: "Orchestrateur",
    orchDesc: "Route, synthétise, traduit",
    footer: "Open source - Licence MIT | Fait pour les agriculteurs du monde 🌍",
  },
  wo: {
    badge: "Jëfandikoo Claude Opus 4.5",
    subtitle: "Ndimbalkat Tool bi Xam-xam Àdduna bi",
    desc: "Ndimbal ci asamaan, tool, feebar ak njëg ci àdduna bi yépp. IA, bari làkk, jëfandikoo ci bépp.",
    startChat: "Tambali waxtaan",
    viewDashboard: "Xool tablo bord",
    featuresTitle: "Lépp lu la soxla",
    featuresSubtitle: "4 agent IA yu wuute di liggéey ngir yow",
    smsTitle: "Yomb ni SMS",
    smsSubtitle: "Soxlawul internet. Yonnee SMS te jot sa ndimbal.",
    archTitle: "Mbindaan Multi-Agent",
    archSubtitle: "Jëfandikoo Claude Opus 4.5 ak Claude Agent SDK",
    orchestrator: "Orchestrateur",
    orchDesc: "Yobbante, sedd, tekki",
    footer: "Open source - Licence MIT | Defar ngir baaykat yi ci àdduna bi 🌍",
  },
};

const features = {
  en: [
    { icon: Cloud, title: "Real-Time Weather", desc: "7-day forecasts for cities worldwide. Drought and flood alerts for any region.", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { icon: Sprout, title: "Crop Advisory", desc: "Planting calendar, adapted varieties, disease diagnosis and organic treatments.", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
    { icon: ShoppingCart, title: "Market Prices", desc: "Real-time prices by city. Best time and place to sell your harvest.", gradient: "linear-gradient(135deg, #d97706, #b45309)" },
    { icon: Phone, title: "SMS Accessible", desc: "Send METEO, TOOL, NJEG by SMS. No internet needed.", gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
    { icon: Globe, title: "Multilingual", desc: "Responses in your language. The AI supports French, English, Wolof and more.", gradient: "linear-gradient(135deg, #dc2626, #b91c1c)" },
    { icon: MessageSquare, title: "Multi-Agent AI", desc: "4 specialized agents collaborate to give you the best possible advice.", gradient: "linear-gradient(135deg, #4f46e5, #4338ca)" },
  ],
  fr: [
    { icon: Cloud, title: "Météo en temps réel", desc: "Prévisions à 7 jours dans le monde entier. Alertes sécheresse et inondations.", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { icon: Sprout, title: "Conseil agricole", desc: "Calendrier de plantation, variétés adaptées, diagnostic de maladies et traitements bio.", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
    { icon: ShoppingCart, title: "Prix du marché", desc: "Prix en temps réel par ville. Meilleur moment et lieu pour vendre votre récolte.", gradient: "linear-gradient(135deg, #d97706, #b45309)" },
    { icon: Phone, title: "Accessible par SMS", desc: "Envoyez METEO, TOOL, NJEG par SMS. Pas besoin d'internet.", gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
    { icon: Globe, title: "Multilingue", desc: "Réponses dans votre langue. L'IA supporte le français, l'anglais, le wolof et plus.", gradient: "linear-gradient(135deg, #dc2626, #b91c1c)" },
    { icon: MessageSquare, title: "IA Multi-Agent", desc: "4 agents spécialisés collaborent pour vous donner les meilleurs conseils.", gradient: "linear-gradient(135deg, #4f46e5, #4338ca)" },
  ],
  wo: [
    { icon: Cloud, title: "Asamaan ci waxtu wi", desc: "Wàllu 7 fan ci àdduna bi. Mucc ak sangu ngir bépp gox.", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { icon: Sprout, title: "Ndimbal ci tool", desc: "Kadur fàgg, xeetu tool, gis feebar te dencal yi.", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
    { icon: ShoppingCart, title: "Njëg ci marché", desc: "Njëg ci waxtu wi ci bépp dëkk. Jamono bu baax ngir jaay.", gradient: "linear-gradient(135deg, #d97706, #b45309)" },
    { icon: Phone, title: "Jëfandikool SMS", desc: "Yonnee METEO, TOOL, NJEG ci SMS. Soxlawul internet.", gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
    { icon: Globe, title: "Bari làkk", desc: "Tontu ci sa làkk. IA bi xam na français, anglais, wolof ak yeneen.", gradient: "linear-gradient(135deg, #dc2626, #b91c1c)" },
    { icon: MessageSquare, title: "IA yu bari", desc: "4 agent yu wuute di liggéey ndax la jox ndimbal bu baax.", gradient: "linear-gradient(135deg, #4f46e5, #4338ca)" },
  ],
};

const stats = {
  en: [
    { value: 17, label: "Global Crops" },
    { value: 20, label: "Countries Covered" },
    { value: 50, label: "Cities Worldwide" },
    { value: 4, label: "AI Agents" },
  ],
  fr: [
    { value: 17, label: "Cultures mondiales" },
    { value: 20, label: "Pays couverts" },
    { value: 50, label: "Villes mondiales" },
    { value: 4, label: "Agents IA" },
  ],
  wo: [
    { value: 17, label: "Tool yu mag" },
    { value: 20, label: "Réew yi" },
    { value: 50, label: "Dëkk yi" },
    { value: 4, label: "Agent IA yi" },
  ],
};

const smsMessages = {
  en: [
    { from: "user", text: "METEO Kaolack" },
    { from: "bot", text: "Kaolack: 35°C, no rain in 5 days. Water your peanuts." },
    { from: "user", text: "NJEG gerte" },
    { from: "bot", text: "Peanut: Kaolack 340 FCFA/kg, Dakar 425 FCFA/kg. Best to sell Mar-Jun." },
  ],
  fr: [
    { from: "user", text: "METEO Kaolack" },
    { from: "bot", text: "Kaolack : 35°C, pas de pluie dans 5 jours. Arrosez vos arachides." },
    { from: "user", text: "NJEG gerte" },
    { from: "bot", text: "Arachide : Kaolack 340 FCFA/kg, Dakar 425 FCFA/kg. Vendez en mars-juin." },
  ],
  wo: [
    { from: "user", text: "METEO Kaolack" },
    { from: "bot", text: "Kaolack: 35°C, taw amul 5 fan. Nosal sa gerte." },
    { from: "user", text: "NJEG gerte" },
    { from: "bot", text: "Gerte: Kaolack 340 FCFA/kg, Dakar 425 FCFA/kg. Jaay ci mars-juin." },
  ],
};

export default function Home() {
  const { language } = useLanguage();
  const t = T[language] || T.fr;
  const feats = features[language] || features.fr;
  const statsList = stats[language] || stats.fr;
  const sms = smsMessages[language] || smsMessages.fr;

  return (
    <AnimatedPage>
      <div className="min-h-screen">
        {/* Hero */}
        <section
          className="pattern-wax"
          style={{
            background: "linear-gradient(135deg, #166534 0%, #15803d 40%, #14532d 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28" style={{ position: "relative", zIndex: 1 }}>
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
                style={{
                  backgroundColor: "rgba(251, 191, 36, 0.15)",
                  color: "#fbbf24",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                }}
              >
                <Sprout className="w-4 h-4" />
                {t.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight"
                style={{ color: "#ffffff" }}
              >
                Agri<span style={{ color: "#fbbf24" }}>Agent</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl mb-4"
                style={{ color: "#d1fae5" }}
              >
                {t.subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg mb-10 max-w-2xl mx-auto"
                style={{ color: "#bbf7d0" }}
              >
                {t.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #d97706)",
                    color: "#1a1a1a",
                    textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(251, 191, 36, 0.4)",
                  }}
                >
                  <MessageSquare className="w-5 h-5" />
                  {t.startChat}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.3)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {t.viewDashboard}
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Decorative bottom wave */}
          <div style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 0,
            height: 60,
            background: "var(--bg-card)",
            clipPath: "ellipse(55% 100% at 50% 100%)",
          }} />
        </section>

        {/* Stats */}
        <section style={{ backgroundColor: "var(--bg-card)" }}>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsList.map((s, i) => (
                <ScrollReveal key={s.label} delay={i * 0.1}>
                  <div className="text-center">
                    <AnimatedCounter
                      value={s.value}
                      style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)" }}
                    />
                    <div className="text-sm mt-1 font-medium" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {/* Divider stripe */}
            <div style={{
              width: 80,
              height: 3,
              background: "linear-gradient(90deg, #166534 33%, #d97706 33% 66%, #a0522d 66%)",
              borderRadius: 2,
              margin: "2rem auto 0",
            }} />
          </div>
        </section>

        {/* Features */}
        <section className="pattern-adinkra" style={{ backgroundColor: "var(--bg)", position: "relative", overflow: "hidden" }}>
          <div className="max-w-7xl mx-auto px-4 py-20" style={{ position: "relative", zIndex: 1 }}>
            <ScrollReveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                  {t.featuresTitle}
                </h2>
                <span className="stripe-senegal" style={{ margin: "0 auto" }} />
                <p className="text-lg mt-3" style={{ color: "var(--text-secondary)" }}>
                  {t.featuresSubtitle}
                </p>
              </div>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feats.map((f, i) => {
                const Icon = f.icon;
                return (
                  <ScrollReveal key={f.title} delay={i * 0.08}>
                    <Card hover style={{ height: "100%" }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "var(--radius-md)",
                          background: f.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <Icon size={24} style={{ color: "#ffffff" }} />
                      </div>
                      <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>
                        {f.title}
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* SMS Demo */}
        <section style={{ background: "linear-gradient(135deg, #166534, #14532d)" }}>
          <div className="max-w-7xl mx-auto px-4 py-20">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3" style={{ color: "#ffffff" }}>{t.smsTitle}</h2>
                <span className="stripe-senegal" style={{ margin: "0 auto" }} />
                <p className="text-lg mt-3" style={{ color: "#bbf7d0" }}>
                  {t.smsSubtitle}
                </p>
              </div>
            </ScrollReveal>

            <div
              className="max-w-sm mx-auto"
              style={{
                borderRadius: 28,
                overflow: "hidden",
                border: "3px solid #374151",
                backgroundColor: "#111827",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Phone header */}
              <div style={{
                background: "#1f2937",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderBottom: "1px solid #374151",
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Sprout size={16} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f3f4f6" }}>AgriAgent</div>
                  <div style={{ fontSize: "0.65rem", color: "#9ca3af" }}>SMS Service</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: 10 }}>
                {sms.map((msg, i) => (
                  <ScrollReveal key={i} delay={0.3 + i * 0.2} direction={msg.from === "user" ? "right" : "left"}>
                    <div style={{ textAlign: msg.from === "user" ? "right" : "left" }}>
                      <span
                        className="font-mono"
                        style={{
                          display: "inline-block",
                          padding: "8px 14px",
                          borderRadius: 16,
                          fontSize: "0.8rem",
                          maxWidth: "85%",
                          ...(msg.from === "user"
                            ? {
                                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                color: "#ffffff",
                                borderBottomRightRadius: 4,
                              }
                            : {
                                backgroundColor: "#374151",
                                color: "#f3f4f6",
                                borderBottomLeftRadius: 4,
                              }),
                        }}
                      >
                        {msg.text}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section style={{ backgroundColor: "var(--bg-card)" }}>
          <div className="max-w-7xl mx-auto px-4 py-20">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                  {t.archTitle}
                </h2>
                <span className="stripe-senegal" style={{ margin: "0 auto" }} />
                <p className="text-lg mt-3" style={{ color: "var(--text-secondary)" }}>
                  {t.archSubtitle}
                </p>
              </div>
            </ScrollReveal>

            <div className="flex flex-col items-center gap-4">
              <ScrollReveal>
                <Card
                  style={{
                    background: "linear-gradient(135deg, #166534, #14532d)",
                    textAlign: "center",
                    padding: "1.25rem 2rem",
                    border: "none",
                  }}
                  hover={false}
                >
                  <div className="font-bold text-lg" style={{ color: "#ffffff" }}>{t.orchestrator}</div>
                  <div className="text-xs mt-1" style={{ color: "#bbf7d0" }}>
                    {t.orchDesc}
                  </div>
                </Card>
              </ScrollReveal>

              {/* Connector */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ width: 2, height: 32, backgroundColor: "var(--primary)", transformOrigin: "top" }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
                {[
                  { icon: Cloud, name: "Weather Agent", sub: "Open-Meteo API", bg: "#eff6ff", border: "#93c5fd", color: "#2563eb" },
                  { icon: Sprout, name: "Agro Agent", sub: "Knowledge Base", bg: "#f0fdf4", border: "#86efac", color: "#16a34a" },
                  { icon: ShoppingCart, name: "Market Agent", sub: "Real-Time Prices", bg: "#fffbeb", border: "#fcd34d", color: "#d97706" },
                ].map((agent, i) => (
                  <ScrollReveal key={agent.name} delay={i * 0.15}>
                    <Card
                      style={{
                        textAlign: "center",
                        borderWidth: 2,
                        borderColor: agent.border,
                        backgroundColor: agent.bg,
                      }}
                    >
                      <agent.icon size={32} style={{ color: agent.color, margin: "0 auto 0.5rem" }} />
                      <div className="font-semibold" style={{ color: "var(--text)" }}>{agent.name}</div>
                      <div className="text-xs mt-1" style={{ color: agent.color }}>{agent.sub}</div>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: "#111827" }}>
          <div style={{
            height: 3,
            background: "linear-gradient(90deg, #166534 33%, #d97706 33% 66%, #a0522d 66%)",
          }} />
          <div className="max-w-7xl mx-auto px-4 py-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sprout className="w-5 h-5" style={{ color: "#22c55e" }} />
              <span className="font-bold" style={{ color: "#ffffff" }}>
                Agri<span style={{ color: "#fbbf24" }}>Agent</span>
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: "#9ca3af" }}>
              Built with Claude Opus 4.5 | Hackathon Cerebral Valley 2026
            </p>
            <p className="text-xs" style={{ color: "#6b7280" }}>
              {t.footer}
            </p>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  );
}
