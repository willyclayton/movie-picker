# Movie Picker Project Memory

## Project Overview
Non-traditional movie recommender using Russell's Circumplex model (Valence × Arousal axes).
Location: `/Users/will.clayton/Desktop/Aside_project/movie-picker`

## Tech Stack
- **Next.js 16 (App Router)** + TypeScript + Tailwind v4 + Framer Motion
- **Tailwind v4**: Configuration is CSS-based via `@theme {}` in `globals.css`, NOT `tailwind.config.ts`
- Fonts: Cormorant Garamond (serif) + Inter, loaded via `next/font/google`

## Key Architecture
- Circumplex coord system: `{valence: -1..+1, arousal: -1..+1, weight: 1-3}`
- All answers map to MoodCoordinates → weighted average → quadrant → TMDB genres
- Mood-counter: flip valence sign when user wants "escape"
- TMDB key server-side only, all movie fetching through `/api/*` routes

## Important Files
- `src/data/circumplex.ts` — quadrant → genre mapping + axis blending logic
- `src/lib/circumplex.ts` — coordinate math (average, applyMoodCounter, extract)
- `src/data/colorMappings.ts` — 20 swatches with empirical valence/arousal scores
- `src/data/images.ts` — 10 OASIS-scored images (add WebPs to `/public/quiz-images/`)
- `src/data/questions.ts` — projective questions pool (weather, animal, texture)
- `src/app/api/recommendations/route.ts` — full recommendation engine

## Design Tokens (Tailwind v4 via @theme in globals.css)
- background: `#0A0A0A`, card: `#141414`, overlay: `#1C1C1C`
- text: `#F0EDE6`, muted: `#9A9590`, accent: `#C9A84C`, active: `#E8D5A3`
- Rounded everywhere (8px min) — angular shapes prime threat vigilance

## State Passing
Quiz → Results via `sessionStorage.setItem('moviePickerAnswers', JSON.stringify(answers))`

## Quiz Images
10 WebP files needed in `/public/quiz-images/`. See README there for filenames + Unsplash queries.
Images degrade gracefully if missing.

## Setup Required
1. Add `TMDB_API_KEY` to `.env.local`
2. Optionally add `STREAMING_API_KEY` (movieofthenight.com RapidAPI)
3. Add 10 WebP images to `/public/quiz-images/`

## Build Notes
- Tailwind v4 uses `@tailwindcss/postcss` in postcss.config.mjs
- `tailwind.config.ts` exists but is superseded by CSS @theme config
- `npm run build` succeeds cleanly
