# testrepository

Moderne kleine Demo-App mit **React 19**, **Vite**, **Tailwind CSS 4** und **React Router**:

- Seitenmenü mit mehreren Screens (Start, Beispiel 1, Beispiel 2, Markdown-Editor, Über)
- **Beispiel 1 – Begrüßung:** Eingabefeld für den Namen, Schreibmaschinen-Effekt
- **Beispiel 2 – Aufgaben:** Eingabefeld für Aufgaben, Speicherung im Browser
- **Markdown-Editor:** geteilte Ansicht mit Live-Vorschau (marked + DOMPurify), Werkzeugleiste, Autosave, Download als `.md`
- Design in den Farben der **Universität Osnabrück** inkl. Logo

## Lokal

```bash
npm ci
npm run dev      # Entwicklungsserver
npm run build    # Produktions-Build nach dist/
```

## Deployment

`.github/workflows/deploy.yml` baut die App und veröffentlicht `dist/` in den Branch **`gh-pages`**.

Einmalig nötig: **Settings → Pages → Build and deployment → Source: „Deploy from a branch“**,
Branch **`gh-pages`**, Ordner **`/ (root)`**.
