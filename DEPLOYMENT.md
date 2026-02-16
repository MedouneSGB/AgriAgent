# Guide de Déploiement AgriAgent

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│     Vercel      │────▶│   Google Cloud   │────▶│   Supabase  │
│   (Frontend)    │     │    (Backend)     │     │  (Database) │
│   Next.js 16    │     │   FastAPI/Python │     │  PostgreSQL │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

---

## 1. Déploiement Frontend sur Vercel

### Option A : Déploiement via Interface Web

1. **Connecter le repo**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "Add New Project"
   - Importez `MedouneSGB/AgriAgent`
   - Sélectionnez le dossier `frontend`

2. **Configurer les variables d'environnement**
   ```
   NEXT_PUBLIC_SUPABASE_URL = <votre-url-supabase>
   NEXT_PUBLIC_SUPABASE_ANON_KEY = <votre-anon-key>
   NEXT_PUBLIC_API_URL = https://agriagent-backend-xxxxx-ew.a.run.app
   ```

3. **Déployer**
   - Framework: Next.js (auto-détecté)
   - Root Directory: `frontend`
   - Cliquez "Deploy"

### Option B : Déploiement via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer (depuis le dossier frontend)
cd frontend
vercel --prod
```

---

## 2. Déploiement Backend sur Google Cloud

### Prérequis

```bash
# Installer Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Se connecter
gcloud auth login

# Configurer le projet
gcloud config set project VOTRE_PROJECT_ID
```

### Option A : Cloud Run (Recommandé)

```bash
cd backend

# Configurer les secrets (une seule fois)
gcloud secrets create ANTHROPIC_API_KEY --data-file=-
# Collez votre clé et appuyez Ctrl+D

gcloud secrets create SUPABASE_URL --data-file=-
gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=-
gcloud secrets create SUPABASE_JWT_SECRET --data-file=-

# Optionnel: Twilio
gcloud secrets create TWILIO_ACCOUNT_SID --data-file=-
gcloud secrets create TWILIO_AUTH_TOKEN --data-file=-
gcloud secrets create TWILIO_PHONE_NUMBER --data-file=-

# Déployer avec Cloud Build
gcloud builds submit --config cloudbuild.yaml

# OU déploiement manuel
gcloud run deploy agriagent-backend \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars "APP_ENV=production,FRONTEND_URL=https://agriagent.vercel.app" \
  --set-secrets "ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,SUPABASE_URL=SUPABASE_URL:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,SUPABASE_JWT_SECRET=SUPABASE_JWT_SECRET:latest"
```

### Option B : App Engine

```bash
cd backend

# Déployer
gcloud app deploy app.yaml

# Configurer les variables (Console GCP > App Engine > Settings)
# Ajouter toutes les variables d'environnement manuellement
```

---

## 3. Configuration Supabase (Existant)

Votre Supabase reste inchangé. Assurez-vous que :

1. **Tables créées** (via `migration.sql`)
2. **RLS activé** pour la sécurité
3. **URL autorisées** dans Authentication > URL Configuration :
   - `https://agriagent.vercel.app`
   - `https://agriagent-backend-xxxxx-ew.a.run.app`

---

## 4. Connexion Frontend ↔ Backend

Après le déploiement du backend, récupérez l'URL :

```bash
# Cloud Run
gcloud run services describe agriagent-backend --region europe-west1 --format="value(status.url)"

# App Engine
gcloud app browse
```

Mettez à jour `NEXT_PUBLIC_API_URL` dans Vercel avec cette URL.

---

## 5. Vérification

### Test Backend
```bash
curl https://agriagent-backend-xxxxx-ew.a.run.app/api/health
```

### Test Frontend
Visitez `https://agriagent.vercel.app`

---

## 6. CI/CD Automatique (Optionnel)

### GitHub Actions pour Cloud Run

Créez `.github/workflows/deploy-backend.yml` :

```yaml
name: Deploy Backend to Cloud Run

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: agriagent-backend
          source: ./backend
          region: europe-west1
```

---

## Coûts Estimés

| Service | Gratuit | Payant |
|---------|---------|--------|
| **Vercel** | 100GB bandwidth/mois | ~$20/mois (Pro) |
| **Cloud Run** | 2M requêtes/mois | ~$5-20/mois |
| **Supabase** | 500MB DB, 50K users | ~$25/mois (Pro) |
| **Anthropic** | - | ~$15/1M tokens |

**Total estimé pour usage modéré : $25-50/mois**

---

## Dépannage

### Erreur CORS
Vérifiez `FRONTEND_URL` dans le backend pointe vers votre domaine Vercel.

### Erreur 503 Cloud Run
Augmentez la mémoire : `--memory 1Gi`

### Erreur Supabase Auth
Vérifiez les URLs autorisées dans Supabase Dashboard.
