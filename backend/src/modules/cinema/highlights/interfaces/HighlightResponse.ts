export interface HighlightResponse {
  id: string;
  userId: string;
  year: number;
  topMovieId: number | null;
  flopMovieId: number | null;
  createdAt: string;
  updatedAt: string;
}