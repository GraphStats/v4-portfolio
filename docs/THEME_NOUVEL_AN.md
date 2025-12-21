# Thème Nouvel An 🎆✨

## Description

Le thème Nouvel An est un thème spécial doré qui s'active automatiquement sur le portfolio entre le **20 décembre** et le **2 janvier** de chaque année.

## Période d'activation

- **Début** : 20 décembre à 00:00:00
- **Fin** : 2 janvier à 23:59:59

## Caractéristiques visuelles

### Palette de couleurs dorées

#### Mode sombre
- **Primary** : Or riche (`oklch(0.78 0.18 75)`)
- **Accent** : Or brillant (`oklch(0.88 0.15 85)`)
- **Background** : Fond sombre chaud avec teinte dorée (`oklch(0.10 0.03 70)`)
- **Card** : Arrière-plan de carte légèrement doré (`oklch(0.15 0.04 75)`)
- **Border** : Bordures dorées (`oklch(0.35 0.08 75)`)

#### Mode clair
- **Primary** : Or profond (`oklch(0.68 0.18 75)`)
- **Accent** : Accent doré chaud (`oklch(0.78 0.16 80)`)
- **Border** : Bordures dorées subtiles (`oklch(0.85 0.05 80)`)

### Effets visuels

1. **Dégradé de texte animé** (`.text-gradient`)
   - Dégradé doré avec 5 couleurs : `#ffd700 → #ffed4e → #ff8c00 → #daa520 → #ffd700`
   - Animation de brillance continue (3 secondes)
   - Texte transparent avec clip de fond

2. **Effet de lueur pulsante** (`.animate-pulse-glow`)
   - Dégradé radial doré avec plusieurs couches
   - Animation de pulsation (2 secondes)
   - Effet de scale et d'opacité

## Implémentation technique

### Fichiers concernés

1. **`components/special-theme-handler.tsx`**
   - Composant React qui détecte la période active
   - Ajoute/retire la classe CSS `special-new-year` sur `<html>`
   - Vérification toutes les heures

2. **`styles/globals.css`**
   - Définition des variables CSS pour le thème
   - Animations et effets visuels
   - Support mode clair et sombre

3. **`scripts/update-special-versions.mjs`**
   - Script de mise à jour du changelog Firebase
   - Définit les dates d'activation/désactivation

### Logique de détection

```typescript
const isDecemberPeriod = now.getMonth() === 11 && now.getDate() >= 20
const isJanuaryPeriod = now.getMonth() === 0 && now.getDate() <= 2
const isNewYearTheme = isDecemberPeriod || isJanuaryPeriod
```

## Utilisation dans les composants

Pour appliquer les effets spéciaux dans vos composants :

```tsx
// Dégradé de texte doré animé
<h1 className="text-gradient">Bonne année !</h1>

// Effet de lueur pulsante
<div className="animate-pulse-glow">
  {/* Contenu */}
</div>
```

## Notes importantes

- Le thème s'active automatiquement, aucune action manuelle requise
- Compatible avec les modes clair et sombre
- Les effets sont optimisés pour les performances
- Le thème se désactive automatiquement après le 2 janvier

## Avertissements lint

Les avertissements suivants dans `globals.css` sont normaux et attendus (ils font partie de Tailwind CSS v4) :
- `@custom-variant` : Directive Tailwind CSS v4
- `@theme` : Directive Tailwind CSS v4
- `@apply` : Directive Tailwind CSS
- `background-clip` : Propriété standard ajoutée pour compatibilité

Ces avertissements n'affectent pas le fonctionnement du thème.
