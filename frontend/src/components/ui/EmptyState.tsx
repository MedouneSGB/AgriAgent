"use client";

import { LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="pattern-adinkra"
      style={{
        textAlign: "center",
        padding: "3rem 2rem",
        backgroundColor: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <Icon
          size={48}
          style={{
            margin: "0 auto 1rem",
            color: "var(--text-muted)",
            opacity: 0.4,
          }}
        />
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          {title}
        </h3>
        {description && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: actionLabel ? "1.25rem" : 0 }}>
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
