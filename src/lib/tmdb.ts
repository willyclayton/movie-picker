import type { TMDBDiscoverParams, TMDBDiscoverResponse, TMDBMovie, StreamingService } from '@/types/tmdb';

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
  runtime: number | null;
  watchProviders: StreamingService[];
};

function normalizeProviderName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('netflix')) return 'netflix';
  if (n.includes('hulu')) return 'hulu';
  if (n.includes('disney')) return 'disney';
  if (n.includes('amazon') || n.includes('prime')) return 'amazon';
  if (n.includes('max') || n.includes('hbo')) return 'max';
  if (n.includes('apple')) return 'appletv';
  if (n.includes('paramount')) return 'paramount';
  if (n.includes('peacock')) return 'peacock';
  if (n.includes('tubi')) return 'tubi';
  if (n.includes('pluto')) return 'pluto';
  return n;
}

/**
 * Fetch IMDB ID and official YouTube trailer for a movie in one call.
 * Uses append_to_response to avoid extra round-trips.
 */
export async function getMovieExtras(id: number): Promise<MovieExtras> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=external_ids,videos,watch%2Fproviders`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return { imdbId: null, trailerUrl: null, runtime: null, watchProviders: [] };

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

    const runtime: number | null = typeof data.runtime === 'number' ? data.runtime : null;

    const usProviders = data['watch/providers']?.results?.US ?? {};
    const regionLink: string | undefined = usProviders.link;
    const watchProviders: StreamingService[] = [
      ...(usProviders.flatrate ?? []).map((p: { provider_name: string }) => ({ name: normalizeProviderName(p.provider_name), type: 'subscription' as const, link: regionLink })),
      ...(usProviders.rent ?? []).map((p: { provider_name: string }) => ({ name: normalizeProviderName(p.provider_name), type: 'rent' as const, link: regionLink })),
      ...(usProviders.buy ?? []).map((p: { provider_name: string }) => ({ name: normalizeProviderName(p.provider_name), type: 'buy' as const, link: regionLink })),
    ].slice(0, 4);

    return { imdbId, trailerUrl, runtime, watchProviders };
  } catch {
    return { imdbId: null, trailerUrl: null, runtime: null, watchProviders: [] };
  }
}

export async function resolveKeywordIds(terms: string[]): Promise<number[]> {
  if (!terms.length) return [];
  const apiKey = getApiKey();
  const results = await Promise.all(
    terms.map(async (term) => {
      try {
        const res = await fetch(
          `${BASE_URL}/search/keyword?api_key=${apiKey}&query=${encodeURIComponent(term)}`,
          { next: { revalidate: 86400 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return (data.results?.[0]?.id as number) ?? null;
      } catch {
        return null;
      }
    })
  );
  return results.filter((id): id is number => id !== null);
}

export function getTMDBImageUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
