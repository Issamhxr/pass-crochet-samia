# Plan du site - Pass-Crochet Samia

## Structure complète du site

```
Pass-Crochet Samia
│
├── 🏠 Accueil (/)
│   ├── Hero Section
│   │   ├── Image flatlay crochet
│   │   ├── Titre principal
│   │   ├── CTA Boutique → /shop
│   │   └── CTA À propos → /about
│   │
│   ├── Mon univers
│   │   ├── Image création/mains
│   │   ├── Récit personnel
│   │   └── Citation inspirante
│   │
│   ├── Mes créations
│   │   ├── Galerie de 6 produits
│   │   ├── Filtrage par catégorie
│   │   └── CTA vers boutique
│   │
│   ├── Pourquoi choisir
│   │   ├── Fait main avec soin
│   │   ├── Pièces uniques
│   │   ├── Créations originales
│   │   └── Artisanal authentique
│   │
│   ├── Avis de nos clients
│   │   ├── 3 témoignages clients
│   │   ├── Notation par étoiles
│   │   └── Informations client
│   │
│   ├── Ateliers crochet
│   │   ├── Image d'atelier
│   │   ├── Description
│   │   ├── 3 piliers (Apprendre, Créer, Se détendre)
│   │   └── CTA réservation
│   │
│   └── Rejoignez mon univers
│       ├── Galerie Instagram (8 images)
│       └── CTA Instagram + Partage
│
├── 📦 Boutique (/shop)
│   ├── Hero Section
│   ├── Filtres de catégories
│   │   ├── Tous
│   │   ├── Amigurumis
│   │   ├── Sacs en Granny
│   │   ├── Accessoires
│   │   ├── Petites créations
│   │   └── Accessoires enfants
│   │
│   └── Grille de produits
│       ├── 6 produits affichés
│       ├── Images haute qualité
│       ├── Prix
│       ├── Catégorie
│       ├── Description courte
│       └── Bouton panier
│
├── ℹ️ À propos (/about)
│   ├── Hero Section
│   ├── Mon parcours
│   │   ├── Image de création
│   │   ├── Récit détaillé
│   │   └── Citation personnelle
│   │
│   ├── Mes valeurs
│   │   ├── Authenticité (🧶)
│   │   ├── Passion (💚)
│   │   └── Créativité (✨)
│   │
│   └── CTA
│       ├── Boutique
│       └── Contact
│
├── 📧 Contact (/contact)
│   ├── Hero Section
│   ├── Informations de contact
│   │   ├── Email
│   │   ├── Téléphone
│   │   ├── Adresse
│   │   └── Horaires d'ouverture
│   │
│   └── Formulaire de contact
│       ├── Champ Nom
│       ├── Champ Email
│       ├── Champ Sujet
│       ├── Champ Message
│       └── Bouton Envoyer
│
├── ❓ FAQ (/faq)
│   ├── Hero Section
│   ├── 8 questions fréquentes
│   │   ├── Délais de préparation
│   │   ├── Commandes personnalisées
│   │   ├── Délais de livraison
│   │   ├── Retours et échanges
│   │   ├── Entretien des créations
│   │   ├── Réductions gros volumes
│   │   ├── Moyens de paiement
│   │   └── Garantie produits
│   │
│   └── CTA Contact
│
└── 📋 Composants partagés
    ├── Header
    │   ├── Logo (Pass-Crochet Samia)
    │   ├── Navigation
    │   │   ├── Accueil → /
    │   │   ├── Boutique → /shop
    │   │   ├── À propos → /about
    │   │   ├── Ateliers → /#workshops
    │   │   └── Contact → /contact
    │   │
    │   ├── Menu mobile (hamburger)
    │   ├── Icône utilisateur
    │   └── Panier (badge 0)
    │
    ├── Footer
    │   ├── Newsletter
    │   │   ├── Formulaire email
    │   │   └── CTA S'inscrire
    │   │
    │   ├── 4 colonnes
    │   │   ├── Marque
    │   │   ├── Boutique (4 catégories)
    │   │   ├── Navigation (4 liens)
    │   │   └── Contact (email, socials)
    │   │
    │   └── Bas de page
    │       ├── Mentions légales
    │       ├── Politique de confidentialité
    │       └── CGV
    │
    ├── Hero (template)
    ├── Universe (section)
    ├── Creations (galerie)
    ├── Benefits (valeurs)
    ├── Testimonials (avis clients)
    ├── Workshops (ateliers)
    ├── Community (social)
    └── Newsletter (inscription)
```

## Pages et routes

| Route | Page | Titre | Description |
|-------|------|-------|------------|
| `/` | Home | Accueil | Page d'accueil principale |
| `/about` | About | À propos | Histoire et valeurs |
| `/shop` | Shop | Boutique | Galerie produits |
| `/contact` | Contact | Contact | Formulaire contact |
| `/faq` | FAQ | Questions fréquentes | Réponses FAQ |

## Composants React

| Composant | Type | Localisation | Usage |
|-----------|------|-------------|-------|
| Header | Layout | components/header.tsx | Page - Accueil, About, Contact, Shop, FAQ |
| Footer | Layout | components/footer.tsx | Page - Accueil, About, Contact, Shop, FAQ |
| Hero | Section | components/hero.tsx | Home |
| Universe | Section | components/universe.tsx | Home |
| Creations | Section | components/creations.tsx | Home |
| Benefits | Section | components/benefits.tsx | Home |
| Testimonials | Section | components/testimonials.tsx | Home |
| Workshops | Section | components/workshops.tsx | Home |
| Community | Section | components/community.tsx | Home |
| Newsletter | Form | components/newsletter.tsx | Footer |

## Actifs visuels

### Images générées
- `/public/images/hero-crochet.jpg` - Image flatlay produits
- `/public/images/about-crochet.jpg` - Mains en création
- `/public/images/workshop-crochet.jpg` - Atelier collectif
- `/public/images/product-1.jpg` - Amigurumi ours
- `/public/images/product-2.jpg` - Sac granny
- `/public/images/product-3.jpg` - Pochette rose
- `/public/images/product-4.jpg` - Porte-clés coloré
- `/public/images/product-5.jpg` - Amigurumi chat
- `/public/images/product-6.jpg` - Sac enfant

### Icônes (Lucide React)
- Menu, X (hamburger menu)
- ShoppingCart (panier)
- User (profil)
- Heart, Sparkles, Gift, Zap (valeurs)
- BookOpen, Lightbulb, Users (ateliers)
- Instagram, Facebook, Twitter (sociaux)
- Mail, Phone, MapPin (contact)
- ChevronDown (accordéon FAQ)
- Star (notation)

## Flux utilisateur

### Visiteur nouveau
1. Arrive à `/` (Accueil)
2. Explore le hero et les créations
3. Clique sur "Voir la boutique" → `/shop`
4. Sélectionne une catégorie
5. Clique sur "Ajouter au panier"
6. Parcourt les avis clients
7. Visite `/about` pour en savoir plus
8. Clique sur contact pour une commande personnalisée

### Client intéressé par les ateliers
1. Arrive à `/` (Accueil)
2. Scroll vers section Ateliers
3. Clique "Réserver un atelier"
4. Remplit formulaire `/contact`

### Support client
1. Visite `/faq` pour trouver réponses
2. Si toujours des questions → `/contact`

## Navigation cross-page

- Logo toujours mène à `/`
- Navigation toujours accessible
- Footer accessible depuis n'importe où
- Mobile menu pour < 768px
- Anchor links pour sections (#creations, #workshops)

---

**Version** : 1.0
**Dernière mise à jour** : Mai 2026
**Pages** : 5
**Composants** : 12
**Images** : 9
**Total de routes** : 6
