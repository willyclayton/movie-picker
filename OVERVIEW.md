# Movie Picker — Mood-Based Film Recommender

A non-traditional movie recommender that determines what you should watch tonight — without ever asking how you feel.

---

## The Idea

Most recommendation engines ask you to rate things you've seen or pick genres you like. This one takes a different approach: it reads your emotional state through indirect, projective inputs (colors, images, metaphors) and maps that to a scientifically grounded model of mood.

The result is a sub-30-second experience that feels intuitive rather than clinical — and surfaces films you might not have found on your own.

---

## How It Works

The core model is **Russell's Circumplex** — a well-established framework from affective psychology that plots emotional states on two axes: **valence** (pleasant ↔ unpleasant) and **arousal** (high energy ↔ low energy).

Every quiz answer produces a coordinate on this 2D plane. The four quadrants map to distinct genre clusters:

| Quadrant | Mood | Genres |
|---|---|---|
| High arousal, negative valence | Intense / Anxious | Thriller, Horror, Crime |
| High arousal, positive valence | Exuberant | Action, Comedy, Adventure |
| Low arousal, negative valence | Melancholic | Drama, Art House, History |
| Low arousal, positive valence | Content / Warm | Romance, Animation, Fantasy |

The quiz has seven steps, each adding signal with different weights:

1. **Color picker** — selects up to 5 colors from a palette mapped to valence/arousal via empirical color-emotion research (132 studies, 42,000+ participants). Saturation acts as a confidence weight.
2. **Image selector** — 15 photos pre-scored using OASIS (Open Affective Standardized Image Set) normative data, covering all four quadrants. User picks one instinctively.
3. **Projective question: weather** — "Pick a weather." A metaphor prompt drawn from validated projective psychology techniques.
4. **Projective question: animal** — "What animal are you right now?" Disambiguates high/low arousal edges.
5. **Projective question: texture** — "If your mood had a texture…" Captures valence nuance (sharp vs. smooth).
6. **Keywords** — Optional free-text tags ("slow burn", "feel-good") that nudge the TMDB discovery query without overriding the coordinate.
7. **Meta-preference toggle** — "Lean into how I feel" vs. "Take me somewhere else." Choosing escape flips the valence sign, routing to the opposite emotional quadrant.

All coordinates are weighted-averaged into a final position. If the result lands near an axis boundary, genre sets from adjacent quadrants are blended 60/40 to reflect ambiguity.

---

## Tech Stack

- **Next.js 16** (App Router) — full-stack, API routes keep the TMDB key server-side
- **TypeScript** throughout
- **Tailwind CSS v4** — custom dark design tokens, rounded everywhere (angular shapes prime threat vigilance per affective priming research)
- **Framer Motion** — step transitions, staggered reveals, loading animation
- **TMDB API** — movie discovery, poster images, watch providers, trailers
- **OMDB API** (optional) — Rotten Tomatoes, IMDB, and audience scores
- **Streaming API** (fallback) — supplements TMDB watch providers when needed

---

## Key Design Decisions

**Never ask directly.** All inputs are indirect and projective. Direct self-report ("how are you feeling?") degrades signal quality — people rationalize rather than feel.

**Under 30 seconds.** Beyond that, users shift from intuitive to analytical processing, reducing the quality of the mood signal.

**Rounded UI throughout.** Backed by affective priming research (Zajonc) — angular shapes activate mild threat vigilance, which would bias emotional inputs toward anxiety.

**Mood-counter path.** A significant segment of users want escape, not validation. The final toggle surfaces this explicitly and routes them to the emotional opposite.

**Emotional framing on results.** Each recommendation is labelled with its tone and a human framing ("For when you want to sit with something real") rather than a genre tag.

---

## Architecture

```
Quiz answers → MoodCoordinate[] → weighted average → (valence, arousal)
    → quadrant + genre selection (with axis blending)
    → TMDB discover (3 pages, parallel)
    → deduplicate → score by circumplex proximity → top 20
    → enrich: per-movie circumplex coord · streaming providers · RT/IMDB scores
    → results with tone labels + QuadrantViz
```

State is passed from quiz to results via `sessionStorage`. All TMDB calls are proxied through Next.js API routes so the key never reaches the client.

---

## Stack Summary

`Next.js` `TypeScript` `Tailwind CSS` `Framer Motion` `TMDB API` `Vercel`
