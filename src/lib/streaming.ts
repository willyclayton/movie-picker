import type { StreamingService } from '@/types/streaming';

const STREAMING_API_BASE = 'https://streaming-availability.p.rapidapi.com';

export type StreamingResult = {
  services: StreamingService[];
};

export async function getStreamingInfo(tmdbId: number): Promise<StreamingResult | null> {
  const apiKey = process.env.STREAMING_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${STREAMING_API_BASE}/shows/movie/${tmdbId}?output_language=en&country=us`;
    const res = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
      },
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) return null;

    const data = await res.json();
    const streamingOptions = data?.streamingOptions?.us ?? {};

    const VALID_TYPES = ['subscription', 'rent', 'buy', 'free'] as const;
    const services: StreamingService[] = Object.entries(streamingOptions).map(
      ([serviceName, options]) => {
        const opt = Array.isArray(options) ? options[0] : options;
        const rawType = (opt as { type?: string })?.type ?? 'subscription';
        const type = VALID_TYPES.includes(rawType as typeof VALID_TYPES[number])
          ? (rawType as StreamingService['type'])
          : 'subscription';
        return {
          name: serviceName,
          type,
          link: (opt as { link?: string })?.link,
        };
      }
    );

    return { services: services.slice(0, 4) }; // limit to 4 services
  } catch {
    return null;
  }
}

/**
 * Enrich multiple movies with streaming info in parallel.
 * Fails gracefully — returns null for any that error.
 */
export async function enrichWithStreaming<T extends { id: number }>(
  movies: T[]
): Promise<(T & { streamingInfo: StreamingResult | null })[]> {
  const results = await Promise.all(
    movies.map(async (movie) => ({
      ...movie,
      streamingInfo: await getStreamingInfo(movie.id).catch(() => null),
    }))
  );
  return results;
}
