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
  with_keywords?: string;
  sort_by?: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  page?: number;
  language?: string;
  include_adult?: boolean;
  with_watch_providers?: string;
  watch_region?: string;
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
  // RT / IMDB scores (populated if OMDB_API_KEY is set)
  tomatometer: string | null;   // e.g. "94%"
  imdbScore: string | null;     // e.g. "8.5"
  audienceScore: string | null; // e.g. "88%" — RT audience score
  // Trailer — YouTube URL if found, null otherwise
  trailerUrl: string | null;
  // Runtime in minutes (from TMDB details)
  runtime: number | null;
  // 3 mood descriptor words derived from genre + tone
  descriptors: [string, string, string];
};

export type StreamingResult = {
  services: StreamingService[];
};

export type StreamingService = {
  name: string;
  type: 'subscription' | 'rent' | 'buy' | 'free';
  link?: string;
};
