import type { MoodCoordinate, QuizAnswer } from '@/types/quiz';
import { clamp } from './utils';

/**
 * Weighted average of multiple MoodCoordinates.
 * Higher-weight coordinates have more influence on the result.
 */
export function averageCoordinates(coords: MoodCoordinate[]): { valence: number; arousal: number } {
  if (!coords.length) return { valence: 0, arousal: 0 };

  let totalWeight = 0;
  let valenceSum = 0;
  let arousalSum = 0;

  for (const coord of coords) {
    totalWeight += coord.weight;
    valenceSum += coord.valence * coord.weight;
    arousalSum += coord.arousal * coord.weight;
  }

  return {
    valence: clamp(valenceSum / totalWeight, -1, 1),
    arousal: clamp(arousalSum / totalWeight, -1, 1),
  };
}

/**
 * Apply mood-counter transformation:
 * Flip valence sign → opposite emotional quadrant.
 * Used when user selects "Take me somewhere else".
 */
export function applyMoodCounter(coord: { valence: number; arousal: number }): {
  valence: number;
  arousal: number;
} {
  return {
    valence: clamp(-coord.valence, -1, 1),
    arousal: coord.arousal,
  };
}

/**
 * Extract MoodCoordinates from quiz answers (skips meta answer).
 */
export function extractCoordinates(answers: QuizAnswer[]): MoodCoordinate[] {
  return answers
    .filter(
      (a): a is Exclude<QuizAnswer, { type: 'meta' } | { type: 'keywords' }> =>
        a.type !== 'meta' && a.type !== 'keywords'
    )
    .map((a) => a.coord);
}

/**
 * Get the meta preference from answers.
 */
export function getMetaPreference(answers: QuizAnswer[]): 'lean-in' | 'escape' | null {
  const meta = answers.find((a): a is Extract<QuizAnswer, { type: 'meta' }> => a.type === 'meta');
  return meta?.preference ?? null;
}

/**
 * Full pipeline: answers → final (valence, arousal) after mood-counter.
 */
export function computeFinalCoordinate(answers: QuizAnswer[]): { valence: number; arousal: number } {
  const coords = extractCoordinates(answers);
  const averaged = averageCoordinates(coords);
  const preference = getMetaPreference(answers);

  if (preference === 'escape') {
    return applyMoodCounter(averaged);
  }

  return averaged;
}
