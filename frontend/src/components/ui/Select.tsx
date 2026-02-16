"use client";

import { useState, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export default function Select({ label, error, options, placeholder, id, ...props }: SelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
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
      <select
        id={id}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: "100%",
          padding: "0.625rem 0.75rem",
          borderRadius: "var(--radius-md)",
          border: `1px solid ${error ? "var(--accent)" : focused ? "var(--primary)" : "var(--border)"}`,
          fontSize: "0.875rem",
          outline: "none",
          boxSizing: "border-box",
          backgroundColor: "var(--bg-input)",
          color: "var(--text)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? "var(--shadow-glow-primary)" : "none",
          cursor: "pointer",
          ...(props.style || {}),
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
