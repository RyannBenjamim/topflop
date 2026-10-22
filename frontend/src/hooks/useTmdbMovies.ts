import { useEffect, useState } from "react";
import { getMoviesByIds } from "../api/tmdb/tmdb.service";
import type { TmdbMovieDetails } from "../types/tmdb";

export function useTmdbMovies(ids: (number | null | undefined)[]) {
  const key = [...new Set(ids.filter((id): id is number => Boolean(id)))].join(',');
  const [movies, setMovies] = useState<Record<number, TmdbMovieDetails>>({});

  useEffect(() => {
    if (!key) return;

    let isMounted = true;
    const list = key.split(',').map(Number);

    getMoviesByIds(list).then(results => {
      if (!isMounted) return;

      setMovies(current => {
        const next = { ...current };
        results.forEach((movie, index) => {
          if (movie) next[list[index]] = movie;
        });
        return next;
      });
    });

    return () => {
      isMounted = false;
    };
  }, [key]);

  return movies;
}
