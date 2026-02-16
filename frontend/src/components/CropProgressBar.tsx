"use client";

import { Sprout, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface CultureProgress {
  cropName: string;
  plantingDate: string;
  expectedHarvest: string;
  progress: number; // 0-100
  status: "planted" | "growing" | "ready" | "harvested";
  healthStatus: "excellent" | "good" | "warning" | "poor";
}

interface CropProgressBarProps {
  culture: CultureProgress;
}

export default function CropProgressBar({ culture }: CropProgressBarProps) {
  const getStatusColor = () => {
    switch (culture.status) {
      case "planted":
        return "#3b82f6";
      case "growing":
        return "#22c55e";
      case "ready":
        return "#f59e0b";
      case "harvested":
        return "#6b7280";
      default:
        return "#3b82f6";
    }
  };

  const getHealthColor = () => {
    switch (culture.healthStatus) {
      case "excellent":
        return "#22c55e";
      case "good":
        return "#3b82f6";
      case "warning":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  const getStatusLabel = () => {
    switch (culture.status) {
      case "planted":
        return "Planté";
      case "growing":
        return "En croissance";
      case "ready":
        return "Prêt à récolter";
      case "harvested":
        return "Récolté";
      default:
        return culture.status;
    }
  };

  const daysToHarvest = () => {
    const today = new Date();
    const harvest = new Date(culture.expectedHarvest);
    const diff = Math.ceil((harvest.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.25rem",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: `${getStatusColor()}22`,
              borderRadius: "8px",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sprout size={20} style={{ color: getStatusColor() }} />
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: "var(--text)" }}>
              {culture.cropName}
            </h4>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Planté le {new Date(culture.plantingDate).toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>

        <div
          className="px-2 py-1 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: `${getStatusColor()}22`,
            color: getStatusColor(),
          }}
        >
          {getStatusLabel()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          <span>Progression</span>
          <span className="font-semibold">{Math.round(culture.progress)}%</span>
        </div>
        <div
          style={{
            height: "8px",
            backgroundColor: "var(--bg-hover)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${culture.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${getStatusColor()}, ${getHealthColor()})`,
              borderRadius: "999px",
            }}
          />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            Jours restants
          </div>
          <div className="text-lg font-bold flex items-center gap-1" style={{ color: getStatusColor() }}>
            {daysToHarvest()}
            <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>jours</span>
          </div>
        </div>

        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            Santé
          </div>
          <div className="flex items-center gap-1">
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: getHealthColor(),
              }}
            />
            <span className="text-sm font-semibold" style={{ color: getHealthColor() }}>
              {culture.healthStatus === "excellent" ? "Excellente" :
               culture.healthStatus === "good" ? "Bonne" :
               culture.healthStatus === "warning" ? "Attention" : "Mauvaise"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Container component for multiple cultures
export function CropProgressList({ cultures }: { cultures: CultureProgress[] }) {
  if (cultures.length === 0) {
    return (
      <div
        className="text-center py-8"
        style={{
          backgroundColor: "var(--bg-hover)",
          borderRadius: "12px",
          color: "var(--text-muted)",
        }}
      >
        <Sprout size={36} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">Aucune culture en cours</p>
        <p className="text-xs mt-1">Créez une parcelle et commencez à cultiver !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cultures.map((culture, idx) => (
        <CropProgressBar key={idx} culture={culture} />
      ))}
    </div>
  );
}
