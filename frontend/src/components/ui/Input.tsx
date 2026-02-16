"use client";

import { useState, InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({ label, icon, error, id, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: error ? "var(--accent)" : focused ? "var(--primary)" : "var(--text-muted)",
            marginBottom: 4,
            transition: "color 0.2s",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "var(--primary)" : "var(--text-muted)",
              transition: "color 0.2s",
              display: "flex",
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: "100%",
            padding: icon ? "0.625rem 0.75rem 0.625rem 2.5rem" : "0.625rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${error ? "var(--accent)" : focused ? "var(--primary)" : "var(--border)"}`,
            fontSize: "0.875rem",
            outline: "none",
            boxSizing: "border-box",
            backgroundColor: "var(--bg-input)",
            color: "var(--text)",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? "var(--shadow-glow-primary)" : "none",
            ...(props.style || {}),
          }}
          {...props}
        />
      </div>
      {error && (
        <p style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
