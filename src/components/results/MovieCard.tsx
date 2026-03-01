'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { getTMDBImageUrl } from '@/lib/tmdb';
import { StreamingBadge } from './StreamingBadge';
import { itemVariants, CINEMATIC_EASE } from '@/lib/animations';
import type { EnrichedMovie } from '@/types/tmdb';

type MovieCardProps = {
  movie: EnrichedMovie;
};

function TomatoIcon({ score }: { score: string }) {
  const pct = parseInt(score);
  const fresh = !isNaN(pct) && pct >= 60;
  return (
    <span title={`Rotten Tomatoes: ${score}`} className="flex items-center gap-1">
      <span>{fresh ? '🍅' : '🤢'}</span>
      <span className={fresh ? 'text-green-400' : 'text-yellow-500'}>{score}</span>
    </span>
  );
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTMDBImageUrl(movie.poster_path, 'w342');
  const year = movie.release_date?.slice(0, 4) ?? '';
  const hasScores = movie.tomatometer || movie.imdbScore;

  return (
    <motion.article
      variants={itemVariants}
      className="group relative bg-card rounded-2xl overflow-hidden flex flex-col hover:bg-overlay transition-colors duration-300"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-overlay overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted text-4xl">🎬</span>
          </div>
        )}

        {/* Tone badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded-lg text-accent text-xs font-sans font-medium tracking-wide">
            {movie.toneLabel}
          </span>
        </div>

        {/* Trailer button — overlaid on poster */}
        {movie.trailerUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-text text-sm font-sans font-medium hover:bg-accent hover:text-background transition-colors"
            >
              <span>▶</span> Trailer
            </a>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-serif text-xl text-text font-light leading-tight group-hover:text-active transition-colors">
            {movie.title}
          </h3>
          {year && (
            <p className="text-muted text-xs font-sans mt-0.5">{year}</p>
          )}
        </div>

        {/* Scores row */}
        {hasScores && (
          <div className="flex items-center gap-3 text-xs font-sans">
            {movie.tomatometer && <TomatoIcon score={movie.tomatometer} />}
            {movie.imdbScore && (
              <span className="flex items-center gap-1 text-muted" title="IMDB rating">
                <span className="text-yellow-400">★</span>
                <span>{movie.imdbScore}</span>
              </span>
            )}
          </div>
        )}

        {/* Framing label */}
        {movie.framingLabel && (
          <p className="text-muted text-xs font-sans italic leading-relaxed">
            {movie.framingLabel}
          </p>
        )}

        {/* Streaming badges */}
        {movie.streamingInfo?.services && movie.streamingInfo.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {movie.streamingInfo.services.slice(0, 3).map((service, i) => (
              <StreamingBadge key={i} service={service} />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
