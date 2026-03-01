import type { MoodCoordinate } from '@/types/quiz';

export type QuizOption = {
  id: string;
  label: string;
  subLabel?: string;
  gradient?: string;
  imageId?: string; // references a QuizImage.id (typically questionOnly: true)
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
        imageId: 'q-storm-lightning',
        gradient: 'linear-gradient(135deg, #0f172a, #1e3a8f)',
        coord: { valence: -0.5, arousal: 0.8, weight: 3 },
      },
      {
        id: 'first-snow',
        label: 'First snow of the year',
        subLabel: 'Everything muffled.',
        imageId: 'q-quiet-snowfall',
        gradient: 'linear-gradient(135deg, #1e293b, #94a3b8)',
        coord: { valence: 0.1, arousal: -0.4, weight: 2 },
      },
      {
        id: 'golden-fog',
        label: 'Golden morning fog',
        subLabel: 'Soft edges. New light.',
        imageId: 'q-golden-fog',
        gradient: 'linear-gradient(135deg, #451a03, #92400e)',
        coord: { valence: 0.2, arousal: -0.5, weight: 2 },
      },
      {
        id: 'heatwave',
        label: 'A heatwave that never breaks',
        subLabel: 'Relentless. Thick.',
        imageId: 'q-heat-haze',
        gradient: 'linear-gradient(135deg, #450a0a, #c2410c)',
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
        imageId: 'q-wolf-treeline',
        gradient: 'linear-gradient(135deg, #0a1a0f, #1a2e1a)',
        coord: { valence: -0.2, arousal: 0.3, weight: 2 },
      },
      {
        id: 'cat-window',
        label: 'A cat in a sun-warmed window',
        subLabel: 'Content. Unrushed.',
        imageId: 'q-cat-sunbeam',
        gradient: 'linear-gradient(135deg, #713f12, #d97706)',
        coord: { valence: 0.6, arousal: -0.5, weight: 2 },
      },
      {
        id: 'hummingbird',
        label: 'A hummingbird between flowers',
        subLabel: 'Everywhere at once.',
        imageId: 'q-hummingbird',
        gradient: 'linear-gradient(135deg, #065f46, #0d9488)',
        coord: { valence: 0.5, arousal: 0.7, weight: 2 },
      },
      {
        id: 'deep-sea-fish',
        label: 'Something slow in the deep ocean',
        subLabel: 'Vast. Unhurried. Alone.',
        imageId: 'q-deep-sea',
        gradient: 'linear-gradient(135deg, #020617, #1e1b4b)',
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
        label: 'Broken glass',
        subLabel: 'Sharp. Unexpected.',
        imageId: 'q-broken-glass',
        coord: { valence: -0.6, arousal: 0.7, weight: 3 },
      },
      {
        id: 'worn-wool',
        label: 'Old wool',
        subLabel: 'Rough but familiar.',
        imageId: 'q-worn-wool',
        coord: { valence: 0.2, arousal: -0.3, weight: 2 },
      },
      {
        id: 'still-water',
        label: 'Still water',
        subLabel: 'Smooth. Reflective.',
        imageId: 'q-still-water',
        coord: { valence: 0.1, arousal: -0.7, weight: 2 },
      },
      {
        id: 'static',
        label: 'Static electricity',
        subLabel: 'Crackling. Restless.',
        imageId: 'q-static-electric',
        coord: { valence: -0.1, arousal: 0.8, weight: 2 },
      },
    ],
  },
];

// Active question index (0 = weather, default)
export const ACTIVE_QUESTION_INDEX = 0;
export const ACTIVE_QUESTION = PROJECTIVE_QUESTIONS[ACTIVE_QUESTION_INDEX];
