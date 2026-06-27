-- =====================================================
-- SONE BRAND — Supabase SQL Setup for LOOKS
-- SQL Editor дээр БҮТНИЙГ НЬ хуулж RUN дарна уу
-- =====================================================

-- 1. looks хүснэгтийг үүсгэх
CREATE TABLE IF NOT EXISTS public.looks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  product_ids TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) идэвхжүүлэх
ALTER TABLE public.looks ENABLE ROW LEVEL SECURITY;

-- 3. Бүх хэрэглэгчид унших (SELECT) зөвшөөрөл олгох
CREATE POLICY "Anyone can view looks"
  ON public.looks
  FOR SELECT
  TO public
  USING (true);

-- 4. Шинэ look нэмэх (INSERT) зөвшөөрөл олгох
CREATE POLICY "Anyone can insert looks"
  ON public.looks
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 5. Look засах (UPDATE) зөвшөөрөл олгох
CREATE POLICY "Anyone can update looks"
  ON public.looks
  FOR UPDATE
  TO public
  USING (true);

-- 6. Look устгах (DELETE) зөвшөөрөл олгох
CREATE POLICY "Anyone can delete looks"
  ON public.looks
  FOR DELETE
  TO public
  USING (true);
