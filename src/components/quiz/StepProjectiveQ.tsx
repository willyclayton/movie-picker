'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, CINEMATIC_EASE } from '@/lib/animations';
import { ACTIVE_QUESTION } from '@/data/questions';
import type { QuizAnswer } from '@/types/quiz';

type StepProjectiveQProps = {
  onComplete: (answer: QuizAnswer) => void;
};

export function StepProjectiveQ({ onComplete }: StepProjectiveQProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const question = ACTIVE_QUESTION;

  function handleSelect(optionId: string) {
    setSelected(optionId);
    setTimeout(() => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return;
      onComplete({
        type: 'projective',
        questionId: question.id,
        optionId,
        coord: option.coord,
      });
    }, 300);
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-lg mx-auto">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        <motion.h2 variants={itemVariants} className="font-serif text-4xl md:text-5xl text-text font-light">
          {question.prompt}
        </motion.h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <motion.button
              key={option.id}
              variants={itemVariants}
              onClick={() => handleSelect(option.id)}
              className={`
                relative text-left px-6 py-5 rounded-2xl border cursor-pointer
                transition-all duration-200 group
                ${isSelected
                  ? 'border-accent bg-overlay text-text'
                  : 'border-overlay bg-card text-text hover:border-muted hover:bg-overlay'
                }
              `}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: CINEMATIC_EASE }}
            >
              <span className="font-sans text-base font-medium block">{option.label}</span>
              {option.subLabel && (
                <span className="font-sans text-sm text-muted block mt-1">{option.subLabel}</span>
              )}
              {isSelected && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
