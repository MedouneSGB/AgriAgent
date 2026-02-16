"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export default function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: error ? "var(--accent)" : "var(--text-muted)",
          marginBottom: 4,
        }}
      >
        {label}{required && " *"}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
