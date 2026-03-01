export type StreamingService = {
  name: string;
  type: 'subscription' | 'rent' | 'buy' | 'free';
  link?: string;
  logo?: string;
};

export type StreamingAvailability = {
  tmdbId: number;
  services: StreamingService[];
};
