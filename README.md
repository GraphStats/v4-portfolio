# Portfolio Drayko

Portfolio moderne créé avec Next.js et Firebase.

## 🔥 Migration vers Firebase

Ce projet utilise Firebase Firestore pour stocker les données du portfolio.

### Configuration Firebase

La configuration Firebase est directement intégrée dans `lib/firebase/config.ts` avec les credentials suivants :
- **Project ID**: docky-dev-fr
- **Collection**: portfolio

### Structure Firestore

#### Collection `portfolio`
Stocke les projets du portfolio :
```
{
  title: string
  description: string
  image_url: string | null
  tags: string[]
  project_url: string | null
  github_url: string | null
  created_at: string (ISO date)
}
```

#### Collection `admins`
Stocke les comptes administrateurs :
```
{
  email: string
  password: string (SHA-256 hash)
  created_at: string (ISO date)
}
```

## 🚀 Installation

```bash
npm install
npm run dev
```

## 📝 Changements principaux

### ✅ Fait
- ✅ Migration de Supabase vers Firebase Firestore
- ✅ Suppression de toutes les publicités (AdBanner, AdPopup)
- ✅ Nettoyage du code et des dépendances
- ✅ Configuration Firebase avec la collection "portfolio"

### 🔧 Fichiers modifiés
- `lib/firebase/` - Nouvelle configuration Firebase
- `lib/actions.ts` - Actions serveur avec Firestore
- `lib/auth.ts` - Authentification avec Firestore
- `app/page.tsx` - Page principale sans pubs
- `app/admin/dashboard/page.tsx` - Dashboard admin avec Firebase
- `components/` - Composants nettoyés

## 🎨 Technologies

- **Framework**: Next.js 16
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Analytics**: Vercel Analytics

## 📦 Scripts

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build de production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Linting du code

---

Créé avec passion par Drayko 🚀

