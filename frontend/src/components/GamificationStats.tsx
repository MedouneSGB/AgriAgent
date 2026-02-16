"use client";

import { Award, Flame, Star, TrendingUp, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const GT = {
  en: {
    farmerLevel: "Farmer level", totalPoints: "Total points", nextLevel: "Next level",
    badges: "Badges",
    parcelles: "Fields", cultures: "Crops", questionsIA: "AI questions", daysActive: "Days active",
    firstField: "First field", firstFieldDesc: "Create your first field",
    multiField: "Multi-fields", multiFieldDesc: "Manage 3 or more fields",
    activeFarmer: "Active farmer", activeFarmerDesc: "Use the app for 7 days",
    chatExpert: "AI Expert", chatExpertDesc: "Ask 50 questions to the AI",
    cropMaster: "Crop master", cropMasterDesc: "Grow 5 types of crops",
    champion: "AgriAgent Champion", championDesc: "Reach level 10",
  },
  fr: {
    farmerLevel: "Niveau d'agriculteur", totalPoints: "Points totaux", nextLevel: "Prochain niveau",
    badges: "Badges",
    parcelles: "Parcelles", cultures: "Cultures", questionsIA: "Questions IA", daysActive: "Jours actifs",
    firstField: "Premier champ", firstFieldDesc: "Cr\u00e9ez votre premi\u00e8re parcelle",
    multiField: "Multi-parcelles", multiFieldDesc: "G\u00e9rez 3 parcelles ou plus",
    activeFarmer: "Agriculteur actif", activeFarmerDesc: "Utilisez l'app pendant 7 jours",
    chatExpert: "Expert IA", chatExpertDesc: "Posez 50 questions au chat IA",
    cropMaster: "Ma\u00eetre cultivateur", cropMasterDesc: "Cultivez 5 types de cultures",
    champion: "Champion AgriAgent", championDesc: "Atteignez le niveau 10",
  },
  wo: {
    farmerLevel: "Nivo baaykat", totalPoints: "Poyen y\u00e9pp", nextLevel: "Nivo bi ci topp",
    badges: "Badges",
    parcelles: "Tool yi", cultures: "F\u00e0gg yi", questionsIA: "Laj IA", daysActive: "B\u00e9s yu aktif",
    firstField: "Nj\u00ebkk tool", firstFieldDesc: "Sos sa njalbeen parcelle",
    multiField: "Tool yu bari", multiFieldDesc: "Saytu 3 parcelles wala l\u00ebn\u00eb",
    activeFarmer: "Baaykat bu leer", activeFarmerDesc: "J\u00ebfandikoo app bi 7 b\u00e9s",
    chatExpert: "Xam-xam IA", chatExpertDesc: "Laaj 50 laj ci IA",
    cropMaster: "Kilifa tool", cropMasterDesc: "F\u00e0gg 5 xeetu tool",
    champion: "Champion AgriAgent", championDesc: "J\u00ebl nivo 10",
  },
};

interface Badge {
  id: string;
  name: string;
  icon: typeof Award;
  description: string;
  earned: boolean;
  color: string;
  bgColor: string;
}

interface GamificationProps {
  parcelles?: number;
  cultures?: number;
  chatMessages?: number;
  daysActive?: number;
}

export default function GamificationStats({
  parcelles = 0,
  cultures = 0,
  chatMessages = 0,
  daysActive = 0,
}: GamificationProps) {
  const { language } = useLanguage();
  const gt = GT[language] || GT.fr;
  // Calculate level based on activities
  const totalPoints =
    parcelles * 10 + cultures * 15 + chatMessages * 2 + daysActive * 5;
  const level = Math.floor(totalPoints / 100) + 1;
  const progress = (totalPoints % 100) / 100;

  const badges: Badge[] = [
    {
      id: "first-field",
      name: gt.firstField,
      icon: Target,
      description: gt.firstFieldDesc,
      earned: parcelles >= 1,
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
    {
      id: "multi-field",
      name: gt.multiField,
      icon: TrendingUp,
      description: gt.multiFieldDesc,
      earned: parcelles >= 3,
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      id: "active-farmer",
      name: gt.activeFarmer,
      icon: Flame,
      description: gt.activeFarmerDesc,
      earned: daysActive >= 7,
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
    {
      id: "chat-expert",
      name: gt.chatExpert,
      icon: Zap,
      description: gt.chatExpertDesc,
      earned: chatMessages >= 50,
      color: "#8b5cf6",
      bgColor: "#faf5ff",
    },
    {
      id: "crop-master",
      name: gt.cropMaster,
      icon: Star,
      description: gt.cropMasterDesc,
      earned: cultures >= 5,
      color: "#ec4899",
      bgColor: "#fdf2f8",
    },
    {
      id: "champion",
      name: gt.champion,
      icon: Award,
      description: gt.championDesc,
      earned: level >= 10,
      color: "#eab308",
      bgColor: "#fefce8",
    },
  ];

  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="space-y-6">
      {/* Level & Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, #16a34a, #166534)",
          borderRadius: "16px",
          padding: "1.5rem",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #fbbf24 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, #fbbf24 2px, transparent 2px),
              radial-gradient(circle at 40% 20%, #fbbf24 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm opacity-90">{gt.farmerLevel}</div>
              <div className="text-4xl font-bold flex items-center gap-2">
                {level}
                <Star className="w-6 h-6" fill="#fbbf24" color="#fbbf24" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">{gt.totalPoints}</div>
              <div className="text-2xl font-bold">{totalPoints}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-2 opacity-90">
              <span>{gt.nextLevel}</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "999px",
                height: "8px",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                  borderRadius: "999px",
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
          <Award className="w-5 h-5" style={{ color: "var(--primary)" }} />
          {gt.badges} ({earnedBadges.length}/{badges.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  backgroundColor: badge.earned ? badge.bgColor : "var(--bg-hover)",
                  border: badge.earned ? `2px solid ${badge.color}` : "2px solid var(--border)",
                  borderRadius: "12px",
                  padding: "1rem",
                  textAlign: "center",
                  opacity: badge.earned ? 1 : 0.5,
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  style={{
                    backgroundColor: badge.earned ? badge.color : "var(--border)",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.5rem",
                  }}
                >
                  <Icon size={24} color={badge.earned ? "#ffffff" : "#9ca3af"} />
                </div>
                <div
                  className="font-semibold text-xs mb-1"
                  style={{ color: badge.earned ? badge.color : "var(--text-muted)" }}
                >
                  {badge.name}
                </div>
                <div
                  className="text-xs"
                  style={{ color: badge.earned ? "var(--text-secondary)" : "var(--text-muted)" }}
                >
                  {badge.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: gt.parcelles, value: parcelles, color: "#22c55e" },
          { label: gt.cultures, value: cultures, color: "#3b82f6" },
          { label: gt.questionsIA, value: chatMessages, color: "#8b5cf6" },
          { label: gt.daysActive, value: daysActive, color: "#f59e0b" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
