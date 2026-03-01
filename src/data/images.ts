import type { MoodCoordinate } from '@/types/quiz';

export type QuizImage = {
  id: string;
  src: string;           // path relative to /public/quiz-images/
  alt: string;
  caption: string;       // shown to user
  coord: Omit<MoodCoordinate, 'weight'>;
  unsplashQuery: string;
  questionOnly?: boolean; // if true, used as a projective question option image, not in main selector
};

// Pre-scored using OASIS (Open Affective Standardized Image Set) normative data principles.
// Valence × Arousal axes, Russell Circumplex model.
//
// Developer: Add corresponding WebP/JPG files to /public/quiz-images/
//   — Main selector images (15): shown in StepImageSelector grid
//   — Question-only images (12, marked questionOnly: true): shown only inside projective question options
//
// Color/lighting empirical rules applied when scoring:
//   High saturation + warm hue → high arousal + positive valence
//   Soft/diffuse light → low arousal + positive valence
//   Harsh/high-contrast light → high arousal + negative valence
//   Achromatic/desaturated → low arousal + slight negative valence
//   Angular/fractured patterns → high arousal + negative valence
//   Curved/smooth → low arousal + positive valence

export const QUIZ_IMAGES: QuizImage[] = [

  // ──────────────────────────────────────────────────────────────
  // MAIN SELECTOR — 15 images, 5 cols × 3 rows desktop
  // Covering all four circumplex quadrants
  // ──────────────────────────────────────────────────────────────

  // ── High arousal + positive (excited, alive, electric) ─────────
  {
    id: 'crashing-waves-sunlit',
    src: '/quiz-images/crashing-waves-sunlit.jpg',
    alt: 'Ocean waves crashing against rocks in bright sunlight',
    caption: 'all force and light',
    coord: { valence: 0.7, arousal: 0.9 },
    unsplashQuery: 'waves crashing rocks bright sunlight ocean spray dramatic',
  },
  {
    id: 'bustling-market-color',
    src: '/quiz-images/bustling-market-color.jpg',
    alt: 'Vibrant bustling market with colorful stalls',
    caption: 'every color, every voice at once',
    coord: { valence: 0.6, arousal: 0.7 },
    unsplashQuery: 'vibrant colorful market bazaar crowd',
  },
  {
    id: 'ink-drop-water',
    src: '/quiz-images/ink-drop-water.jpg',
    alt: 'Ink bloom expanding in clear water — macro',
    caption: 'something spreading outward',
    coord: { valence: 0.4, arousal: 0.6 },
    unsplashQuery: 'ink drop water macro bloom expand dark abstract',
  },

  // ── Low arousal + positive (calm, content, safe) ──────────────
  {
    id: 'golden-hour-fields',
    src: '/quiz-images/golden-hour-fields.jpg',
    alt: 'Golden light over open fields at sunset',
    caption: 'golden light over open fields',
    coord: { valence: 0.8, arousal: 0.1 },
    unsplashQuery: 'golden hour wheat fields sunset warm',
  },
  {
    id: 'cozy-cabin-firelight',
    src: '/quiz-images/cozy-cabin-firelight.jpg',
    alt: 'Warm firelight in a cozy cabin interior',
    caption: 'firelight and nowhere to be',
    coord: { valence: 0.7, arousal: -0.3 },
    unsplashQuery: 'cozy cabin fireplace warm interior winter',
  },
  {
    id: 'sunlight-forest-rays',
    src: '/quiz-images/sunlight-forest-rays.jpg',
    alt: 'Sunlight fracturing through a forest canopy',
    caption: 'light finding a way through',
    coord: { valence: 0.5, arousal: 0.4 },
    unsplashQuery: 'sunlight rays forest canopy light beams green',
  },
  {
    id: 'underwater-soft-light',
    src: '/quiz-images/underwater-soft-light.jpg',
    alt: 'Soft underwater light filtering through water',
    caption: 'weightless, drifting',
    coord: { valence: 0.3, arousal: -0.5 },
    unsplashQuery: 'underwater light rays ocean peaceful',
  },

  // ── High arousal + negative (tense, restless, unsettled) ──────
  {
    id: 'neon-arcade-night',
    src: '/quiz-images/neon-arcade-night.jpg',
    alt: 'Neon-lit arcade at night',
    caption: 'neon lights and late-night energy',
    coord: { valence: 0.2, arousal: 0.8 },
    unsplashQuery: 'neon arcade night lights retro',
  },
  {
    id: 'rainy-city-neon',
    src: '/quiz-images/rainy-city-neon.jpg',
    alt: 'Rain on glass reflecting neon city lights at midnight',
    caption: 'rain on glass at midnight',
    coord: { valence: -0.3, arousal: 0.4 },
    unsplashQuery: 'rain window neon city night reflections',
  },
  {
    id: 'cracked-earth-aerial',
    src: '/quiz-images/cracked-earth-aerial.jpg',
    alt: 'Cracked dry earth seen from directly above',
    caption: 'surface giving way',
    coord: { valence: -0.3, arousal: 0.5 },
    unsplashQuery: 'cracked dry earth aerial overhead drought texture abstract',
  },

  // ── Low arousal + negative (melancholic, hollow, heavy) ───────
  {
    id: 'misty-mountains-fog',
    src: '/quiz-images/misty-mountains-fog.jpg',
    alt: 'Mountains disappearing into morning fog',
    caption: 'mountains disappearing into fog',
    coord: { valence: 0.1, arousal: -0.4 },
    unsplashQuery: 'misty mountain fog moody landscape',
  },
  {
    id: 'empty-rooftop-dusk',
    src: '/quiz-images/empty-rooftop-dusk.jpg',
    alt: 'Empty rooftop at dusk with city skyline below',
    caption: 'the city below, the sky above',
    coord: { valence: -0.1, arousal: -0.2 },
    unsplashQuery: 'empty rooftop urban dusk twilight city',
  },
  {
    id: 'deep-ocean-dark',
    src: '/quiz-images/deep-ocean-dark.jpg',
    alt: 'Dark deep ocean with a faint light source below',
    caption: 'something vast below the surface',
    coord: { valence: -0.4, arousal: 0.2 },
    unsplashQuery: 'deep ocean dark water mysterious abyss',
  },
  {
    id: 'bare-winter-trees-fog',
    src: '/quiz-images/bare-winter-trees-fog.jpg',
    alt: 'Bare winter trees dissolving into grey fog',
    caption: 'nothing left on the branches',
    coord: { valence: -0.3, arousal: -0.5 },
    unsplashQuery: 'bare winter trees fog grey empty forest silent',
  },
  {
    id: 'stark-white-desert',
    src: '/quiz-images/stark-white-desert.jpg',
    alt: 'Vast white salt flats under overcast sky',
    caption: 'silence and salt flats',
    coord: { valence: -0.5, arousal: -0.6 },
    unsplashQuery: 'white salt flats desert empty silence',
  },


  // ──────────────────────────────────────────────────────────────
  // QUESTION-ONLY IMAGES — used as visual options in projective questions
  // Not shown in the main image selector grid
  // ──────────────────────────────────────────────────────────────

  // ── Weather question ──────────────────────────────────────────
  {
    id: 'q-storm-lightning',
    src: '/quiz-images/q-storm-lightning.jpg',
    alt: 'Lightning bolt splitting a dark dramatic sky',
    caption: 'thunderstorm at 3am',
    coord: { valence: -0.5, arousal: 0.8 },
    unsplashQuery: 'lightning bolt dark dramatic sky storm night single tree',
    questionOnly: true,
  },
  {
    id: 'q-quiet-snowfall',
    src: '/quiz-images/q-quiet-snowfall.jpg',
    alt: 'Snow falling softly on a quiet path in blue-grey light',
    caption: 'first snow of the year',
    coord: { valence: 0.1, arousal: -0.4 },
    unsplashQuery: 'quiet snowfall path winter soft muffled blue grey',
    questionOnly: true,
  },
  {
    id: 'q-golden-fog',
    src: '/quiz-images/q-golden-fog.jpg',
    alt: 'Soft golden fog drifting through trees at early dawn',
    caption: 'golden morning fog',
    coord: { valence: 0.2, arousal: -0.5 },
    unsplashQuery: 'golden morning fog trees dawn soft light warm',
    questionOnly: true,
  },
  {
    id: 'q-heat-haze',
    src: '/quiz-images/q-heat-haze.jpg',
    alt: 'Heat shimmer distorting a long empty road surface',
    caption: 'a heatwave that never breaks',
    coord: { valence: -0.3, arousal: 0.5 },
    unsplashQuery: 'heat haze shimmer road summer relentless desert',
    questionOnly: true,
  },

  // ── Animal question ───────────────────────────────────────────
  {
    id: 'q-wolf-treeline',
    src: '/quiz-images/q-wolf-treeline.jpg',
    alt: 'Wolf silhouette standing at the edge of a dark forest',
    caption: 'watching from the treeline',
    coord: { valence: -0.2, arousal: 0.3 },
    unsplashQuery: 'wolf silhouette treeline forest edge dusk watching',
    questionOnly: true,
  },
  {
    id: 'q-cat-sunbeam',
    src: '/quiz-images/q-cat-sunbeam.jpg',
    alt: 'Cat curled up in a warm pool of window sunlight',
    caption: 'content and unrushed',
    coord: { valence: 0.6, arousal: -0.5 },
    unsplashQuery: 'cat curled window sunbeam warm cozy sleeping',
    questionOnly: true,
  },
  {
    id: 'q-hummingbird',
    src: '/quiz-images/q-hummingbird.jpg',
    alt: 'Hummingbird frozen mid-flight between flowers',
    caption: 'everywhere at once',
    coord: { valence: 0.5, arousal: 0.7 },
    unsplashQuery: 'hummingbird hovering flower motion blur close',
    questionOnly: true,
  },
  {
    id: 'q-deep-sea',
    src: '/quiz-images/q-deep-sea.jpg',
    alt: 'Bioluminescent creature drifting in the pitch-black deep ocean',
    caption: 'vast, unhurried, alone',
    coord: { valence: -0.4, arousal: -0.6 },
    unsplashQuery: 'deep ocean bioluminescent creature dark abyss glow',
    questionOnly: true,
  },

  // ── Texture question ──────────────────────────────────────────
  {
    id: 'q-broken-glass',
    src: '/quiz-images/q-broken-glass.jpg',
    alt: 'Fractured glass with sharp irregular shard edges',
    caption: 'sharp and unexpected',
    coord: { valence: -0.6, arousal: 0.7 },
    unsplashQuery: 'broken shattered glass fracture pattern sharp abstract macro',
    questionOnly: true,
  },
  {
    id: 'q-worn-wool',
    src: '/quiz-images/q-worn-wool.jpg',
    alt: 'Close-up of soft worn wool textile with warm tones',
    caption: 'rough but familiar',
    coord: { valence: 0.2, arousal: -0.3 },
    unsplashQuery: 'worn wool textile close-up soft fabric texture warm',
    questionOnly: true,
  },
  {
    id: 'q-still-water',
    src: '/quiz-images/q-still-water.jpg',
    alt: 'Mirror-flat still pond surface reflecting the sky perfectly',
    caption: 'smooth and reflective',
    coord: { valence: 0.1, arousal: -0.7 },
    unsplashQuery: 'still water mirror surface pond reflection flat calm',
    questionOnly: true,
  },
  {
    id: 'q-static-electric',
    src: '/quiz-images/q-static-electric.jpg',
    alt: 'Abstract crackling plasma or static electricity pattern',
    caption: 'crackling and restless',
    coord: { valence: -0.1, arousal: 0.8 },
    unsplashQuery: 'plasma ball static electricity abstract crackling energy purple',
    questionOnly: true,
  },
];
