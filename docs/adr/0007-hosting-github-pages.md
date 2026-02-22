# ADR 0007: Hosting auf GitHub Pages

Status: accepted  
Datum: 2026-02-22

## Kontext

Die Website ist eine statische Hugo-Site (vgl. ADR 0001). Fuer den Betrieb benoetigen wir ein oeffentliches Hosting ohne eigene Server-Infrastruktur. Der Build umfasst neben Hugo einen vorgelagerten Schritt (Sovereignty Score, siehe ADR 0006). Aenderungen sollen nach Merge in den Hauptbranch automatisch live gehen.

## Entscheidung

Wir hosten die Site auf **GitHub Pages** und nutzen **GitHub Actions** fuer Build und Deploy:

- Bei jedem Push auf den Branch `main` (inkl. Merge eines PRs) laeuft ein Workflow, der:
  1. Node-Dependencies installiert (`npm ci`)
  2. das Score-Skript ausfuehrt (`npx tsx scripts/score-tools.ts`)
  3. Hugo baut (`hugo build --gc --minify` mit baseURL und cacheDir aus der Action)
  4. das Ergebnis als Pages-Artifact hochlaedt und deployed
- Die Quelle fuer Pages ist **GitHub Actions** (nicht „Deploy from a branch“).
- Optional kann eine Custom Domain (z. B. sovereign-tech-directory.eu) in den Repository-Einstellungen konfiguriert werden.

## Konsequenzen

Positiv:
- Kein eigener Server, keine laufenden Infrastruktur-Kosten
- Reproduzierbarer Build im Repo (`.github/workflows/hugo.yaml`)
- Automatische Aktualisierung bei jedem Merge in `main`
- Hugo-Cache zwischen Builds reduziert Laufzeit

Negativ:
- Abhaengigkeit von GitHub (Verfuegbarkeit, AGB)
- Build-Laufzeit und -Limits unterliegen den GitHub Actions Kontingenten

## Alternativen

1) Netlify / Vercel / Cloudflare Pages  
   - Vorteil: oft groessere Limits, erweiterte Features  
   - Nachteil: zusaetzlicher Dienst, ggf. Konfiguration ausserhalb des Repos

2) Eigenes Hosting (VPS + Nginx o. a.)  
   - Vorteil: volle Kontrolle  
   - Nachteil: Betrieb, Updates, Sicherheit in eigener Verantwortung

3) Deploy from branch (GitHub Pages mit gebautem `public/` im Repo)  
   - Vorteil: sehr einfache Pages-Konfiguration  
   - Nachteil: Build-Artefakte im Repo, Score-Schritt muesste lokal oder in separater CI laufen; wir bevorzugen „Build in CI, nur Quellcode im Repo“.

## Referenzen

- ADR 0001 (Static Site Generator)
- ADR 0006 (Sovereignty Score, Build-Integration)
- [Hugo: Host on GitHub Pages](https://gohugo.io/host-and-deploy/host-on-github-pages/)
- Workflow: `.github/workflows/hugo.yaml`
