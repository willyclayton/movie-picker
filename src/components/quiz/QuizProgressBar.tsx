'use client';

import { motion } from 'framer-motion';
import { CINEMATIC_EASE } from '@/lib/animations';

const STEP_LABELS = ['Color', 'Image', 'Feeling', 'You'];

type QuizProgressBarProps = {
  currentStep: number;
  totalSteps?: number;
};

export function QuizProgressBar({ currentStep, totalSteps = 4 }: QuizProgressBarProps) {
  return (
    <div className="w-full max-w-sm mx-auto" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={totalSteps}>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="relative w-full h-0.5 bg-overlay rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: i <= currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: CINEMATIC_EASE, delay: i * 0.05 }}
              />
            </div>
            <span
              className={`text-xs font-sans transition-colors duration-300 ${
                i <= currentStep ? 'text-muted' : 'text-overlay'
              }`}
              style={{ fontSize: '10px', letterSpacing: '0.08em' }}
            >
              {STEP_LABELS[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
