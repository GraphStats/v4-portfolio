# 🐛 Corrections du Thème Nouvel An

## Date : 21 décembre 2025 - 18:47

### Bugs corrigés

#### 1. ✅ Animation du message "Bonne Année" qui partait sur le côté

**Problème** :
- Le message "Bonne Année 2026" partait vers le côté au lieu de monter verticalement
- L'animation `fadeOut` utilisait `translateX(-50%)` sans le maintenir dans la transformation finale

**Solution** :
- Renommé l'animation en `fadeOutUp` pour plus de clarté
- Ajouté `transform: 'translateX(-50%)'` dans le style inline pour centrer initialement
- Modifié l'animation pour maintenir le centrage horizontal tout en montant verticalement :
  ```css
  @keyframes fadeOutUp {
      from {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
      }
      to {
          opacity: 0;
          transform: translateX(-50%) translateY(-50px);
      }
  }
  ```

**Fichier modifié** : `components/special-themes/new-year-overlay.tsx`

---

#### 2. ✅ Navbar et Theme Toggle en jaune/doré

**Problème** :
- Les liens de navigation (Projets, Tech, Contact) étaient affectés par le thème doré
- Le bouton de switch mode clair/sombre était également en jaune
- Le bouton Admin avait des effets dorés non désirés
- Les icônes de la navbar scintillaient

**Solution** :
Ajout d'une section d'exclusions dans `new-year.css` avec des règles `!important` pour :

1. **Liens de navigation** :
   ```css
   .special-new-year header nav a,
   .special-new-year header nav button {
       background: none !important;
       animation: none !important;
       box-shadow: none !important;
       color: inherit !important;
       filter: none !important;
   }
   ```

2. **Theme Toggle** :
   ```css
   .special-new-year header button[aria-label*="theme"],
   .special-new-year header button[aria-label*="Theme"] {
       background: none !important;
       animation: none !important;
       box-shadow: none !important;
       filter: none !important;
       color: inherit !important;
   }
   ```

3. **Icônes** :
   ```css
   .special-new-year header nav svg,
   .special-new-year header button[aria-label*="theme"] svg {
       animation: none !important;
       filter: none !important;
   }
   ```

4. **Bouton Admin** :
   ```css
   .special-new-year header a[href="/admin"],
   .special-new-year header a[href="/admin"] button {
       background: none !important;
       animation: none !important;
       box-shadow: none !important;
   }
   ```

5. **Tous les boutons du header** (sauf le logo) :
   ```css
   .special-new-year header button:not([class*="w-10"]):not([class*="h-10"]) {
       background: transparent !important;
       animation: none !important;
       box-shadow: none !important;
   }
   ```

6. **Logo** (garde l'effet doré) :
   ```css
   .special-new-year header .w-10.h-10 {
       background: linear-gradient(135deg, #FFD700, #FFA500) !important;
       animation: festive-rotate 20s linear infinite !important;
       box-shadow: 0 0 20px rgba(255, 215, 0, 0.5) !important;
   }
   ```

**Fichiers modifiés** :
- `styles/special-themes/new-year.css`
- `public/styles/special-themes/new-year.css` (synchronisé)

---

## Résultat final

### ✅ Ce qui a l'effet doré :
- Titres (h1, h2) avec `.text-gradient`
- Logo du site (rotation + brillance)
- Boutons principaux (CTA, formulaires, etc.)
- Cartes et sections
- Texte du hero
- Footer
- Particules et confettis
- Message "Bonne Année"
- Scrollbar
- Sélection de texte
- Curseur

### ❌ Ce qui garde le style original :
- Liens de navigation (Projets, Tech, Contact)
- Bouton Theme Toggle (mode clair/sombre)
- Bouton Admin
- Icônes de la navbar
- Tous les boutons du header (sauf le logo)

---

## Comment tester

1. **Vérifier l'animation du message** :
   - Recharger la page
   - Observer le message "Bonne Année 2026" en haut
   - Il doit monter verticalement et disparaître (pas partir sur le côté)

2. **Vérifier la navbar** :
   - Survoler "Projets", "Tech", "Contact"
   - Ils doivent garder leur couleur d'origine (pas jaune)
   - Le hover doit être subtil (translateY(-2px))

3. **Vérifier le Theme Toggle** :
   - Cliquer sur le bouton soleil/lune
   - Il doit garder son style d'origine
   - Pas d'effet doré, pas de brillance

4. **Vérifier le logo** :
   - Le logo doit tourner lentement
   - Il doit avoir un effet doré
   - Il doit briller

---

## Notes techniques

- Utilisation de `!important` nécessaire car les règles générales du thème sont très spécifiques
- Les sélecteurs utilisent des attributs (`aria-label*="theme"`) pour cibler précisément
- Le logo est exclu via `:not([class*="w-10"]):not([class*="h-10"])` pour garder son effet
- La synchronisation du CSS est automatique via `npm run sync-themes`

---

## Prochaines améliorations possibles

- [ ] Ajouter un toggle manuel pour activer/désactiver le thème (pour debug)
- [ ] Créer une version "light" du thème avec moins d'effets
- [ ] Ajouter des sons festifs (optionnel)
- [ ] Optimiser les performances des particules sur mobile
- [ ] Ajouter un compteur "Jours avant 2026" si on est avant le 31 déc

---

**Dernière mise à jour** : 21 décembre 2025 - 18:47
