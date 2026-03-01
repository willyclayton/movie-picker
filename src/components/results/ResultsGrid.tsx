'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, itemVariants, CINEMATIC_EASE } from '@/lib/animations';
import { MovieCard } from './MovieCard';
import type { EnrichedMovie } from '@/types/tmdb';

type ResultsGridProps = {
  movies: EnrichedMovie[];
  toneLabel: string;
  framingTemplate: string;
};

export function ResultsGrid({ movies, toneLabel, framingTemplate }: ResultsGridProps) {
  const [visibleCount, setVisibleCount] = useState(10);
  const visible = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <span className="text-accent text-xs font-sans tracking-[0.2em] uppercase">
          {toneLabel} picks
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-text font-light">
          {framingTemplate}
        </h2>
        <p className="text-muted text-sm font-sans">
          Showing {visible.length} of {movies.length} films
        </p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <AnimatePresence>
          {visible.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* See More */}
      {hasMore && (
        <div className="flex justify-center">
          <motion.button
            onClick={() => setVisibleCount(movies.length)}
            className="px-6 py-3 border border-overlay rounded-full text-muted text-sm font-sans hover:border-accent hover:text-accent transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: CINEMATIC_EASE }}
          >
            See more films →
          </motion.button>
        </div>
      )}
    </div>
  );
}
