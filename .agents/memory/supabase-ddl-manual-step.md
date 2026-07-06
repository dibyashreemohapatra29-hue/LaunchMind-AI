---
name: Supabase DDL requires manual SQL editor step
description: When a project uses an external Supabase project (not Replit's built-in Postgres), the agent cannot create/alter tables itself.
---

When a client only has `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (or their non-Vite equivalents) and no service-role key or direct Postgres connection string for that Supabase project, the agent has no way to run DDL (CREATE TABLE, ALTER TABLE, RLS policies) against it — the anon key only supports PostgREST reads/writes governed by RLS, not raw SQL.

**Why:** `executeSql` only targets Replit's own managed Postgres (or data warehouses), not arbitrary external Postgres/Supabase instances. Attempting to use the Supabase JS client for DDL doesn't work either — it's a REST API layer, not a SQL console.

**How to apply:** When a task requires new Supabase tables, write the exact `CREATE TABLE` / RLS policy SQL, ask the user to run it once in their Supabase Dashboard → SQL Editor, and confirm before testing persistence-dependent features. Build all application code in the same turn while waiting on their confirmation to avoid idle time.
