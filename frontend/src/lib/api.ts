import { createClient } from "@/lib/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8095/api";

// ─── Auth helpers ─────────────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    // not logged in
  }
  return {};
}

async function authFetch(url: string, options: RequestInit = {}) {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Chat ─────────────────────────────────────────────────────

export interface ChatResponse {
  response: string;
  language: string;
  agents_used: string[];
  metadata?: Record<string, unknown>;
}

export interface WeatherData {
  city: string;
  region: string;
  lat: number;
  lon: number;
  current: {
    temperature: number;
    windspeed: number;
    weather_code: number;
  };
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation_mm: number;
    wind_max_kmh: number;
    weather_code: number;
  }>;
  summary: {
    total_precipitation_mm: number;
    max_temperature: number;
    rain_days: number;
  };
}

export async function sendChat(
  message: string,
  city?: string,
  language?: string
): Promise<ChatResponse> {
  return authFetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, city, language }),
  });
}

export async function sendChatStream(
  message: string,
  city: string | undefined,
  language: string | undefined,
  onRouting: (agents: string[]) => void,
  onToken: (text: string) => void,
  onDone: (agentsUsed: string[], language: string) => void,
  onError: (error: string) => void
): Promise<void> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ message, city, language }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "routing") onRouting(data.agents);
          else if (data.type === "token") onToken(data.text);
          else if (data.type === "done")
            onDone(data.agents_used, data.language);
          else if (data.type === "error") onError(data.message);
        } catch {
          // ignore malformed SSE events
        }
      }
    }
  }
}

export interface DiagnoseResponse {
  diagnosis: string;
  language: string;
  agents_used: string[];
}

export async function diagnoseCrop(
  image: File,
  language: string
): Promise<DiagnoseResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("language", language);
  const res = await fetch(`${API_BASE}/diagnose`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getWeather(city: string): Promise<WeatherData> {
  const res = await fetch(`${API_BASE}/weather/${city}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getCrops(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/crops`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getMarkets(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/markets`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getZones(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/zones`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getCities(): Promise<
  Record<string, { lat: number; lon: number; region: string }>
> {
  const res = await fetch(`${API_BASE}/cities`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Profile ──────────────────────────────────────────────────

export async function fetchProfile() {
  return authFetch(`${API_BASE}/me`);
}

export async function updateProfile(data: Record<string, unknown>) {
  return authFetch(`${API_BASE}/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ─── Parcelles ────────────────────────────────────────────────

export interface Parcelle {
  id: string;
  name: string;
  surface_ha: number | null;
  zone: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  soil_type: string;
  notes: string;
  created_at: string;
  cultures?: Culture[];
}

export async function fetchParcelles(): Promise<Parcelle[]> {
  return authFetch(`${API_BASE}/parcelles`);
}

export async function fetchParcelle(id: string): Promise<Parcelle> {
  return authFetch(`${API_BASE}/parcelles/${id}`);
}

export async function createParcelle(
  data: Partial<Parcelle>
): Promise<Parcelle> {
  return authFetch(`${API_BASE}/parcelles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateParcelle(
  id: string,
  data: Partial<Parcelle>
): Promise<Parcelle> {
  return authFetch(`${API_BASE}/parcelles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteParcelle(id: string) {
  return authFetch(`${API_BASE}/parcelles/${id}`, { method: "DELETE" });
}

// ─── Cultures ─────────────────────────────────────────────────

export interface Culture {
  id: string;
  parcelle_id: string;
  crop_key: string;
  variety: string;
  status: string;
  planting_date: string | null;
  expected_harvest: string | null;
  actual_harvest_date: string | null;
  season: string;
  notes: string;
  created_at: string;
  history?: SeasonHistory[];
}

export async function fetchCultures(parcelleId?: string): Promise<Culture[]> {
  const url = parcelleId
    ? `${API_BASE}/cultures?parcelle_id=${parcelleId}`
    : `${API_BASE}/cultures`;
  return authFetch(url);
}

export async function fetchCulture(id: string): Promise<Culture> {
  return authFetch(`${API_BASE}/cultures/${id}`);
}

export async function createCulture(
  data: Partial<Culture>
): Promise<Culture> {
  return authFetch(`${API_BASE}/cultures`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCulture(
  id: string,
  data: Partial<Culture>
): Promise<Culture> {
  return authFetch(`${API_BASE}/cultures/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCulture(id: string) {
  return authFetch(`${API_BASE}/cultures/${id}`, { method: "DELETE" });
}

// ─── Season History ───────────────────────────────────────────

export interface SeasonHistory {
  id: string;
  culture_id: string;
  season: string;
  yield_kg_ha: number | null;
  total_yield_kg: number | null;
  expenses_fcfa: number;
  revenue_fcfa: number;
  notes: string;
  created_at: string;
}

export async function fetchHistory(
  cultureId?: string
): Promise<SeasonHistory[]> {
  const url = cultureId
    ? `${API_BASE}/history?culture_id=${cultureId}`
    : `${API_BASE}/history`;
  return authFetch(url);
}

export async function createHistory(
  data: Partial<SeasonHistory>
): Promise<SeasonHistory> {
  return authFetch(`${API_BASE}/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ─── Alerts ───────────────────────────────────────────────────

export interface Alert {
  id: string;
  type: string;
  title_fr: string;
  title_wo: string;
  body_fr: string;
  body_wo: string;
  severity: string;
  is_read: boolean;
  created_at: string;
}

export async function fetchAlerts(): Promise<Alert[]> {
  return authFetch(`${API_BASE}/alerts`);
}

export async function markAlertRead(id: string) {
  return authFetch(`${API_BASE}/alerts/${id}/read`, { method: "PUT" });
}

export async function generateAlerts(): Promise<Alert[]> {
  return authFetch(`${API_BASE}/alerts/generate`, { method: "POST" });
}

// ─── Calendar ─────────────────────────────────────────────────

export interface CalendarMonth {
  month: number;
  recommendation_fr: string;
  recommendation_wo: string;
  crops: Array<{
    key: string;
    name_fr: string;
    name_wo: string;
    activities: string[];
  }>;
}

export interface CalendarData {
  zone: string;
  zone_info: Record<string, unknown> | null;
  calendar: CalendarMonth[];
}

export async function fetchCalendar(zone: string): Promise<CalendarData> {
  const res = await fetch(`${API_BASE}/calendar/${zone}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Rotation ─────────────────────────────────────────────────

export async function fetchRotationAdvice(parcelleId: string) {
  return authFetch(`${API_BASE}/rotation/${parcelleId}`);
}
