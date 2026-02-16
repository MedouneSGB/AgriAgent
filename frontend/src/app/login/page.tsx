"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Sprout, Mail, Lock } from "lucide-react";
import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const T = {
  en: {
    title: "Sign In",
    subtitle: "Access your farm dashboard",
    email: "Email",
    password: "Password",
    submit: "Sign In",
    noAccount: "No account?",
    signUp: "Create one",
    loading: "Signing in...",
  },
  fr: {
    title: "Connexion",
    subtitle: "Acc\u00e9dez \u00e0 votre tableau de bord agricole",
    email: "Email",
    password: "Mot de passe",
    submit: "Se connecter",
    noAccount: "Pas de compte ?",
    signUp: "Cr\u00e9er un compte",
    loading: "Connexion...",
  },
  wo: {
    title: "Dugg",
    subtitle: "Jot sa tablo bord tool",
    email: "Email",
    password: "Baatu jaam",
    submit: "Dugg",
    noAccount: "Amoo compte ?",
    signUp: "Sos benn",
    loading: "Yegsi...",
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = T[language] || T.fr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AnimatedPage>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* ── Left decorative panel (desktop only) ── */}
        <div
          className="hidden md:flex"
          style={{
            width: "45%",
            minHeight: "100vh",
            background: "linear-gradient(160deg, #166534 0%, #16a34a 50%, #15803d 100%)",
            position: "relative",
            overflow: "hidden",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
          }}
        >
          {/* Pattern-wax overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.08,
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #fff 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #fff 2px, transparent 2px),
                radial-gradient(circle at 50% 50%, #fff 1.5px, transparent 1.5px),
                radial-gradient(circle at 25% 75%, #fff 1px, transparent 1px),
                radial-gradient(circle at 75% 25%, #fff 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px, 60px 60px, 30px 30px, 40px 40px, 40px 40px",
              backgroundPosition: "0 0, 30px 30px, 15px 15px, 10px 10px, 50px 50px",
            }}
          />
          {/* Diagonal wax lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  rgba(255,255,255,0.3) 20px,
                  rgba(255,255,255,0.3) 22px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 20px,
                  rgba(255,255,255,0.3) 20px,
                  rgba(255,255,255,0.3) 22px
                )
              `,
            }}
          />
          {/* Diamond wax shapes */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage: `
                linear-gradient(45deg, rgba(251,191,36,0.4) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(251,191,36,0.4) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(251,191,36,0.4) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(251,191,36,0.4) 75%)
              `,
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0",
            }}
          />

          {/* Branding content */}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Logo circle */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Sprout size={40} color="#ffffff" strokeWidth={1.8} />
            </div>

            {/* Brand name */}
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "0.5rem",
              }}
            >
              AgriAgent
            </h1>

            {/* International stripe */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 0,
                margin: "0.75rem auto 1.25rem",
                width: 100,
                height: 4,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div style={{ flex: 1, backgroundColor: "#22c55e" }} />
              <div style={{ flex: 1, backgroundColor: "#3b82f6" }} />
              <div style={{ flex: 1, backgroundColor: "#f59e0b" }} />
              <div style={{ flex: 1, backgroundColor: "#ef4444" }} />
              <div style={{ flex: 1, backgroundColor: "#8b5cf6" }} />
            </div>

            {/* Tagline */}
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1rem",
                lineHeight: 1.6,
                maxWidth: 280,
                margin: "0 auto",
              }}
            >
              {t.subtitle}
            </p>

            {/* Decorative bottom dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                marginTop: "2rem",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.3)" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#fbbf24", opacity: 0.8 }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.3)" }} />
            </div>
          </div>
        </div>

        {/* ── Right panel: form ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            backgroundColor: "var(--bg)",
            minHeight: "100vh",
          }}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            {/* Mobile compact header (hidden on desktop) */}
            <div
              className="flex md:hidden"
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #16a34a, #166534)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <Sprout size={26} color="#ffffff" strokeWidth={2} />
              </div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                AgriAgent
              </h2>
              {/* International stripe mobile */}
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  margin: "0.5rem 0 0",
                  width: 60,
                  height: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div style={{ flex: 1, backgroundColor: "#22c55e" }} />
                <div style={{ flex: 1, backgroundColor: "#3b82f6" }} />
                <div style={{ flex: 1, backgroundColor: "#f59e0b" }} />
                <div style={{ flex: 1, backgroundColor: "#ef4444" }} />
                <div style={{ flex: 1, backgroundColor: "#8b5cf6" }} />
              </div>
            </div>

            {/* Form card */}
            <Card
              variant="default"
              hover={false}
              padding="2rem"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              {/* Form header */}
              <div style={{ marginBottom: "1.75rem" }}>
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t.title}
                </h1>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                  }}
                >
                  {t.subtitle}
                </p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit}>
                {/* Error message */}
                {error && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(220, 38, 38, 0.08)",
                      color: "#dc2626",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "1.25rem",
                      fontSize: "0.8125rem",
                      border: "1px solid rgba(220, 38, 38, 0.15)",
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Email field */}
                <div style={{ marginBottom: "1rem" }}>
                  <Input
                    id="email"
                    type="email"
                    label={t.email}
                    icon={<Mail size={16} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                {/* Password field */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <Input
                    id="password"
                    type="password"
                    label={t.password}
                    icon={<Lock size={16} />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                    autoComplete="current-password"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  style={{
                    width: "100%",
                  }}
                >
                  {loading ? t.loading : t.submit}
                </Button>
              </form>

              {/* Sign up link */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                {t.noAccount}{" "}
                <Link
                  href="/signup"
                  style={{
                    color: "#16a34a",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {t.signUp}
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
