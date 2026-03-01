import type { MoodCoordinate } from '@/types/quiz';

export type QuizImage = {
  id: string;
  src: string;           // path relative to /public/quiz-images/
  alt: string;
  caption: string;       // shown to user
  coord: Omit<MoodCoordinate, 'weight'>;
  // Unsplash fallback URL for development (developer should replace with local assets)
  unsplashQuery: string;
};

// Pre-scored using OASIS (Open Affective Standardized Image Set) normative data principles.
// Developer: Add corresponding WebP files to /public/quiz-images/
export const QUIZ_IMAGES: QuizImage[] = [
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
    id: 'bustling-market-color',
    src: '/quiz-images/bustling-market-color.jpg',
    alt: 'Vibrant bustling market with colorful stalls',
    caption: 'every color, every voice at once',
    coord: { valence: 0.6, arousal: 0.7 },
    unsplashQuery: 'vibrant colorful market bazaar crowd',
  },
  {
    id: 'neon-arcade-night',
    src: '/quiz-images/neon-arcade-night.jpg',
    alt: 'Neon-lit arcade at night',
    caption: 'neon lights and late-night energy',
    coord: { valence: 0.2, arousal: 0.8 },
    unsplashQuery: 'neon arcade night lights retro',
  },
  {
    id: 'underwater-soft-light',
    src: '/quiz-images/underwater-soft-light.jpg',
    alt: 'Soft underwater light filtering through water',
    caption: 'weightless, drifting',
    coord: { valence: 0.3, arousal: -0.5 },
    unsplashQuery: 'underwater light rays ocean peaceful',
  },
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
    id: 'rainy-city-neon',
    src: '/quiz-images/rainy-city-neon.jpg',
    alt: 'Rain on glass reflecting neon city lights at midnight',
    caption: 'rain on glass at midnight',
    coord: { valence: -0.3, arousal: 0.4 },
    unsplashQuery: 'rain window neon city night reflections',
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
    id: 'stark-white-desert',
    src: '/quiz-images/stark-white-desert.jpg',
    alt: 'Vast white salt flats under overcast sky',
    caption: 'silence and salt flats',
    coord: { valence: -0.5, arousal: -0.6 },
    unsplashQuery: 'white salt flats desert empty silence',
  },
];
