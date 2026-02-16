"use client";

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string; label: string }> = {
  planned: { bg: "var(--bg-hover)", color: "var(--text-secondary)", border: "var(--border)", label: "Planifie" },
  sown: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", label: "Seme" },
  growing: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", label: "Croissance" },
  harvesting: { bg: "#fffbeb", color: "#92400e", border: "#fde68a", label: "Recolte" },
  harvested: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "Recolte" },
  failed: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", label: "Echec" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.planned;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: "0.7rem",
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: s.color,
          opacity: 0.7,
        }}
      />
      {s.label}
    </span>
  );
}
