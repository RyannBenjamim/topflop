export interface ReviewResponse {
  id: string;
  title: string;
  content: string;
  topPercentage: number;
  authorId: string;
  movieTmdbId: number;
  createdAt: string;
  updatedAt: string;
}