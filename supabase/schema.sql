-- ==========================================================
-- ARDABEY SUCUKLARI - SUPABASE DATABASE & STORAGE SCHEMA
-- Bu kodu Supabase Dashboard -> SQL Editor sekmesine yapıştırıp
-- "Run" butonuna basarak tüm tabloları ve depolama alanını kurabilirsiniz.
-- ==========================================================

-- 1. ÜRÜNLER TABLOSU
create table if not exists public.products (
  id bigint primary key,
  name text not null,
  category text not null default 'Geleneksel Kangal',
  tag text default 'Yeni Ürün',
  tag_color text default 'bg-red-600 text-white',
  description text default '',
  price_per_kg numeric not null default 0,
  stock_kg numeric not null default 100,
  is_active boolean not null default true,
  image_url text default '',
  rating numeric default 5.0,
  reviews_count int default 0,
  features jsonb default '[]'::jsonb,
  specs jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 2. SİTE VE BANNER AYARLARI TABLOSU
create table if not exists public.settings (
  id int primary key default 1,
  site_name text default 'Ardabey Sucukları',
  support_phone text default '0850 308 19 23',
  whatsapp_phone text default '+90 532 123 45 67',
  logo_url text default '',
  banner1 text default 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600',
  banner2 text default 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=1600',
  free_shipping_kg numeric default 3,
  bulk_discount_kg numeric default 5,
  updated_at timestamptz default now()
);

-- 3. SİPARİŞLER TABLOSU
create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  email text default '',
  address text default '',
  city text default 'İstanbul',
  district text default 'Kadıköy',
  items text default '',
  items_list jsonb default '[]'::jsonb,
  kg numeric default 1,
  total numeric default 0,
  payment_method text default 'Kapıda Nakit',
  status text default 'Hazırlanıyor',
  tracking_number text default '',
  cargo_company text default 'Yurtiçi Kargo (Soğuk Dağıtım)',
  date text default '',
  notes text default '',
  created_at timestamptz default now()
);

-- 4. ÖDEME YÖNTEMLERİ AYARLARI (İyzico, PayTR, Havale IBAN'lar)
create table if not exists public.payment_settings (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- GÜVENLİK / RLS (Row Level Security) İZİNLERİ
alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;
alter table public.payment_settings enable row level security;

-- Tüm operasyonlara (Select/Insert/Update/Delete) izin ver
drop policy if exists "Allow all on products" on public.products;
create policy "Allow all on products" on public.products for all using (true) with check (true);

drop policy if exists "Allow all on settings" on public.settings;
create policy "Allow all on settings" on public.settings for all using (true) with check (true);

drop policy if exists "Allow all on orders" on public.orders;
create policy "Allow all on orders" on public.orders for all using (true) with check (true);

drop policy if exists "Allow all on payment_settings" on public.payment_settings;
create policy "Allow all on payment_settings" on public.payment_settings for all using (true) with check (true);

-- 5. RESİM VE MEDYA DEPOLAMA (STORAGE BUCKET)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access for uploads" on storage.objects;
create policy "Public Access for uploads"
on storage.objects for select
using ( bucket_id = 'uploads' );

drop policy if exists "Allow Uploads to uploads bucket" on storage.objects;
create policy "Allow Uploads to uploads bucket"
on storage.objects for insert
with check ( bucket_id = 'uploads' );

drop policy if exists "Allow Update to uploads bucket" on storage.objects;
create policy "Allow Update to uploads bucket"
on storage.objects for update
using ( bucket_id = 'uploads' );

drop policy if exists "Allow Delete in uploads bucket" on storage.objects;
create policy "Allow Delete in uploads bucket"
on storage.objects for delete
using ( bucket_id = 'uploads' );
