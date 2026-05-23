# Guide de déploiement - Pass-Crochet Samia

## Prérequis

- Node.js 18+ 
- pnpm, npm ou yarn
- Compte Vercel (optionnel mais recommandé)
- Domaine personnel (optionnel)

## Installation locale

### 1. Cloner ou télécharger le projet

```bash
# Télécharger le ZIP depuis v0
cd pass-crochet-samia
```

### 2. Installer les dépendances

```bash
pnpm install
# ou
npm install
# ou
yarn install
```

### 3. Lancer en développement

```bash
pnpm dev
# ou
npm run dev
```

Le site sera accessible à `http://localhost:3000`

### 4. Builder pour la production

```bash
pnpm build
```

### 5. Lancer en production local

```bash
pnpm start
```

## Déploiement sur Vercel

### Option 1 : Via GitHub (Recommandé)

1. **Pousser le code vers GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pass-Crochet Samia site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pass-crochet-samia.git
   git push -u origin main
   ```

2. **Connecter Vercel à GitHub**
   - Aller sur https://vercel.com/new
   - Cliquer "Import Git Repository"
   - Sélectionner votre repo GitHub
   - Vercel détectera automatiquement Next.js

3. **Configuration Vercel**
   - Framework: Next.js (auto-détecté)
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Cliquer "Deploy"

4. **Domaine personnalisé**
   - Settings → Domains
   - Ajouter domaine personnalisé
   - Suivre les instructions DNS

### Option 2 : Déploiement direct sur Vercel

1. Installer Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Déployer
   ```bash
   vercel
   ```

3. Suivre les prompts Vercel

### Option 3 : Autres hébergeurs

**Netlify:**
```bash
npm run build
# Déployer le dossier .next
```

**AWS Amplify:**
- Connecter GitHub repo
- Vercel/Amplify détecte automatiquement Next.js

**DigitalOcean App Platform:**
- Connecter GitHub
- Suivre leur guide Next.js

## Variables d'environnement

Actuellement, aucune variable d'environnement n'est requise.

Si vous ajoutez des fonctionnalités à l'avenir :

```env
# .env.local (développement)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://votredomaine.com
```

> **Note** : Les variables avec `NEXT_PUBLIC_` sont exposées au navigateur. Ne pas y mettre de secrets.

## Configuration de domaine

### Avec Vercel (le plus simple)

1. Aller à Vercel Dashboard → Project Settings
2. Domains → Add Domain
3. Entrer votre domaine (ex: www.pass-crochet-samia.fr)
4. Suivre les instructions DNS
5. Attendre propagation DNS (5-48h)

### Avec DNS externe

1. Dans Vercel, noter les nameservers ou records CNAME
2. Aller chez votre registraire DNS (OVH, GoDaddy, etc.)
3. Mettre à jour les DNS records
4. Attendre propagation

## Intégrations futures

### E-commerce (Stripe)

```typescript
// Si vous ajoutez Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
```

Ajouter variables Vercel:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Email (Resend ou SendGrid)

```typescript
import { resend } from 'resend'

// Dans /api/contact
await resend.emails.send({
  from: 'contact@yourdomain.com',
  to: email,
  html: emailTemplate
})
```

Variables à ajouter:
- `RESEND_API_KEY` ou `SENDGRID_API_KEY`
- `CONTACT_EMAIL`

### CMS (Contentful, Sanity)

Si vous voulez synchroniser les produits avec un CMS:

```typescript
// Dans app/shop/page.tsx
const products = await fetch(
  `https://api.sanity.io/v2021-06-07/data/query/production`,
  { 
    headers: {
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`
    }
  }
)
```

## Monitoring et Analytics

### Vercel Analytics (gratuit)

Automatiquement inclus dans Vercel. Voir dans Vercel Dashboard → Analytics

### Google Analytics

1. Créer un compte Google Analytics
2. Ajouter le script de tracking à `layout.tsx`

```typescript
import Script from 'next/script'

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

## Performance

### Image Optimization

Déjà optimisé avec Next.js Image component. Vérifier:
- Format WebP automatique
- Lazy loading
- Responsive sizes

### Cache

Pour Vercel, le cache est automatique. 
- Pages statiques : cache infini
- Routes dynamiques : cache configurable

## Maintenance

### Mise à jour des dépendances

```bash
# Vérifier les mises à jour
pnpm outdated

# Mettre à jour
pnpm update

# Forcer les majeures
pnpm update -D next@latest
```

### Redéploiement

Sur Vercel : tout commit vers main redéploie automatiquement

Localement :
```bash
git add .
git commit -m "Update description"
git push origin main
# Vercel détecte et redéploie automatiquement
```

## Troubleshooting

### Build échoue

```bash
# Nettoyer et relancer
rm -rf .next node_modules
pnpm install
pnpm build
```

### Pages 404

- Vérifier que tous les fichiers sont bien dans `/app`
- Vérifier les imports
- Vérifier la structure des dossiers

### Images ne s'affichent pas

- Vérifier le chemin `/public/images/`
- Vérifier l'alt text
- Dans Vercel : images doivent être optimisées, pas externes non sécurisées

### Lenteur

- Vérifier Vercel Analytics
- Optimiser les images
- Minimiser les dépendances
- Utiliser Server Components quand possible

## Sécurité

### HTTPS

Automatique sur Vercel et tous les hébergeurs modernes

### Headers de sécurité

Ajouter dans `next.config.mjs` :

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        }
      ]
    }
  ]
}
```

### Validation des formulaires

Déjà implémentée avec `required` et `type="email"`

## Checklist avant production

- [ ] Tester sur mobile
- [ ] Vérifier tous les liens internes
- [ ] Tester formulaire contact
- [ ] Vérifier images se chargent
- [ ] SEO metadata correcte
- [ ] Google Analytics configuré (si souhaité)
- [ ] Domain/SSL configuré
- [ ] Backup des images et contenus
- [ ] Plan de maintenance en place

## Support

- **Vercel Docs** : https://vercel.com/docs
- **Next.js Docs** : https://nextjs.org/docs
- **Tailwind Docs** : https://tailwindcss.com/docs

---

**Version** : 1.0
**Dernière mise à jour** : Mai 2026
**Plateforme recommandée** : Vercel
