"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sprout,
  MessageSquare,
  LayoutDashboard,
  Menu,
  X,
  CalendarDays,
  Map,
  LogOut,
  UserCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const publicLinks = [
  { href: "/", label: "Home", labelFr: "Accueil", labelWo: "Kër", icon: Sprout },
  { href: "/dashboard", label: "Dashboard", labelFr: "Tableau", labelWo: "Tablo", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", labelFr: "Calendrier", labelWo: "Kadur", icon: CalendarDays },
  { href: "/chat", label: "Chat", labelFr: "Chat", labelWo: "Waxtaan", icon: MessageSquare },
];

const authLinks = [
  { href: "/parcelles", label: "My Fields", labelFr: "Parcelles", labelWo: "Tool yi", icon: Map },
];

const LANG_OPTIONS: Array<{ key: Language; label: string }> = [
  { key: "en", label: "EN" },
  { key: "fr", label: "FR" },
  { key: "wo", label: "WO" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const { dark, toggle } = useTheme();

  const allLinks = user ? [...publicLinks, ...authLinks] : publicLinks;

  // Helper function to get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const linkLabel = (link: { label: string; labelFr: string; labelWo: string }) =>
    language === "wo" ? link.labelWo : language === "fr" ? link.labelFr : link.label;

  return (
    <nav
      className={scrolled ? "glass-nav" : ""}
      style={{
        backgroundColor: scrolled ? undefined : "#14532d",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "background-color 0.3s, backdrop-filter 0.3s",
      }}
    >
      {/* Global stripe */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #166534 33%, #d97706 33% 66%, #a0522d 66%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
            style={{ color: "#ffffff", textDecoration: "none" }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sprout className="w-7 h-7" />
            </motion.div>
            <span style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}>
              Agri<span style={{ color: "#fbbf24" }}>Agent</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {allLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                  style={{
                    position: "relative",
                    backgroundColor: "transparent",
                    color: active ? "#ffffff" : "#d1fae5",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {linkLabel(link)}
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60%",
                        height: 2,
                        backgroundColor: "#fbbf24",
                        borderRadius: 1,
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLanguage(opt.key)}
                  className="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    backgroundColor: language === opt.key
                      ? "rgba(251, 191, 36, 0.9)"
                      : "transparent",
                    color: language === opt.key ? "#1a1a1a" : "#d1fae5",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Dark mode toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              className="p-2 rounded-lg cursor-pointer"
              style={{
                color: "#d1fae5",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
              }}
              title={dark ? "Light mode" : "Dark mode"}
            >
              <motion.div
                key={dark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </motion.button>

            {/* Auth */}
            {!loading &&
              (user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      color: "#d1fae5",
                      backgroundColor: pathname === "/profile" ? "rgba(255,255,255,0.1)" : "transparent",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #fbbf24, #d97706)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#1a1a1a",
                      }}
                    >
                      {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </div>
                    <span className="max-w-[80px] truncate text-sm">
                      {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : user.email?.split("@")[0]}
                    </span>
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSignOut}
                    className="p-2 rounded-lg cursor-pointer"
                    style={{ color: "#fca5a5", background: "none", border: "none" }}
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #d97706)",
                    color: "#1a1a1a",
                    textDecoration: "none",
                  }}
                >
                  {language === "fr" ? "Connexion" : language === "wo" ? "Dugg" : "Login"}
                </Link>
              ))}
          </div>

          {/* Mobile toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2"
            style={{ color: "#ffffff", background: "none", border: "none" }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-1">
              {allLinks.map((link, i) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                        color: active ? "#ffffff" : "#d1fae5",
                        textDecoration: "none",
                        borderLeft: active ? "3px solid #fbbf24" : "3px solid transparent",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {linkLabel(link)}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile auth */}
              {!loading &&
                (user ? (
                  <div className="flex items-center gap-2 px-4 pt-2">
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#d1fae5", textDecoration: "none" }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #fbbf24, #d97706)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#1a1a1a",
                        }}
                      >
                        {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </div>
                      {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : user.email?.split("@")[0]}
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setOpen(false); }}
                      className="ml-auto cursor-pointer"
                      style={{ color: "#fca5a5", background: "none", border: "none" }}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-semibold text-center"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #d97706)",
                      color: "#1a1a1a",
                      textDecoration: "none",
                    }}
                  >
                    {language === "fr" ? "Connexion" : language === "wo" ? "Dugg" : "Login"}
                  </Link>
                ))}

              {/* Mobile bottom row: language + dark toggle */}
              <div className="flex items-center gap-1 px-4 pt-2">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setLanguage(opt.key)}
                    className="px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      backgroundColor: language === opt.key
                        ? "rgba(251, 191, 36, 0.9)"
                        : "transparent",
                      color: language === opt.key ? "#1a1a1a" : "#d1fae5",
                      border: "none",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={toggle}
                  className="ml-auto p-2 rounded-lg cursor-pointer"
                  style={{
                    color: "#d1fae5",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "none",
                  }}
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
