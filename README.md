# Drayko - Creative Developer (Next.js)

Portfolio + panel admin (dashboard + "Projets Ops") construit avec Next.js (App Router), Firebase/Firestore, Clerk, Tailwind + Radix UI.

## Features

- Pages publiques (v4 UI)
- Admin login + dashboard: gestion projets, news, stats, toggles (maintenance, v4, disponibilite, error mode)
- Projets Ops: mode "Single project" + mode "General" (updates/events + calendrier global)
- Firestore comme source de donnees

## Tech stack

- Next.js 16 (App Router)
- React 19
- Firebase (Firestore + Storage)
- Clerk (auth)
- Tailwind CSS + Radix UI (shadcn-style components)

## Getting started

Prerequis: Node.js recent + npm.

1. Installer les deps:
   - `npm install`
2. Configurer les variables d'environnement:
   - copier `.env.example` vers `.env.local`
   - remplir les valeurs
3. Lancer en dev:
   - `npm run dev`

## Environment variables

Variables principales:
- Firebase (public): `NEXT_PUBLIC_FIREBASE_*`
- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Cloudflare (optionnel): `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_TOKEN`

## Admin

Routes:
- `/admin` : page login admin
- `/admin/dashboard` : dashboard principal
- `/admin/projects` : Projets Ops (organisation interne)

Notes:
- La session admin est geree via un cookie `admin_session` (voir `lib/auth.ts` + `middleware.ts`).
- Les donnees Projets Ops sont stockees dans `project-admin/{projectId}`.
- La "Roadmap" Projets Ops est synchronisee avec `portfolio/{projectId}.changelog` (meme systeme que le dashboard).

## Firestore data model

- `portfolio` (projects)
  - champs projet + `changelog: [{ id, version, date, changes[] }]`
- `admins` (admin accounts)
- `project-admin` (meta interne par projet)
  - `notes`, `updates` (statuts), `events` (calendrier)
- `news` (posts)
- `update-p/main` (site update badge / changelog global)

## Scripts

- `npm run dev` : dev server
- `npm run build` : build production
- `npm run start` : start production
- `npm run lint` : eslint (si installe/configure)
- `npm run sync-themes` : copie des CSS de themes speciaux vers `public/`