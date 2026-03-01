export type TMDBMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
};

export type TMDBDiscoverParams = {
  with_genres?: string;
  sort_by?: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  page?: number;
  language?: string;
  include_adult?: boolean;
};

export type TMDBDiscoverResponse = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

export type EnrichedMovie = TMDBMovie & {
  framingLabel: string;
  toneLabel: string;
  streamingInfo?: StreamingResult | null;
};

export type StreamingResult = {
  services: StreamingService[];
};

export type StreamingService = {
  name: string;
  type: 'subscription' | 'rent' | 'buy' | 'free';
  link?: string;
};
