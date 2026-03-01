'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { PRESET_KEYWORDS } from '@/data/keywords';
import { Button } from '@/components/ui/Button';
import type { QuizAnswer } from '@/types/quiz';

type StepKeywordsProps = {
  onComplete: (answer: QuizAnswer) => void;
};

function parseCustomTerms(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function StepKeywords({ onComplete }: StepKeywordsProps) {
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [customText, setCustomText] = useState('');

  function toggleChip(searchTerm: string) {
    setSelectedChips((prev) => {
      const next = new Set(prev);
      if (next.has(searchTerm)) {
        next.delete(searchTerm);
      } else {
        next.add(searchTerm);
      }
      return next;
    });
  }

  function handleContinue() {
    const customTerms = parseCustomTerms(customText);
    const selected = [...Array.from(selectedChips), ...customTerms];
    onComplete({ type: 'keywords', selected });
  }

  function handleSkip() {
    onComplete({ type: 'keywords', selected: [] });
  }

  const hasSelection = selectedChips.size > 0 || customText.trim().length > 0;

  return (
    <div className="flex flex-col gap-10 w-full max-w-lg mx-auto">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        <motion.h2 variants={itemVariants} className="font-serif text-4xl md:text-5xl text-text font-light">
          Anything pulling at you?
        </motion.h2>
        <motion.p variants={itemVariants} className="font-sans text-sm text-muted">
          Optional. Pick a few or add your own.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-6"
      >
        {/* Preset chips */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
          {PRESET_KEYWORDS.map((kw) => {
            const isSelected = selectedChips.has(kw.searchTerm);
            return (
              <button
                key={kw.searchTerm}
                onClick={() => toggleChip(kw.searchTerm)}
                className={`
                  px-4 py-2 rounded-full border text-sm font-sans font-medium
                  transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? 'border-accent bg-overlay text-active ring-1 ring-accent'
                    : 'border-overlay bg-card text-muted hover:border-muted hover:text-text'
                  }
                `}
              >
                {kw.label}
              </button>
            );
          })}
        </motion.div>

        {/* Custom text input */}
        <motion.div variants={itemVariants}>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="or type: heist, revenge, road trip…"
            className="
              w-full px-5 py-3.5 rounded-xl border border-overlay bg-card
              text-text text-sm font-sans placeholder:text-muted
              focus:outline-none focus:border-muted focus:bg-overlay
              transition-all duration-200
            "
          />
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={handleSkip}
            className="text-muted hover:text-text"
          >
            Skip
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleContinue}
            disabled={!hasSelection}
            className="flex-1"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
