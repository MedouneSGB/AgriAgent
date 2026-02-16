"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

type CardVariant = "default" | "glass" | "outlined";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  padding?: string;
}

const variantStyles: Record<CardVariant, CSSProperties> = {
  default: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-sm)",
  },
  glass: {
    backgroundColor: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  outlined: {
    backgroundColor: "transparent",
    border: "1px solid var(--border)",
  },
};

export default function Card({
  children,
  variant = "default",
  hover = true,
  className = "",
  style,
  onClick,
  padding = "1.25rem",
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "var(--shadow-md)" } : undefined}
      transition={{ duration: 0.2 }}
      className={className}
      onClick={onClick}
      style={{
        borderRadius: "var(--radius-lg)",
        padding,
        cursor: onClick ? "pointer" : undefined,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
