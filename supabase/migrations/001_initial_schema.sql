-- ============================================================
-- InmoDesk – Schema inicial
-- ============================================================

-- Inmobiliarias
create table if not exists inmobiliarias (
  id   uuid primary key default gen_random_uuid(),
  nombre text not null,
  created_at timestamptz default now()
);

-- Usuarios (vinculados a auth.users)
create table if not exists usuarios (
  id            uuid primary key references auth.users(id) on delete cascade,
  inmobiliaria_id uuid references inmobiliarias(id) on delete cascade,
  nombre        text,
  email         text,
  rol           text default 'admin',
  created_at    timestamptz default now()
);

-- Propietarios
create table if not exists propietarios (
  id              text primary key,
  nombre          text not null,
  telefono        text,
  email           text,
  inmobiliaria_id uuid references inmobiliarias(id) on delete cascade not null,
  created_at      timestamptz default now()
);

-- Inquilinos
create table if not exists inquilinos (
  id              text primary key,
  nombre          text not null,
  telefono        text,
  email           text,
  dni             text,
  inmobiliaria_id uuid references inmobiliarias(id) on delete cascade not null,
  created_at      timestamptz default now()
);

-- Propiedades
create table if not exists propiedades (
  id                   text primary key,
  direccion            text not null,
  unidad               text,
  tipo                 text,
  barrio               text,
  ciudad               text,
  propietario_id       text references propietarios(id),
  inquilino_id         text references inquilinos(id),
  ambientes            int,
  metros               numeric,
  alquiler_mensual     numeric,
  estado_contrato      text,
  fecha_inicio_contrato date,
  fecha_fin_contrato    date,
  inmobiliaria_id      uuid references inmobiliarias(id) on delete cascade not null,
  created_at           timestamptz default now()
);

-- Proveedores
create table if not exists proveedores (
  id                         text primary key,
  nombre                     text not null,
  rubro                      text,
  zona                       text,
  telefono                   text,
  email                      text,
  estado                     text default 'Activo',
  tiempo_promedio_respuesta  text,
  rating                     numeric,
  total_trabajos             int default 0,
  historial                  jsonb default '[]',
  inmobiliaria_id            uuid references inmobiliarias(id) on delete cascade not null,
  created_at                 timestamptz default now()
);

-- Incidencias
create table if not exists incidencias (
  id                   text primary key,
  propiedad_id         text references propiedades(id),
  inquilino_id         text references inquilinos(id),
  propietario_id       text references propietarios(id),
  proveedor_id         text references proveedores(id),
  rubro                text,
  urgencia             text,
  estado               text default 'Nueva',
  titulo               text not null,
  descripcion          text,
  fecha_creacion       timestamptz default now(),
  fecha_actualizacion  timestamptz default now(),
  presupuesto_estimado numeric,
  costo_final          numeric,
  notas                text default '',
  evidencias           jsonb default '[]',
  timeline             jsonb default '[]',
  inmobiliaria_id      uuid references inmobiliarias(id) on delete cascade not null,
  created_at           timestamptz default now()
);

-- ============================================================
-- Función helper para RLS
-- ============================================================
create or replace function get_inmobiliaria_id()
returns uuid
language sql
security definer
stable
as $$
  select inmobiliaria_id from usuarios where id = auth.uid()
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table inmobiliarias  enable row level security;
alter table usuarios       enable row level security;
alter table propietarios   enable row level security;
alter table inquilinos     enable row level security;
alter table propiedades    enable row level security;
alter table proveedores    enable row level security;
alter table incidencias    enable row level security;

-- Inmobiliarias: solo la propia
create policy "own_inmobiliaria" on inmobiliarias
  for all using (id = get_inmobiliaria_id());

-- Usuarios: solo los de la misma inmobiliaria
create policy "same_inmobiliaria" on usuarios
  for all using (inmobiliaria_id = get_inmobiliaria_id());

-- Resto de tablas: acceso por inmobiliaria_id
create policy "inmobiliaria_access" on propietarios
  for all using (inmobiliaria_id = get_inmobiliaria_id());

create policy "inmobiliaria_access" on inquilinos
  for all using (inmobiliaria_id = get_inmobiliaria_id());

create policy "inmobiliaria_access" on propiedades
  for all using (inmobiliaria_id = get_inmobiliaria_id());

create policy "inmobiliaria_access" on proveedores
  for all using (inmobiliaria_id = get_inmobiliaria_id());

create policy "inmobiliaria_access" on incidencias
  for all using (inmobiliaria_id = get_inmobiliaria_id());
