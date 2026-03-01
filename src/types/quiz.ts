export type MoodCoordinate = {
  valence: number;  // -1.0 (unpleasant) to +1.0 (pleasant)
  arousal: number;  // -1.0 (low energy) to +1.0 (high energy)
  weight: number;   // 1–3, confidence of signal
};

export type QuizAnswer =
  | { type: 'color'; selectedColors: string[]; coord: MoodCoordinate }
  | { type: 'image'; imageId: string; coord: MoodCoordinate }
  | { type: 'projective'; questionId: string; optionId: string; coord: MoodCoordinate }
  | { type: 'meta'; preference: 'lean-in' | 'escape' };

export type CircumplexQuadrant = 'intense' | 'exuberant' | 'melancholic' | 'content';

export type QuizState = {
  answers: QuizAnswer[];
  currentStep: number;  // 0–3
  isComplete: boolean;
};
