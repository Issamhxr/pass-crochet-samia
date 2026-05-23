# Pass-Crochet Samia - Site E-commerce Complet

## Vue d'ensemble

Un site e-commerce moderne et élégant pour la marque **Pass-Crochet Samia**, spécialisée dans les créations faites main au crochet. Le site présente une identité visuelle chaleureuse, authentique et professionnelle.

## Sections principales

### 1. **Accueil (Home - `/`)**
- **Hero Section** : Banner accrocheur avec image de produits, titre inspirant et CTAs
- **Mon univers** : Présentation de l'histoire personnelle et passionnée de Samia
- **Mes créations** : Galerie de 6 produits phares avec images de haute qualité
- **Pourquoi choisir** : 4 valeurs clés (fait main, unique, création originale, authentique)
- **Ateliers** : Section promotionnelle pour les ateliers de crochet
- **Rejoignez mon univers** : Galerie Instagram intégrée avec CTA sociaux

### 2. **À propos (`/about`)**
- Récit détaillé du parcours et de la passion de Samia
- Images de qualité professionnelle
- Trois piliers de valeur : Authenticité, Passion, Créativité
- CTA pour explorer les créations et se connecter

### 3. **Boutique (`/shop`)**
- Page produits complète avec filtrage par catégories
- 6 produits de démonstration dans différentes catégories :
  - Amigurumis (3 produits)
  - Sacs en Granny
  - Accessoires
  - Petites créations
  - Accessoires enfants
- Système de filtrage interactif
- Cards de produits avec images, prix et CTA

### 4. **Contact (`/contact`)**
- Formulaire de contact complet et fonctionnel
- Informations de contact multi-canaux (email, téléphone, adresse)
- Horaires d'ouverture
- Design professionnel et accueillant

## Design et Style

### Palette de couleurs
- **Primaire** : Beige chaud (`#C4A469`) - Représente le fait main et la chaleur
- **Secondaire** : Rose pâle (`#F0E8D8`) - Douceur et féminité
- **Accent** : Marron clair (`#E8CCAD`) - Accent chaleureux
- **Neutres** : Blancs, gris clairs pour l'accessibilité

### Typographie
- **Titres** : Police serif élégante pour le prestige
- **Corps** : Police sans-serif lisible et moderne
- **Hiérarchie** : Tailles et poids variés pour une bonne hiérarchie

### Composants visuels
- Images générées professionnellement pour tous les héros de section
- Produits avec images de studio haute qualité
- Transitions et animations fluides
- Design responsive mobile-first
- Système d'espacement cohérent

## Pages créées

```
/app
├── layout.tsx              # Layout principal avec métadonnées SEO
├── globals.css             # Styles globaux et design tokens
├── page.tsx                # Page d'accueil
├── about/
│   └── page.tsx            # Page à propos
├── contact/
│   └── page.tsx            # Page de contact
└── shop/
    └── page.tsx            # Page boutique

/components
├── header.tsx              # Barre de navigation responsive
├── hero.tsx                # Section héro de la page d'accueil
├── universe.tsx            # Section mon univers
├── creations.tsx           # Galerie de créations
├── benefits.tsx            # Section avantages
├── workshops.tsx           # Section ateliers
├── community.tsx           # Galerie social / rejoindre
└── footer.tsx              # Pied de page avec liens et contact

/public/images
├── hero-crochet.jpg        # Image flatlay de produits
├── about-crochet.jpg       # Image de création/mains au travail
├── workshop-crochet.jpg    # Image d'atelier collectif
├── product-1.jpg           # Amigurumi ours
├── product-2.jpg           # Sac granny
├── product-3.jpg           # Pochette rose
├── product-4.jpg           # Porte-clés
├── product-5.jpg           # Amigurumi chat
└── product-6.jpg           # Sac enfant
```

## Fonctionnalités

### Navigation
- ✅ Navigation principale avec menu mobile responsive
- ✅ Ancres de section (#creations, #workshops)
- ✅ Liens internes vers tous les pages principales

### E-commerce
- ✅ Grille de produits dynamique
- ✅ Filtrage par catégorie
- ✅ Images optimisées de produits
- ✅ Boutons d'ajout au panier prêts pour intégration

### Formulaire
- ✅ Formulaire de contact fonctionnel
- ✅ Validation des champs
- ✅ Feedback utilisateur

### SEO et Accessibilité
- ✅ Métadonnées optimisées (title, description)
- ✅ Structure HTML sémantique
- ✅ Contraste des couleurs conforme WCAG
- ✅ Texte alternatif pour toutes les images
- ✅ Navigation au clavier

## Améliorations futures

### E-commerce
- [ ] Panier d'achat persistant (localStorage ou session)
- [ ] Système de paiement (Stripe)
- [ ] Gestion des commandes
- [ ] Pages produit détaillées

### Contenu
- [ ] Blog pour partager inspirations et tutoriels
- [ ] Galerie Instagram intégrée en temps réel
- [ ] Portfolio des créations avec filtres avancés
- [ ] Testimonials clients

### Fonctionnalités
- [ ] Newsletter inscription
- [ ] Wishlist
- [ ] Système de notifications
- [ ] Chat en direct

## Technologies utilisées

- **Framework** : Next.js 16 avec App Router
- **Styling** : Tailwind CSS v4 avec design tokens OKLch
- **Composants** : shadcn/ui
- **Images** : Next.js Image avec optimisation
- **Icons** : Lucide React

## Installation et lancement

```bash
# Installation des dépendances
pnpm install

# Lancement du serveur de développement
pnpm dev

# Build de production
pnpm build

# Lancement en production
pnpm start
```

Le site sera accessible à `http://localhost:3000`

## Structure des composants

### Header
- Navigation responsive avec mobile menu
- Logo personnalisé
- Icônes utilisateur et panier

### Sections Hero
- Images optimisées et responsive
- Textes centrés avec hiérarchie claire
- CTA primaire et secondaire

### Cards de produits
- Hover effects élégants
- Affichage du prix et de la catégorie
- Bouton d'action primaire

### Formulaires
- Inputs stylisés avec focus states
- Validation côté client
- Labels et placeholders clairs

## Configuration du design

Les tokens de design sont définis dans `globals.css` en variables CSS OKLch :

```css
--primary: oklch(0.714 0.088 43.44)      /* Beige chaud */
--secondary: oklch(0.942 0.082 55.239)   /* Rose pâle */
--accent: oklch(0.92 0.051 23.926)       /* Marron clair */
```

Le système supporte le dark mode avec des ajustements de couleurs automatiques.

## Notes de marque

- **Valeur centrale** : Authenticité et fait main
- **Ton de voice** : Doux, chaleureux, passionné, authentique
- **Audience** : Personnes cherchant des créations uniques et artisanales
- **Proposition** : Chaque création porte une part de l'histoire de Samia

---

**Version** : 1.0.0
**Dernière mise à jour** : Mai 2026
**Statut** : Prêt pour production
