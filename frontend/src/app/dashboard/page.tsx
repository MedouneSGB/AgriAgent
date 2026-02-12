"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Cloud,
  Sprout,
  ShoppingCart,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { getWeather, type WeatherData } from "@/lib/api";

const SenegalMap = dynamic(() => import("@/components/SenegalMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ height: 360, backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", color: "#6b7280" }}
    >
      Loading map...
    </div>
  ),
});

const CITIES = [
  "dakar", "kaolack", "saint-louis", "ziguinchor", "touba",
  "thies", "tambacounda", "kolda", "fatick", "louga",
];

const CROPS_DATA = [
  { name: "Peanut", nameWo: "Gerte", zone: "Bassin Arachidier", season: "Jun-Oct", price: "340-425 FCFA/kg", trend: "stable", bgColor: "#fef9c3", textColor: "#854d0e" },
  { name: "Millet", nameWo: "Dugub", zone: "Center, North", season: "Jun-Oct", price: "240-325 FCFA/kg", trend: "rising", bgColor: "#fef3c7", textColor: "#92400e" },
  { name: "Rice", nameWo: "Malo", zone: "Casamance, River", season: "Jun-Dec", price: "325-400 FCFA/kg", trend: "rising", bgColor: "#dcfce7", textColor: "#166534" },
  { name: "Corn", nameWo: "Mbaxal", zone: "Casamance, East", season: "Jun-Oct", price: "210-275 FCFA/kg", trend: "stable", bgColor: "#ffedd5", textColor: "#9a3412" },
  { name: "Cowpea", nameWo: "Niebe", zone: "Center", season: "Jul-Oct", price: "425-550 FCFA/kg", trend: "rising", bgColor: "#fee2e2", textColor: "#991b1b" },
  { name: "Tomato", nameWo: "Tamaate", zone: "Niayes, River", season: "Oct-Apr", price: "350-500 FCFA/kg", trend: "volatile", bgColor: "#ffe4e6", textColor: "#9f1239" },
  { name: "Onion", nameWo: "Soble", zone: "Niayes, River", season: "Oct-Apr", price: "300-400 FCFA/kg", trend: "seasonal", bgColor: "#f3e8ff", textColor: "#6b21a8" },
];

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState("kaolack");
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
      setWeatherError("Unable to load weather. Check that the backend is running.");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchedRef.current = null;
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Dashboard</h1>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border rounded-lg px-4 py-2 font-medium"
          style={{ backgroundColor: "#ffffff", color: "#111827", borderColor: "#d1d5db" }}
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Senegal Map */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4" style={{ color: "#1e3a5f" }}>
          <MapPin className="w-5 h-5" style={{ color: "#dc2626" }} />
          Senegal - Select a City
        </h2>
        <SenegalMap selectedCity={selectedCity} onCitySelect={setSelectedCity} />
      </section>

      {/* Weather Section */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4" style={{ color: "#1e3a5f" }}>
          <Cloud className="w-5 h-5" style={{ color: "#3b82f6" }} />
          Weather - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
        </h2>

        {weatherLoading && (
          <div
            className="rounded-xl p-8 text-center"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", color: "#6b7280" }}
          >
            Loading weather data...
          </div>
        )}

        {weatherError && (
          <div
            className="rounded-xl p-4 text-sm"
            style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}
          >
            {weatherError}
          </div>
        )}

        {weather && !weatherLoading && (
          <div className="space-y-4">
            {/* Current weather */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
              >
                <div className="flex items-center gap-2 text-sm mb-1" style={{ color: "#bfdbfe" }}>
                  <Thermometer className="w-4 h-4" />
                  Current Temperature
                </div>
                <div className="text-3xl font-bold" style={{ color: "#ffffff" }}>
                  {weather.current.temperature}°C
                </div>
              </div>
              <div
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
              >
                <div className="flex items-center gap-2 text-sm mb-1" style={{ color: "#cffafe" }}>
                  <Droplets className="w-4 h-4" />
                  Rain (7 days)
                </div>
                <div className="text-3xl font-bold" style={{ color: "#ffffff" }}>
                  {weather.summary.total_precipitation_mm} mm
                </div>
                <div className="text-sm" style={{ color: "#cffafe" }}>
                  {weather.summary.rain_days} rain day(s)
                </div>
              </div>
              <div
                className="rounded-xl p-5"
                style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)" }}
              >
                <div className="flex items-center gap-2 text-sm mb-1" style={{ color: "#ccfbf1" }}>
                  <Wind className="w-4 h-4" />
                  Wind
                </div>
                <div className="text-3xl font-bold" style={{ color: "#ffffff" }}>
                  {weather.current.windspeed} km/h
                </div>
              </div>
            </div>

            {/* 7 day forecast */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
              <div
                className="px-5 py-3 font-medium text-sm"
                style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", color: "#374151" }}
              >
                7-Day Forecast
              </div>
              <div>
                {weather.forecast.map((day, idx) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between px-5 py-3 text-sm"
                    style={{ borderTop: idx > 0 ? "1px solid #f3f4f6" : "none" }}
                  >
                    <div className="w-24 font-medium" style={{ color: "#374151" }}>
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium" style={{ color: "#2563eb" }}>
                        {day.temp_min}°
                      </span>
                      <div className="w-20 rounded-full h-2" style={{ backgroundColor: "#e5e7eb" }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            background: "linear-gradient(to right, #60a5fa, #f87171)",
                            width: `${((day.temp_max - 15) / 30) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium" style={{ color: "#dc2626" }}>
                        {day.temp_max}°
                      </span>
                    </div>
                    <div className="flex items-center gap-1 w-20 justify-end">
                      <Droplets className="w-3 h-3" style={{ color: "#60a5fa" }} />
                      <span
                        style={{
                          color: day.precipitation_mm > 0 ? "#2563eb" : "#9ca3af",
                          fontWeight: day.precipitation_mm > 0 ? 500 : 400,
                        }}
                      >
                        {day.precipitation_mm} mm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Crops & Markets */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4" style={{ color: "#1e3a5f" }}>
          <ShoppingCart className="w-5 h-5" style={{ color: "#eab308" }} />
          Crops & Market Prices
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CROPS_DATA.map((crop) => (
            <div
              key={crop.name}
              className="rounded-xl p-4 hover:shadow-md transition-shadow"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold" style={{ color: "#111827" }}>{crop.name}</h3>
                  <p className="text-xs" style={{ color: "#92400e" }}>{crop.nameWo}</p>
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: crop.bgColor, color: crop.textColor }}
                >
                  {crop.trend}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2" style={{ color: "#4b5563" }}>
                  <MapPin className="w-3 h-3" />
                  {crop.zone}
                </div>
                <div className="flex items-center gap-2" style={{ color: "#4b5563" }}>
                  <Sprout className="w-3 h-3" />
                  {crop.season}
                </div>
                <div className="flex items-center gap-2 font-medium" style={{ color: "#166534" }}>
                  <TrendingUp className="w-3 h-3" />
                  {crop.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Status */}
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#1e3a5f" }}>
          AI Agents - Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { name: "Orchestrator", desc: "Routes & synthesizes", icon: "🎯", bgColor: "#f0fdf4", borderColor: "#bbf7d0" },
            { name: "Weather Agent", desc: "Open-Meteo API", icon: "🌤️", bgColor: "#eff6ff", borderColor: "#bfdbfe" },
            { name: "Agro Agent", desc: "Knowledge base", icon: "🌱", bgColor: "#ecfdf5", borderColor: "#a7f3d0" },
            { name: "Market Agent", desc: "Real-time prices", icon: "📊", bgColor: "#fefce8", borderColor: "#fde68a" },
          ].map((agent) => (
            <div
              key={agent.name}
              className="rounded-xl p-4"
              style={{ backgroundColor: agent.bgColor, border: `1px solid ${agent.borderColor}` }}
            >
              <div className="text-2xl mb-2">{agent.icon}</div>
              <div className="font-semibold text-sm" style={{ color: "#111827" }}>
                {agent.name}
              </div>
              <div className="text-xs mt-1" style={{ color: "#6b7280" }}>{agent.desc}</div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                <span className="text-xs" style={{ color: "#166534" }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
