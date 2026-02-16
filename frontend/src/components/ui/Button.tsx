"use client";

import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; borderRadius: string }> = {
  sm: { padding: "0.375rem 0.75rem", fontSize: "0.8rem", borderRadius: "var(--radius-sm)" },
  md: { padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "var(--radius-md)" },
  lg: { padding: "0.75rem 1.5rem", fontSize: "1rem", borderRadius: "var(--radius-md)" },
};

const variantStyles: Record<ButtonVariant, Record<string, string>> = {
  primary: {
    background: "linear-gradient(135deg, var(--primary), #166534)",
    color: "#ffffff",
    border: "none",
  },
  secondary: {
    background: "linear-gradient(135deg, var(--secondary), #b45309)",
    color: "#ffffff",
    border: "none",
  },
  ghost: {
    background: "transparent",
    color: "var(--text)",
    border: "1px solid var(--border)",
  },
  danger: {
    background: "linear-gradient(135deg, #dc2626, #991b1b)",
    color: "#ffffff",
    border: "none",
  },
  icon: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "none",
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const sStyle = sizeStyles[size];
  const vStyle = variantStyles[variant];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        ...sStyle,
        ...vStyle,
        ...(style || {}),
      }}
      {...(props as Record<string, unknown>)}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
            display: "inline-block",
          }}
        />
      ) : null}
      {children}
    </motion.button>
  );
}
