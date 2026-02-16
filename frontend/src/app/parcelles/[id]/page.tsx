"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import {
  fetchParcelle, updateParcelle, deleteParcelle,
  createCulture, updateCulture, deleteCulture,
  createHistory, fetchRotationAdvice,
  type Parcelle, type Culture,
} from "@/lib/api";
import { ArrowLeft, Plus, Trash2, RotateCcw } from "lucide-react";

const CROPS = [
  { key: "arachide", fr: "Arachide", wo: "Gerte" },
  { key: "mil", fr: "Mil", wo: "Dugub" },
  { key: "riz", fr: "Riz", wo: "Malo" },
  { key: "mais", fr: "Mais", wo: "Mbaxal" },
  { key: "niebe", fr: "Niebe", wo: "Niebe" },
  { key: "tomate", fr: "Tomate", wo: "Tamaate" },
  { key: "oignon", fr: "Oignon", wo: "Soble" },
];

const STATUSES = ["planned", "sown", "growing", "harvesting", "harvested", "failed"];

export default function ParcelleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const id = params.id as string;

  const [parcelle, setParcelle] = useState<Parcelle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCultureForm, setShowCultureForm] = useState(false);
  const [cultureForm, setCultureForm] = useState({ crop_key: "arachide", variety: "", status: "planned", planting_date: "", expected_harvest: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [rotation, setRotation] = useState<{ recommendations: Array<{ crop_key: string; name_fr: string; reason_fr: string }> } | null>(null);
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null);
  const [historyForm, setHistoryForm] = useState({ season: "", yield_kg_ha: "", expenses_fcfa: "", revenue_fcfa: "", notes: "" });

  const load = async () => {
    try {
      const data = await fetchParcelle(id);
      setParcelle(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleDeleteParcelle = async () => {
    if (!confirm(language === "fr" ? "Supprimer cette parcelle ?" : "Delete this field?")) return;
    await deleteParcelle(id);
    router.push("/parcelles");
  };

  const handleAddCulture = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCulture({
        parcelle_id: id,
        crop_key: cultureForm.crop_key,
        variety: cultureForm.variety,
        status: cultureForm.status,
        planting_date: cultureForm.planting_date || null,
        expected_harvest: cultureForm.expected_harvest || null,
        notes: cultureForm.notes,
      });
      setCultureForm({ crop_key: "arachide", variety: "", status: "planned", planting_date: "", expected_harvest: "", notes: "" });
      setShowCultureForm(false);
      await load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleStatusChange = async (cultureId: string, newStatus: string) => {
    await updateCulture(cultureId, { status: newStatus });
    await load();
  };

  const handleDeleteCulture = async (cultureId: string) => {
    if (!confirm("Supprimer ?")) return;
    await deleteCulture(cultureId);
    await load();
  };

  const handleAddHistory = async (cultureId: string) => {
    await createHistory({
      culture_id: cultureId,
      season: historyForm.season,
      yield_kg_ha: historyForm.yield_kg_ha ? parseFloat(historyForm.yield_kg_ha) : null,
      expenses_fcfa: historyForm.expenses_fcfa ? parseInt(historyForm.expenses_fcfa) : 0,
      revenue_fcfa: historyForm.revenue_fcfa ? parseInt(historyForm.revenue_fcfa) : 0,
      notes: historyForm.notes,
    });
    setShowHistoryFor(null);
    setHistoryForm({ season: "", yield_kg_ha: "", expenses_fcfa: "", revenue_fcfa: "", notes: "" });
    await load();
  };

  const handleRotation = async () => {
    try {
      const data = await fetchRotationAdvice(id);
      setRotation(data);
    } catch { /* ignore */ }
  };

  const inputStyle = { width: "100%", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const, backgroundColor: "var(--bg-input)", color: "var(--text)" };

  if (loading) return <ProtectedRoute><div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Loading...</div></ProtectedRoute>;
  if (!parcelle) return <ProtectedRoute><div style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>Parcelle introuvable</div></ProtectedRoute>;

  const cultures = parcelle.cultures || [];

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
          <button onClick={() => router.push("/parcelles")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", flex: 1 }}>{parcelle.name}</h1>
          <button onClick={handleDeleteParcelle} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>
            <Trash2 size={18} />
          </button>
        </div>

        {/* Parcelle Info */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", fontSize: "0.875rem" }}>
            {parcelle.surface_ha && <div><span style={{ color: "var(--text-muted)" }}>Surface</span><br /><strong>{parcelle.surface_ha} ha</strong></div>}
            {parcelle.zone && <div><span style={{ color: "var(--text-muted)" }}>Zone</span><br /><strong>{parcelle.zone}</strong></div>}
            {parcelle.city && <div><span style={{ color: "var(--text-muted)" }}>Ville</span><br /><strong>{parcelle.city}</strong></div>}
            {parcelle.soil_type && <div><span style={{ color: "var(--text-muted)" }}>Sol</span><br /><strong>{parcelle.soil_type}</strong></div>}
          </div>
          {parcelle.notes && <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{parcelle.notes}</p>}
        </div>

        {/* Cultures Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text)" }}>
            Cultures ({cultures.length})
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleRotation} style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.4rem 0.75rem", border: "1px solid #16a34a", color: "#16a34a", borderRadius: 8, background: "var(--bg-card)", cursor: "pointer", fontSize: "0.8rem" }}>
              <RotateCcw size={14} /> Rotation
            </button>
            <button onClick={() => setShowCultureForm(!showCultureForm)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.4rem 0.75rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem" }}>
              <Plus size={14} /> Culture
            </button>
          </div>
        </div>

        {/* Rotation Advice */}
        {rotation && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#166534", marginBottom: 8 }}>Conseil rotation</h3>
            {rotation.recommendations.map((r, i) => (
              <div key={i} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 4 }}>
                <strong>{r.name_fr}</strong> - {r.reason_fr}
              </div>
            ))}
          </div>
        )}

        {/* Add Culture Form */}
        {showCultureForm && (
          <form onSubmit={handleAddCulture} style={{ background: "var(--bg-card)", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem", border: "1px solid var(--border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Culture</label>
                <select value={cultureForm.crop_key} onChange={(e) => setCultureForm({ ...cultureForm, crop_key: e.target.value })} style={inputStyle}>
                  {CROPS.map((c) => <option key={c.key} value={c.key}>{c.fr} ({c.wo})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Variete</label>
                <input value={cultureForm.variety} onChange={(e) => setCultureForm({ ...cultureForm, variety: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Statut</label>
                <select value={cultureForm.status} onChange={(e) => setCultureForm({ ...cultureForm, status: e.target.value })} style={inputStyle}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Date semis</label>
                <input type="date" value={cultureForm.planting_date} onChange={(e) => setCultureForm({ ...cultureForm, planting_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Recolte prevue</label>
                <input type="date" value={cultureForm.expected_harvest} onChange={(e) => setCultureForm({ ...cultureForm, expected_harvest: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Notes</label>
                <input value={cultureForm.notes} onChange={(e) => setCultureForm({ ...cultureForm, notes: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: "0.75rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowCultureForm(false)} style={{ padding: "0.4rem 0.75rem", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-card)", cursor: "pointer", fontSize: "0.8rem", color: "var(--text)" }}>Annuler</button>
              <button type="submit" disabled={saving} style={{ padding: "0.4rem 0.75rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem" }}>{saving ? "..." : "Ajouter"}</button>
            </div>
          </form>
        )}

        {/* Culture Cards */}
        {cultures.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)" }}>
            Aucune culture sur cette parcelle
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {cultures.map((c: Culture) => (
              <div key={c.id} style={{ background: "var(--bg-card)", borderRadius: 12, padding: "1rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ color: "var(--text)" }}>{CROPS.find((cr) => cr.key === c.crop_key)?.fr || c.crop_key}</strong>
                    {c.variety && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>({c.variety})</span>}
                    <StatusBadge status={c.status} />
                  </div>
                  <button onClick={() => handleDeleteCulture(c.id)} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: "flex", gap: 12, fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>
                  {c.planting_date && <span>Semis: {c.planting_date}</span>}
                  {c.expected_harvest && <span>Recolte: {c.expected_harvest}</span>}
                </div>

                {/* Quick Status */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {STATUSES.filter((s) => s !== c.status).map((s) => (
                    <button key={s} onClick={() => handleStatusChange(c.id, s)} style={{ padding: "2px 8px", fontSize: "0.7rem", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--bg)", cursor: "pointer" }}>
                      {s}
                    </button>
                  ))}
                </div>

                {/* History toggle */}
                <div style={{ marginTop: 8, borderTop: "1px solid var(--border-light)", paddingTop: 8 }}>
                  <button onClick={() => setShowHistoryFor(showHistoryFor === c.id ? null : c.id)} style={{ fontSize: "0.75rem", color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                    {showHistoryFor === c.id ? "Fermer" : "+ Ajouter historique saison"}
                  </button>
                  {showHistoryFor === c.id && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: 8 }}>
                      <input placeholder="Saison (ex: 2025-nawet)" value={historyForm.season} onChange={(e) => setHistoryForm({ ...historyForm, season: e.target.value })} style={{ ...inputStyle, fontSize: "0.8rem" }} />
                      <input placeholder="Rendement kg/ha" type="number" value={historyForm.yield_kg_ha} onChange={(e) => setHistoryForm({ ...historyForm, yield_kg_ha: e.target.value })} style={{ ...inputStyle, fontSize: "0.8rem" }} />
                      <input placeholder="Depenses FCFA" type="number" value={historyForm.expenses_fcfa} onChange={(e) => setHistoryForm({ ...historyForm, expenses_fcfa: e.target.value })} style={{ ...inputStyle, fontSize: "0.8rem" }} />
                      <input placeholder="Revenus FCFA" type="number" value={historyForm.revenue_fcfa} onChange={(e) => setHistoryForm({ ...historyForm, revenue_fcfa: e.target.value })} style={{ ...inputStyle, fontSize: "0.8rem" }} />
                      <button onClick={() => handleAddHistory(c.id)} style={{ gridColumn: "span 2", padding: "0.4rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem" }}>Enregistrer</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
