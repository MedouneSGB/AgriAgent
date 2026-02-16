"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRIES, CONTINENT_COLORS, type CountryAgriData } from "@/data/worldAgriculture";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function createCityIcon(isSelected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: ${isSelected ? 16 : 10}px;
      height: ${isSelected ? 16 : 10}px;
      background: ${isSelected ? "#dc2626" : "#166534"};
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: all 0.2s;
    "></div>`,
    iconSize: [isSelected ? 16 : 10, isSelected ? 16 : 10],
    iconAnchor: [isSelected ? 8 : 5, isSelected ? 8 : 5],
  });
}

interface WorldMapProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
  selectedCountry?: string;
  onCountrySelect?: (countryCode: string) => void;
  mode?: "cities" | "countries";
}

export default function WorldMap({
  selectedCity,
  onCitySelect,
  selectedCountry,
  onCountrySelect,
  mode = "countries",
}: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", height: 420 }}>
      <MapContainer
        center={[20, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Country circles with dominant crops */}
        {mode === "countries" && COUNTRIES.map((country) => {
          const isSelected = selectedCountry === country.code;
          const isHovered = hoveredCountry === country.code;
          const color = CONTINENT_COLORS[country.continent] || "#6b7280";
          const radius = isSelected ? 18 : isHovered ? 14 : 10;

          return (
            <CircleMarker
              key={country.code}
              center={[country.lat, country.lon]}
              radius={radius}
              pathOptions={{
                color: isSelected ? "#ffffff" : color,
                fillColor: color,
                fillOpacity: isSelected ? 0.95 : 0.7,
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onCountrySelect?.(country.code),
                mouseover: () => setHoveredCountry(country.code),
                mouseout: () => setHoveredCountry(null),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} permanent={isSelected}>
                <div style={{ textAlign: "center", minWidth: 140 }}>
                  <strong style={{ fontSize: 13 }}>{country.name}</strong>
                  <br />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>
                    {country.dominantCrops.slice(0, 3).join(", ")}
                  </span>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* City markers (when a country is selected or mode=cities) */}
        {(mode === "cities" || selectedCountry) &&
          COUNTRIES
            .filter(c => mode === "cities" || c.code === selectedCountry)
            .flatMap(c => c.cities)
            .map((city) => (
              <Marker
                key={city.key}
                position={[city.lat, city.lon]}
                icon={createCityIcon(selectedCity === city.key)}
                eventHandlers={{
                  click: () => onCitySelect(city.key),
                }}
              >
                <Popup>
                  <div style={{ textAlign: "center", minWidth: 100 }}>
                    <strong style={{ fontSize: 14 }}>{city.name}</strong>
                    <br />
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{city.region}</span>
                  </div>
                </Popup>
              </Marker>
            ))
        }
      </MapContainer>
    </div>
  );
}

// ===== Country Info Panel =====

export function CountryInfoPanel({ countryCode }: { countryCode: string }) {
  const country = COUNTRIES.find(c => c.code === countryCode);
  if (!country) return null;

  const continentColor = CONTINENT_COLORS[country.continent] || "#6b7280";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={countryCode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "1.25rem",
          marginTop: "1rem",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: `${continentColor}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            {country.code === "SN" ? "🇸🇳" :
             country.code === "FR" ? "🇫🇷" :
             country.code === "US" ? "🇺🇸" :
             country.code === "BR" ? "🇧🇷" :
             country.code === "IN" ? "🇮🇳" :
             country.code === "CN" ? "🇨🇳" :
             country.code === "NG" ? "🇳🇬" :
             country.code === "KE" ? "🇰🇪" :
             country.code === "MA" ? "🇲🇦" :
             country.code === "EG" ? "🇪🇬" :
             country.code === "AR" ? "🇦🇷" :
             country.code === "AU" ? "🇦🇺" :
             country.code === "ES" ? "🇪🇸" :
             country.code === "UA" ? "🇺🇦" :
             country.code === "MX" ? "🇲🇽" :
             country.code === "ID" ? "🇮🇩" :
             country.code === "TH" ? "🇹🇭" :
             country.code === "CI" ? "🇨🇮" :
             country.code === "ET" ? "🇪🇹" :
             "🌍"}
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>{country.name}</h3>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {country.continent} · {country.climate} · {country.currency}
            </div>
          </div>
        </div>

        {/* Dominant Crops */}
        <div className="mb-3">
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            DOMINANT CROPS
          </div>
          <div className="flex flex-wrap gap-2">
            {country.dominantCrops.map(crop => (
              <span
                key={crop}
                className="px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${continentColor}15`,
                  color: continentColor,
                  border: `1px solid ${continentColor}30`,
                }}
              >
                {crop}
              </span>
            ))}
          </div>
        </div>

        {/* Zones */}
        <div className="mb-3">
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            AGRO-ECOLOGICAL ZONES
          </div>
          <div className="space-y-1.5">
            {country.zones.map(zone => (
              <div
                key={zone.key}
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: continentColor,
                    flexShrink: 0,
                  }}
                />
                <span className="font-medium">{zone.label}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  ({zone.crops.join(", ")})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cities */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            MAJOR CITIES
          </div>
          <div className="flex flex-wrap gap-2">
            {country.cities.map(city => (
              <span
                key={city.key}
                className="px-2 py-1 rounded-md text-xs"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--text-secondary)",
                }}
              >
                📍 {city.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
