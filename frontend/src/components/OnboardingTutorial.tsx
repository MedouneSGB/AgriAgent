"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TutorialStep {
  title: Record<string, string>;
  description: Record<string, string>;
  target?: string;
  highlight?: boolean;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: { en: "Welcome to AgriAgent!", fr: "Bienvenue sur AgriAgent !", wo: "Dalal ak diam ci AgriAgent!" },
    description: {
      en: "Your intelligent agricultural assistant. Let me show you the main features.",
      fr: "Votre assistant agricole intelligent. Je vais vous faire d\u00e9couvrir les fonctionnalit\u00e9s principales.",
      wo: "Sa bopp xam-xam tool. Dinaa la wonewoon ligg\u00e9eyu ci mag.",
    },
  },
  {
    title: { en: "AI Chat", fr: "Chat IA", wo: "Waxtaan ak IA" },
    description: {
      en: "Ask any question about weather, crops, diseases and market prices. The AI responds in your language!",
      fr: "Posez toutes vos questions sur la m\u00e9t\u00e9o, les cultures, les maladies et les prix du march\u00e9. L'IA vous r\u00e9pond dans votre langue !",
      wo: "Laaj ngir jant ci asamaan, tool, feebar, ak nj\u00ebg. IA bi di la wax ci sa l\u00e0kk!",
    },
    target: "chat",
  },
  {
    title: { en: "Dashboard", fr: "Tableau de bord", wo: "Tablo bord" },
    description: {
      en: "Check the weather in your area, recommended crops and real-time market prices.",
      fr: "Consultez la m\u00e9t\u00e9o de votre r\u00e9gion, les cultures recommand\u00e9es et les prix du march\u00e9 en temps r\u00e9el.",
      wo: "Xool asamaan bi sa gox, tool yu baax te nj\u00ebg ci march\u00e9.",
    },
    target: "dashboard",
  },
  {
    title: { en: "My Fields", fr: "Mes Parcelles", wo: "Samay Tool" },
    description: {
      en: "Manage your fields: create plots, track your crops and plan your harvests.",
      fr: "G\u00e9rez vos champs : cr\u00e9ez des parcelles, suivez vos cultures et planifiez vos r\u00e9coltes.",
      wo: "Jaar sa tool: sos parcelles, sopleeku sa \u00f1\u00e0kk te planifie sa b\u00ebr\u00ebb.",
    },
    target: "parcelles",
  },
  {
    title: { en: "Agricultural Calendar", fr: "Calendrier Agricole", wo: "Kadur Tool" },
    description: {
      en: "Discover the best planting periods based on your zone and season.",
      fr: "D\u00e9couvrez les meilleures p\u00e9riodes de plantation selon votre zone et la saison.",
      wo: "Xam jamono bu baax ngir f\u00e0gg ci sa suf.",
    },
    target: "calendar",
  },
  {
    title: { en: "You're ready!", fr: "Vous \u00eates pr\u00eat !", wo: "Pareel nga!" },
    description: {
      en: "Explore the app and don't hesitate to ask the AI chat. Happy harvesting!",
      fr: "Explorez l'application et n'h\u00e9sitez pas \u00e0 poser des questions au chat IA. Bonne r\u00e9colte !",
      wo: "Xool app bi te laaj sa laj. B\u00ebr\u00ebb bu baax!",
    },
  },
];

export default function OnboardingTutorial() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const currentStepData = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenTutorial", "true");
  };

  const handleSkip = () => {
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 9998,
              backdropFilter: "blur(4px)",
            }}
            onClick={handleSkip}
          />

          {/* Tutorial Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              maxWidth: "480px",
              width: "90%",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #16a34a, #166534)",
                padding: "1.5rem",
                position: "relative",
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  padding: "0.25rem",
                  borderRadius: "4px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <X size={20} />
              </button>

              <div className="flex items-center justify-between mb-2">
                <h2 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "700" }}>
                  {currentStepData.title[language] || currentStepData.title.fr}
                </h2>
              </div>

              {/* Progress */}
              <div className="flex gap-1">
                {TUTORIAL_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: "4px",
                      borderRadius: "2px",
                      backgroundColor: idx <= currentStep ? "#fbbf24" : "rgba(255,255,255,0.3)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "2rem" }}>
              <p style={{ color: "#374151", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                {currentStepData.description[language] || currentStepData.description.fr}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  {language === "en" ? "Skip" : language === "wo" ? "Sappe" : "Passer"}
                </button>

                <button
                  onClick={handleNext}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#15803d")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#16a34a")}
                >
                  {isLastStep ? (
                    <>
                      <Check size={16} />
                      {language === "en" ? "Get started" : language === "wo" ? "Jerejef!" : "Commencer"}
                    </>
                  ) : (
                    <>
                      {language === "en" ? "Next" : language === "wo" ? "Ci topp" : "Suivant"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Step counter */}
              <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", color: "#9ca3af" }}>
                {currentStep + 1} / {TUTORIAL_STEPS.length}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
