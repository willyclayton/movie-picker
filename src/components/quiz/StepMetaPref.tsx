'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, CINEMATIC_EASE } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import type { QuizAnswer } from '@/types/quiz';

type StepMetaPrefProps = {
  onComplete: (answer: QuizAnswer) => void;
};

type Preference = 'lean-in' | 'escape';

const OPTIONS: { id: Preference; headline: string; subText: string }[] = [
  {
    id: 'lean-in',
    headline: 'Lean into how I feel',
    subText: 'Give me something that meets me where I am.',
  },
  {
    id: 'escape',
    headline: 'Take me somewhere else',
    subText: 'I want out of this feeling entirely.',
  },
];

export function StepMetaPref({ onComplete }: StepMetaPrefProps) {
  const [selected, setSelected] = useState<Preference | null>(null);

  function handleSelect(pref: Preference) {
    setSelected(pref);
  }

  function handleSubmit() {
    if (!selected) return;
    onComplete({ type: 'meta', preference: selected });
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-lg mx-auto">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        <motion.p
          variants={itemVariants}
          className="text-muted text-xs tracking-[0.15em] uppercase font-sans"
        >
          last thing
        </motion.p>
        <motion.h2 variants={itemVariants} className="font-serif text-4xl md:text-5xl text-text font-light">
          What do you want tonight to do?
        </motion.h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-4"
      >
        {OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <motion.button
              key={option.id}
              variants={itemVariants}
              onClick={() => handleSelect(option.id)}
              className={`
                relative p-8 rounded-2xl border-2 cursor-pointer text-left
                transition-all duration-300
                ${isSelected
                  ? 'border-accent bg-overlay'
                  : 'border-overlay bg-card hover:border-muted'
                }
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: CINEMATIC_EASE }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-serif text-2xl font-light mb-2 transition-colors ${isSelected ? 'text-active' : 'text-text'}`}>
                    {option.headline}
                  </p>
                  <p className="text-muted text-sm font-sans">{option.subText}</p>
                </div>

                {/* Toggle dot */}
                <div className={`
                  mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200
                  ${isSelected ? 'border-accent bg-accent' : 'border-muted bg-transparent'}
                `}>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full bg-accent"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selected ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center"
      >
        <Button size="lg" onClick={handleSubmit} disabled={!selected}>
          Show me the movies
        </Button>
      </motion.div>
    </div>
  );
}
