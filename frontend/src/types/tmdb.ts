export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails extends TmdbMovie {
  runtime: number | null;
  genres: TmdbGenre[];
}

export interface TmdbVideo {
  key: string;
  site: string;
  type: string;
}

export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
