'use client';

import { motion } from 'framer-motion';
import { containerVariants, itemVariants, CINEMATIC_EASE } from '@/lib/animations';

export function HeroSection() {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto"
    >
      <motion.p
        variants={itemVariants}
        className="text-muted text-sm tracking-[0.2em] uppercase font-sans"
      >
        a different kind of recommender
      </motion.p>

      <motion.h1
        variants={itemVariants}
        className="font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-tight text-text"
      >
        What kind of
        <br />
        <em className="text-accent not-italic">movie</em> are you
        <br />
        tonight?
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-muted text-base md:text-lg font-sans leading-relaxed max-w-sm"
      >
        We won&apos;t ask what you feel. We&apos;ll find out another way.
      </motion.p>
    </motion.div>
  );
}
