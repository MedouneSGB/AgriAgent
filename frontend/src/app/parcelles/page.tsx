"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { fetchParcelles, createParcelle, type Parcelle } from "@/lib/api";
import { Plus, MapPin, Layers } from "lucide-react";

import { WORLD_ZONES, getAllCities } from "@/data/worldAgriculture";

const ZONES = WORLD_ZONES.map(z => ({ key: z.key, label: z.label }));
const ALL_CITIES = getAllCities();

const SOILS = ["sableux","sablo-argileux","argileux","argilo-limoneux","limoneux","ferrugineux"];

const T = {
  en: { title: "My Fields", add: "Add Field", name: "Name", surface: "Surface (ha)", zone: "Zone", city: "City", soil: "Soil Type", notes: "Notes", save: "Save", cancel: "Cancel", empty: "No fields yet. Create your first plot!", cultures: "crops", loading: "Loading..." },
  fr: { title: "Mes Parcelles", add: "Ajouter", name: "Nom", surface: "Surface (ha)", zone: "Zone", city: "Ville", soil: "Type de sol", notes: "Notes", save: "Enregistrer", cancel: "Annuler", empty: "Aucune parcelle. Cr\u00e9ez votre premier champ !", cultures: "cultures", loading: "Chargement..." },
  wo: { title: "Samay Tool", add: "Yokk", name: "Tur", surface: "Yaatu (ha)", zone: "Suf", city: "D\u00ebkk bi", soil: "Xeetu suuf", notes: "Noter", save: "Denc", cancel: "Neenal", empty: "Amoo tool. Sos sa njalbeen !", cultures: "cultures", loading: "Yegsi..." },
};

export default function ParcellesPage() {
  const { language } = useLanguage();
  const t = T[language] || T.fr;
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", surface_ha: "", zone: "", city: "", soil_type: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await fetchParcelles();
      setParcelles(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await createParcelle({
        name: form.name,
        surface_ha: form.surface_ha ? parseFloat(form.surface_ha) : null,
        zone: form.zone || undefined,
        city: form.city || undefined,
        soil_type: form.soil_type || undefined,
        notes: form.notes || "",
      });
      setForm({ name: "", surface_ha: "", zone: "", city: "", soil_type: "", notes: "" });
      setShowForm(false);
      await load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const inputStyle = { width: "100%", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const, backgroundColor: "var(--bg-input)", color: "var(--text)" };

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: 960, margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>{t.title}</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.5rem 1rem", background: "linear-gradient(135deg, #16a34a, #166534)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}
          >
            <Plus size={16} /> {t.add}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "var(--bg-card)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "grid", gap: "1rem" }} className="grid-cols-1 sm:grid-cols-2">
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>{t.name} *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>{t.surface}</label>
                <input type="number" step="0.1" value={form.surface_ha} onChange={(e) => setForm({ ...form, surface_ha: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>{t.zone}</label>
                <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} style={inputStyle}>
                  <option value="">--</option>
                  {ZONES.map((z) => <option key={z.key} value={z.key}>{z.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>{t.city}</label>
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle}>
                  <option value="">--</option>
                  {ALL_CITIES.map((c) => <option key={c.key} value={c.key}>{c.name} ({c.region})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>{t.soil}</label>
                <select value={form.soil_type} onChange={(e) => setForm({ ...form, soil_type: e.target.value })} style={inputStyle}>
                  <option value="">--</option>
                  {SOILS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>{t.notes}</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: "1rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-card)", cursor: "pointer", fontSize: "0.875rem", color: "var(--text)" }}>{t.cancel}</button>
              <button type="submit" disabled={saving} style={{ padding: "0.5rem 1rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>{saving ? "..." : t.save}</button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>{t.loading}</div>
        ) : parcelles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <MapPin size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <p>{t.empty}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {parcelles.map((p) => (
              <Link key={p.id} href={`/parcelles/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: "1.25rem", border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer", transition: "box-shadow 0.2s" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{p.name}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {p.surface_ha && <span>{p.surface_ha} ha</span>}
                    {p.zone && <span style={{ background: "#f0fdf4", color: "#166534", padding: "1px 8px", borderRadius: 6 }}>{p.zone}</span>}
                    {p.soil_type && <span>{p.soil_type}</span>}
                  </div>
                  {p.cultures && (
                    <div style={{ marginTop: 8, fontSize: "0.8rem", color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                      <Layers size={14} /> {p.cultures.length} {t.cultures}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
