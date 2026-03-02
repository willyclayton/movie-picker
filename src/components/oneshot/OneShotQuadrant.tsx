'use client';

import { useRef } from 'react';

type Coord = { valence: number; arousal: number };

type Props = {
  coordinate: Coord | null;
  onChange: (coord: Coord) => void;
};

const QUADRANT_COLORS = {
  intense:     { base: 'rgba(80,20,20,0.35)',  active: 'rgba(80,20,20,0.6)'  },
  exuberant:   { base: 'rgba(80,50,10,0.35)',  active: 'rgba(80,50,10,0.6)'  },
  melancholic: { base: 'rgba(20,30,60,0.35)',  active: 'rgba(20,30,60,0.6)'  },
  content:     { base: 'rgba(15,50,30,0.35)',  active: 'rgba(15,50,30,0.6)'  },
} as const;

function getQuadrant(valence: number, arousal: number): keyof typeof QUADRANT_COLORS {
  if (valence < 0 && arousal >= 0) return 'intense';
  if (valence >= 0 && arousal >= 0) return 'exuberant';
  if (valence < 0 && arousal < 0) return 'melancholic';
  return 'content';
}

function getCoordFromEvent(
  e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  el: HTMLDivElement
): Coord {
  const rect = el.getBoundingClientRect();
  let clientX: number, clientY: number;
  if ('touches' in e) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
  return {
    valence: x * 2 - 1,
    arousal: 1 - y * 2,
  };
}

export function OneShotQuadrant({ coordinate, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeQuadrant = coordinate ? getQuadrant(coordinate.valence, coordinate.arousal) : null;

  const dotX = coordinate ? ((coordinate.valence + 1) / 2) * 100 : null;
  const dotY = coordinate ? ((1 - coordinate.arousal) / 2) * 100 : null;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    onChange(getCoordFromEvent(e, containerRef.current));
  }

  function handleTouch(e: React.TouchEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!containerRef.current) return;
    onChange(getCoordFromEvent(e, containerRef.current));
  }

  return (
    <>
      <style>{`
        @keyframes oneshot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.75; }
        }
      `}</style>
      <div
        ref={containerRef}
        onClick={handleClick}
        onTouchStart={handleTouch}
        className="relative rounded-lg overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 440,
          aspectRatio: '1 / 1',
          border: '1px solid #2a2a2a',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      >
        {/* Quadrant backgrounds */}
        <div className="absolute" style={{
          left: 0, top: 0, width: '50%', height: '50%',
          background: activeQuadrant === 'intense' ? QUADRANT_COLORS.intense.active : QUADRANT_COLORS.intense.base,
        }} />
        <div className="absolute" style={{
          right: 0, top: 0, width: '50%', height: '50%',
          background: activeQuadrant === 'exuberant' ? QUADRANT_COLORS.exuberant.active : QUADRANT_COLORS.exuberant.base,
        }} />
        <div className="absolute" style={{
          left: 0, bottom: 0, width: '50%', height: '50%',
          background: activeQuadrant === 'melancholic' ? QUADRANT_COLORS.melancholic.active : QUADRANT_COLORS.melancholic.base,
        }} />
        <div className="absolute" style={{
          right: 0, bottom: 0, width: '50%', height: '50%',
          background: activeQuadrant === 'content' ? QUADRANT_COLORS.content.active : QUADRANT_COLORS.content.base,
        }} />

        {/* Crosshair */}
        <div className="absolute" style={{ top: '50%', left: 0, right: 0, height: 1, background: '#2a2a2a', pointerEvents: 'none' }} />
        <div className="absolute" style={{ left: '50%', top: 0, bottom: 0, width: 1, background: '#2a2a2a', pointerEvents: 'none' }} />

        {/* Quadrant name labels */}
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', top: 8, left: 10 }}>intense</span>
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', top: 8, right: 10 }}>exuberant</span>
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', bottom: 8, left: 10 }}>melancholic</span>
        <span className="absolute text-[10px] uppercase tracking-wider" style={{ color: '#9A9590', bottom: 8, right: 10 }}>content</span>

        {/* Axis labels */}
        <span className="absolute text-[9px]" style={{ color: '#9A9590', left: 6, top: '50%', transform: 'translateY(-50%)' }}>Unpleasant</span>
        <span className="absolute text-[9px]" style={{ color: '#9A9590', right: 6, top: '50%', transform: 'translateY(-50%)' }}>Pleasant</span>
        <span className="absolute text-[9px]" style={{ color: '#9A9590', top: 6, left: '50%', transform: 'translateX(-50%)' }}>Energised</span>
        <span className="absolute text-[9px]" style={{ color: '#9A9590', bottom: 6, left: '50%', transform: 'translateX(-50%)' }}>Calm</span>

        {/* User dot */}
        {dotX !== null && dotY !== null && (
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
              animation: 'oneshot-pulse 2s ease-in-out infinite',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </>
  );
}
