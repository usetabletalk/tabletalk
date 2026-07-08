# Gluten-Free Guide

A mobile app that helps people with celiac disease navigate daily life — role-play practice for social situations, tips & tricks, and community resources — designed for people with social anxiety and neurodivergent users.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile/` — the Expo app (frontend-only, no backend)
  - `app/(tabs)/` — three tabs: Practice (`index.tsx`), Tips (`tips.tsx`), Community (`community.tsx`)
  - `app/scenario/[id].tsx` — role-play conversation screen
  - `constants/colors.ts` — design tokens (warm off-white, terracotta primary, sage accents)
  - Persistence: AsyncStorage via an `AppStateProvider` context (completed scenarios, favorited tips)

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
