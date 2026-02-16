"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Cloud,
  Globe,
  Sprout,
  ShoppingCart,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { getWeather, type WeatherData } from "@/lib/api";
import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Badge from "@/components/ui/Badge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import QuickInsightsWidget from "@/components/QuickInsightsWidget";
import { useLanguage } from "@/context/LanguageContext";
import { COUNTRIES, GLOBAL_CROPS, getAllCityKeys, getCountryByCity, type CountryAgriData } from "@/data/worldAgriculture";

const DT = {
  en: {
    title: "Dashboard",
    subtitle: "Global agricultural intelligence",
    countries: "countries",
    loadingMap: "Loading world map...",
    mapTitle: "World Map — Select a Country & City",
    weather: "Weather",
    currentTemp: "Current Temperature",
    rain7: "Rain (7 days)",
    rainDays: "rain day(s)",
    wind: "Wind",
    forecast: "7-Day Forecast",
    weatherError: "Unable to load weather. Check that the backend is running.",
    cropsTitle: "Global Crops & Market Prices",
    agentsTitle: "AI Agents - Status",
    active: "Active",
    orchName: "Orchestrator", orchDesc: "Routes & synthesizes",
    weatherAgent: "Weather Agent", weatherDesc: "Open-Meteo API",
    agroAgent: "Agro Agent", agroDesc: "Knowledge base",
    marketAgent: "Market Agent", marketDesc: "Real-time prices",
  },
  fr: {
    title: "Tableau de bord",
    subtitle: "Intelligence agricole mondiale",
    countries: "pays",
    loadingMap: "Chargement de la carte...",
    mapTitle: "Carte du monde — S\u00e9lectionnez un pays & une ville",
    weather: "M\u00e9t\u00e9o",
    currentTemp: "Temp\u00e9rature actuelle",
    rain7: "Pluie (7 jours)",
    rainDays: "jour(s) de pluie",
    wind: "Vent",
    forecast: "Pr\u00e9visions 7 jours",
    weatherError: "Impossible de charger la m\u00e9t\u00e9o. V\u00e9rifiez que le backend fonctionne.",
    cropsTitle: "Cultures mondiales & Prix du march\u00e9",
    agentsTitle: "Agents IA - Statut",
    active: "Actif",
    orchName: "Orchestrateur", orchDesc: "Route & synth\u00e9tise",
    weatherAgent: "Agent M\u00e9t\u00e9o", weatherDesc: "API Open-Meteo",
    agroAgent: "Agent Agro", agroDesc: "Base de connaissances",
    marketAgent: "Agent March\u00e9", marketDesc: "Prix en temps r\u00e9el",
  },
  wo: {
    title: "Tablo bord",
    subtitle: "Xam-xam tool ci \u00e0dduna bi",
    countries: "r\u00e9ew",
    loadingMap: "Yegsi kaart bi...",
    mapTitle: "Kaart \u00c0dduna bi — Tann r\u00e9ew ak d\u00ebkk",
    weather: "Asamaan",
    currentTemp: "Tangaay tey",
    rain7: "Taw (7 fan)",
    rainDays: "fan(yi) ci taw",
    wind: "Ngelaw",
    forecast: "W\u00e0llu 7 fan",
    weatherError: "Mun naa waccee asamaan bi. Saytul backend bi.",
    cropsTitle: "Tool yi ak Nj\u00ebg March\u00e9",
    agentsTitle: "Agent IA yi - Statut",
    active: "Aktif",
    orchName: "Orchestrateur", orchDesc: "Yobbante & sedd",
    weatherAgent: "Agent Asamaan", weatherDesc: "API Open-Meteo",
    agroAgent: "Agent Agro", agroDesc: "Xam-xam bu mag",
    marketAgent: "Agent March\u00e9", marketDesc: "Nj\u00ebg ci waxtu",
  },
};

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ height: 420, backgroundColor: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
    >
      ...
    </div>
  ),
});

const CountryInfoPanel = dynamic(
  () => import("@/components/WorldMap").then(mod => ({ default: mod.CountryInfoPanel })),
  { ssr: false }
);

const CROPS_DATA = [
  { name: "Rice", emoji: "🌾", zone: "Asia, W. Africa", season: "Year-round", price: "~$0.40/kg", trend: "stable", bgColor: "#dcfce7", textColor: "#166534" },
  { name: "Wheat", emoji: "🌾", zone: "Europe, N. America, Asia", season: "Oct-Jul", price: "~$0.30/kg", trend: "rising", bgColor: "#fef3c7", textColor: "#92400e" },
  { name: "Corn", emoji: "🌽", zone: "Americas, Africa", season: "Apr-Oct", price: "~$0.25/kg", trend: "stable", bgColor: "#ffedd5", textColor: "#9a3412" },
  { name: "Soybean", emoji: "🫘", zone: "Brazil, US, Argentina", season: "Oct-Mar", price: "~$0.55/kg", trend: "rising", bgColor: "#fef9c3", textColor: "#854d0e" },
  { name: "Coffee", emoji: "☕", zone: "Brazil, Ethiopia, Colombia", season: "Year-round", price: "~$5.50/kg", trend: "volatile", bgColor: "#f3e8ff", textColor: "#6b21a8" },
  { name: "Peanut", emoji: "🥜", zone: "Senegal, India, China", season: "Jun-Oct", price: "~$1.10/kg", trend: "stable", bgColor: "#fef9c3", textColor: "#854d0e" },
  { name: "Cocoa", emoji: "🍫", zone: "Côte d'Ivoire, Ghana", season: "Oct-Mar", price: "~$3.20/kg", trend: "rising", bgColor: "#fee2e2", textColor: "#991b1b" },
  { name: "Palm Oil", emoji: "🌴", zone: "Indonesia, Malaysia", season: "Year-round", price: "~$0.90/kg", trend: "volatile", bgColor: "#ffe4e6", textColor: "#9f1239" },
  { name: "Sugarcane", emoji: "🎋", zone: "Brazil, India, Thailand", season: "Year-round", price: "~$0.04/kg", trend: "stable", bgColor: "#dcfce7", textColor: "#166534" },
  { name: "Olive", emoji: "🫒", zone: "Spain, Morocco, Italy", season: "Oct-Feb", price: "~$3.00/kg", trend: "seasonal", bgColor: "#ecfdf5", textColor: "#065f46" },
  { name: "Tea", emoji: "🍵", zone: "China, India, Kenya", season: "Year-round", price: "~$2.80/kg", trend: "stable", bgColor: "#dcfce7", textColor: "#166534" },
  { name: "Millet", emoji: "🌾", zone: "Sahel, India", season: "Jun-Oct", price: "~$0.35/kg", trend: "rising", bgColor: "#fef3c7", textColor: "#92400e" },
];

const TREND_BADGE_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "neutral" | "gold"> = {
  stable: "neutral",
  rising: "success",
  volatile: "danger",
  seasonal: "info",
};

export default function DashboardPage() {
  const { language } = useLanguage();
  const dt = DT[language] || DT.fr;
  const [selectedCity, setSelectedCity] = useState("dakar");
  const [selectedCountry, setSelectedCountry] = useState("SN");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const fetchedRef = useRef<string | null>(null);

  const loadWeather = useCallback(async (city: string) => {
    if (fetchedRef.current === city) return;
    fetchedRef.current = city;
    setWeatherLoading(true);
    setWeatherError("");
    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch {
      setWeatherError(dt.weatherError);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchedRef.current = null;
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Header row with city selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              {dt.title}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {dt.subtitle} — {COUNTRIES.length} {dt.countries}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                const country = COUNTRIES.find(c => c.code === e.target.value);
                if (country && country.cities.length > 0) setSelectedCity(country.cities[0].key);
              }}
              className="border rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 flex-1 min-w-0 sm:flex-initial"
              style={{ backgroundColor: "var(--bg-card)", color: "var(--text)", borderColor: "var(--border)" }}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 flex-1 min-w-0 sm:flex-initial"
              style={{ backgroundColor: "var(--bg-card)", color: "var(--text)", borderColor: "var(--border)" }}
            >
              {COUNTRIES.find(c => c.code === selectedCountry)?.cities.map((city) => (
                <option key={city.key} value={city.key}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Insights Widget */}
        <ScrollReveal>
          <Card hover={false} padding="1.5rem">
            <QuickInsightsWidget />
          </Card>
        </ScrollReveal>

        {/* World Map */}
        <ScrollReveal>
          <section>
            <SectionHeader
              title={dt.mapTitle}
              icon={Globe}
              iconColor="#3b82f6"
              stripe
            />
            <WorldMap
              selectedCity={selectedCity}
              onCitySelect={(city) => {
                setSelectedCity(city);
                const country = getCountryByCity(city);
                if (country) setSelectedCountry(country.code);
              }}
              selectedCountry={selectedCountry}
              onCountrySelect={(code) => {
                setSelectedCountry(code);
                const country = COUNTRIES.find(c => c.code === code);
                if (country && country.cities.length > 0) setSelectedCity(country.cities[0].key);
              }}
            />
            <CountryInfoPanel countryCode={selectedCountry} />
          </section>
        </ScrollReveal>

        {/* Weather Section */}
        <ScrollReveal delay={0.05}>
          <section>
            <SectionHeader
              title={`${dt.weather} - ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`}
              icon={Cloud}
              iconColor="#3b82f6"
              stripe
            />

            {weatherLoading && (
              <Card hover={false} padding="2rem">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <LoadingSkeleton variant="card" height="110px" />
                    <LoadingSkeleton variant="card" height="110px" />
                    <LoadingSkeleton variant="card" height="110px" />
                  </div>
                  <LoadingSkeleton variant="table-row" count={7} />
                </div>
              </Card>
            )}

            {weatherError && (
              <Card
                hover={false}
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <p className="text-sm" style={{ color: "#b91c1c" }}>
                  {weatherError}
                </p>
              </Card>
            )}

            {weather && !weatherLoading && (
              <div className="space-y-4">
                {/* Current weather cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ScrollReveal delay={0.0}>
                    <Card
                      hover={true}
                      padding="1.25rem"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        border: "none",
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm mb-1" style={{ color: "#bfdbfe" }}>
                        <Thermometer className="w-4 h-4" />
                        {dt.currentTemp}
                      </div>
                      <div className="text-3xl font-bold" style={{ color: "#ffffff" }}>
                        <AnimatedCounter
                          value={weather.current.temperature}
                          suffix="\u00B0C"
                          decimals={1}
                          style={{ color: "#ffffff" }}
                        />
                      </div>
                    </Card>
                  </ScrollReveal>

                  <ScrollReveal delay={0.08}>
                    <Card
                      hover={true}
                      padding="1.25rem"
                      style={{
                        background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                        border: "none",
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm mb-1" style={{ color: "#cffafe" }}>
                        <Droplets className="w-4 h-4" />
                        {dt.rain7}
                      </div>
                      <div className="text-3xl font-bold" style={{ color: "#ffffff" }}>
                        <AnimatedCounter
                          value={weather.summary.total_precipitation_mm}
                          suffix=" mm"
                          decimals={1}
                          style={{ color: "#ffffff" }}
                        />
                      </div>
                      <div className="text-sm" style={{ color: "#cffafe" }}>
                        {weather.summary.rain_days} {dt.rainDays}
                      </div>
                    </Card>
                  </ScrollReveal>

                  <ScrollReveal delay={0.16}>
                    <Card
                      hover={true}
                      padding="1.25rem"
                      style={{
                        background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                        border: "none",
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm mb-1" style={{ color: "#ccfbf1" }}>
                        <Wind className="w-4 h-4" />
                        {dt.wind}
                      </div>
                      <div className="text-3xl font-bold" style={{ color: "#ffffff" }}>
                        <AnimatedCounter
                          value={weather.current.windspeed}
                          suffix=" km/h"
                          decimals={1}
                          style={{ color: "#ffffff" }}
                        />
                      </div>
                    </Card>
                  </ScrollReveal>
                </div>

                {/* 7 day forecast */}
                <ScrollReveal delay={0.1}>
                  <Card hover={false} padding="0">
                    <div
                      className="px-5 py-3 font-medium text-sm"
                      style={{
                        backgroundColor: "var(--bg)",
                        borderBottom: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                      }}
                    >
                      {dt.forecast}
                    </div>
                    <div>
                      {weather.forecast.map((day, idx) => (
                        <div
                          key={day.date}
                          className="flex items-center justify-between px-5 py-3 text-sm transition-colors"
                          style={{
                            borderTop: idx > 0 ? "1px solid var(--border-light)" : "none",
                            cursor: "default",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-hover)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          }}
                        >
                          <div className="w-24 font-medium" style={{ color: "var(--text-secondary)" }}>
                            {new Date(day.date).toLocaleDateString(language === "fr" || language === "wo" ? "fr-FR" : "en-US", {
                              weekday: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium" style={{ color: "#2563eb" }}>
                              {day.temp_min}&deg;
                            </span>
                            <div className="w-20 rounded-full h-2" style={{ backgroundColor: "var(--border)" }}>
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  background: "linear-gradient(to right, #60a5fa, #f87171)",
                                  width: `${((day.temp_max - 15) / 30) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="font-medium" style={{ color: "#dc2626" }}>
                              {day.temp_max}&deg;
                            </span>
                          </div>
                          <div className="flex items-center gap-1 w-20 justify-end">
                            <Droplets className="w-3 h-3" style={{ color: "#60a5fa" }} />
                            <span
                              style={{
                                color: day.precipitation_mm > 0 ? "#2563eb" : "var(--text-muted)",
                                fontWeight: day.precipitation_mm > 0 ? 500 : 400,
                              }}
                            >
                              {day.precipitation_mm} mm
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </ScrollReveal>
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* Crops & Markets */}
        <ScrollReveal delay={0.05}>
          <section>
            <SectionHeader
              title={dt.cropsTitle}
              icon={ShoppingCart}
              iconColor="#eab308"
              stripe
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {CROPS_DATA.map((crop, idx) => (
                <ScrollReveal key={crop.name} delay={idx * 0.04}>
                  <Card
                    hover={true}
                    padding="0"
                    style={{
                      borderLeft: `4px solid ${crop.textColor}`,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "1rem 1rem 1rem 0.85rem" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold" style={{ color: "var(--text)" }}>
                            {crop.emoji} {crop.name}
                          </h3>
                        </div>
                        <Badge variant={TREND_BADGE_VARIANT[crop.trend] || "neutral"}>
                          {crop.trend}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                          <MapPin className="w-3 h-3" />
                          {crop.zone}
                        </div>
                        <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                          <Sprout className="w-3 h-3" />
                          {crop.season}
                        </div>
                        <div className="flex items-center gap-2 font-medium" style={{ color: "#166534" }}>
                          <TrendingUp className="w-3 h-3" />
                          {crop.price}
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Agent Status */}
        <ScrollReveal delay={0.05}>
          <section>
            <SectionHeader
              title={dt.agentsTitle}
              stripe
            />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { name: dt.orchName, desc: dt.orchDesc, icon: "\uD83C\uDFAF", bgColor: "#f0fdf4", borderColor: "#bbf7d0" },
                { name: dt.weatherAgent, desc: dt.weatherDesc, icon: "\uD83C\uDF24\uFE0F", bgColor: "#eff6ff", borderColor: "#bfdbfe" },
                { name: dt.agroAgent, desc: dt.agroDesc, icon: "\uD83C\uDF31", bgColor: "#ecfdf5", borderColor: "#a7f3d0" },
                { name: dt.marketAgent, desc: dt.marketDesc, icon: "\uD83D\uDCCA", bgColor: "#fefce8", borderColor: "#fde68a" },
              ].map((agent, idx) => (
                <ScrollReveal key={agent.name} delay={idx * 0.06}>
                  <Card
                    hover={true}
                    style={{
                      backgroundColor: agent.bgColor,
                      border: `1px solid ${agent.borderColor}`,
                    }}
                  >
                    <div className="text-2xl mb-2">{agent.icon}</div>
                    <div className="font-semibold text-sm" style={{ color: "#111827" }}>
                      {agent.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#6b7280" }}>
                      {agent.desc}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse-dot"
                        style={{ backgroundColor: "#22c55e" }}
                      />
                      <span className="text-xs font-medium" style={{ color: "#166534" }}>
                        {dt.active}
                      </span>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </AnimatedPage>
  );
}
