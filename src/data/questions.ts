import type { MoodCoordinate } from '@/types/quiz';

export type QuizOption = {
  id: string;
  label: string;
  subLabel?: string;
  coord: MoodCoordinate;
};

export type ProjectiveQuestion = {
  id: string;
  prompt: string;
  category: 'weather' | 'animal' | 'texture' | 'time' | 'landscape';
  options: QuizOption[];
};

export const PROJECTIVE_QUESTIONS: ProjectiveQuestion[] = [
  {
    id: 'weather',
    prompt: 'Pick a weather.',
    category: 'weather',
    options: [
      {
        id: 'thunderstorm',
        label: 'Thunderstorm at 3am',
        subLabel: 'No warning. All at once.',
        coord: { valence: -0.5, arousal: 0.8, weight: 3 },
      },
      {
        id: 'first-snow',
        label: 'First snow of the year',
        subLabel: 'Everything muffled.',
        coord: { valence: 0.1, arousal: -0.4, weight: 2 },
      },
      {
        id: 'golden-fog',
        label: 'Golden morning fog',
        subLabel: 'Soft edges. New light.',
        coord: { valence: 0.2, arousal: -0.5, weight: 2 },
      },
      {
        id: 'heatwave',
        label: 'A heatwave that never breaks',
        subLabel: 'Relentless. Thick.',
        coord: { valence: -0.3, arousal: 0.5, weight: 2 },
      },
    ],
  },
  {
    id: 'animal',
    prompt: 'What animal are you right now?',
    category: 'animal',
    options: [
      {
        id: 'wolf',
        label: 'A wolf alone at the edge of the woods',
        subLabel: 'Watching. Waiting.',
        coord: { valence: -0.2, arousal: 0.3, weight: 2 },
      },
      {
        id: 'cat-window',
        label: 'A cat in a sun-warmed window',
        subLabel: 'Content. Unrushed.',
        coord: { valence: 0.6, arousal: -0.5, weight: 2 },
      },
      {
        id: 'hummingbird',
        label: 'A hummingbird between flowers',
        subLabel: 'Everywhere at once.',
        coord: { valence: 0.5, arousal: 0.7, weight: 2 },
      },
      {
        id: 'deep-sea-fish',
        label: 'Something slow in the deep ocean',
        subLabel: 'Vast. Unhurried. Alone.',
        coord: { valence: -0.4, arousal: -0.6, weight: 3 },
      },
    ],
  },
  {
    id: 'texture',
    prompt: 'If your mood had a texture…',
    category: 'texture',
    options: [
      {
        id: 'broken-glass',
        label: 'Broken glass — sharp, unexpected',
        coord: { valence: -0.6, arousal: 0.7, weight: 3 },
      },
      {
        id: 'worn-wool',
        label: 'Old wool — rough but familiar',
        coord: { valence: 0.2, arousal: -0.3, weight: 2 },
      },
      {
        id: 'still-water',
        label: 'Still water — smooth, reflective',
        coord: { valence: 0.1, arousal: -0.7, weight: 2 },
      },
      {
        id: 'static',
        label: 'Static electricity — crackling, restless',
        coord: { valence: -0.1, arousal: 0.8, weight: 2 },
      },
    ],
  },
];

// Active question index (0 = weather, default)
export const ACTIVE_QUESTION_INDEX = 0;
export const ACTIVE_QUESTION = PROJECTIVE_QUESTIONS[ACTIVE_QUESTION_INDEX];
