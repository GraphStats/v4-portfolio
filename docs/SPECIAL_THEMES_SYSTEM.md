# 🎨 Système de Thèmes Spéciaux

## 📋 Vue d'ensemble

Ce système permet d'activer des thèmes spéciaux temporaires sans modifier le code de base de l'application. Les thèmes sont complètement isolés dans des fichiers séparés.

## 🗂️ Structure des fichiers

```
portfolio-new/
├── components/
│   ├── special-theme-handler.tsx          # Handler principal (NE PAS MODIFIER SAUF POUR AJOUTER DE NOUVEAUX THÈMES)
│   └── special-themes/
│       └── new-year-overlay.tsx           # Overlay du thème Nouvel An
├── styles/
│   └── special-themes/
│       └── new-year.css                   # Styles du thème Nouvel An
└── public/
    └── styles/
        └── special-themes/
            └── new-year.css               # Copie publique du CSS (chargé dynamiquement)
```

## 🎆 Thème Nouvel An (20 déc - 2 jan)

### Caractéristiques

- **Palette dorée spectaculaire** avec 7+ nuances d'or
- **Particules dorées flottantes** (30 particules animées)
- **Confettis dorés** tombant du haut
- **Feux d'artifice** au clic (30% de chance)
- **Lueurs dorées** en arrière-plan
- **Message "Bonne Année"** qui apparaît brièvement
- **Animations** : brillance, pulsation, rotation, scintillement
- **Curseur personnalisé** doré
- **Scrollbar dorée**
- **Sélection de texte** avec effet doré

### Fichiers concernés

1. **`components/special-themes/new-year-overlay.tsx`**
   - Gère les effets visuels (particules, confettis, feux d'artifice)
   - Affiche le message de vœux
   - Crée les lueurs d'arrière-plan

2. **`styles/special-themes/new-year.css`** & **`public/styles/special-themes/new-year.css`**
   - Palette de couleurs complète
   - Animations et keyframes
   - Styles pour tous les éléments
   - Effets de hover et interactions

## 🔧 Comment fonctionne le système

### 1. Détection de la période

Le `SpecialThemeHandler` vérifie la date actuelle toutes les heures :

```typescript
const isDecemberPeriod = now.getMonth() === 11 && now.getDate() >= 20
const isJanuaryPeriod = now.getMonth() === 0 && now.getDate() <= 2
const isActive = isDecemberPeriod || isJanuaryPeriod
```

### 2. Chargement dynamique

Quand le thème est actif :
- Ajoute la classe `special-new-year` à `<html>`
- Charge dynamiquement le CSS depuis `/public/styles/special-themes/new-year.css`
- Affiche l'overlay avec les effets visuels

Quand le thème est inactif :
- Retire la classe `special-new-year`
- Supprime le lien CSS
- Cache l'overlay

### 3. Isolation complète

**AUCUN fichier de base n'est modifié** :
- ✅ `globals.css` reste intact
- ✅ `page.tsx` reste intact
- ✅ Autres composants restent intacts

Le thème fonctionne uniquement via :
- Classe CSS `.special-new-year`
- Fichiers dans `special-themes/`
- Chargement dynamique

## ➕ Ajouter un nouveau thème spécial

### Étape 1 : Créer les fichiers du thème

```bash
# Créer le CSS du thème
styles/special-themes/mon-theme.css

# Créer l'overlay (optionnel)
components/special-themes/mon-theme-overlay.tsx

# Copier le CSS dans public
public/styles/special-themes/mon-theme.css
```

### Étape 2 : Modifier le handler

Dans `components/special-theme-handler.tsx`, ajouter la logique de détection :

```typescript
// Importer l'overlay
const MonThemeOverlay = dynamic(
    () => import("./special-themes/mon-theme-overlay").then(mod => ({ default: mod.MonThemeOverlay })),
    { ssr: false }
)

// Dans checkTheme()
const isMonTheme = /* votre logique de date */

if (isMonTheme) {
    document.documentElement.classList.add("special-mon-theme")
    // Charger le CSS...
}
```

### Étape 3 : Créer le CSS

```css
/* styles/special-themes/mon-theme.css */
.special-mon-theme {
    /* Vos variables CSS */
    --primary: ...;
    --accent: ...;
}

.special-mon-theme h1 {
    /* Vos styles */
}
```

## 🎨 Classes CSS disponibles

Le thème Nouvel An utilise ces classes pour cibler les éléments :

- `.special-new-year` - Classe racine
- `.text-gradient` - Texte avec dégradé
- `.glass` - Éléments en verre
- `[class*="card"]` - Toutes les cartes
- `.mesh-bg` - Arrière-plans mesh
- `button`, `.button` - Boutons
- `header`, `footer` - En-tête et pied de page

## 🚀 Déploiement

### Important : Synchroniser les fichiers CSS

Après modification de `styles/special-themes/new-year.css`, **TOUJOURS** copier vers public :

```bash
Copy-Item -Path "styles\special-themes\new-year.css" -Destination "public\styles\special-themes\new-year.css"
```

Ou créer un script npm :

```json
{
  "scripts": {
    "sync-themes": "xcopy /Y styles\\special-themes\\*.css public\\styles\\special-themes\\"
  }
}
```

## 🐛 Dépannage

### Le thème ne s'active pas

1. Vérifier la date actuelle
2. Ouvrir la console : la classe `special-new-year` doit être sur `<html>`
3. Vérifier que le CSS est chargé dans l'onglet Network

### Les effets visuels ne s'affichent pas

1. Vérifier la console pour les erreurs
2. S'assurer que l'overlay est monté (React DevTools)
3. Vérifier que les z-index sont corrects

### Le CSS ne se charge pas

1. Vérifier que le fichier existe dans `public/styles/special-themes/`
2. Vérifier le chemin dans le handler : `/styles/special-themes/new-year.css`
3. Redémarrer le serveur de dev

## 📝 Bonnes pratiques

1. **Ne jamais modifier `globals.css`** pour les thèmes spéciaux
2. **Toujours utiliser des classes préfixées** (`.special-*`)
3. **Tester la désactivation** du thème
4. **Optimiser les performances** (lazy loading, animations GPU)
5. **Documenter les périodes** d'activation
6. **Synchroniser** styles/ et public/

## 🎯 Avantages de ce système

- ✅ **Isolation complète** - Pas de risque de casser le code de base
- ✅ **Chargement dynamique** - CSS chargé uniquement quand nécessaire
- ✅ **Facile à maintenir** - Tout est dans des dossiers séparés
- ✅ **Réutilisable** - Système extensible pour d'autres thèmes
- ✅ **Performant** - Lazy loading des composants
- ✅ **Propre** - Nettoyage automatique après la période

## 📅 Calendrier des thèmes

| Thème | Période | Fichiers |
|-------|---------|----------|
| Nouvel An | 20 déc - 2 jan | `new-year.css`, `new-year-overlay.tsx` |
| (À venir) | - | - |

---

**Créé le** : 21 décembre 2025  
**Dernière mise à jour** : 21 décembre 2025
