type OMDBRating = { Source: string; Value: string };

type OMDBResponse = {
  Ratings?: OMDBRating[];
  imdbRating?: string;
  Response: 'True' | 'False';
};

export type RTScores = {
  tomatometer: string | null;  // e.g. "94%" — Rotten Tomatoes critic score
  imdb: string | null;         // e.g. "8.5" — IMDB audience-based score
};

export async function getRTScores(imdbId: string): Promise<RTScores | null> {
  const key = process.env.OMDB_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${key}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const data: OMDBResponse = await res.json();
    if (data.Response !== 'True') return null;

    const rt = data.Ratings?.find((r) => r.Source === 'Rotten Tomatoes');

    return {
      tomatometer: rt?.Value ?? null,
      imdb:
        data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : null,
    };
  } catch {
    return null;
  }
}
