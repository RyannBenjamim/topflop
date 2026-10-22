import { tmdbApi } from "../api";
import type { TmdbMovie, TmdbMovieDetails, TmdbPage, TmdbVideo } from "../../types/tmdb";

const tmdbKey: string | undefined = import.meta.env.VITE_TMDB_API_KEY;

const usesBearer = tmdbKey?.startsWith('eyJ') ?? false;

const movieCache = new Map<number, Promise<TmdbMovieDetails>>();

const tmdbRequest = async <T>(url: string, params: Record<string, string | number> = {}): Promise<T> => {
  if (!tmdbKey) throw new Error('Defina VITE_TMDB_API_KEY no .env para carregar os filmes.');

  try {
    const response = await tmdbApi.get<T>(url, {
      params: {
        language: 'pt-BR',
        ...params,
        ...(usesBearer ? {} : { api_key: tmdbKey }),
      },
      headers: usesBearer ? { Authorization: `Bearer ${tmdbKey}` } : undefined,
    });
    return response.data;
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw new Error('A chave do TMDB foi recusada. Confira VITE_TMDB_API_KEY no .env.');
    throw new Error('Não foi possível carregar os dados do TMDB.');
  }
}

export async function getPopular() {
  const data = await tmdbRequest<TmdbPage<TmdbMovie>>('/movie/popular');
  return data.results;
}

export async function getTopRated() {
  const data = await tmdbRequest<TmdbPage<TmdbMovie>>('/movie/top_rated');
  return data.results;
}

export async function getAnimations() {
  const data = await tmdbRequest<TmdbPage<TmdbMovie>>('/discover/movie', { with_genres: 16, sort_by: 'popularity.desc' });
  return data.results;
}

export async function searchMovies(query: string) {
  const data = await tmdbRequest<TmdbPage<TmdbMovie>>('/search/movie', { query });
  return data.results;
}

export async function getSimilar(id: number) {
  const data = await tmdbRequest<TmdbPage<TmdbMovie>>(`/movie/${id}/similar`);
  return data.results;
}

export async function getVideos(id: number) {
  const data = await tmdbRequest<{ results: TmdbVideo[] }>(`/movie/${id}/videos`, { language: '' });
  return data.results;
}

export function getMovie(id: number) {
  if (!movieCache.has(id)) {
    const request = tmdbRequest<TmdbMovieDetails>(`/movie/${id}`).catch((error) => {
      movieCache.delete(id);
      throw error;
    });
    movieCache.set(id, request);
  }
  return movieCache.get(id)!;
}

export function getMoviesByIds(ids: number[]) {
  return Promise.all(ids.map((id) => getMovie(id).catch(() => null)));
}
