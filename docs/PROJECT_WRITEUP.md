# Rate Quest — Project Write-Up

A one-page map of what we built, why, and how the data answers our question.
Use it to confirm we're on the main quest, not a side quest.

## The goal (the only thing that matters)

**Research question:** Will anything short of keeping their current mortgage
rate unfreeze a "locked-in" homeowner — and if cash can compete, at what price?

Everything below exists to answer that and nothing else.

## What we built

A mobile-first, anonymous, 8-bit web game ("a hero's journey through the Realm
of Bostonia") that runs a **two-card concept test** in about 90 seconds, plus a
private dashboard that turns responses into segmented analysis.

- **Front end:** Vite + React single-page game.
- **Back end:** two serverless functions (`/api/respond` to save one run,
  `/api/results` to read them) on Netlify, with Netlify Blobs for storage.
- **Dashboard:** `/results?key=SECRET` — team-only, password in the link.
- No accounts, no email, no PII, no tracking.

## The experimental logic

1. **Build a homeowner (segmentation).** Players set their rate, household,
   home size, tenure, and desire to move. This lets us split the target segment
   from everyone else *before* looking at behavior.

2. **The two-card choice (the core concept test).** One forced choice with equal
   visual weight:
   - **Card A — Rate Shield:** keep your current mortgage rate at your next home.
   - **Card B — Dragon's Hoard:** a fixed **$10,000** cash bonus toward your next
     home if you sell. (Anchor is deliberate and never randomized; it mirrors the
     proposed first-time-buyer credit.)
   This is the headline measure: *does cash even get considered vs. the rate?*

3. **The escalator (price discovery — the "at what price?" part).** We branch on
   the card they picked and find their tipping point:
   - Chose the rate (A): the cash offer **grows** $25k → $50k → $75k → $100k →
     $150k. We record the dollar value where they flip and take the cash, or
     "never."
   - Chose the cash (B): the offer **shrinks** $7.5k → $5k → $2.5k → $1k → $0. We
     record the floor where they switch back to keeping their rate, or "never"
     (riding it to $0 = a hassle-driven mover).
   This converts a yes/no into a **number**: the price at which the rate lock
   breaks.

4. **The barrier (the kill-condition).** One forced question: what's *really*
   keeping you in your home — the rate, the costs/fees, the hassle, or "honestly,
   I don't want to move." That last answer is the kill-condition: if locked-in
   movers mostly *don't want to move*, then no price fixes a preference, and the
   whole premise is challenged. We surface it, not bury it.

5. **The result (the share loop).** A hero title based on their behavior, plus a
   native share button to recruit another homeowner.

## The user experience

- **~90 seconds, six beats,** alternating gameplay with short animated story
  cards that frame each decision ("a herald arrives with two offers," etc.).
- Each themed card carries a plain-language **"In plain terms:"** line so the
  real-world meaning is never lost under the medieval flavor.
- Mobile-first, high-contrast, accessible (readable type, reduced-motion
  support), anonymous, and disclaimed up front (unskippable, verbatim copy).

## The data we collect

One record is written **only on completion** (after the barrier question).
Partial runs are not stored. Each record:

| Field | What it captures |
|---|---|
| `rate` | Current mortgage rate (2.0–8.0%) |
| `moveDesire` | Desire to move, 1–5 |
| `household`, `homeSize`, `tenure` | Context / segmentation color |
| `initialChoice` | A (rate) or B (cash) — the headline preference |
| `flipThreshold` | The dollar tipping point (flip up, or floor down) |
| `neverFlipped` | True if they never changed their mind |
| `barrier` | The stated real reason (incl. the kill-condition) |
| `completedAt` | Server timestamp |

**Segmentation (fixed before data exists):** a *locked-in mover* = rate < 5.5%
AND move-desire ≥ 3. The dashboard computes every metric for locked-in movers,
everyone else, and combined.

## How the data answers the goal

- **"Will anything unfreeze them?"** → the A-vs-B split among locked-in movers
  (do they ever pick cash?), plus how many "never" leave the rate at any price.
- **"At what price?"** → the flip-threshold distribution for locked-in movers,
  read against a shaded **$15k–$40k "plausible lender budget" band** (labeled
  ESTIMATE, verify before pitch). If the mass of flips sits above the band, cash
  can't realistically compete; if it sits inside it, there's a viable price.
- **"Is the premise even right?"** → the barrier breakdown. If "I don't want to
  move" is the plurality among locked-in movers, the constraint isn't financial
  and no offer wins.

## Integrity guardrails

- Anonymous, no PII, partial runs discarded.
- The $10k anchor is fixed and visible; the kill-condition answer is given equal
  weight; story copy frames tension without hinting at a "right" answer.
- A password-protected "clear all responses" reset lets us wipe test data so the
  real run starts clean.

## Side-quest check ✅

In scope: measuring **whether** cash competes with a locked rate and **at what
price**, for a clearly defined locked-in segment, with a stated-reason backstop.
Out of scope (and intentionally not built): accounts, email capture, analytics,
randomized anchors, admin editing — none of which serve the question.
