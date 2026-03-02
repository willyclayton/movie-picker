# Movie Picker

A mood-based movie recommender built on **Russell's Circumplex model** — it reads your emotional state through indirect, projective inputs and surfaces films matched to where you actually are right now.

No ratings. No genre menus. Under 30 seconds.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Create `.env.local` in the project root:

```env
# Required — get one at https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_key_here

# Optional — enables Rotten Tomatoes / IMDB scores on results
OMDB_API_KEY=your_key_here
```

---

## Quiz images

Add JPG files to `public/quiz-images/` (approx 800px wide). See `public/quiz-images/README.md` for the full list of 27 filenames, their circumplex coordinates, and which quiz step each appears in.

Images degrade gracefully if absent — missing images show a dark card with caption text.

---

## Tech stack

- **Next.js 16** (App Router) — API routes keep TMDB key server-side
- **TypeScript** throughout
- **Tailwind CSS v4** — CSS-based `@theme {}` config in `globals.css`
- **Framer Motion** — step transitions and staggered reveals
- **TMDB API** — movie discovery, posters, streaming providers
