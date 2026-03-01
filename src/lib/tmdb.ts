import type { TMDBDiscoverParams, TMDBDiscoverResponse, TMDBMovie } from '@/types/tmdb';

const BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY is not set');
  return key;
}

export async function discoverMovies(params: TMDBDiscoverParams): Promise<TMDBMovie[]> {
  const apiKey = getApiKey();
  const searchParams = new URLSearchParams({
    api_key: apiKey,
    language: 'en-US',
    include_adult: 'false',
    ...Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    ),
  });

  const url = `${BASE_URL}/discover/movie?${searchParams.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`TMDB discover failed: ${res.status} ${res.statusText}`);
  }

  const data: TMDBDiscoverResponse = await res.json();
  return data.results ?? [];
}

export async function discoverMoviesMultiPage(
  params: TMDBDiscoverParams,
  pages: number = 3
): Promise<TMDBMovie[]> {
  const pageRequests = Array.from({ length: pages }, (_, i) =>
    discoverMovies({ ...params, page: i + 1 }).catch(() => [] as TMDBMovie[])
  );

  const results = await Promise.all(pageRequests);
  return results.flat();
}

type MovieExtras = {
  imdbId: string | null;
  trailerUrl: string | null;
};

/**
 * Fetch IMDB ID and official YouTube trailer for a movie in one call.
 * Uses append_to_response to avoid extra round-trips.
 */
export async function getMovieExtras(id: number): Promise<MovieExtras> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=external_ids,videos`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return { imdbId: null, trailerUrl: null };

    const data = await res.json();

    const imdbId: string | null = data.external_ids?.imdb_id ?? null;

    // Prefer official trailers, fall back to any trailer, then teasers
    const videos: { type: string; site: string; official?: boolean; key: string }[] =
      data.videos?.results ?? [];

    const trailer =
      videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ??
      videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ??
      videos.find((v) => v.type === 'Teaser' && v.site === 'YouTube');

    const trailerUrl = trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null;

    return { imdbId, trailerUrl };
  } catch {
    return { imdbId: null, trailerUrl: null };
  }
}

export function getTMDBImageUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
