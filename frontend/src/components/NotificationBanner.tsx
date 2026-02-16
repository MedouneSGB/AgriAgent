"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CloudRain, Wind, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

// Translations for alerts
const ALERTS_I18N = {
  "rainy-season": {
    en: { title: "Rainy season", message: "Ideal time to plant millet, corn, and peanuts!" },
    fr: { title: "Saison des pluies", message: "C'est la période idéale pour planter mil, maïs et arachide !" },
    wo: { title: "Nawet", message: "Jamono bu baax ngir fàgg dugub, mboq ak gerte!" },
  },

  "morning-water": {
    en: { title: "Ideal watering time", message: "Cool temperature - optimal for irrigating your crops." },
    fr: { title: "Moment idéal pour arroser", message: "Température fraîche - optimal pour l'irrigation." },
    wo: { title: "Jamono bu baax ngir nosal", message: "Tangaay bu sédd - bu baax ngir nosal." },
  },
};

const DISMISSED_KEY = "agriagent_dismissed_alerts";

interface WeatherAlert {
  id: string;
  type: "warning" | "info" | "success";
  icon: typeof AlertTriangle;
  title: string;
  message: string;
  color: string;
  bgColor: string;
}

export default function NotificationBanner() {
  const { language } = useLanguage();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Load dismissed alerts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only keep dismissals from today
        const today = new Date().toDateString();
        if (parsed.date === today) {
          setDismissed(new Set(parsed.ids));
        } else {
          localStorage.removeItem(DISMISSED_KEY);
        }
      }
    } catch {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;
    
    const newAlerts: WeatherAlert[] = [];
    const lang = language as "en" | "fr" | "wo";

    // Rainy season alert (June-October)
    if (month >= 6 && month <= 10 && !dismissed.has("rainy-season")) {
      const t = ALERTS_I18N["rainy-season"][lang] || ALERTS_I18N["rainy-season"].fr;
      newAlerts.push({
        id: "rainy-season",
        type: "info",
        icon: CloudRain,
        title: t.title,
        message: t.message,
        color: "#3b82f6",
        bgColor: "#eff6ff",
      });
    }



    // Morning watering reminder (only show once per session)
    if (hour >= 6 && hour <= 8 && !dismissed.has("morning-water")) {
      const t = ALERTS_I18N["morning-water"][lang] || ALERTS_I18N["morning-water"].fr;
      newAlerts.push({
        id: "morning-water",
        type: "success",
        icon: Wind,
        title: t.title,
        message: t.message,
        color: "#10b981",
        bgColor: "#f0fdf4",
      });
    }

    setAlerts(newAlerts);
  }, [language, dismissed]);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    
    // Persist to localStorage
    const newDismissed = new Set(dismissed);
    newDismissed.add(id);
    setDismissed(newDismissed);
    
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify({
        date: new Date().toDateString(),
        ids: Array.from(newDismissed),
      }));
    } catch {
      // Ignore errors
    }
  };

  return (
    <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-auto sm:right-4 z-40 sm:max-w-md space-y-2">
      <AnimatePresence>
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: alert.bgColor,
                border: `1px solid ${alert.color}33`,
                borderRadius: "10px",
                padding: "0.625rem 0.75rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              <button
                onClick={() => dismissAlert(alert.id)}
                style={{
                  position: "absolute",
                  top: "0.375rem",
                  right: "0.375rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                  borderRadius: "4px",
                  color: alert.color,
                  opacity: 0.6,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-2 pr-5">
                <div
                  className="hidden sm:flex"
                  style={{
                    backgroundColor: `${alert.color}22`,
                    borderRadius: "6px",
                    padding: "0.375rem",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} style={{ color: alert.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className="font-semibold text-xs sm:text-sm"
                    style={{ color: alert.color }}
                  >
                    {alert.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs line-clamp-2" style={{ color: "#374151" }}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
