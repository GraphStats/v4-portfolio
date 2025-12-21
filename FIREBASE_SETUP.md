# Guide de Configuration Firebase

## Étapes pour configurer Firebase Firestore

### 1. Créer les collections dans Firestore

Dans la console Firebase (https://console.firebase.google.com/), créez les collections suivantes :

#### Collection `portfolio`
Cette collection stocke vos projets. Chaque document doit avoir :
- `title` (string) - Titre du projet
- `description` (string) - Description du projet
- `image_url` (string | null) - URL de l'image
- `tags` (array) - Liste des tags (ex: ["React", "TypeScript"])
- `project_url` (string | null) - URL du projet en ligne
- `github_url` (string | null) - URL du repo GitHub
- `created_at` (string) - Date de création (ISO format)

**Exemple de document :**
```json
{
  "title": "Mon Super Projet",
  "description": "Une description détaillée du projet",
  "image_url": "https://example.com/image.jpg",
  "tags": ["React", "Next.js", "Firebase"],
  "project_url": "https://monprojet.com",
  "github_url": "https://github.com/user/repo",
  "created_at": "2024-12-21T10:00:00.000Z"
}
```

#### Collection `admins`
Cette collection stocke les comptes administrateurs. Chaque document doit avoir :
- `email` (string) - Email de l'admin
- `password` (string) - Mot de passe hashé en SHA-256
- `created_at` (string) - Date de création (ISO format)

**Pour créer un admin :**
1. Allez sur `/admin` de votre application
2. Utilisez le formulaire de création d'admin dans le dashboard
3. Ou créez manuellement un document avec un mot de passe hashé

**Pour hasher un mot de passe manuellement :**
```javascript
// Dans la console du navigateur
const password = "votre_mot_de_passe"
const encoder = new TextEncoder()
const data = encoder.encode(password)
const hashBuffer = await crypto.subtle.digest("SHA-256", data)
const hashArray = Array.from(new Uint8Array(hashBuffer))
const hashedPassword = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
console.log(hashedPassword)
```

### 2. Règles de sécurité Firestore

Dans la console Firebase, configurez les règles de sécurité :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection portfolio - lecture publique, écriture authentifiée
    match /portfolio/{document=**} {
      allow read: if true;
      allow write: if false; // Géré côté serveur
    }
    
    // Collection admins - accès restreint
    match /admins/{document=**} {
      allow read, write: if false; // Géré côté serveur uniquement
    }
  }
}
```

### 3. Configuration du projet

La configuration Firebase est déjà intégrée dans `lib/firebase/config.ts` :
- Project ID: `docky-dev-fr`
- Les credentials sont déjà configurés

### 4. Tester la connexion

1. Démarrez le serveur : `npm run dev`
2. Allez sur `http://localhost:3000`
3. Les projets devraient se charger depuis Firestore
4. Testez l'admin sur `/admin`

### 5. Premiers pas

**Créer votre premier admin :**
1. Créez manuellement un document dans la collection `admins` avec :
   ```json
   {
     "email": "admin@example.com",
     "password": "hash_sha256_de_votre_mot_de_passe",
     "created_at": "2024-12-21T10:00:00.000Z"
   }
   ```
2. Connectez-vous sur `/admin`
3. Utilisez le dashboard pour gérer vos projets

**Ajouter des projets :**
- Via le dashboard admin (`/admin/dashboard`)
- Ou manuellement dans Firestore

## Troubleshooting

### Erreur de connexion Firebase
- Vérifiez que les credentials dans `lib/firebase/config.ts` sont corrects
- Assurez-vous que les collections existent dans Firestore

### Les projets ne s'affichent pas
- Vérifiez que la collection s'appelle bien `portfolio`
- Vérifiez les règles de sécurité Firestore

### Impossible de se connecter en admin
- Vérifiez que le hash du mot de passe est correct
- Vérifiez que l'email correspond exactement

## Support

Pour toute question, consultez la documentation Firebase :
- https://firebase.google.com/docs/firestore
