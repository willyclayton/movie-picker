'use client';

import Image from 'next/image';
import { getQuadrant, getDescriptors, QUADRANT_MAP } from '@/data/circumplex';
import { getTMDBImageUrl } from '@/lib/tmdb';
import type { EnrichedMovie } from '@/types/tmdb';

type Props = {
  coordinate: { valence: number; arousal: number };
  movies: EnrichedMovie[];
  toneLabel: string;
  framingTemplate: string;
};

const QUADRANT_COLORS = {
  intense:    { base: 'rgba(80,20,20,0.35)',  active: 'rgba(80,20,20,0.6)'  },
  exuberant:  { base: 'rgba(80,50,10,0.35)',  active: 'rgba(80,50,10,0.6)'  },
  melancholic:{ base: 'rgba(20,30,60,0.35)',  active: 'rgba(20,30,60,0.6)'  },
  content:    { base: 'rgba(15,50,30,0.35)',  active: 'rgba(15,50,30,0.6)'  },
} as const;

// Deterministic scatter within the active quadrant using Fibonacci-based offsets
function getThumbnailPosition(
  index: number,
  quadrant: keyof typeof QUADRANT_COLORS
): { left: string; top: string } {
  // Use golden-ratio fractions so thumbnails spread without clustering
  const nx = ((index * 0.618) % 0.76) + 0.12; // 0.12–0.88 within quadrant
  const ny = ((index * 0.381) % 0.76) + 0.12;

  let x: number, y: number;
  if (quadrant === 'intense') {
    x = nx * 50; y = ny * 50;
  } else if (quadrant === 'exuberant') {
    x = 50 + nx * 50; y = ny * 50;
  } else if (quadrant === 'melancholic') {
    x = nx * 50; y = 50 + ny * 50;
  } else {
    x = 50 + nx * 50; y = 50 + ny * 50;
  }

  return { left: `calc(${x}% - 16px)`, top: `calc(${y}% - 16px)` };
}

export function QuadrantViz({ coordinate, movies, toneLabel, framingTemplate }: Props) {
  const { valence, arousal } = coordinate;
  const quadrant = getQuadrant(valence, arousal);
  const quadrantConfig = QUADRANT_MAP[quadrant];
  const descriptors = getDescriptors(quadrantConfig.genreIds, toneLabel);

  // Convert coordinate to % position on chart
  const dotX = ((valence + 1) / 2) * 100;
  const dotY = ((1 - arousal) / 2) * 100;

  // Up to 12 thumbnails with posters
  const posterMovies = movies.filter((m) => m.poster_path).slice(0, 12);

  return (
    <div className="flex flex-col items-center gap-6 py-2 w-full">
      <style>{`
        @keyframes quadrant-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.75; }
        }
      `}</style>

      {/* Chart */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 420,
          aspectRatio: '1 / 1',
          border: '1px solid #2a2a2a',
        }}
      >
        {/* Quadrant backgrounds */}
        {/* intense: top-left */}
        <div
          className="absolute"
          style={{
            left: 0, top: 0, width: '50%', height: '50%',
            background: quadrant === 'intense'
              ? QUADRANT_COLORS.intense.active
              : QUADRANT_COLORS.intense.base,
          }}
        />
        {/* exuberant: top-right */}
        <div
          className="absolute"
          style={{
            right: 0, top: 0, width: '50%', height: '50%',
            background: quadrant === 'exuberant'
              ? QUADRANT_COLORS.exuberant.active
              : QUADRANT_COLORS.exuberant.base,
          }}
        />
        {/* melancholic: bottom-left */}
        <div
          className="absolute"
          style={{
            left: 0, bottom: 0, width: '50%', height: '50%',
            background: quadrant === 'melancholic'
              ? QUADRANT_COLORS.melancholic.active
              : QUADRANT_COLORS.melancholic.base,
          }}
        />
        {/* content: bottom-right */}
        <div
          className="absolute"
          style={{
            right: 0, bottom: 0, width: '50%', height: '50%',
            background: quadrant === 'content'
              ? QUADRANT_COLORS.content.active
              : QUADRANT_COLORS.content.base,
          }}
        />

        {/* Crosshair */}
        <div
          className="absolute"
          style={{ top: '50%', left: 0, right: 0, height: 1, background: '#2a2a2a', pointerEvents: 'none' }}
        />
        <div
          className="absolute"
          style={{ left: '50%', top: 0, bottom: 0, width: 1, background: '#2a2a2a', pointerEvents: 'none' }}
        />

        {/* Quadrant name labels */}
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', top: 8, left: 10 }}>
          intense
        </span>
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', top: 8, right: 10 }}>
          exuberant
        </span>
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', bottom: 8, left: 10 }}>
          melancholic
        </span>
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', bottom: 8, right: 10 }}>
          content
        </span>

        {/* Axis end labels */}
        <span
          className="absolute text-[9px]"
          style={{ color: '#9A9590', left: 6, top: '50%', transform: 'translateY(-50%)' }}
        >
          Unpleasant
        </span>
        <span
          className="absolute text-[9px]"
          style={{ color: '#9A9590', right: 6, top: '50%', transform: 'translateY(-50%)' }}
        >
          Pleasant
        </span>
        <span
          className="absolute text-[9px]"
          style={{ color: '#9A9590', top: 6, left: '50%', transform: 'translateX(-50%)' }}
        >
          Energised
        </span>
        <span
          className="absolute text-[9px]"
          style={{ color: '#9A9590', bottom: 6, left: '50%', transform: 'translateX(-50%)' }}
        >
          Calm
        </span>

        {/* Movie poster thumbnails scattered in active quadrant */}
        {posterMovies.map((movie, index) => {
          const pos = getThumbnailPosition(index, quadrant);
          const src = getTMDBImageUrl(movie.poster_path, 'w342');
          if (!src) return null;
          return (
            <div
              key={movie.id}
              className="absolute overflow-hidden"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '2px solid #C9A84C',
                ...pos,
              }}
            >
              <Image
                src={src}
                alt={movie.title}
                width={32}
                height={32}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          );
        })}

        {/* User dot */}
        <div
          className="absolute"
          style={{
            left: `calc(${dotX}% - 7px)`,
            top: `calc(${dotY}% - 7px)`,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#C9A84C',
            boxShadow: '0 0 10px 3px rgba(201,168,76,0.55)',
            animation: 'quadrant-pulse 2s ease-in-out infinite',
            zIndex: 10,
          }}
        />
      </div>

      {/* Description row */}
      <div className="flex flex-col items-center gap-3 text-center" style={{ maxWidth: 420, width: '100%' }}>
        {/* Quadrant chip */}
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest font-sans"
          style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
        >
          {quadrant}
        </span>

        {/* Framing sentence */}
        <p className="font-serif text-base italic" style={{ color: '#9A9590' }}>
          {framingTemplate}
        </p>

        {/* Descriptor words */}
        <div className="flex gap-4">
          {descriptors.map((d) => (
            <span key={d} className="text-xs uppercase tracking-wider font-sans" style={{ color: '#9A9590' }}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
