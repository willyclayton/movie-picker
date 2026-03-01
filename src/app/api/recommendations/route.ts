import { NextRequest, NextResponse } from 'next/server';
import { computeFinalCoordinate } from '@/lib/circumplex';
import { discoverMoviesMultiPage, getMovieExtras } from '@/lib/tmdb';
import { enrichWithStreaming } from '@/lib/streaming';
import { getRTScores } from '@/lib/omdb';
import { selectGenres } from '@/data/circumplex';
import { deduplicateBy, shuffle } from '@/lib/utils';
import type { QuizAnswer } from '@/types/quiz';
import type { EnrichedMovie, TMDBMovie } from '@/types/tmdb';

async function enrichMovie(movie: TMDBMovie, toneLabel: string, framingLabel: string): Promise<EnrichedMovie> {
  // Fetch TMDB extras (IMDB ID + trailer) and streaming in parallel
  const [extras, streamingResult] = await Promise.all([
    getMovieExtras(movie.id).catch(() => ({ imdbId: null, trailerUrl: null })),
    enrichWithStreaming([movie])
      .then((r) => r[0]?.streamingInfo ?? null)
      .catch(() => null),
  ]);

  // Fetch RT scores if we have an IMDB ID and OMDB key
  const rtScores = extras.imdbId
    ? await getRTScores(extras.imdbId).catch(() => null)
    : null;

  // Fallback trailer: YouTube search
  const trailerUrl =
    extras.trailerUrl ??
    `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`;

  return {
    ...movie,
    toneLabel,
    framingLabel,
    streamingInfo: streamingResult,
    tomatometer: rtScores?.tomatometer ?? null,
    imdbScore: rtScores?.imdb ?? null,
    trailerUrl,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const answers: QuizAnswer[] = body.answers ?? [];

    if (!answers.length) {
      return NextResponse.json({ error: 'No answers provided' }, { status: 400 });
    }

    // 1. Compute final circumplex coordinate
    const { valence, arousal } = computeFinalCoordinate(answers);

    // 2. Select genres based on coordinate (with blending near axes)
    const { genreIds, toneLabel, framingTemplate, sortBy } = selectGenres(valence, arousal);

    // 3. Determine quality threshold based on arousal
    const voteAvgThreshold = arousal < -0.3 ? 7.0 : 6.0;

    // 4. Build TMDB discover params
    const discoverParams = {
      with_genres: genreIds.slice(0, 3).join('|'),
      sort_by: sortBy,
      'vote_average.gte': voteAvgThreshold,
      'vote_count.gte': 50,
    };

    // 5. Fetch pages 1–3 in parallel
    let movies = await discoverMoviesMultiPage(discoverParams, 3);

    // 6. Fallback: if < 5 results, retry with just top 2 genres, lower threshold
    if (movies.length < 5) {
      const fallbackParams = {
        with_genres: genreIds.slice(0, 2).join('|'),
        sort_by: sortBy,
        'vote_average.gte': 5.5,
        'vote_count.gte': 30,
      };
      movies = await discoverMoviesMultiPage(fallbackParams, 2);
    }

    // 7. Deduplicate and shuffle, take 10
    const unique = deduplicateBy(movies, (m) => m.id);
    const shuffled = shuffle(unique);
    const selected = shuffled.slice(0, 10);

    // 8. Enrich all movies in parallel (TMDB extras + streaming + RT scores)
    const result = await Promise.all(
      selected.map((movie) => enrichMovie(movie, toneLabel, framingTemplate))
    );

    return NextResponse.json({
      movies: result,
      toneLabel,
      framingTemplate,
      coordinate: { valence, arousal },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[recommendations]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
