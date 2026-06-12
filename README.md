# Rate Quest

A mobile-first, anonymous, 8-bit web game that runs a two-card concept test on
rate-locked homeowners. Built as a class experiment for BU SI 839, not a product.

**Research question:** will anything short of keeping their current mortgage rate
unfreeze a locked-in homeowner, and if cash can compete, at what price?

## Stack

- Vite + React single-page app
- Netlify hosting + Netlify Functions (v2) for the API
- Netlify Blobs for storage
- No auth, no accounts, no emails, no analytics

## The game (6 screens, ~90 seconds)

0. Disclaimer (cannot be skipped)
1. Build your homeowner (sets segmentation fields)
2. The choice: Rate Shield (A) vs Treasure Chest, $10,000 (B)
3. The escalator: chest grows (A) or shrinks (B); record the flip point
4. The real reason (barrier question; includes the kill-condition answer)
5. Result + native share

The response is written **once**, on completion of screen 4. Partial runs are
never stored.

## API

- `POST /api/respond` — writes one completed response object to Blobs.
- `GET /api/results?key=SECRET` — returns all responses as JSON for the dashboard.

The dashboard lives at `/results?key=SECRET`, where `SECRET` is the `RESULTS_KEY`
environment variable. The "auth" is a single shared secret in a query string,
which is good enough for a graded class demo with anonymous, non-sensitive data.

## Local development

```bash
npm install
npm install -g netlify-cli   # gives you functions + Blobs locally
netlify dev                  # serves the SPA and /api/* together
```

Plain `npm run dev` runs the front end only (no API/Blobs).

Set a local secret in a `.env` file:

```
RESULTS_KEY=changeme
```

Then open the dashboard at `http://localhost:8888/results?key=changeme`.

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   Build command and publish dir are read from `netlify.toml` (`npm run build`,
   `dist`).
3. Under **Site settings → Environment variables**, add `RESULTS_KEY` with a
   secret value.
4. Deploy. The dashboard is at `https://<your-site>.netlify.app/results?key=<RESULTS_KEY>`.

Netlify Blobs is enabled automatically for the deployed functions; no extra
configuration needed.

## Data model (one object per completed run)

```json
{
  "rate": 3.25,
  "household": 4,
  "homeSize": "too_big",
  "tenure": "5-10",
  "moveDesire": 4,
  "initialChoice": "A",
  "flipThreshold": 50000,
  "neverFlipped": false,
  "barrier": "rate",
  "completedAt": "ISO timestamp"
}
```

## Segmentation (hard-coded)

- **Locked-in mover** (the target): `rate < 5.5` AND `moveDesire >= 3`
- **Everyone else**: context / control

The dashboard computes every metric for both groups separately and combined.
