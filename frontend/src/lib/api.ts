const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8095/api";

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
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, city, language }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
          else if (data.type === "done") onDone(data.agents_used, data.language);
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
