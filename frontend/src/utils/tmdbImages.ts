const tmdbImageUrl = 'https://image.tmdb.org/t/p';

export const posterDefault = '/images/poster-default.png';

export type PosterSize = 'w185' | 'w342' | 'w500';

export const getPosterUrl = (path?: string | null, size: PosterSize = 'w500'): string | undefined => {
  return path ? `${tmdbImageUrl}/${size}${path}` : undefined;
}

export type BackdropSize = 'w780' | 'w1280';

export const getBackdropUrl = (path?: string | null, size: BackdropSize = 'w1280'): string | undefined => {
  return path ? `${tmdbImageUrl}/${size}${path}` : undefined;
}
