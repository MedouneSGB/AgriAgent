"use client";

import type { CalendarMonth } from "@/lib/api";

const CROP_COLORS: Record<string, string> = {
  arachide: "#f59e0b", mil: "#eab308", riz: "#22c55e", mais: "#f97316",
  niebe: "#ef4444", tomate: "#dc2626", oignon: "#8b5cf6",
};

const MONTH_NAMES_FR = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const CROP_LABELS: Record<string, { fr: string; wo: string }> = {
  arachide: { fr: "Arachide", wo: "Gerte" },
  mil: { fr: "Mil", wo: "Dugub" },
  riz: { fr: "Riz", wo: "Malo" },
  mais: { fr: "Mais", wo: "Mbaxal" },
  niebe: { fr: "Niebe", wo: "Niebe" },
  tomate: { fr: "Tomate", wo: "Tamaate" },
  oignon: { fr: "Oignon", wo: "Soble" },
};

interface Props {
  calendar: CalendarMonth[];
  language: "en" | "fr" | "wo";
}

export default function CalendarTimeline({ calendar, language }: Props) {
  // Build per-crop data from calendar
  const cropMap = new Map<string, { months: Map<number, string[]> }>();

  for (const month of calendar) {
    for (const crop of month.crops) {
      if (!cropMap.has(crop.key)) {
        cropMap.set(crop.key, { months: new Map() });
      }
      cropMap.get(crop.key)!.months.set(month.month, crop.activities);
    }
  }

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "100px repeat(12, 1fr)", gap: 0, minWidth: 700 }}>
        {/* Header */}
        <div style={{ padding: "0.5rem", fontWeight: 600, fontSize: "0.75rem", color: "var(--text-muted)" }} />
        {MONTH_NAMES_FR.map((m, i) => (
          <div
            key={i}
            style={{
              padding: "0.5rem 0.25rem",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "0.75rem",
              color: i + 1 === currentMonth ? "#16a34a" : "var(--text-muted)",
              background: i + 1 === currentMonth ? "#f0fdf4" : "transparent",
              borderBottom: "2px solid var(--border)",
              position: "relative",
            }}
          >
            {m}
            {i + 1 === currentMonth && (
              <div style={{ position: "absolute", bottom: 0, left: "50%", width: 2, height: "100%", background: "#16a34a", opacity: 0.3 }} />
            )}
          </div>
        ))}

        {/* Crop rows */}
        {Array.from(cropMap.entries()).map(([cropKey, data]) => {
          const color = CROP_COLORS[cropKey] || "#6b7280";
          const label = CROP_LABELS[cropKey];
          const displayName = language === "wo" && label ? label.wo : label?.fr || cropKey;

          return (
            <div key={cropKey} style={{ display: "contents" }}>
              {/* Label */}
              <div
                style={{
                  padding: "0.5rem 0.25rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                {displayName}
              </div>

              {/* Month cells */}
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const activities = data.months.get(month) || [];
                const hasSowing = activities.includes("sowing");
                const hasGrowing = activities.includes("growing");
                const hasHarvest = activities.includes("harvest");
                const hasActivity = activities.length > 0;

                let bg = "transparent";
                let opacity = 0;
                let borderLeft = "none";
                let borderRight = "none";

                if (hasSowing) {
                  bg = color;
                  opacity = 0.7;
                  borderLeft = `3px dashed ${color}`;
                } else if (hasGrowing) {
                  bg = color;
                  opacity = 0.4;
                } else if (hasHarvest) {
                  bg = color;
                  opacity = 0.25;
                  borderRight = `3px solid ${color}`;
                }

                return (
                  <div
                    key={month}
                    style={{
                      borderBottom: "1px solid var(--border-light)",
                      padding: 2,
                      position: "relative",
                    }}
                  >
                    {hasActivity && (
                      <div
                        style={{
                          background: bg,
                          opacity,
                          borderRadius: 4,
                          height: "100%",
                          minHeight: 28,
                          borderLeft,
                          borderRight,
                        }}
                      />
                    )}
                    {month === currentMonth && (
                      <div style={{ position: "absolute", top: 0, left: "50%", width: 2, height: "100%", background: "#16a34a", opacity: 0.3 }} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 16, height: 12, background: "#6b7280", opacity: 0.7, borderRadius: 3, borderLeft: "2px dashed #6b7280" }} />
          {language === "wo" ? "Bey" : language === "fr" ? "Semis" : "Sowing"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 16, height: 12, background: "#6b7280", opacity: 0.4, borderRadius: 3 }} />
          {language === "wo" ? "Yokk" : language === "fr" ? "Croissance" : "Growing"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 16, height: 12, background: "#6b7280", opacity: 0.25, borderRadius: 3, borderRight: "2px solid #6b7280" }} />
          {language === "wo" ? "Natt" : language === "fr" ? "Recolte" : "Harvest"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 2, height: 12, background: "#16a34a" }} />
          {language === "wo" ? "Tey" : language === "fr" ? "Mois actuel" : "Current month"}
        </div>
      </div>
    </div>
  );
}
