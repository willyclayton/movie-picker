'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { loadingTextVariants, CINEMATIC_EASE } from '@/lib/animations';

const LOADING_PHASES = [
  { text: 'Reading the room…', duration: 1200 },
  { text: 'Mapping your frequency…', duration: 1300 },
  { text: 'Finding what fits…', duration: 1000 },
];

type LoadingTransitionProps = {
  onComplete?: () => void;
  minDuration?: number;
};

export function LoadingTransition({ onComplete, minDuration = 3500 }: LoadingTransitionProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    LOADING_PHASES.forEach((p, i) => {
      const timer = setTimeout(() => setPhase(i), elapsed);
      timers.push(timer);
      elapsed += p.duration;
    });

    const doneTimer = setTimeout(() => {
      onComplete?.();
    }, Math.max(elapsed, minDuration));
    timers.push(doneTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete, minDuration]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated gradient backdrop */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.06) 0%, transparent 60%)',
            'radial-gradient(ellipse at 70% 60%, rgba(201,168,76,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)',
          ],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Pulsing orb */}
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-accent/5 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Phase text */}
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            variants={loadingTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="font-serif text-3xl md:text-4xl text-text font-light"
          >
            {LOADING_PHASES[phase]?.text}
          </motion.p>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {LOADING_PHASES.map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted"
              animate={{ opacity: i === phase ? 1 : 0.3, scale: i === phase ? 1.3 : 1 }}
              transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
