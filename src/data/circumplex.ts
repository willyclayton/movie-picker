import type { CircumplexQuadrant } from '@/types/quiz';
import type { TMDBMovie } from '@/types/tmdb';

export const GENRE_COORD_MAP: Record<number, { valence: number; arousal: number }> = {
  27:    { valence: -0.75, arousal:  0.80 }, // Horror
  53:    { valence: -0.55, arousal:  0.72 }, // Thriller
  9648:  { valence: -0.25, arousal:  0.42 }, // Mystery
  80:    { valence: -0.42, arousal:  0.52 }, // Crime
  28:    { valence:  0.22, arousal:  0.88 }, // Action
  35:    { valence:  0.82, arousal:  0.55 }, // Comedy
  12:    { valence:  0.45, arousal:  0.78 }, // Adventure
  878:   { valence:  0.05, arousal:  0.65 }, // Sci-Fi
  18:    { valence: -0.42, arousal: -0.22 }, // Drama
  36:    { valence: -0.18, arousal: -0.35 }, // History
  99:    { valence:  0.12, arousal: -0.28 }, // Documentary
  37:    { valence: -0.12, arousal:  0.28 }, // Western
  10749: { valence:  0.78, arousal:  0.08 }, // Romance
  10751: { valence:  0.70, arousal:  0.32 }, // Family
  16:    { valence:  0.62, arousal:  0.44 }, // Animation
  14:    { valence:  0.32, arousal:  0.52 }, // Fantasy
  10402: { valence:  0.55, arousal:  0.38 }, // Music
  10752: { valence: -0.52, arousal:  0.62 }, // War
};

const VALENCE_POS = ['triumph', 'love', 'joy', 'heartwarming', 'uplifting', 'hope', 'redemption', 'funny', 'hilarious', 'wholesome', 'delight', 'inspiring', 'celebrate'];
const VALENCE_NEG = ['dark', 'brutal', 'devastating', 'bleak', 'tragic', 'murder', 'violent', 'grief', 'trauma', 'haunting', 'despair', 'evil', 'sinister', 'terrifying'];
const AROUSAL_HIGH = ['explosive', 'battle', 'war', 'fight', 'survive', 'desperate', 'chase', 'intense', 'danger', 'threat', 'attack', 'relentless', 'race'];
const AROUSAL_LOW = ['quiet', 'gentle', 'tender', 'peaceful', 'nostalgic', 'serene', 'contemplative', 'reflective'];

const KEYWORD_ADJUSTMENTS: Record<string, { valence?: number; arousal?: number }> = {
  'feel-good':     { valence:  0.15 },
  'feel good':     { valence:  0.15 },
  'dark':          { valence: -0.10 },
  'slow burn':     { arousal: -0.12 },
  'action hero':   { arousal:  0.10 },
  'suspense':      { arousal:  0.10 },
  'violence':      { valence: -0.08, arousal:  0.08 },
  'friendship':    { valence:  0.10 },
  'revenge':       { valence: -0.05, arousal:  0.10 },
  'redemption':    { valence:  0.12 },
  'coming of age': { valence:  0.08, arousal: -0.05 },
  'romantic':      { valence:  0.10 },
  'horror':        { valence: -0.12, arousal:  0.10 },
  'comedy':        { valence:  0.10 },
};

/**
 * Compute a continuous (valence, arousal) coordinate for a movie using
 * genre base + vote_average + overview text + popularity + optional keywords.
 */
export function computeMovieCoordinate(
  movie: TMDBMovie,
  keywords?: { id?: number; name: string }[]
): { valence: number; arousal: number } {
  // 1. Genre base: average known genre coords
  const known = movie.genre_ids.map((id) => GENRE_COORD_MAP[id]).filter(Boolean);
  let valence = known.length > 0
    ? known.reduce((s, c) => s + c.valence, 0) / known.length
    : 0;
  let arousal = known.length > 0
    ? known.reduce((s, c) => s + c.arousal, 0) / known.length
    : 0;

  // 2. vote_average modifier (valence only)
  if (movie.vote_average >= 8.0)      valence += 0.15;
  else if (movie.vote_average >= 7.0) valence += 0.08;
  else if (movie.vote_average >= 6.0) valence += 0.00;
  else if (movie.vote_average >= 5.0) valence -= 0.08;
  else                                 valence -= 0.15;

  // 3. Overview text analysis
  const text = (movie.overview ?? '').toLowerCase();
  const posCount  = VALENCE_POS.filter((w) => text.includes(w)).length;
  const negCount  = VALENCE_NEG.filter((w) => text.includes(w)).length;
  const highCount = AROUSAL_HIGH.filter((w) => text.includes(w)).length;
  const lowCount  = AROUSAL_LOW.filter((w) => text.includes(w)).length;
  valence += Math.max(-0.20, Math.min(0.20, (posCount - negCount) * 0.05));
  arousal += Math.max(-0.20, Math.min(0.20, (highCount - lowCount) * 0.05));

  // 4. Popularity modifier (arousal only)
  const pop = movie.popularity ?? 0;
  if (pop > 200)     arousal += 0.08;
  else if (pop > 50) arousal += 0.04;
  else if (pop < 5)  arousal -= 0.04;

  // 5. Keyword modifier
  if (keywords && keywords.length > 0) {
    for (const kw of keywords) {
      const adj = KEYWORD_ADJUSTMENTS[kw.name.toLowerCase()];
      if (adj) {
        if (adj.valence) valence += adj.valence;
        if (adj.arousal) arousal += adj.arousal;
      }
    }
  }

  // 6. Clamp to [-1, +1]
  return {
    valence: Math.max(-1, Math.min(1, valence)),
    arousal: Math.max(-1, Math.min(1, arousal)),
  };
}

export function scoreMovieProximity(
  movieCoord: { valence: number; arousal: number },
  userCoord: { valence: number; arousal: number },
  isKeywordMatch: boolean
): number {
  const dist = Math.sqrt(
    (movieCoord.valence - userCoord.valence) ** 2 +
    (movieCoord.arousal - userCoord.arousal) ** 2
  );
  return isKeywordMatch ? dist - 0.35 : dist;
}

export type QuadrantConfig = {
  genreIds: number[];
  toneLabel: string;
  framingTemplate: string;
  sortBy: string;
};

export const QUADRANT_MAP: Record<CircumplexQuadrant, QuadrantConfig> = {
  intense: {
    // valence < 0, arousal > 0
    genreIds: [27, 53, 9648, 80], // Horror, Thriller, Mystery, Crime
    toneLabel: 'unsettling',
    framingTemplate: 'For when you need something that grabs you by the throat',
    sortBy: 'popularity.desc',
  },
  exuberant: {
    // valence > 0, arousal > 0
    genreIds: [28, 35, 12, 878], // Action, Comedy, Adventure, Sci-Fi
    toneLabel: 'propulsive',
    framingTemplate: 'For when you want to feel alive',
    sortBy: 'popularity.desc',
  },
  melancholic: {
    // valence < 0, arousal < 0
    genreIds: [18, 36, 99, 37], // Drama, History, Documentary, Western
    toneLabel: 'melancholic',
    framingTemplate: 'For when you want to sit with something real',
    sortBy: 'vote_average.desc',
  },
  content: {
    // valence > 0, arousal < 0
    genreIds: [10749, 10751, 16, 14], // Romance, Family, Animation, Fantasy
    toneLabel: 'warm',
    framingTemplate: 'For when you need something that feels like home',
    sortBy: 'vote_average.desc',
  },
};

/**
 * Determine the primary quadrant from a valence/arousal coordinate.
 */
export function getQuadrant(valence: number, arousal: number): CircumplexQuadrant {
  if (valence >= 0 && arousal >= 0) return 'exuberant';
  if (valence < 0 && arousal >= 0) return 'intense';
  if (valence < 0 && arousal < 0) return 'melancholic';
  return 'content';
}

// Axis boundary threshold for blending
const BLEND_THRESHOLD = 0.2;

export type GenreSelection = {
  genreIds: number[];
  toneLabel: string;
  framingTemplate: string;
  sortBy: string;
  isBlended: boolean;
};

export const GENRE_DESCRIPTORS: Record<number, string> = {
  28: 'Kinetic',
  12: 'Expansive',
  16: 'Enchanting',
  35: 'Witty',
  80: 'Gritty',
  99: 'Grounding',
  18: 'Intimate',
  10751: 'Heartwarming',
  14: 'Dreamlike',
  36: 'Weighty',
  27: 'Unsettling',
  10402: 'Soulful',
  9648: 'Enigmatic',
  10749: 'Tender',
  878: 'Visionary',
  53: 'Gripping',
  10752: 'Harrowing',
  37: 'Mythic',
};

const TONE_FALLBACKS: Record<string, string[]> = {
  unsettling: ['Tense', 'Dark', 'Visceral'],
  propulsive: ['Propulsive', 'Bold', 'Charged'],
  melancholic: ['Profound', 'Still', 'Resonant'],
  warm: ['Warm', 'Gentle', 'Luminous'],
};

export function getDescriptors(
  genreIds: number[],
  toneLabel: string
): [string, string, string] {
  const words: string[] = [];
  for (const id of genreIds) {
    const word = GENRE_DESCRIPTORS[id];
    if (word && !words.includes(word)) words.push(word);
    if (words.length === 3) break;
  }
  const fallbacks = TONE_FALLBACKS[toneLabel] ?? ['Cinematic', 'Evocative', 'Compelling'];
  let fi = 0;
  while (words.length < 3) words.push(fallbacks[fi++ % fallbacks.length]);
  return [words[0], words[1], words[2]];
}

/**
 * Returns genre selection, blending adjacent quadrants when near an axis.
 * Near-axis coordinates get a 60/40 blend from two adjacent quadrant genre pools.
 */
export function selectGenres(valence: number, arousal: number): GenreSelection {
  const nearValenceAxis = Math.abs(valence) < BLEND_THRESHOLD;
  const nearArousalAxis = Math.abs(arousal) < BLEND_THRESHOLD;

  const primary = getQuadrant(valence, arousal);
  const primaryConfig = QUADRANT_MAP[primary];

  if (!nearValenceAxis && !nearArousalAxis) {
    return {
      genreIds: primaryConfig.genreIds.slice(0, 3),
      toneLabel: primaryConfig.toneLabel,
      framingTemplate: primaryConfig.framingTemplate,
      sortBy: primaryConfig.sortBy,
      isBlended: false,
    };
  }

  // Determine secondary quadrant
  let secondary: CircumplexQuadrant;
  if (nearValenceAxis && !nearArousalAxis) {
    // Near valence axis — blend with quadrant on other side of valence
    secondary = getQuadrant(-valence, arousal);
  } else if (nearArousalAxis && !nearValenceAxis) {
    // Near arousal axis — blend with quadrant on other side of arousal
    secondary = getQuadrant(valence, -arousal);
  } else {
    // Near both axes — use opposite quadrant
    secondary = getQuadrant(-valence, -arousal);
  }

  const secondaryConfig = QUADRANT_MAP[secondary];

  // 60% primary, 40% secondary — take top genres from each
  const primaryGenres = primaryConfig.genreIds.slice(0, 2);
  const secondaryGenres = secondaryConfig.genreIds
    .filter((id) => !primaryGenres.includes(id))
    .slice(0, 2);

  return {
    genreIds: [...primaryGenres, ...secondaryGenres],
    toneLabel: primaryConfig.toneLabel,
    framingTemplate: primaryConfig.framingTemplate,
    sortBy: primaryConfig.sortBy,
    isBlended: true,
  };
}
