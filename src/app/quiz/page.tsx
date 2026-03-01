'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizShell } from '@/components/quiz/QuizShell';
import { useQuizState } from '@/hooks/useQuizState';

export default function QuizPage() {
  const router = useRouter();
  const { state, submitAnswer, goBack } = useQuizState();

  useEffect(() => {
    if (state.isComplete) {
      sessionStorage.setItem('moviePickerAnswers', JSON.stringify(state.answers));
      router.push('/results');
    }
  }, [state.isComplete, state.answers, router]);

  return (
    <QuizShell
      currentStep={state.currentStep}
      onAnswer={submitAnswer}
      onBack={goBack}
    />
  );
}
