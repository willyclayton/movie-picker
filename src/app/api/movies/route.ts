import { NextRequest, NextResponse } from 'next/server';
import { discoverMovies } from '@/lib/tmdb';
import type { TMDBDiscoverParams } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params: TMDBDiscoverParams = {
    with_genres: searchParams.get('with_genres') ?? undefined,
    sort_by: searchParams.get('sort_by') ?? 'popularity.desc',
    'vote_average.gte': searchParams.has('vote_average.gte')
      ? Number(searchParams.get('vote_average.gte'))
      : undefined,
    'vote_count.gte': searchParams.has('vote_count.gte')
      ? Number(searchParams.get('vote_count.gte'))
      : 50,
    page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
  };

  try {
    const movies = await discoverMovies(params);
    return NextResponse.json({ movies });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
