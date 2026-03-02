'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingTransition } from '@/components/results/LoadingTransition';
import { ResultsGrid } from '@/components/results/ResultsGrid';
import { QuadrantViz } from '@/components/results/QuadrantViz';
import { Button } from '@/components/ui/Button';
import { useRecommendations } from '@/hooks/useRecommendations';
import type { QuizAnswer } from '@/types/quiz';

type Phase = 'loading' | 'results' | 'error';

export default function ResultsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('loading');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQuadrant, setShowQuadrant] = useState(false);
  const { movies, toneLabel, framingTemplate, coordinate, isLoading, error, fetchRecommendations, retry, refresh } =
    useRecommendations();

  useEffect(() => {
    const raw = sessionStorage.getItem('moviePickerAnswers');
    if (!raw) {
      router.replace('/quiz');
      return;
    }

    try {
      const parsed: QuizAnswer[] = JSON.parse(raw);
      if (!parsed.length) {
        router.replace('/quiz');
        return;
      }
      const rawPlatforms = localStorage.getItem('moviePickerPlatforms');
      const savedPlatforms: string[] = rawPlatforms ? JSON.parse(rawPlatforms) : [];
      setAnswers(parsed);
      setPlatforms(savedPlatforms);
      fetchRecommendations(parsed, savedPlatforms);
    } catch {
      router.replace('/quiz');
    }
  }, [router, fetchRecommendations]);

  // When loading finishes AND loading animation is done, show results
  function handleLoadingAnimationDone() {
    if (!isLoading) {
      setPhase(error ? 'error' : 'results');
    }
  }

  useEffect(() => {
    // If API finished after animation already done, advance phase
    if (phase === 'loading' && !isLoading && movies.length > 0) {
      // Let animation complete naturally — don't rush it
    }
    if (!isLoading && error) {
      // Show error after minimum load time
    }
  }, [isLoading, movies, error, phase]);

  useEffect(() => {
    if (!isLoading) setIsRefreshing(false);
  }, [isLoading]);

  if (phase === 'loading') {
    return (
      <LoadingTransition
        onComplete={() => {
          setPhase(error ? 'error' : 'results');
        }}
        minDuration={3500}
      />
    );
  }

  if (phase === 'error' || error) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-center flex flex-col gap-4 max-w-md">
          <h2 className="font-serif text-3xl text-text font-light">Something went sideways.</h2>
          <p className="text-muted text-sm font-sans">{error ?? 'Unable to load recommendations.'}</p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => {
                setPhase('loading');
                retry(answers, platforms);
              }}
            >
              Try again
            </Button>
            <Button variant="ghost" onClick={() => router.push('/quiz')}>
              Retake quiz
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <ResultsGrid
          movies={movies}
          toneLabel={toneLabel}
          framingTemplate={framingTemplate}
        />

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-8 pb-4">
          <Button
            variant="ghost"
            onClick={() => { setIsRefreshing(true); refresh(); }}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Finding more...' : 'Show me different movies →'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              sessionStorage.removeItem('moviePickerAnswers');
              router.push('/quiz');
            }}
          >
            Not quite right? Retake the quiz →
          </Button>
          <Button variant="ghost" onClick={() => setShowQuadrant((v) => !v)}>
            {showQuadrant ? 'Hide quadrant ↑' : 'Show me the quadrant →'}
          </Button>
        </div>

        {showQuadrant && coordinate && (
          <QuadrantViz
            coordinate={coordinate}
            movies={movies}
            toneLabel={toneLabel}
            framingTemplate={framingTemplate}
          />
        )}
      </div>
    </main>
  );
}
