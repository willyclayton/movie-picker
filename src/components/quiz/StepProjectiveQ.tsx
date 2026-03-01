'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, CINEMATIC_EASE } from '@/lib/animations';
import { PROJECTIVE_QUESTIONS } from '@/data/questions';
import { QUIZ_IMAGES } from '@/data/images';
import type { QuizAnswer } from '@/types/quiz';

type StepProjectiveQProps = {
  onComplete: (answer: QuizAnswer) => void;
  questionIndex?: number;
};

export function StepProjectiveQ({ onComplete, questionIndex = 0 }: StepProjectiveQProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const question = PROJECTIVE_QUESTIONS[questionIndex];

  // Image-card layout when every option has an imageId; gradient-card when some have gradient
  const hasImages = question.options.every((o) => o.imageId != null);
  const hasGradients = !hasImages && question.options.some((o) => o.gradient);

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
    <div className={`flex flex-col w-full mx-auto ${hasImages ? 'gap-8 max-w-2xl' : 'gap-10 max-w-lg'}`}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        <motion.h2 variants={itemVariants} className="font-serif text-4xl md:text-5xl text-text font-light">
          {question.prompt}
        </motion.h2>
        {hasImages && (
          <motion.p variants={itemVariants} className="text-muted text-sm font-sans">
            Go with the first feeling.
          </motion.p>
        )}
      </motion.div>

      {hasImages ? (
        // ── Full-bleed image cards (2×2 grid) ─────────────────────────
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-3"
        >
          {question.options.map((option) => {
            const image = QUIZ_IMAGES.find((img) => img.id === option.imageId);
            const isSelected = selected === option.id;

            return (
              <motion.button
                key={option.id}
                variants={itemVariants}
                onClick={() => handleSelect(option.id)}
                className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[4/3] bg-overlay"
                aria-label={option.label}
                aria-pressed={isSelected}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: CINEMATIC_EASE }}
              >
                {/* Bottom gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/75 z-10" />

                {/* Image — gradient fallback if file is missing */}
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = 'none';
                      // Show gradient fallback by revealing parent background
                      if (option.gradient && el.parentElement) {
                        el.parentElement.style.background = option.gradient;
                      }
                    }}
                  />
                ) : option.gradient ? (
                  <div className="absolute inset-0" style={{ background: option.gradient }} />
                ) : null}

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                  <p className="text-text text-xs font-sans font-medium leading-tight opacity-90 group-hover:opacity-100 transition-opacity">
                    {option.label}
                  </p>
                  {option.subLabel && (
                    <p className="text-muted text-xs font-sans leading-tight mt-0.5 opacity-70">
                      {option.subLabel}
                    </p>
                  )}
                </div>

                {/* Selected ring */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 ring-2 ring-accent ring-inset rounded-xl z-30"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      ) : hasGradients ? (
        // ── Gradient header cards (fallback layout) ────────────────────
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-3"
        >
          {question.options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <motion.button
                key={option.id}
                variants={itemVariants}
                onClick={() => handleSelect(option.id)}
                className={`
                  rounded-2xl overflow-hidden border cursor-pointer
                  transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-accent ring-1 ring-accent'
                    : 'border-overlay hover:border-muted'
                  }
                `}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: CINEMATIC_EASE }}
              >
                <div
                  className="h-28 w-full"
                  style={{ background: option.gradient }}
                />
                <div className="px-4 py-3 bg-card">
                  <span className="font-sans text-sm font-medium text-text block leading-snug">
                    {option.label}
                  </span>
                  {option.subLabel && (
                    <span className="font-sans text-xs text-muted block mt-1">
                      {option.subLabel}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      ) : (
        // ── Text-button list (plain fallback) ──────────────────────────
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
      )}
    </div>
  );
}
