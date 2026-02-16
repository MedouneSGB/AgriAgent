"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  stripe?: boolean;
  action?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "var(--primary)",
  stripe = true,
  action,
}: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Icon && <Icon size={20} style={{ color: iconColor }} />}
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text)" }}>{title}</h2>
        </div>
        {stripe && <span className="stripe-senegal" />}
        {subtitle && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
