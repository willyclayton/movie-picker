'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageNav } from '@/components/ui/PageNav';
import { OneShotQuadrant } from '@/components/oneshot/OneShotQuadrant';

type Coord = { valence: number; arousal: number };

export default function OneShotPage() {
  const router = useRouter();
  const [coord, setCoord] = useState<Coord | null>(null);

  function handleSubmit() {
    if (!coord) return;
    const answers = [
      { type: 'image', imageId: 'oneshot', coord: { valence: coord.valence, arousal: coord.arousal, weight: 3 } },
    ];
    sessionStorage.setItem('moviePickerAnswers', JSON.stringify(answers));
    router.push('/results');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-10">
      <div className="max-w-2xl mx-auto w-full mb-8">
        <PageNav />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-serif text-3xl text-text font-light">
            Drop a pin on where you are right now.
          </h1>
          <p className="font-sans text-sm" style={{ color: '#9A9590' }}>
            We&apos;ll find movies that match.
          </p>
        </div>

        <OneShotQuadrant coordinate={coord} onChange={setCoord} />

        <button
          onClick={handleSubmit}
          disabled={coord === null}
          className="px-10 py-4 text-lg font-sans font-medium rounded-full transition-colors"
          style={{
            background: coord ? '#C9A84C' : '#2a2a2a',
            color: coord ? '#0A0A0A' : '#9A9590',
            cursor: coord ? 'pointer' : 'not-allowed',
          }}
        >
          Find my movies
        </button>
      </div>
    </div>
  );
}
