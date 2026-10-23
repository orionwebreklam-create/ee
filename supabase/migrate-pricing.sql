-- ==========================================================
-- ARDABEY SUCUKLARI - FİYAT PAKETİ & VARYANT MIGRATION
-- Bu 2 satırı Supabase Dashboard -> SQL Editor'a yapıştırıp
-- "Run" butonuna basın. (Var olan kolonları bozmaz, güvenli/idempotent)
-- ==========================================================

alter table public.products add column if not exists packages jsonb default '[]'::jsonb;
alter table public.products add column if not exists variants jsonb default '[]'::jsonb;
