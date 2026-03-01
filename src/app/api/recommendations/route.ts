import { NextRequest, NextResponse } from 'next/server';
import { computeFinalCoordinate } from '@/lib/circumplex';
import { discoverMoviesMultiPage, getMovieExtras, resolveKeywordIds } from '@/lib/tmdb';
import { enrichWithStreaming } from '@/lib/streaming';
import { getRTScores } from '@/lib/omdb';
import { selectGenres, getDescriptors } from '@/data/circumplex';
import { PLATFORMS } from '@/data/platforms';
import { deduplicateBy, shuffle } from '@/lib/utils';
import type { QuizAnswer } from '@/types/quiz';
import type { EnrichedMovie, TMDBMovie } from '@/types/tmdb';

async function enrichMovie(movie: TMDBMovie, toneLabel: string, framingLabel: string): Promise<EnrichedMovie> {
  // Fetch TMDB extras (IMDB ID + trailer + runtime) and streaming in parallel
  const [extras, streamingResult] = await Promise.all([
    getMovieExtras(movie.id).catch(() => ({ imdbId: null, trailerUrl: null, runtime: null })),
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
    runtime: extras.runtime,
    descriptors: getDescriptors(movie.genre_ids, toneLabel),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const answers: QuizAnswer[] = body.answers ?? [];
    const platforms: string[] = body.platforms ?? [];
    const providerIds = platforms
      .map((key) => PLATFORMS.find((p) => p.key === key)?.providerId)
      .filter((id): id is number => id !== undefined);

    if (!answers.length) {
      return NextResponse.json({ error: 'No answers provided' }, { status: 400 });
    }

    // 1. Compute final circumplex coordinate
    const { valence, arousal } = computeFinalCoordinate(answers);

    // 2. Select genres based on coordinate (with blending near axes)
    const { genreIds, toneLabel, framingTemplate, sortBy } = selectGenres(valence, arousal);

    // 3. Determine quality threshold based on arousal
    const voteAvgThreshold = arousal < -0.3 ? 7.0 : 6.0;

    // 4. Resolve user keyword terms to TMDB keyword IDs
    const keywordAnswer = answers.find((a) => a.type === 'keywords');
    const keywordTerms = keywordAnswer?.type === 'keywords' ? keywordAnswer.selected : [];
    const keywordIds = await resolveKeywordIds(keywordTerms);

    // 5. Build provider filter (only when platforms are selected)
    const providerFilter =
      providerIds.length > 0
        ? { with_watch_providers: providerIds.join('|'), watch_region: 'US' }
        : {};

    // 6. Build TMDB discover params
    const discoverParams = {
      with_genres: genreIds.slice(0, 3).join('|'),
      sort_by: sortBy,
      'vote_average.gte': voteAvgThreshold,
      'vote_count.gte': 50,
      ...(keywordIds.length > 0 && { with_keywords: keywordIds.join('|') }),
      ...providerFilter,
    };

    // 7. Fetch pages 1–3 in parallel
    let movies = await discoverMoviesMultiPage(discoverParams, 3);

    // 8. Fallback tier 1: if < 5 results and keywords were applied, retry without keywords (keep providers)
    if (movies.length < 5 && keywordIds.length > 0) {
      const noKeywordParams = {
        with_genres: genreIds.slice(0, 3).join('|'),
        sort_by: sortBy,
        'vote_average.gte': voteAvgThreshold,
        'vote_count.gte': 50,
        ...providerFilter,
      };
      movies = await discoverMoviesMultiPage(noKeywordParams, 3);
    }

    // 9. Fallback tier 2: if still < 5 and providers were set, retry without providers
    if (movies.length < 5 && providerIds.length > 0) {
      const noProviderParams = {
        with_genres: genreIds.slice(0, 3).join('|'),
        sort_by: sortBy,
        'vote_average.gte': voteAvgThreshold,
        'vote_count.gte': 50,
      };
      movies = await discoverMoviesMultiPage(noProviderParams, 3);
    }

    // 10. Fallback tier 3: if still < 5, retry with fewer genres and lower thresholds
    if (movies.length < 5) {
      const fallbackParams = {
        with_genres: genreIds.slice(0, 2).join('|'),
        sort_by: sortBy,
        'vote_average.gte': 5.5,
        'vote_count.gte': 30,
      };
      movies = await discoverMoviesMultiPage(fallbackParams, 2);
    }

    // 11. Deduplicate and shuffle, take 10
    const unique = deduplicateBy(movies, (m) => m.id);
    const shuffled = shuffle(unique);
    const selected = shuffled.slice(0, 20);

    // 12. Enrich all movies in parallel (TMDB extras + streaming + RT scores)
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
