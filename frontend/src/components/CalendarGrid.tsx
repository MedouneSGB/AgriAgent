"use client";

import { useState } from "react";
import type { CalendarMonth } from "@/lib/api";

const CROP_COLORS: Record<string, string> = {
  arachide: "#f59e0b", mil: "#eab308", riz: "#22c55e", mais: "#f97316",
  niebe: "#ef4444", tomate: "#dc2626", oignon: "#8b5cf6",
};

const MONTH_NAMES_FR = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_WO = ["Sam", "Fev", "Mar", "Aw", "Me", "Suw", "Sul", "Ut", "Sep", "Okt", "Now", "Des"];

const ACTIVITY_LABELS: Record<string, Record<string, string>> = {
  sowing: { fr: "Semis", wo: "Bey", en: "Sowing" },
  growing: { fr: "Croissance", wo: "Yokk", en: "Growing" },
  harvest: { fr: "Recolte", wo: "Natt", en: "Harvest" },
};

const ACTIVITY_COLORS: Record<string, string> = {
  sowing: "#166534",
  growing: "#ca8a04",
  harvest: "#ea580c",
};

interface Props {
  calendar: CalendarMonth[];
  language: "en" | "fr" | "wo";
}

export default function CalendarGrid({ calendar, language }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const monthNames = language === "wo" ? MONTH_NAMES_WO : MONTH_NAMES_FR;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
        {calendar.map((m) => {
          const isRainy = m.month >= 6 && m.month <= 10;
          const isExpanded = expanded === m.month;

          return (
            <div
              key={m.month}
              onClick={() => setExpanded(isExpanded ? null : m.month)}
              style={{
                background: isRainy ? "#eff6ff" : "var(--bg-card)",
                border: isExpanded ? "2px solid #16a34a" : "1px solid var(--border)",
                borderRadius: 12,
                padding: "0.75rem",
                cursor: "pointer",
                transition: "border-color 0.2s",
                minHeight: 90,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>
                  {monthNames[m.month - 1]}
                </span>
                {isRainy && (
                  <span style={{ fontSize: "0.65rem", color: "#3b82f6", background: "#dbeafe", padding: "1px 6px", borderRadius: 4 }}>
                    {language === "wo" ? "Nawet" : "Pluie"}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {m.crops.map((crop) =>
                  crop.activities.map((act) => (
                    <span
                      key={`${crop.key}-${act}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: "0.65rem",
                        padding: "1px 6px",
                        borderRadius: 6,
                        background: `${CROP_COLORS[crop.key] || "#6b7280"}20`,
                        color: ACTIVITY_COLORS[act] || "var(--text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: CROP_COLORS[crop.key] || "#6b7280",
                        }}
                      />
                      {crop.name_fr}
                    </span>
                  ))
                )}
                {m.crops.length === 0 && (
                  <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>-</span>
                )}
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 8, fontSize: "0.75rem" }}>
                  <p style={{ color: "var(--text-secondary)", marginBottom: 6 }}>
                    {language === "wo" ? m.recommendation_wo : m.recommendation_fr}
                  </p>
                  {m.crops.map((crop) => (
                    <div key={crop.key} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: CROP_COLORS[crop.key] }} />
                      <strong>{language === "wo" ? crop.name_wo : crop.name_fr}</strong>
                      <span style={{ color: "var(--text-muted)" }}>
                        {crop.activities.map((a) => ACTIVITY_LABELS[a]?.[language] || a).join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
