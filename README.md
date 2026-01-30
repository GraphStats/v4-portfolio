# Portfolio (Next.js + Firebase)

Portfolio personnel multi-pages construit avec Next.js, Firestore et Clerk.

## Fonctionnalites

- Pages de contenu (about, contact, news, stats, tags, update, etc.)
- Liste de projets chargee depuis Firestore
- Dashboard admin pour gerer les projets et la configuration speciale
- Authentification utilisateur via Clerk pour les zones protegees
- UI moderne (Tailwind CSS + Radix UI) avec animations (Framer Motion)
- Analytics et performance via Vercel

## Stack technique

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Firebase (Firestore client + firebase-admin cote serveur)
- Clerk (authentification)
- Radix UI, Framer Motion, Recharts

## Structure du projet

- `app/` routes et pages
- `components/` composants UI
- `lib/` logique metier, actions serveur, integrations (Firebase, Cloudflare)
- `styles/` styles globaux et themes speciaux
- `public/` assets statiques

## Pre-requis

- Node.js 18+ recommande
- npm

## Installation

```bash
npm install
npm run dev
```

Le site est disponible sur `http://localhost:3000`.

## Configuration

### Variables d'environnement

Creez un fichier `.env` (ou `.env.local`) et renseignez au minimum :

```bash
# Firebase (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Cloudflare (si utilise)
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_API_TOKEN=
```

Note : la config Firebase est actuellement definie dans `lib/firebase/config.ts`.
Vous pouvez la remplacer par des variables d'environnement si besoin.

### Firebase / Firestore

La base utilise principalement les collections suivantes :

- `portfolio` : projets affiches sur le site
- `admins` : comptes admin pour le dashboard

Consultez `FIREBASE_SETUP.md` pour la structure exacte et les regles Firestore.

### Acces admin

- Connexion : `/admin`
- Dashboard : `/admin/dashboard`

Vous pouvez creer un admin via Firestore ou via le dashboard (voir
`FIREBASE_SETUP.md`). Ne stockez jamais de credentials dans le repo.

## Scripts

- `npm run dev` : demarrage en developpement
- `npm run build` : build de production
- `npm run start` : demarrage en production
- `npm run lint` : lint du code
- `npm run sync-themes` : copie les themes speciaux vers `public/styles/special-themes`

## Deploiement

Le projet peut etre deployee sur Vercel ou tout hebergeur Node.js
supportant Next.js.

## Securite

- Ne commitez pas vos secrets (`.env`, comptes admin, tokens).
- Utilisez des regles Firestore restrictives en production.
