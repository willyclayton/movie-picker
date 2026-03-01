'use client';

import { motion } from 'framer-motion';
import { containerVariants } from '@/lib/animations';
import { MovieCard } from './MovieCard';
import type { EnrichedMovie } from '@/types/tmdb';

type ResultsGridProps = {
  movies: EnrichedMovie[];
  toneLabel: string;
  framingTemplate: string;
};

export function ResultsGrid({ movies, toneLabel, framingTemplate }: ResultsGridProps) {
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
        <p className="text-muted text-sm font-sans">{movies.length} films found</p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </motion.div>
    </div>
  );
}
