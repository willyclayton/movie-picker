'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, CINEMATIC_EASE } from '@/lib/animations';
import { QUIZ_IMAGES } from '@/data/images';
import type { QuizAnswer } from '@/types/quiz';

type StepImageSelectorProps = {
  onComplete: (answer: QuizAnswer) => void;
};

export function StepImageSelector({ onComplete }: StepImageSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelected(id);
    // Brief delay for visual feedback, then advance
    setTimeout(() => {
      const image = QUIZ_IMAGES.find((img) => img.id === id);
      if (!image) return;
      onComplete({
        type: 'image',
        imageId: id,
        coord: { ...image.coord, weight: 2 },
      });
    }, 350);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        <motion.h2 variants={itemVariants} className="font-serif text-4xl md:text-5xl text-text font-light">
          Which one pulls you in?
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted text-sm font-sans">
          Go with the first feeling.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {QUIZ_IMAGES.filter((img) => !img.questionOnly).map((image) => {
          const isSelected = selected === image.id;
          return (
            <motion.button
              key={image.id}
              variants={itemVariants}
              onClick={() => handleSelect(image.id)}
              className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[3/4] bg-overlay"
              aria-label={image.caption}
              aria-pressed={isSelected}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: CINEMATIC_EASE }}
            >
              {/* Image with next/image — falls back gracefully if not found */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 z-10" />

              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
                onError={(e) => {
                  // Hide broken image, show background color
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                <p className="text-text text-xs font-sans leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
                  {image.caption}
                </p>
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
    </div>
  );
}
