-- Neon Postgres schema for capra.pk. Idempotent: apply with `node scripts/apply-schema.mjs`. No migration tool.

-- ─── Shop ───────────────────────────────────────────────────────────────────
-- One row per series slug, overlaying src/content/products.ts. A price is NEVER stored here: prices live
-- in the price list in code. /admin owns copy, imagery, SEO and the shop facts (listed, stock).
create table if not exists products (
  slug            text primary key,
  name            text,
  summary         text,
  blurb           text,
  image           text,
  seo_title       text,
  seo_description text,
  keywords        text[] not null default '{}',
  hidden          boolean not null default false,  -- out of listings, page still reachable
  sellable        boolean not null default true,   -- false = not sold at all
  stock           integer,                         -- null = no cap; 0 = out of stock
  updated_at      timestamptz not null default now()
);

-- One row per order. `lines` and `totals` are the server-priced basket, read back verbatim and never recalculated.
create table if not exists orders (
  id             bigserial primary key,
  ref            text not null unique,
  status         text not null default 'new',      -- new | confirmed | shipped | delivered | cancelled
  payment_method text not null,                    -- cod | bank | jazzcash | easypaisa
  payment_status text not null default 'unpaid',   -- unpaid | paid | refunded
  payment_ref    text,                             -- transfer reference, typed in /admin
  contact        jsonb not null,                   -- { name, phone, email, notes }
  address        jsonb not null,                   -- { line1, line2, city, province, postcode }
  lines          jsonb not null,                   -- [{ id, sku, name, qty, unit, amount, variant, variantLabel }]
  totals         jsonb not null,                   -- { subtotal, delivery, total }
  total          numeric(12,0) not null,
  tracking       text,                             -- courier and consignment number, shown to the customer
  admin_note     text,
  page           text,
  ip             text,
  meta           jsonb not null default '{}'::jsonb, -- ref code / utm / landing path
  stock_taken_at timestamptz,                      -- set while the order holds stock (syncOrderStock)
  paid_at        timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists orders_created_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status, created_at desc);
create index if not exists orders_email_lower_idx on orders (lower(contact->>'email'));
create index if not exists orders_phone_idx on orders ((contact->>'phone'));

-- "Email me my basket": ids and quantities only, re-priced on open. Kept 180 days.
create table if not exists saved_baskets (
  id           text primary key,
  token        text not null,
  email        text not null,
  items        jsonb not null,
  total        numeric(12,0) not null,
  page         text,
  remind       boolean not null default false,
  remind_text  text,
  reminded_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists saved_baskets_created_idx on saved_baskets (created_at desc);
create index if not exists saved_baskets_email_idx on saved_baskets (email);

-- ─── Enquiries ──────────────────────────────────────────────────────────────
create table if not exists enquiries (
  id         bigserial primary key,
  ref        text,
  kind       text not null,                -- contact | wholesale | product | warranty
  name       text not null,
  email      text,
  phone      text,
  city       text,
  subject    text,
  message    text,
  product    text,
  page       text,
  ip         text,
  extra      jsonb,
  status     text not null default 'new', -- new | replied | closed
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on enquiries (created_at desc);
create index if not exists enquiries_email_lower_idx on enquiries (lower(email));

-- ─── Customer accounts ─────────────────────────────────────────────────────
-- Sign-in by a 6-digit emailed code (src/lib/customer.ts). No passwords. Identity is the verified lower-case email.
create table if not exists customers (
  id               bigserial primary key,
  email            text not null unique,
  name             text,
  phone            text,
  company          text,
  default_address  jsonb,
  session_version  integer not null default 0,
  last_login_at    timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists customer_codes (
  id          bigserial primary key,
  email       text not null,
  code_hash   text not null,
  attempts    integer not null default 0,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists customer_codes_email_idx on customer_codes (email, created_at desc);

-- Marketing consent, keyed by email. `consent_text` is the wording agreed to; an unsubscribed row is kept.
create table if not exists marketing_consents (
  email            text primary key,
  status           text not null,   -- subscribed | unsubscribed
  source           text not null,   -- checkout | account | admin (admin only ever unsubscribes)
  consent_text     text,
  subscribed_at    timestamptz,
  unsubscribed_at  timestamptz,
  updated_at       timestamptz not null default now()
);

-- ─── Journal ────────────────────────────────────────────────────────────────
-- src/content/blog.ts is the shipped default; a row with the same slug wins.
create table if not exists posts (
  slug          text primary key,
  title         text not null,
  seo_title     text,
  description   text not null,
  category      text not null,
  body          text not null default '',
  image         text,
  image_alt     text,
  keywords      text[] not null default '{}',
  areas         text[] not null default '{}',
  faqs          jsonb not null default '[]'::jsonb,
  author        text,
  published     boolean not null default false,
  published_at  date,
  updated_at    timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- ─── Admin users ────────────────────────────────────────────────────────────
-- Email + password (scrypt via node:crypto). Seed the first owner with scripts/seed-admin-user.mjs.
create table if not exists site_admins (
  id            bigserial primary key,
  name          text not null,
  email         text not null unique,
  role          text not null default 'staff', -- owner | staff
  password_hash text not null,
  last_login_at timestamptz,
  created_at    timestamptz not null default now()
);

-- ─── Analytics (first-party; no raw IP is ever stored) ──────────────────────
create table if not exists sessions (
  id            text primary key,
  visitor_id    text not null,
  landing_path  text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  ref_code      text,
  country       text,
  region        text,
  city          text,
  latitude      text,
  longitude     text,
  device        text,
  browser       text,
  os            text,
  screen        text,
  language      text,
  ip_hash       text,
  bot           boolean not null default false,
  views         integer not null default 0,
  events        integer not null default 0,
  duration_ms   bigint  not null default 0,
  started_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);
create index if not exists sessions_started_idx on sessions (started_at desc);
create index if not exists sessions_visitor_idx on sessions (visitor_id);

create table if not exists page_views (
  id           text primary key,
  session_id   text not null,
  visitor_id   text not null,
  path         text not null,
  title        text,
  referrer     text,
  duration_ms  integer not null default 0,
  max_scroll   integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists page_views_created_idx on page_views (created_at desc);
create index if not exists page_views_path_idx on page_views (path, created_at desc);
create index if not exists page_views_session_idx on page_views (session_id, created_at);

create table if not exists events (
  id         bigserial primary key,
  session_id text not null,
  visitor_id text not null,
  path       text,
  name       text not null,
  label      text,
  meta       jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_created_idx on events (created_at desc);
create index if not exists events_name_idx on events (name, created_at desc);

-- ─── Rate limits ────────────────────────────────────────────────────────────
create table if not exists rate_limits (
  bucket       text primary key,
  hits         integer not null,
  window_start timestamptz not null
);
create index if not exists rate_limits_window_idx on rate_limits (window_start);
