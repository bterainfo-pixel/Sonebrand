-- =====================================================
-- SONE BRAND — Supabase SQL Setup
-- SQL Editor дээр БҮТНИЙГ НЬ хуулж RUN дарна уу
-- =====================================================

-- 1. orders хүснэгтэд receipt_image болон date багана нэмэх
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS receipt_image TEXT,
  ADD COLUMN IF NOT EXISTS date TEXT;

-- 2. orders хүснэгтэд status-ийн шинэ утгуудыг зөвшөөрөх
--    (transit, out_for_delivery нэмэгдсэн)
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

-- 3. Storage Bucket үүсгэх (баримтын зургуудыг хадгалах)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Receipts bucket-д бүх хэрэглэгч upload хийж болдог policy
CREATE POLICY "Anyone can upload receipts"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'receipts');

-- 5. Receipts bucket-д бүх хэрэглэгч уншиж болдог policy
CREATE POLICY "Anyone can view receipts"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'receipts');

-- 6. Receipts bucket-д устгах боломжтой policy (admin-д)
CREATE POLICY "Anyone can delete receipts"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'receipts');
