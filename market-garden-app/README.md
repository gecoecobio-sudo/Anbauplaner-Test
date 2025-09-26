# Market Garden Anbauplaner

Produktionsreife Next.js App für Market-Garden Betriebe mit Timeline-Planung, Aufgabenverwaltung und Mondphasen-Integration.

## ✨ Features
- Drag & Drop Timeline mit Tages- und KW-Ansicht
- Anpassbare Phasenmodelle mit automatischer Task-Generierung
- Mondphasen-Overlay (Biodynamische Kategorien)
- Aufgabenliste mit Fokus auf heute, Zukunft und Historie
- Multi-Tenant-RLS für Supabase + Demo-Modus ohne Login
- Umfangreiche Kultur-Datenbank mit recherchierten Defaults

## 🍼 Super einfache Schritt-für-Schritt-Anleitung

Diese Anleitung funktioniert auf Windows, macOS und Linux. Alles passiert lokal auf deinem Computer – du brauchst keinen eigenen Server.

1. **Vorbereitung (einmalig)**
   1. Installiere [Node.js LTS](https://nodejs.org/) (dadurch bekommst du auch `npm`).
   2. Lade dir [Git](https://git-scm.com/downloads) herunter und installiere es.
   3. Erstelle einen kostenlosen Account bei [Supabase](https://supabase.com) und lege ein neues Projekt an (braucht ein paar Minuten).

2. **Projekt von GitHub holen**
   ```bash
   git clone https://github.com/<dein-benutzername>/<repo-name>.git
   cd <repo-name>/market-garden-app
   ```
   > Falls du Git nicht nutzen möchtest, kannst du das ZIP von GitHub herunterladen, entpacken und im Ordner `market-garden-app` weiterarbeiten.

3. **Datei mit Zugangsdaten anlegen**
   ```bash
   cp .env.example .env.local
   ```
   - Öffne `.env.local` mit einem Texteditor.
   - Trage bei `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` die Werte aus deinem Supabase-Projekt ein (Einstellungen → API).

4. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```
   (Beim ersten Mal dauert das ein paar Minuten.)

5. **App starten**
   ```bash
   npm run dev
   ```
   - Wenn „ready - started server on 0.0.0.0:3000“ erscheint, öffne im Browser `http://localhost:3000`.
   - Du kannst die App sofort im Demo-Modus testen. Für dein echtes Supabase-Projekt loggst du dich ein (Google OAuth aktivieren, siehe unten).

6. **Supabase-Datenbank einrichten (optional für eigene Daten)**
   - Installiere das [Supabase CLI](https://supabase.com/docs/guides/cli) (nur falls du die Datenbank-Struktur automatisch anlegen möchtest).
   - Melde dich im Terminal an: `supabase login` und folge den Anweisungen.
   - Führe das Schema ein:
     ```bash
     supabase db push --file supabase/schema.sql
     ```

7. **Google-Login aktivieren (optional)**
   - In Supabase unter „Authentication → Providers → Google“ aktivieren.
   - Als Redirect-URL eintragen:
     - Lokal: `http://localhost:3000/auth/callback`
     - Produktion (z. B. Vercel): `https://deine-domain.de/auth/callback`

> **Hinweis:** Wir können nicht direkt auf dein Supabase-Projekt zugreifen, weil die Zugangsdaten bei dir bleiben müssen. Trage sie daher in `.env.local` ein und teile sie mit niemandem.

Wenn du die App später erneut starten möchtest, genügt es, im Ordner `market-garden-app` `npm run dev` auszuführen.

## 🚀 Getting Started (Kurzfassung für Fortgeschrittene)

```bash
cp .env.example .env.local
# Supabase Keys eintragen
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
