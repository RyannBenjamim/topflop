export interface Review {
  id: string;
  title: string;
  content: string;
  topPercentage: number;
  authorId: string;
  movieTmdbId: number;
  createdAt: string;
  updatedAt: string;
}

export type ReviewSummary = Pick<
  Review,
  'id' | 'title' | 'topPercentage' | 'authorId' | 'movieTmdbId'
> & Partial<Pick<Review, 'createdAt'>> & {
  excerpt?: string;
};

export interface CreateReview {
  title: string;
  content: string;
  topPercentage: number;
  movieTmdbId: number;
}

export type UpdateReview = Partial<CreateReview>;

export type ReviewFormValues = Omit<CreateReview, 'movieTmdbId'>;
