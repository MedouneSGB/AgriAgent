// ===== WORLD AGRICULTURE DATA =====
// Dominant crops, zones, cities, and regions for the interactive world map

export interface CountryAgriData {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  lat: number;
  lon: number;
  continent: string;
  dominantCrops: string[];
  zones: AgriZone[];
  cities: CityData[];
  currency: string;
  climate: string;
}

export interface AgriZone {
  key: string;
  label: string;
  crops: string[];
}

export interface CityData {
  name: string;
  key: string;
  lat: number;
  lon: number;
  region: string;
}

// ---------- ZONES by continent ----------

export const WORLD_ZONES: AgriZone[] = [
  // Africa
  { key: "west_africa_sahel", label: "West Africa - Sahel", crops: ["mil", "sorgho", "niebe", "arachide"] },
  { key: "west_africa_humid", label: "West Africa - Humid", crops: ["riz", "mais", "manioc", "cacao", "igname"] },
  { key: "east_africa_highland", label: "East Africa - Highland", crops: ["cafe", "the", "mais", "banane"] },
  { key: "east_africa_savanna", label: "East Africa - Savanna", crops: ["mais", "sorgho", "coton", "tournesol"] },
  { key: "north_africa", label: "North Africa", crops: ["ble", "orge", "olive", "agrumes", "dattes"] },
  { key: "southern_africa", label: "Southern Africa", crops: ["mais", "canne_sucre", "soja", "tabac"] },
  // Americas
  { key: "north_america_midwest", label: "North America - Midwest", crops: ["mais", "soja", "ble"] },
  { key: "north_america_west", label: "North America - West", crops: ["fruits", "legumes", "amandes", "raisin"] },
  { key: "central_america", label: "Central America", crops: ["cafe", "canne_sucre", "banane", "cacao"] },
  { key: "south_america_tropics", label: "South America - Tropics", crops: ["soja", "canne_sucre", "cafe", "cacao"] },
  { key: "south_america_temperate", label: "South America - Temperate", crops: ["ble", "mais", "raisin", "boeuf"] },
  // Asia
  { key: "south_asia_monsoon", label: "South Asia - Monsoon", crops: ["riz", "ble", "coton", "the", "epices"] },
  { key: "southeast_asia", label: "Southeast Asia", crops: ["riz", "huile_palme", "caoutchouc", "cafe"] },
  { key: "east_asia", label: "East Asia", crops: ["riz", "ble", "soja", "the"] },
  { key: "central_asia", label: "Central Asia", crops: ["ble", "coton", "orge"] },
  // Europe
  { key: "western_europe", label: "Western Europe", crops: ["ble", "raisin", "betterave", "colza"] },
  { key: "mediterranean", label: "Mediterranean", crops: ["olive", "raisin", "agrumes", "ble", "tomate"] },
  { key: "eastern_europe", label: "Eastern Europe", crops: ["ble", "tournesol", "mais", "pomme_terre"] },
  // Oceania
  { key: "oceania", label: "Oceania", crops: ["ble", "canne_sucre", "laine", "boeuf"] },
  // Senegal-specific (kept for backward compat)
  { key: "niayes", label: "Niayes (Senegal)", crops: ["tomate", "oignon", "chou", "carotte"] },
  { key: "bassin_arachidier", label: "Bassin Arachidier (Senegal)", crops: ["arachide", "mil", "niebe"] },
  { key: "casamance", label: "Casamance (Senegal)", crops: ["riz", "mais", "mangue"] },
  { key: "vallee_fleuve", label: "Vallée du Fleuve (Senegal)", crops: ["riz", "tomate", "oignon"] },
  { key: "sylvopastorale", label: "Zone Sylvo-pastorale (Senegal)", crops: ["mil", "niebe"] },
  { key: "senegal_oriental", label: "Sénégal Oriental", crops: ["coton", "mais", "arachide"] },
];

// ---------- COUNTRIES ----------

export const COUNTRIES: CountryAgriData[] = [
  // ===== AFRICA =====
  {
    name: "Senegal", code: "SN", lat: 14.5, lon: -14.5, continent: "Africa",
    dominantCrops: ["arachide", "mil", "riz", "mais", "niebe", "tomate", "oignon"],
    currency: "FCFA",
    climate: "Tropical / Sahélien",
    zones: [
      { key: "niayes", label: "Niayes", crops: ["tomate", "oignon", "chou"] },
      { key: "bassin_arachidier", label: "Bassin Arachidier", crops: ["arachide", "mil", "niebe"] },
      { key: "casamance", label: "Casamance", crops: ["riz", "mais", "mangue"] },
      { key: "vallee_fleuve", label: "Vallée du Fleuve", crops: ["riz", "tomate", "oignon"] },
      { key: "sylvopastorale", label: "Zone Sylvo-pastorale", crops: ["mil", "niebe"] },
      { key: "senegal_oriental", label: "Sénégal Oriental", crops: ["coton", "mais", "arachide"] },
    ],
    cities: [
      { name: "Dakar", key: "dakar", lat: 14.6928, lon: -17.4467, region: "Dakar" },
      { name: "Kaolack", key: "kaolack", lat: 14.152, lon: -16.0726, region: "Kaolack" },
      { name: "Saint-Louis", key: "saint-louis", lat: 16.0326, lon: -16.4818, region: "Saint-Louis" },
      { name: "Ziguinchor", key: "ziguinchor", lat: 12.5681, lon: -16.2719, region: "Ziguinchor" },
      { name: "Thiès", key: "thies", lat: 14.7886, lon: -16.926, region: "Thiès" },
      { name: "Touba", key: "touba", lat: 14.85, lon: -15.8833, region: "Diourbel" },
      { name: "Tambacounda", key: "tambacounda", lat: 13.7709, lon: -13.6673, region: "Tambacounda" },
    ],
  },
  {
    name: "Nigeria", code: "NG", lat: 9.082, lon: 8.675, continent: "Africa",
    dominantCrops: ["manioc", "igname", "mais", "riz", "sorgho", "cacao"],
    currency: "NGN",
    climate: "Tropical",
    zones: [
      { key: "ng_north", label: "Northern Nigeria", crops: ["sorgho", "mil", "arachide", "coton"] },
      { key: "ng_south", label: "Southern Nigeria", crops: ["manioc", "igname", "huile_palme", "cacao"] },
    ],
    cities: [
      { name: "Abuja", key: "abuja", lat: 9.0579, lon: 7.4951, region: "FCT" },
      { name: "Lagos", key: "lagos", lat: 6.5244, lon: 3.3792, region: "Lagos" },
      { name: "Kano", key: "kano", lat: 12.0022, lon: 8.5920, region: "Kano" },
    ],
  },
  {
    name: "Kenya", code: "KE", lat: -1.286, lon: 36.817, continent: "Africa",
    dominantCrops: ["the", "cafe", "mais", "haricot", "fleurs"],
    currency: "KES",
    climate: "Tropical / Highland",
    zones: [
      { key: "ke_highland", label: "Kenya Highlands", crops: ["the", "cafe", "mais"] },
      { key: "ke_coast", label: "Kenya Coast", crops: ["noix_coco", "manioc", "mangue"] },
    ],
    cities: [
      { name: "Nairobi", key: "nairobi", lat: -1.2921, lon: 36.8219, region: "Nairobi" },
      { name: "Mombasa", key: "mombasa", lat: -4.0435, lon: 39.6682, region: "Coast" },
      { name: "Nakuru", key: "nakuru", lat: -0.3031, lon: 36.0800, region: "Rift Valley" },
    ],
  },
  {
    name: "Ethiopia", code: "ET", lat: 9.145, lon: 40.489, continent: "Africa",
    dominantCrops: ["cafe", "teff", "mais", "ble", "sorgho"],
    currency: "ETB",
    climate: "Tropical Highland",
    zones: [
      { key: "et_highland", label: "Ethiopian Highlands", crops: ["cafe", "teff", "ble"] },
      { key: "et_rift", label: "Rift Valley", crops: ["mais", "haricot", "fleurs"] },
    ],
    cities: [
      { name: "Addis Ababa", key: "addis-ababa", lat: 9.0192, lon: 38.7525, region: "Addis Ababa" },
      { name: "Dire Dawa", key: "dire-dawa", lat: 9.6009, lon: 41.8503, region: "Dire Dawa" },
    ],
  },
  {
    name: "Morocco", code: "MA", lat: 31.792, lon: -7.093, continent: "Africa",
    dominantCrops: ["ble", "orge", "olive", "agrumes", "tomate"],
    currency: "MAD",
    climate: "Mediterranean / Arid",
    zones: [
      { key: "ma_atlantic", label: "Plaines Atlantiques", crops: ["ble", "canne_sucre", "betterave"] },
      { key: "ma_souss", label: "Souss-Massa", crops: ["agrumes", "tomate", "argan"] },
    ],
    cities: [
      { name: "Casablanca", key: "casablanca", lat: 33.5731, lon: -7.5898, region: "Casablanca-Settat" },
      { name: "Marrakech", key: "marrakech", lat: 31.6295, lon: -7.9811, region: "Marrakech-Safi" },
      { name: "Fès", key: "fes", lat: 34.0331, lon: -5.0003, region: "Fès-Meknès" },
    ],
  },
  {
    name: "Côte d'Ivoire", code: "CI", lat: 7.540, lon: -5.547, continent: "Africa",
    dominantCrops: ["cacao", "cafe", "hevea", "huile_palme", "riz"],
    currency: "FCFA",
    climate: "Tropical",
    zones: [
      { key: "ci_forest", label: "Zone Forestière", crops: ["cacao", "cafe", "hevea"] },
      { key: "ci_savanna", label: "Zone de Savane", crops: ["coton", "mais", "riz"] },
    ],
    cities: [
      { name: "Abidjan", key: "abidjan", lat: 5.3600, lon: -4.0083, region: "Lagunes" },
      { name: "Yamoussoukro", key: "yamoussoukro", lat: 6.8276, lon: -5.2893, region: "Lacs" },
    ],
  },
  {
    name: "Egypt", code: "EG", lat: 26.820, lon: 30.802, continent: "Africa",
    dominantCrops: ["ble", "riz", "coton", "canne_sucre", "mais"],
    currency: "EGP",
    climate: "Arid / Nile Valley",
    zones: [
      { key: "eg_delta", label: "Nile Delta", crops: ["riz", "coton", "ble"] },
      { key: "eg_upper", label: "Upper Egypt", crops: ["canne_sucre", "ble", "mais"] },
    ],
    cities: [
      { name: "Cairo", key: "cairo", lat: 30.0444, lon: 31.2357, region: "Cairo" },
      { name: "Alexandria", key: "alexandria", lat: 31.2001, lon: 29.9187, region: "Alexandria" },
    ],
  },

  // ===== ASIA =====
  {
    name: "India", code: "IN", lat: 20.594, lon: 78.963, continent: "Asia",
    dominantCrops: ["riz", "ble", "coton", "canne_sucre", "the", "epices"],
    currency: "INR",
    climate: "Tropical Monsoon / Semi-arid",
    zones: [
      { key: "in_punjab", label: "Punjab (Breadbasket)", crops: ["ble", "riz", "coton"] },
      { key: "in_south", label: "South India", crops: ["riz", "noix_coco", "epices", "cafe"] },
      { key: "in_assam", label: "Assam / Northeast", crops: ["the", "riz", "jute"] },
    ],
    cities: [
      { name: "New Delhi", key: "new-delhi", lat: 28.6139, lon: 77.2090, region: "Delhi" },
      { name: "Mumbai", key: "mumbai", lat: 19.0760, lon: 72.8777, region: "Maharashtra" },
      { name: "Hyderabad", key: "hyderabad", lat: 17.3850, lon: 78.4867, region: "Telangana" },
      { name: "Kolkata", key: "kolkata", lat: 22.5726, lon: 88.3639, region: "West Bengal" },
    ],
  },
  {
    name: "China", code: "CN", lat: 35.862, lon: 104.195, continent: "Asia",
    dominantCrops: ["riz", "ble", "mais", "soja", "the", "coton"],
    currency: "CNY",
    climate: "Diverse (Tropical to Temperate)",
    zones: [
      { key: "cn_yangtze", label: "Yangtze River Basin", crops: ["riz", "the", "colza"] },
      { key: "cn_north", label: "North China Plain", crops: ["ble", "mais", "soja"] },
    ],
    cities: [
      { name: "Beijing", key: "beijing", lat: 39.9042, lon: 116.4074, region: "Beijing" },
      { name: "Shanghai", key: "shanghai", lat: 31.2304, lon: 121.4737, region: "Shanghai" },
      { name: "Chengdu", key: "chengdu", lat: 30.5728, lon: 104.0668, region: "Sichuan" },
    ],
  },
  {
    name: "Indonesia", code: "ID", lat: -0.789, lon: 113.921, continent: "Asia",
    dominantCrops: ["riz", "huile_palme", "caoutchouc", "cafe", "cacao"],
    currency: "IDR",
    climate: "Tropical Humid",
    zones: [
      { key: "id_java", label: "Java", crops: ["riz", "canne_sucre", "mais"] },
      { key: "id_sumatra", label: "Sumatra", crops: ["huile_palme", "caoutchouc", "cafe"] },
    ],
    cities: [
      { name: "Jakarta", key: "jakarta", lat: -6.2088, lon: 106.8456, region: "Java" },
      { name: "Surabaya", key: "surabaya", lat: -7.2575, lon: 112.7521, region: "East Java" },
    ],
  },
  {
    name: "Thailand", code: "TH", lat: 15.870, lon: 100.993, continent: "Asia",
    dominantCrops: ["riz", "caoutchouc", "manioc", "canne_sucre", "fruits"],
    currency: "THB",
    climate: "Tropical",
    zones: [
      { key: "th_central", label: "Central Plains", crops: ["riz", "canne_sucre"] },
      { key: "th_north", label: "Northern Thailand", crops: ["riz", "mais", "fruits"] },
    ],
    cities: [
      { name: "Bangkok", key: "bangkok", lat: 13.7563, lon: 100.5018, region: "Bangkok" },
      { name: "Chiang Mai", key: "chiang-mai", lat: 18.7883, lon: 98.9853, region: "North" },
    ],
  },

  // ===== AMERICAS =====
  {
    name: "Brazil", code: "BR", lat: -14.235, lon: -51.925, continent: "Americas",
    dominantCrops: ["soja", "cafe", "canne_sucre", "mais", "coton", "oranges"],
    currency: "BRL",
    climate: "Tropical / Subtropical",
    zones: [
      { key: "br_cerrado", label: "Cerrado", crops: ["soja", "mais", "coton"] },
      { key: "br_minas", label: "Minas Gerais", crops: ["cafe", "canne_sucre", "mais"] },
      { key: "br_south", label: "Southern Brazil", crops: ["soja", "ble", "raisin"] },
    ],
    cities: [
      { name: "São Paulo", key: "sao-paulo", lat: -23.5505, lon: -46.6333, region: "São Paulo" },
      { name: "Brasília", key: "brasilia", lat: -15.7975, lon: -47.8919, region: "Federal District" },
      { name: "Cuiabá", key: "cuiaba", lat: -15.6014, lon: -56.0979, region: "Mato Grosso" },
    ],
  },
  {
    name: "United States", code: "US", lat: 37.090, lon: -95.713, continent: "Americas",
    dominantCrops: ["mais", "soja", "ble", "coton", "fruits", "legumes"],
    currency: "USD",
    climate: "Diverse (Temperate to Subtropical)",
    zones: [
      { key: "us_cornbelt", label: "Corn Belt", crops: ["mais", "soja"] },
      { key: "us_plains", label: "Great Plains", crops: ["ble", "sorgho", "boeuf"] },
      { key: "us_california", label: "California", crops: ["fruits", "legumes", "amandes", "raisin"] },
    ],
    cities: [
      { name: "Chicago", key: "chicago", lat: 41.8781, lon: -87.6298, region: "Illinois" },
      { name: "Des Moines", key: "des-moines", lat: 41.5868, lon: -93.6250, region: "Iowa" },
      { name: "Fresno", key: "fresno", lat: 36.7378, lon: -119.7871, region: "California" },
    ],
  },
  {
    name: "Argentina", code: "AR", lat: -38.416, lon: -63.617, continent: "Americas",
    dominantCrops: ["soja", "mais", "ble", "tournesol", "raisin", "boeuf"],
    currency: "ARS",
    climate: "Temperate / Pampas",
    zones: [
      { key: "ar_pampas", label: "Pampas", crops: ["soja", "mais", "ble", "tournesol"] },
      { key: "ar_mendoza", label: "Mendoza", crops: ["raisin", "olive"] },
    ],
    cities: [
      { name: "Buenos Aires", key: "buenos-aires", lat: -34.6037, lon: -58.3816, region: "Buenos Aires" },
      { name: "Rosario", key: "rosario", lat: -32.9468, lon: -60.6393, region: "Santa Fe" },
    ],
  },
  {
    name: "Mexico", code: "MX", lat: 23.634, lon: -102.553, continent: "Americas",
    dominantCrops: ["mais", "avocat", "tomate", "cafe", "canne_sucre", "haricot"],
    currency: "MXN",
    climate: "Tropical / Semi-arid",
    zones: [
      { key: "mx_central", label: "Central Mexico", crops: ["mais", "haricot", "avocat"] },
      { key: "mx_south", label: "Southern Mexico", crops: ["cafe", "cacao", "canne_sucre"] },
    ],
    cities: [
      { name: "Mexico City", key: "mexico-city", lat: 19.4326, lon: -99.1332, region: "CDMX" },
      { name: "Guadalajara", key: "guadalajara", lat: 20.6597, lon: -103.3496, region: "Jalisco" },
    ],
  },

  // ===== EUROPE =====
  {
    name: "France", code: "FR", lat: 46.228, lon: 2.214, continent: "Europe",
    dominantCrops: ["ble", "raisin", "mais", "colza", "betterave", "tournesol"],
    currency: "EUR",
    climate: "Temperate / Mediterranean",
    zones: [
      { key: "fr_beauce", label: "Beauce (Grenier à blé)", crops: ["ble", "colza", "betterave"] },
      { key: "fr_bordeaux", label: "Bordeaux / SW", crops: ["raisin", "mais", "tournesol"] },
      { key: "fr_provence", label: "Provence", crops: ["olive", "lavande", "raisin", "fruits"] },
    ],
    cities: [
      { name: "Paris", key: "paris", lat: 48.8566, lon: 2.3522, region: "Île-de-France" },
      { name: "Toulouse", key: "toulouse", lat: 43.6047, lon: 1.4442, region: "Occitanie" },
      { name: "Lyon", key: "lyon", lat: 45.7640, lon: 4.8357, region: "Auvergne-Rhône-Alpes" },
    ],
  },
  {
    name: "Spain", code: "ES", lat: 40.464, lon: -3.749, continent: "Europe",
    dominantCrops: ["olive", "raisin", "agrumes", "tomate", "ble"],
    currency: "EUR",
    climate: "Mediterranean",
    zones: [
      { key: "es_andalucia", label: "Andalucía", crops: ["olive", "agrumes", "tomate"] },
      { key: "es_castilla", label: "Castilla", crops: ["ble", "orge", "tournesol"] },
    ],
    cities: [
      { name: "Madrid", key: "madrid", lat: 40.4168, lon: -3.7038, region: "Madrid" },
      { name: "Seville", key: "seville", lat: 37.3891, lon: -5.9845, region: "Andalusia" },
    ],
  },
  {
    name: "Ukraine", code: "UA", lat: 48.379, lon: 31.166, continent: "Europe",
    dominantCrops: ["ble", "tournesol", "mais", "orge", "colza"],
    currency: "UAH",
    climate: "Temperate Continental",
    zones: [
      { key: "ua_steppe", label: "Steppe", crops: ["ble", "tournesol", "mais"] },
      { key: "ua_forest", label: "Forest-Steppe", crops: ["ble", "betterave", "pomme_terre"] },
    ],
    cities: [
      { name: "Kyiv", key: "kyiv", lat: 50.4501, lon: 30.5234, region: "Kyiv" },
      { name: "Odesa", key: "odesa", lat: 46.4825, lon: 30.7233, region: "Odesa" },
    ],
  },

  // ===== OCEANIA =====
  {
    name: "Australia", code: "AU", lat: -25.274, lon: 133.775, continent: "Oceania",
    dominantCrops: ["ble", "orge", "canne_sucre", "coton", "laine"],
    currency: "AUD",
    climate: "Arid / Temperate",
    zones: [
      { key: "au_wheat", label: "Wheat Belt (WA)", crops: ["ble", "orge", "canola"] },
      { key: "au_queensland", label: "Queensland", crops: ["canne_sucre", "coton", "fruits"] },
    ],
    cities: [
      { name: "Sydney", key: "sydney", lat: -33.8688, lon: 151.2093, region: "NSW" },
      { name: "Perth", key: "perth", lat: -31.9505, lon: 115.8605, region: "WA" },
    ],
  },
];

// ---------- GLOBAL CROPS DATABASE ----------

export interface GlobalCrop {
  key: string;
  name_fr: string;
  name_en: string;
  emoji: string;
  topProducers: string[]; // country codes
  globalProduction: string; // e.g. "1.2B tonnes"
  color: string;
}

export const GLOBAL_CROPS: GlobalCrop[] = [
  { key: "riz", name_fr: "Riz", name_en: "Rice", emoji: "🌾", topProducers: ["CN", "IN", "ID", "TH", "SN"], globalProduction: "520M tonnes", color: "#22c55e" },
  { key: "ble", name_fr: "Blé", name_en: "Wheat", emoji: "🌾", topProducers: ["CN", "IN", "US", "FR", "UA"], globalProduction: "780M tonnes", color: "#f59e0b" },
  { key: "mais", name_fr: "Maïs", name_en: "Corn/Maize", emoji: "🌽", topProducers: ["US", "CN", "BR", "AR", "UA"], globalProduction: "1.2B tonnes", color: "#eab308" },
  { key: "soja", name_fr: "Soja", name_en: "Soybean", emoji: "🫘", topProducers: ["BR", "US", "AR", "CN", "IN"], globalProduction: "370M tonnes", color: "#84cc16" },
  { key: "cafe", name_fr: "Café", name_en: "Coffee", emoji: "☕", topProducers: ["BR", "ET", "ID", "CO", "KE"], globalProduction: "10M tonnes", color: "#92400e" },
  { key: "cacao", name_fr: "Cacao", name_en: "Cocoa", emoji: "🍫", topProducers: ["CI", "NG", "ID", "BR", "ET"], globalProduction: "5.8M tonnes", color: "#78350f" },
  { key: "coton", name_fr: "Coton", name_en: "Cotton", emoji: "🧵", topProducers: ["CN", "IN", "US", "BR", "AU"], globalProduction: "25M tonnes", color: "#e5e7eb" },
  { key: "canne_sucre", name_fr: "Canne à sucre", name_en: "Sugarcane", emoji: "🎋", topProducers: ["BR", "IN", "CN", "TH", "AU"], globalProduction: "1.9B tonnes", color: "#a3e635" },
  { key: "arachide", name_fr: "Arachide", name_en: "Peanut", emoji: "🥜", topProducers: ["CN", "IN", "NG", "SN", "US"], globalProduction: "50M tonnes", color: "#d4a76a" },
  { key: "mil", name_fr: "Mil", name_en: "Millet", emoji: "🌾", topProducers: ["IN", "NG", "SN", "NE", "CN"], globalProduction: "28M tonnes", color: "#ca8a04" },
  { key: "tomate", name_fr: "Tomate", name_en: "Tomato", emoji: "🍅", topProducers: ["CN", "IN", "US", "ES", "EG"], globalProduction: "190M tonnes", color: "#dc2626" },
  { key: "olive", name_fr: "Olive", name_en: "Olive", emoji: "🫒", topProducers: ["ES", "MA", "EG", "FR", "IT"], globalProduction: "20M tonnes", color: "#65a30d" },
  { key: "the", name_fr: "Thé", name_en: "Tea", emoji: "🍵", topProducers: ["CN", "IN", "KE", "ET", "ID"], globalProduction: "6.5M tonnes", color: "#16a34a" },
  { key: "huile_palme", name_fr: "Huile de palme", name_en: "Palm Oil", emoji: "🌴", topProducers: ["ID", "MY", "TH", "NG", "CI"], globalProduction: "77M tonnes", color: "#ea580c" },
  { key: "tournesol", name_fr: "Tournesol", name_en: "Sunflower", emoji: "🌻", topProducers: ["UA", "AR", "FR", "ES", "CN"], globalProduction: "55M tonnes", color: "#fbbf24" },
  { key: "oignon", name_fr: "Oignon", name_en: "Onion", emoji: "🧅", topProducers: ["CN", "IN", "EG", "US", "SN"], globalProduction: "100M tonnes", color: "#a855f7" },
  { key: "manioc", name_fr: "Manioc", name_en: "Cassava", emoji: "🥔", topProducers: ["NG", "TH", "ID", "BR", "CI"], globalProduction: "310M tonnes", color: "#a0522d" },
];

// ---------- HELPER: get all cities worldwide ----------

export function getAllCities(): CityData[] {
  return COUNTRIES.flatMap(c => c.cities);
}

export function getAllCityKeys(): string[] {
  return COUNTRIES.flatMap(c => c.cities.map(city => city.key));
}

export function getCountryByCity(cityKey: string): CountryAgriData | undefined {
  return COUNTRIES.find(c => c.cities.some(city => city.key === cityKey));
}

export function getZonesForCountry(countryCode: string): AgriZone[] {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.zones || [];
}

// ---------- CONTINENT COLORS ----------

export const CONTINENT_COLORS: Record<string, string> = {
  Africa: "#22c55e",
  Asia: "#ef4444",
  Americas: "#3b82f6",
  Europe: "#8b5cf6",
  Oceania: "#f59e0b",
};
