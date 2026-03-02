'use client';

import { useState, useCallback } from 'react';
import type { QuizAnswer } from '@/types/quiz';
import type { EnrichedMovie } from '@/types/tmdb';

type RecommendationsState = {
  movies: EnrichedMovie[];
  toneLabel: string;
  framingTemplate: string;
  coordinate: { valence: number; arousal: number } | null;
  isLoading: boolean;
  error: string | null;
};

export function useRecommendations() {
  const [state, setState] = useState<RecommendationsState>({
    movies: [],
    toneLabel: '',
    framingTemplate: '',
    coordinate: null,
    isLoading: false,
    error: null,
  });

  const [storedAnswers, setStoredAnswers] = useState<QuizAnswer[]>([]);
  const [storedPlatforms, setStoredPlatforms] = useState<string[]>([]);
  const [pageOffset, setPageOffset] = useState(0);

  const fetchRecommendations = useCallback(async (answers: QuizAnswer[], platforms: string[] = [], offset: number = 0) => {
    setStoredAnswers(answers);
    setStoredPlatforms(platforms);
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, platforms, pageOffset: offset }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      setState({
        movies: data.movies ?? [],
        toneLabel: data.toneLabel ?? '',
        framingTemplate: data.framingTemplate ?? '',
        coordinate: data.coordinate ?? null,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Something went wrong',
      }));
    }
  }, []);

  const retry = useCallback(
    (answers: QuizAnswer[], platforms?: string[]) => fetchRecommendations(answers, platforms),
    [fetchRecommendations]
  );

  const refresh = useCallback(() => {
    const nextOffset = pageOffset + 3;
    setPageOffset(nextOffset);
    fetchRecommendations(storedAnswers, storedPlatforms, nextOffset);
  }, [pageOffset, storedAnswers, storedPlatforms, fetchRecommendations]);

  return { ...state, fetchRecommendations, retry, refresh };
}
