-- Market Garden Anbauplaner Schema
create extension if not exists "uuid-ossp";

create table if not exists public.farms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now(),
  settings jsonb
);

create table if not exists public.profiles (
  id uuid primary key,
  farm_id uuid references public.farms(id) on delete cascade,
  role text not null check (role in ('owner', 'worker')) default 'worker',
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.fields (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade,
  name text not null,
  type text not null check (type in ('OUTDOOR','GREENHOUSE','POLYTUNNEL')),
  bed_count integer not null default 0
);

create table if not exists public.beds (
  id uuid primary key default uuid_generate_v4(),
  field_id uuid references public.fields(id) on delete cascade,
  number text not null,
  width integer not null default 80,
  length integer not null default 2500
);

create table if not exists public.crops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  phases jsonb not null,
  rows_per_bed integer not null,
  plant_spacing integer not null,
  row_spacing integer not null,
  seeds_per_spot integer,
  seeds_per_tray integer,
  yield_per_plant numeric,
  yield_unit text not null check (yield_unit in ('kg','piece','bunch')),
  moon_phase_preference text[] not null default array[]::text[]
);

create table if not exists public.plantings (
  id uuid primary key default uuid_generate_v4(),
  bed_id uuid references public.beds(id) on delete cascade,
  crop_id uuid references public.crops(id) on delete cascade,
  phases_timeline jsonb not null,
  plant_count integer not null,
  expected_yield numeric,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  status text not null check (status in ('planned','active','harvesting','finished')) default 'planned',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  planting_id uuid references public.plantings(id) on delete cascade,
  type text not null check (type in ('SOW','TRANSPLANT','DIRECT_SEED','PREPARE','HARVEST_START','HARVEST_END')),
  due_date date not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id) on delete set null,
  notes text
);

alter table public.farms enable row level security;
alter table public.profiles enable row level security;
alter table public.fields enable row level security;
alter table public.beds enable row level security;
alter table public.crops enable row level security;
alter table public.plantings enable row level security;
alter table public.tasks enable row level security;

create policy "Owners view own farm" on public.farms
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.farm_id = farms.id
    )
  );

create policy "Profiles are self managed" on public.profiles
  for select using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Farm members read fields" on public.fields
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.farm_id = fields.farm_id
    )
  );

create policy "Farm members read beds" on public.beds
  for select using (
    exists (
      select 1 from public.fields f
      join public.profiles p on p.farm_id = f.farm_id
      where f.id = beds.field_id and p.id = auth.uid()
    )
  );

create policy "Farm members manage plantings" on public.plantings
  using (
    exists (
      select 1 from public.beds b
      join public.fields f on f.id = b.field_id
      join public.profiles p on p.farm_id = f.farm_id
      where b.id = plantings.bed_id and p.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.beds b
      join public.fields f on f.id = b.field_id
      join public.profiles p on p.farm_id = f.farm_id
      where b.id = plantings.bed_id and p.id = auth.uid()
    )
  );

create policy "Farm members manage tasks" on public.tasks
  using (
    exists (
      select 1 from public.plantings pl
      join public.beds b on b.id = pl.bed_id
      join public.fields f on f.id = b.field_id
      join public.profiles p on p.farm_id = f.farm_id
      where pl.id = tasks.planting_id and p.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.plantings pl
      join public.beds b on b.id = pl.bed_id
      join public.fields f on f.id = b.field_id
      join public.profiles p on p.farm_id = f.farm_id
      where pl.id = tasks.planting_id and p.id = auth.uid()
    )
  );

create policy "Crops are shared" on public.crops for select using (true);

-- Demo seed data
insert into public.farms (id, name) values ('00000000-0000-0000-0000-000000000001', 'Demo Hof')
  on conflict (id) do nothing;

insert into public.profiles (id, farm_id, role, name, email)
values ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'owner', 'Demo Nutzer', 'demo@example.com')
  on conflict (id) do nothing;
