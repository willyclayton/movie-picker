import type { MoodCoordinate } from '@/types/quiz';

export type ColorSwatch = {
  id: string;
  hex: string;
  label: string;
  coord: Omit<MoodCoordinate, 'weight'>;
};

// Based on empirical color-emotion research (132 studies, 42,266 participants)
// Colors organized for visual appeal in a 4×5 grid
export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    id: 'bright-red',
    hex: '#FF2020',
    label: 'bright red',
    coord: { valence: -0.1, arousal: 0.9 },
  },
  {
    id: 'deep-crimson',
    hex: '#8B0000',
    label: 'deep crimson',
    coord: { valence: -0.3, arousal: 0.6 },
  },
  {
    id: 'soft-pink',
    hex: '#F4A7B9',
    label: 'soft pink',
    coord: { valence: 0.7, arousal: 0.1 },
  },
  {
    id: 'bright-orange',
    hex: '#FF6B35',
    label: 'bright orange',
    coord: { valence: 0.5, arousal: 0.7 },
  },
  {
    id: 'warm-amber',
    hex: '#E8A020',
    label: 'warm amber',
    coord: { valence: 0.6, arousal: 0.3 },
  },
  {
    id: 'bright-yellow',
    hex: '#FFE620',
    label: 'bright yellow',
    coord: { valence: 0.8, arousal: 0.6 },
  },
  {
    id: 'forest-green',
    hex: '#2D6A4F',
    label: 'forest green',
    coord: { valence: 0.3, arousal: -0.2 },
  },
  {
    id: 'electric-lime',
    hex: '#7FFF00',
    label: 'electric lime',
    coord: { valence: 0.2, arousal: 0.7 },
  },
  {
    id: 'sky-blue',
    hex: '#7EC8E3',
    label: 'sky blue',
    coord: { valence: 0.4, arousal: 0.1 },
  },
  {
    id: 'electric-blue',
    hex: '#0047FF',
    label: 'electric blue',
    coord: { valence: 0.2, arousal: 0.6 },
  },
  {
    id: 'deep-navy',
    hex: '#0D1B2A',
    label: 'deep navy',
    coord: { valence: -0.3, arousal: -0.4 },
  },
  {
    id: 'deep-purple',
    hex: '#4A0080',
    label: 'deep purple',
    coord: { valence: -0.2, arousal: 0.3 },
  },
  {
    id: 'dusty-lavender',
    hex: '#B8A9C9',
    label: 'dusty lavender',
    coord: { valence: 0.3, arousal: -0.3 },
  },
  {
    id: 'neon-magenta',
    hex: '#FF00FF',
    label: 'neon magenta',
    coord: { valence: -0.1, arousal: 0.8 },
  },
  {
    id: 'terracotta',
    hex: '#C1440E',
    label: 'terracotta',
    coord: { valence: 0.3, arousal: -0.1 },
  },
  {
    id: 'charcoal',
    hex: '#1C1C1C',
    label: 'charcoal',
    coord: { valence: -0.6, arousal: -0.2 },
  },
  {
    id: 'medium-gray',
    hex: '#808080',
    label: 'medium gray',
    coord: { valence: -0.2, arousal: -0.5 },
  },
  {
    id: 'soft-cream',
    hex: '#F5F0E8',
    label: 'soft cream',
    coord: { valence: 0.5, arousal: -0.4 },
  },
  {
    id: 'burnt-rust',
    hex: '#8B3A00',
    label: 'burnt rust',
    coord: { valence: 0.1, arousal: 0.2 },
  },
  {
    id: 'deep-red',
    hex: '#DC143C',
    label: 'deep red',
    coord: { valence: -0.1, arousal: 0.8 },
  },
];

/**
 * Given a hex color, returns saturation (0-1) as weight signal.
 * Higher saturation = stronger emotional signal.
 */
function getColorWeight(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  // Scale to 1-3
  return Math.max(1, Math.round(s * 3));
}

/**
 * Compute average mood coordinate from a set of selected color IDs.
 */
export function colorsToMoodCoord(selectedIds: string[]): MoodCoordinate {
  const selected = COLOR_SWATCHES.filter((s) => selectedIds.includes(s.id));
  if (!selected.length) return { valence: 0, arousal: 0, weight: 1 };

  let totalWeight = 0;
  let valenceSum = 0;
  let arousalSum = 0;

  for (const swatch of selected) {
    const w = getColorWeight(swatch.hex);
    totalWeight += w;
    valenceSum += swatch.coord.valence * w;
    arousalSum += swatch.coord.arousal * w;
  }

  return {
    valence: valenceSum / totalWeight,
    arousal: arousalSum / totalWeight,
    weight: 2,
  };
}
