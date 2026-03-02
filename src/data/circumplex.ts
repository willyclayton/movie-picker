import type { CircumplexQuadrant } from '@/types/quiz';

export const GENRE_COORD_MAP: Record<number, { valence: number; arousal: number }> = {
  // intense (valence < 0, arousal > 0)
  27: { valence: -0.5, arousal: 0.5 },   // Horror
  53: { valence: -0.5, arousal: 0.5 },   // Thriller
  9648: { valence: -0.5, arousal: 0.5 }, // Mystery
  80: { valence: -0.5, arousal: 0.5 },   // Crime
  // exuberant (valence > 0, arousal > 0)
  28: { valence: 0.5, arousal: 0.5 },    // Action
  35: { valence: 0.5, arousal: 0.5 },    // Comedy
  12: { valence: 0.5, arousal: 0.5 },    // Adventure
  878: { valence: 0.5, arousal: 0.5 },   // Sci-Fi
  // melancholic (valence < 0, arousal < 0)
  18: { valence: -0.5, arousal: -0.5 },  // Drama
  36: { valence: -0.5, arousal: -0.5 },  // History
  99: { valence: -0.5, arousal: -0.5 },  // Documentary
  37: { valence: -0.5, arousal: -0.5 },  // Western
  // content (valence > 0, arousal < 0)
  10749: { valence: 0.5, arousal: -0.5 },// Romance
  10751: { valence: 0.5, arousal: -0.5 },// Family
  16: { valence: 0.5, arousal: -0.5 },   // Animation
  14: { valence: 0.5, arousal: -0.5 },   // Fantasy
};

export function scoreMovieProximity(
  genreIds: number[],
  userCoord: { valence: number; arousal: number },
  isKeywordMatch: boolean
): number {
  const known = genreIds.map((id) => GENRE_COORD_MAP[id]).filter(Boolean);
  const avg =
    known.length > 0
      ? {
          valence: known.reduce((s, c) => s + c.valence, 0) / known.length,
          arousal: known.reduce((s, c) => s + c.arousal, 0) / known.length,
        }
      : { valence: 0, arousal: 0 };
  const dist = Math.sqrt(
    (avg.valence - userCoord.valence) ** 2 + (avg.arousal - userCoord.arousal) ** 2
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
