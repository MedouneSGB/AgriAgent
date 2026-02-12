"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CITIES: Array<{
  name: string;
  key: string;
  lat: number;
  lon: number;
  region: string;
}> = [
  { name: "Dakar", key: "dakar", lat: 14.6928, lon: -17.4467, region: "Dakar" },
  { name: "Thiès", key: "thies", lat: 14.7886, lon: -16.926, region: "Thiès" },
  { name: "Kaolack", key: "kaolack", lat: 14.152, lon: -16.0726, region: "Kaolack" },
  { name: "Saint-Louis", key: "saint-louis", lat: 16.0326, lon: -16.4818, region: "Saint-Louis" },
  { name: "Ziguinchor", key: "ziguinchor", lat: 12.5681, lon: -16.2719, region: "Ziguinchor" },
  { name: "Touba", key: "touba", lat: 14.85, lon: -15.8833, region: "Diourbel" },
  { name: "Tambacounda", key: "tambacounda", lat: 13.7709, lon: -13.6673, region: "Tambacounda" },
  { name: "Kolda", key: "kolda", lat: 12.8835, lon: -14.95, region: "Kolda" },
  { name: "Fatick", key: "fatick", lat: 14.339, lon: -16.4041, region: "Fatick" },
  { name: "Louga", key: "louga", lat: 15.6144, lon: -16.2281, region: "Louga" },
];

function createIcon(isSelected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: ${isSelected ? 18 : 12}px;
      height: ${isSelected ? 18 : 12}px;
      background: ${isSelected ? "#dc2626" : "#166534"};
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [isSelected ? 18 : 12, isSelected ? 18 : 12],
    iconAnchor: [isSelected ? 9 : 6, isSelected ? 9 : 6],
  });
}

interface SenegalMapProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
}

export default function SenegalMap({ selectedCity, onCitySelect }: SenegalMapProps) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", height: 360 }}>
      <MapContainer
        center={[14.5, -15.0]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {CITIES.map((city) => (
          <Marker
            key={city.key}
            position={[city.lat, city.lon]}
            icon={createIcon(selectedCity === city.key)}
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
        ))}
      </MapContainer>
    </div>
  );
}
