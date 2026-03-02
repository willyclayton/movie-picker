'use client';

import { useState } from 'react';
import Link from 'next/link';

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="max-w-sm w-full mx-6 bg-card rounded-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors font-sans text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="font-serif text-2xl text-text font-light mb-5">How it works</h2>
        <div className="flex flex-col gap-3 text-muted text-sm font-sans leading-relaxed">
          <p>We don&apos;t ask what you&apos;ve watched. We ask how you feel.</p>
          <p>
            Your answers map to two emotional axes: how calm or energised you are, and how
            pleasant or unpleasant the feeling. Together they place you on a mood map.
          </p>
          <p>
            We then match movies that tend to evoke that emotional zone — matched to who you
            are right now, not your watch history.
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-lg border border-overlay text-muted hover:text-text hover:border-muted transition-colors text-sm font-sans"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function PageNav() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-muted hover:text-text transition-colors text-sm font-sans"
        >
          ← Home
        </Link>
        <button
          onClick={() => setShowInfo(true)}
          className="w-7 h-7 rounded-full border border-overlay text-muted hover:text-text hover:border-muted transition-colors text-sm font-sans flex items-center justify-center"
          aria-label="How it works"
        >
          ?
        </button>
      </div>
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </>
  );
}
