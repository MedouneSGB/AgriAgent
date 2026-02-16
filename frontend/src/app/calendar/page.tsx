"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { fetchCalendar, fetchProfile, type CalendarData } from "@/lib/api";
import CalendarGrid from "@/components/CalendarGrid";
import CalendarTimeline from "@/components/CalendarTimeline";

import { WORLD_ZONES, GLOBAL_CROPS } from "@/data/worldAgriculture";

const CROP_COLORS: Record<string, string> = Object.fromEntries(
  GLOBAL_CROPS.map(c => [c.key, c.color])
);

const CROP_NAMES: Record<string, string> = Object.fromEntries(
  GLOBAL_CROPS.map(c => [c.key, c.name_en])
);

const ZONES = WORLD_ZONES.map(z => ({ key: z.key, label: z.label }));

const T = {
  en: { title: "Agricultural Calendar", grid: "Grid", timeline: "Timeline", zone: "Zone", loading: "Loading...", legend: "Legend" },
  fr: { title: "Calendrier Agricole", grid: "Grille", timeline: "Chronologie", zone: "Zone", loading: "Chargement...", legend: "L\u00e9gende" },
  wo: { title: "Arminaatu Tool", grid: "Grille", timeline: "Chronologie", zone: "Suf", loading: "Yegsi...", legend: "L\u00e9gende" },
};

export default function CalendarPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = T[language] || T.fr;

  const [zone, setZone] = useState("bassin_arachidier");
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-select user's zone
  useEffect(() => {
    if (user) {
      fetchProfile()
        .then((p) => {
          if (p.zone) setZone(p.zone);
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetchCalendar(zone)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [zone]);

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>
        {t.title}
      </h1>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
        {/* Zone */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500 }}>{t.zone}:</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            style={{ padding: "0.4rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.875rem", backgroundColor: "var(--bg-input)", color: "var(--text)" }}
          >
            {ZONES.map((z) => (
              <option key={z.key} value={z.key}>{z.label}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setView("grid")}
            style={{
              padding: "0.4rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background: view === "grid" ? "#166534" : "var(--bg-card)",
              color: view === "grid" ? "#fff" : "var(--text-secondary)",
            }}
          >
            {t.grid}
          </button>
          <button
            onClick={() => setView("timeline")}
            style={{
              padding: "0.4rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              borderLeft: "1px solid var(--border)",
              cursor: "pointer",
              background: view === "timeline" ? "#166534" : "var(--bg-card)",
              color: view === "timeline" ? "#fff" : "var(--text-secondary)",
            }}
          >
            {t.timeline}
          </button>
        </div>
      </div>

      {/* Crop legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" }}>
        {Object.entries(CROP_COLORS).map(([key, color]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            {CROP_NAMES[key] || key}
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>{t.loading}</div>
      ) : data ? (
        <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {view === "grid" ? (
            <CalendarGrid calendar={data.calendar} language={language} />
          ) : (
            <CalendarTimeline calendar={data.calendar} language={language} />
          )}
        </div>
      ) : null}
    </div>
  );
}
