"use client";

import { Lightbulb, CloudRain, Sun, Sprout, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface SmartSuggestion {
  text: string;
  icon: typeof Lightbulb;
  color: string;
  category: "weather" | "season" | "crop" | "market";
}

interface SmartSuggestionsProps {
  onSelect: (text: string) => void;
  city?: string;
}

const ST = {
  en: { title: "Smart Suggestions" },
  fr: { title: "Suggestions intelligentes" },
  wo: { title: "Xalaat yu baax" },
};

export default function SmartSuggestions({ onSelect, city = "kaolack" }: SmartSuggestionsProps) {
  const { language } = useLanguage();
  const month = new Date().getMonth() + 1; // 1-12
  
  const suggestions: SmartSuggestion[] = [];

  // Season-based suggestions
  if (month >= 6 && month <= 10) {
    // Rainy season (June-October)
    if (language === "fr") {
      suggestions.push(
        { text: `Quand planter l'arachide \u00e0 ${city} ?`, icon: Sprout, color: "#22c55e", category: "season" },
        { text: "Comment optimiser la plantation du mil cette saison ?", icon: CloudRain, color: "#3b82f6", category: "weather" },
        { text: "Quel est le calendrier de plantation pour le ma\u00efs ?", icon: Sprout, color: "#16a34a", category: "season" },
      );
    } else if (language === "wo") {
      suggestions.push(
        { text: `Kañ laa fàgg gerte ci ${city} ?`, icon: Sprout, color: "#22c55e", category: "season" },
        { text: "Nan laa mën def ngir dugg bu baax ci hivernage ?", icon: CloudRain, color: "#3b82f6", category: "weather" },
        { text: "Kañ laa fàgg mboq ?", icon: Sprout, color: "#16a34a", category: "season" },
      );
    } else {
      suggestions.push(
        { text: `When to plant peanuts in ${city}?`, icon: Sprout, color: "#22c55e", category: "season" },
        { text: "How to optimize millet planting this season?", icon: CloudRain, color: "#3b82f6", category: "weather" },
        { text: "What is the planting calendar for corn?", icon: Sprout, color: "#16a34a", category: "season" },
      );
    }
  } else {
    // Dry season (November-May)
    if (language === "fr") {
      suggestions.push(
        { text: `Quelle est la m\u00e9t\u00e9o \u00e0 ${city} pour les prochains jours ?`, icon: Sun, color: "#f59e0b", category: "weather" },
        { text: "Quand planter les tomates et oignons (cultures mara\u00eech\u00e8res) ?", icon: Sprout, color: "#22c55e", category: "season" },
        { text: "Conseils d'irrigation pour la saison s\u00e8che", icon: CloudRain, color: "#3b82f6", category: "crop" },
      );
    } else if (language === "wo") {
      suggestions.push(
        { text: `Nan la asamaan bi nekk ci ${city} ?`, icon: Sun, color: "#f59e0b", category: "weather" },
        { text: "Kañ laa fàgg tamaate ak soble ?", icon: Sprout, color: "#22c55e", category: "season" },
        { text: "Ndimbal ci nosal ci noor", icon: CloudRain, color: "#3b82f6", category: "crop" },
      );
    } else {
      suggestions.push(
        { text: `What's the weather in ${city} for the next few days?`, icon: Sun, color: "#f59e0b", category: "weather" },
        { text: "When to plant tomatoes and onions?", icon: Sprout, color: "#22c55e", category: "season" },
        { text: "Irrigation tips for the dry season", icon: CloudRain, color: "#3b82f6", category: "crop" },
      );
    }
  }

  // Always relevant
  if (language === "fr") {
    suggestions.push(
      { text: "Prix actuels de l'arachide au march\u00e9", icon: TrendingUp, color: "#8b5cf6", category: "market" },
      { text: "Ma plante a des taches jaunes, que faire ?", icon: Lightbulb, color: "#ec4899", category: "crop" },
    );
  } else if (language === "wo") {
    suggestions.push(
      { text: "Nj\u00ebg gerte ci march\u00e9 tey", icon: TrendingUp, color: "#8b5cf6", category: "market" },
      { text: "Sama garab am na xonq, lu ma war def ?", icon: Lightbulb, color: "#ec4899", category: "crop" },
    );
  } else {
    suggestions.push(
      { text: "Current peanut market prices", icon: TrendingUp, color: "#8b5cf6", category: "market" },
      { text: "My plant has yellow spots, what should I do?", icon: Lightbulb, color: "#ec4899", category: "crop" },
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="text-xs font-semibold flex items-center gap-1"
        style={{ color: "var(--text-muted)" }}
      >
        <Lightbulb size={14} />
        {ST[language]?.title || ST.fr.title}
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.slice(0, 4).map((suggestion, idx) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(suggestion.text)}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "0.625rem 0.875rem",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                color: "var(--text-secondary)",
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: `${suggestion.color}11`,
                borderColor: suggestion.color,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={14} style={{ color: suggestion.color }} />
              <span>{suggestion.text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
