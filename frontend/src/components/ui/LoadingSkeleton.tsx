"use client";

type SkeletonVariant = "text" | "card" | "avatar" | "table-row";

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  width?: string;
  height?: string;
}

const variantDefaults: Record<SkeletonVariant, { width: string; height: string; borderRadius: string }> = {
  text: { width: "100%", height: "16px", borderRadius: "var(--radius-sm)" },
  card: { width: "100%", height: "120px", borderRadius: "var(--radius-lg)" },
  avatar: { width: "48px", height: "48px", borderRadius: "50%" },
  "table-row": { width: "100%", height: "48px", borderRadius: "var(--radius-sm)" },
};

export default function LoadingSkeleton({
  variant = "text",
  count = 1,
  width,
  height,
}: LoadingSkeletonProps) {
  const defaults = variantDefaults[variant];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: variant === "card" ? 12 : 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer"
          style={{
            width: width || defaults.width,
            height: height || defaults.height,
            borderRadius: defaults.borderRadius,
          }}
        />
      ))}
    </div>
  );
}
