'use client';

import { useState, useCallback } from 'react';
import type { QuizAnswer, QuizState } from '@/types/quiz';

const TOTAL_STEPS = 7;

export function useQuizState() {
  const [state, setState] = useState<QuizState>({
    answers: [],
    currentStep: 0,
    isComplete: false,
  });

  const submitAnswer = useCallback((answer: QuizAnswer) => {
    setState((prev) => {
      const answers =
        answer.type === 'projective'
          ? [
              ...prev.answers.filter(
                (a) => !(a.type === 'projective' && (a as { type: 'projective'; questionId: string }).questionId === (answer as { type: 'projective'; questionId: string }).questionId)
              ),
              answer,
            ]
          : [...prev.answers.filter((a) => a.type !== answer.type), answer];
      const nextStep = prev.currentStep + 1;
      const isComplete = nextStep >= TOTAL_STEPS;
      return {
        answers,
        currentStep: isComplete ? prev.currentStep : nextStep,
        isComplete,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
      isComplete: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ answers: [], currentStep: 0, isComplete: false });
  }, []);

  return { state, submitAnswer, goBack, reset };
}
