"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, MessageSquare, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage, type Language } from "@/context/LanguageContext";

const navLinks = [
  { href: "/", label: "Home", icon: Sprout },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
];

const LANG_OPTIONS: Array<{ key: Language; label: string; color: string }> = [
  { key: "en", label: "EN", color: "#2563eb" },
  { key: "fr", label: "FR", color: "#166534" },
  { key: "wo", label: "Wolof", color: "#d97706" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <nav style={{ backgroundColor: "#14532d" }} className="shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: "#ffffff" }}>
            <Sprout className="w-7 h-7" />
            <span>AgriAgent SN</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: active ? "#166534" : "transparent",
                    color: active ? "#ffffff" : "#d1fae5",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Language buttons */}
          <div className="hidden md:flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLanguage(opt.key)}
                className="px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: language === opt.key ? opt.color : "transparent",
                  color: language === opt.key ? "#ffffff" : "#d1fae5",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            style={{ color: "#ffffff" }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: active ? "#166534" : "transparent",
                  color: active ? "#ffffff" : "#d1fae5",
                }}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          {/* Mobile language buttons */}
          <div className="flex items-center gap-1 px-4 pt-2">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLanguage(opt.key)}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: language === opt.key ? opt.color : "transparent",
                  color: language === opt.key ? "#ffffff" : "#d1fae5",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
