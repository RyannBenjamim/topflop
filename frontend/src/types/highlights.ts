export interface Highlight {
  id: string;
  userId: string;
  year: number;
  topMovieId: number | null;
  flopMovieId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertHighlight {
  topMovieId?: number;
  flopMovieId?: number;
}
