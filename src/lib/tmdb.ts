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

export function getTMDBImageUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
