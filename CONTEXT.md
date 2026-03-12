# CalmHomeSpaces Manager — CONTEXTE

> Ce fichier documente la logique métier, l'architecture et le schéma de données du projet.

---

## A. Business Model & Stratégie

### Flux de Trafic
```
Pinterest (Image virale) → Notre Site (Bridge Page) → Amazon (Lien Affilié) → Achat
```

### Problème
Amazon bannit les comptes affiliés qui envoient du trafic direct depuis les réseaux sociaux sans contexte ("clics à l'aveugle"). Les liens directs Pinterest → Amazon sont interdits par les TOS.

### Solution
La **Bridge Page** sert de tampon entre Pinterest et Amazon :
- Elle **qualifie l'utilisateur** en ajoutant du contexte (description, avis, UI premium)
- Elle **apporte de la valeur** (belle présentation, informations produit)
- Elle affiche **clairement l'avertissement d'affiliation** (conformité FTC + Amazon Associates)

### Esthétique
- Style : **"Calm, Cozy, Minimalist, High-End"**
- Le design doit être une **extension naturelle de Pinterest**
- ❌ Pas de pop-ups agressifs, pas de design amateur, pas de spam

---

## B. Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 14+ (App Router) |
| Langage | TypeScript (Strict mode) |
| Styling | Tailwind CSS v4 |
| Utilitaires CSS | `clsx` + `tailwind-merge` |
| Icônes | Lucide React |
| CMS Headless | Airtable (API REST) |
| Hébergement | Vercel |
| Fonts | `Playfair Display` (Titres) + `Inter` (Corps) via `next/font` |
| Optimisation Image | `next/image` (WebP/AVIF auto) |

---

## C. Architecture du Système

### 1. Le Cerveau — Airtable
Source de vérité unique. Contient les produits, images, textes IA, statuts de publication et logs d'erreurs.

### 2. Les Ouvriers — n8n (Externalisé)
Automatisation externe : lit Airtable, génère le contenu via Gemini, met à jour Airtable. **Non codé dans ce projet.**

### 3. La Vitrine — Next.js (Ce projet)
Site statique avec ISR (Incremental Static Regeneration). Pas de base de données locale. Fetch Airtable au build et à la demande.

---

## D. Schéma Airtable — Table `Products`

| Champ | Type | Description |
|-------|------|-------------|
| `Title` | Single Line Text | Titre SEO (généré par IA) |
| `Description` | Long Text | Texte marketing copywriting |
| `Generated_Media` | Attachment | Image haute qualité |
| `Affiliate_Link` | URL | Lien Amazon avec tag partenaire |
| `Status` | Single Select | `To Do` / `Processing` / `Ready` / `Published` / `Error` |
| `Bridge_URL` | Formula | URL calculée de la page Next.js |
| `Approved` | Checkbox | Validation humaine |
| `Category` | Single Select | Ex: "Lighting", "Furniture", "Decor" |

---

## E. Conformité & Sécurité

### Amazon Associates TOS
- Tous les liens Amazon : `rel="nofollow noreferrer noopener"` + `target="_blank"`
- Disclaimer FTC visible en permanence à proximité du CTA

### Disclaimer obligatoire
> "En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises."

### Protection
- Aucune clé API en dur (variables d'environnement uniquement)
- Champs Airtable filtrés côté serveur (pas d'exposition de données internes)
