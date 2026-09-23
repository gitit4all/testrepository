# testrepository

Moderne kleine Demo-App mit **React 19**, **Vite**, **Tailwind CSS 4** und **React Router**:

- Seitenmenü mit mehreren Screens (Start, Beispiel 1, Beispiel 2, Über)
- **Beispiel 1 – Begrüßung:** Eingabefeld für den Namen, Schreibmaschinen-Effekt mit blinkendem Cursor
- **Beispiel 2 – Aufgaben:** Eingabefeld für Aufgaben, neue Einträge blinken auf, Speicherung im Browser

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
