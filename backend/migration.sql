-- AgriAgent SN - Database Migration
-- Execute this in Supabase SQL Editor: https://supabase.com/dashboard/project/jnpwzdoiazisuduurkqc/sql

-- ============================================
-- TABLE 1: profiles (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  region TEXT DEFAULT '',
  city TEXT DEFAULT '',
  zone TEXT DEFAULT '',
  preferred_language TEXT DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'wo', 'en')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TABLE 2: parcelles (farmer's fields/plots)
-- ============================================
CREATE TABLE public.parcelles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surface_ha DECIMAL(10,2),
  zone TEXT,
  city TEXT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  soil_type TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_parcelles_user ON public.parcelles(user_id);

-- ============================================
-- TABLE 3: cultures (crops planted on plots)
-- ============================================
CREATE TABLE public.cultures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcelle_id UUID NOT NULL REFERENCES public.parcelles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_key TEXT NOT NULL,
  variety TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'sown', 'growing', 'harvesting', 'harvested', 'failed')),
  planting_date DATE,
  expected_harvest DATE,
  actual_harvest_date DATE,
  season TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cultures_user ON public.cultures(user_id);
CREATE INDEX idx_cultures_parcelle ON public.cultures(parcelle_id);

-- ============================================
-- TABLE 4: season_history (past season records)
-- ============================================
CREATE TABLE public.season_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  culture_id UUID NOT NULL REFERENCES public.cultures(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  yield_kg_ha DECIMAL(10,2),
  total_yield_kg DECIMAL(10,2),
  expenses_fcfa INTEGER DEFAULT 0,
  revenue_fcfa INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_history_user ON public.season_history(user_id);

-- ============================================
-- TABLE 5: alerts (personalized farmer alerts)
-- ============================================
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('weather', 'calendar', 'market', 'rotation', 'pest')),
  title_fr TEXT NOT NULL,
  title_wo TEXT DEFAULT '',
  body_fr TEXT NOT NULL,
  body_wo TEXT DEFAULT '',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  related_parcelle_id UUID REFERENCES public.parcelles(id) ON DELETE SET NULL,
  related_culture_id UUID REFERENCES public.cultures(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_alerts_user ON public.alerts(user_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcelles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Parcelles
CREATE POLICY "Users can view own parcelles" ON public.parcelles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own parcelles" ON public.parcelles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own parcelles" ON public.parcelles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own parcelles" ON public.parcelles FOR DELETE USING (auth.uid() = user_id);

-- Cultures
CREATE POLICY "Users can view own cultures" ON public.cultures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cultures" ON public.cultures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cultures" ON public.cultures FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cultures" ON public.cultures FOR DELETE USING (auth.uid() = user_id);

-- Season history
CREATE POLICY "Users can view own history" ON public.season_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.season_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON public.season_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON public.season_history FOR DELETE USING (auth.uid() = user_id);

-- Alerts
CREATE POLICY "Users can view own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
