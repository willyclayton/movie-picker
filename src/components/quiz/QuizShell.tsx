'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { stepVariants } from '@/lib/animations';
import { QuizProgressBar } from './QuizProgressBar';
import { StepColorPicker } from './StepColorPicker';
import { StepImageSelector } from './StepImageSelector';
import { StepProjectiveQ } from './StepProjectiveQ';
import { StepKeywords } from './StepKeywords';
import { StepMetaPref } from './StepMetaPref';
import { Button } from '@/components/ui/Button';
import type { QuizAnswer } from '@/types/quiz';

type QuizShellProps = {
  currentStep: number;
  onAnswer: (answer: QuizAnswer) => void;
  onBack: () => void;
};

type StepProps = { onComplete: (answer: QuizAnswer) => void };

const STEPS: ((props: StepProps) => React.ReactElement)[] = [
  (props) => <StepColorPicker {...props} />,
  (props) => <StepImageSelector {...props} />,
  (props) => <StepProjectiveQ {...props} questionIndex={0} />,
  (props) => <StepProjectiveQ {...props} questionIndex={1} />,
  (props) => <StepKeywords {...props} />,
  (props) => <StepMetaPref {...props} />,
];

export function QuizShell({ currentStep, onAnswer, onBack }: QuizShellProps) {
  const StepComponent = STEPS[currentStep];

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full mb-12">
        {currentStep > 0 ? (
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted hover:text-text">
            ← Back
          </Button>
        ) : (
          <div />
        )}
        <QuizProgressBar currentStep={currentStep} />
        <div className="w-16" /> {/* spacer to balance back button */}
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <StepComponent onComplete={onAnswer} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step counter */}
      <p className="text-center text-muted text-xs font-sans mt-8">
        {currentStep + 1} of 6
      </p>
    </div>
  );
}
