"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import GamificationStats from "@/components/GamificationStats";
import { useToast } from "@/components/ui/Toast";
import { UserCircle, Phone } from "lucide-react";

import { fetchProfile, updateProfile } from "@/lib/api";
import { COUNTRIES, WORLD_ZONES, getAllCities } from "@/data/worldAgriculture";

const ALL_ZONES = WORLD_ZONES.map(z => ({ key: z.key, label: z.label }));
const ALL_CITIES = getAllCities();

const T = {
  en: { title: "My Profile", save: "Save", saved: "Saved!", name: "Full Name", phone: "Phone", region: "City", zone: "Agro-ecological Zone", lang: "Preferred Language" },
  fr: { title: "Mon Profil", save: "Enregistrer", saved: "Enregistr\u00e9 !", name: "Nom complet", phone: "T\u00e9l\u00e9phone", region: "Ville", zone: "Zone agro-\u00e9cologique", lang: "Langue pr\u00e9f\u00e9r\u00e9e" },
  wo: { title: "Sama Profil", save: "Denc", saved: "Denc na !", name: "Sa tur", phone: "Telefon", region: "D\u00ebkk bi", zone: "Suf tool", lang: "L\u00e0kk" },
};

interface Profile {
  full_name: string;
  phone: string;
  city: string;
  zone: string;
  preferred_language: string;
}

export default function ProfilePage() {
  const { session, user } = useAuth();
  const { language } = useLanguage();
  const t = T[language] || T.fr;
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    city: "",
    zone: "",
    preferred_language: "fr",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.access_token) return;
    fetchProfile()
      .then((r) => r.json())
      .then((data) =>
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          city: data.city || "",
          zone: data.zone || "",
          preferred_language: data.preferred_language || "fr",
        })
      )
      .catch(() => {});
  }, [session]);

  const handleSave = async () => {
    if (!session?.access_token) return;
    setSaving(true);
    await updateProfile(profile as unknown as Record<string, unknown>);
    setSaving(false);
    toast(t.saved, "success");
  };

  const initials = (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <ProtectedRoute>
      <AnimatedPage>
        <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Profile form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Avatar + Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary), #166534)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <div>
                  <SectionHeader
                    title={t.title}
                    icon={UserCircle}
                    iconColor="var(--primary)"
                    stripe
                  />
                </div>
              </div>

              <Card hover={false} padding="2rem">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Input
                label={t.name}
                icon={<UserCircle size={16} />}
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />

              <Input
                label={t.phone}
                icon={<Phone size={16} />}
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />

              <Select
                label={t.region}
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="--"
                options={ALL_CITIES.map((c) => ({
                  value: c.key,
                  label: `${c.name} (${c.region})`,
                }))}
              />

              <Select
                label={t.zone}
                value={profile.zone}
                onChange={(e) => setProfile({ ...profile, zone: e.target.value })}
                placeholder="--"
                options={ALL_ZONES.map((z) => ({
                  value: z.key,
                  label: z.label,
                }))}
              />

              {/* Language segmented control */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginBottom: 8,
                  }}
                >
                  {t.lang}
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  {[
                    { key: "fr", label: "FR" },
                    { key: "en", label: "EN" },
                    { key: "wo", label: "WO" },
                    { key: "es", label: "ES" },
                    { key: "pt", label: "PT" },
                  ].map((l) => {
                    const active = profile.preferred_language === l.key;
                    return (
                      <button
                        key={l.key}
                        onClick={() => setProfile({ ...profile, preferred_language: l.key })}
                        style={{
                          flex: 1,
                          padding: "0.5rem 0.25rem",
                          border: "none",
                          background: active
                            ? "linear-gradient(135deg, var(--primary), #166534)"
                            : "var(--bg-card)",
                          color: active ? "#ffffff" : "var(--text-muted)",
                          fontWeight: active ? 600 : 400,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          minWidth: 0,
                        }}
                      >
                        {l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                loading={saving}
                onClick={handleSave}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {saving ? "..." : t.save}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right column - Gamification */}
        <div className="lg:col-span-1 space-y-6">
              <Card hover={false} padding="1.5rem">
                <GamificationStats
                  parcelles={3}
                  cultures={5}
                  chatMessages={12}
                  daysActive={4}
                />
              </Card>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </ProtectedRoute>
  );
}
