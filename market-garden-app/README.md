# Market Garden Anbauplaner

Produktionsreife Next.js App für Market-Garden Betriebe mit Timeline-Planung, Aufgabenverwaltung und Mondphasen-Integration.

## ✨ Features
- Drag & Drop Timeline mit Tages- und KW-Ansicht
- Anpassbare Phasenmodelle mit automatischer Task-Generierung
- Mondphasen-Overlay (Biodynamische Kategorien)
- Aufgabenliste mit Fokus auf heute, Zukunft und Historie
- Multi-Tenant-RLS für Supabase + Demo-Modus ohne Login
- Umfangreiche Kultur-Datenbank mit recherchierten Defaults

## 🚀 Getting Started

```bash
cp .env.example .env.local
# trage deine Supabase Keys ein
npm install
npm run dev
```

Öffne `http://localhost:3000`. Ohne Login steht eine Demo-Timeline zur Verfügung.

### Supabase Setup
1. Neues Projekt anlegen und die URL/Anon Keys in `.env.local` eintragen.
2. Schema anlegen:
   ```bash
   supabase db push --file supabase/schema.sql
   ```
3. Google OAuth aktivieren und Redirect `https://<domain>/auth/callback` bzw. lokal `http://localhost:3000/auth/callback` hinzufügen.

### Tests
```bash
npm run test
```

## 📂 Projektstruktur
```
src/
  app/                Next.js App Router Routen
  components/         UI-Komponenten inkl. Timeline & Tasks
  data/               Recherchedaten & Demo-Inhalte
  hooks/              Zustand Stores
  lib/                Planungslogik (Tasks, Moon, Dates)
  providers/          React Query Provider
  tests/              Vitest Unit-Tests
supabase/schema.sql   Datenbankschema & RLS Policies
```

## 🛠 Tech Stack
- Next.js 15 (App Router, TypeScript strict)
- Tailwind CSS 4 (Custom Dark Theme)
- Supabase (Postgres + Auth + RLS)
- React Query & Zustand
- Vitest + Testing Library für Unit Tests

## 📦 Deployment
Vercel-ready. Stelle sicher, dass alle `NEXT_PUBLIC_*` Variablen und die Supabase OAuth Redirects gesetzt sind.
