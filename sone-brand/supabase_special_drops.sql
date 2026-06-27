-- =====================================================
-- SONE BRAND — Supabase SQL Setup for SPECIAL DROPS
-- SQL Editor дээр БҮТНИЙГ НЬ хуулж RUN дарна уу
-- =====================================================

-- 1. special_drops хүснэгтийг үүсгэх (хэрэв байхгүй бол)
CREATE TABLE IF NOT EXISTS public.special_drops (
  id TEXT PRIMARY KEY,
  image TEXT,
  product_id TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) идэвхжүүлэх
ALTER TABLE public.special_drops ENABLE ROW LEVEL SECURITY;

-- 3. Хуучин policy-г устгах (дахин үүсгэхийн өмнө)
DROP POLICY IF EXISTS "Anyone can view special_drops" ON public.special_drops;
DROP POLICY IF EXISTS "Anyone can insert special_drops" ON public.special_drops;
DROP POLICY IF EXISTS "Anyone can update special_drops" ON public.special_drops;
DROP POLICY IF EXISTS "Anyone can delete special_drops" ON public.special_drops;

-- 4. Policy-г шинээр үүсгэх
CREATE POLICY "Anyone can view special_drops"
  ON public.special_drops FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can insert special_drops"
  ON public.special_drops FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can update special_drops"
  ON public.special_drops FOR UPDATE TO public USING (true);

CREATE POLICY "Anyone can delete special_drops"
  ON public.special_drops FOR DELETE TO public USING (true);
