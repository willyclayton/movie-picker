'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, CINEMATIC_EASE } from '@/lib/animations';
import { COLOR_SWATCHES, colorsToMoodCoord } from '@/data/colorMappings';
import { Button } from '@/components/ui/Button';
import type { QuizAnswer } from '@/types/quiz';

type StepColorPickerProps = {
  onComplete: (answer: QuizAnswer) => void;
};

const MIN_SELECTIONS = 1;
const MAX_SELECTIONS = 5;

export function StepColorPicker({ onComplete }: StepColorPickerProps) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggleColor(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_SELECTIONS) return prev;
      return [...prev, id];
    });
  }

  function handleSubmit() {
    if (selected.length < MIN_SELECTIONS) return;
    const coord = colorsToMoodCoord(selected);
    onComplete({ type: 'color', selectedColors: selected, coord });
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-lg mx-auto">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        <motion.h2 variants={itemVariants} className="font-serif text-4xl md:text-5xl text-text font-light">
          Pick your colors.
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted text-sm font-sans">
          Choose up to {MAX_SELECTIONS}. Trust instinct.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-5 gap-3"
      >
        {COLOR_SWATCHES.map((swatch) => {
          const isSelected = selected.includes(swatch.id);
          return (
            <motion.button
              key={swatch.id}
              variants={itemVariants}
              onClick={() => toggleColor(swatch.id)}
              className="relative group cursor-pointer"
              aria-label={swatch.label}
              aria-pressed={isSelected}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.15, ease: CINEMATIC_EASE }}
            >
              <div
                className="w-full aspect-square rounded-xl transition-all duration-200"
                style={{ backgroundColor: swatch.hex }}
              />
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 rounded-xl ring-2 ring-white ring-offset-2 ring-offset-background"
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selected.length >= MIN_SELECTIONS ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selected.length < MIN_SELECTIONS}
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
