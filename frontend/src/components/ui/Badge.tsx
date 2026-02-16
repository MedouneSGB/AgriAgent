"use client";

import { CSSProperties } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "gold";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  success: { backgroundColor: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  warning: { backgroundColor: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" },
  danger: { backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
  info: { backgroundColor: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" },
  neutral: { backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" },
  gold: { backgroundColor: "#fffbeb", color: "#92400e", border: "1px solid #fbbf24" },
};

export default function Badge({ children, variant = "neutral", style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: "0.7rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
