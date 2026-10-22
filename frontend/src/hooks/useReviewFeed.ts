import { useEffect, useMemo, useState } from "react";
import { findAll } from "../api/reviews.service";
import { getFollowing } from "../api/follows.service";
import { useAuth } from "./useAuth";
import type { ReviewSummary } from "../types/reviews";
import { getErrorMessage } from "../utils/requestError";

export type FeedTab = 'recent' | 'friends';

export function useReviewFeed(tab: FeedTab) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewSummary[] | null>(null);
  const [error, setError] = useState('');
  const [followingIds, setFollowingIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    findAll()
      .then(res => setReviews(res.data))
      .catch(error => {
        setReviews([]);
        setError(getErrorMessage(error));
      });
  }, []);

  useEffect(() => {
    if (!user) return;

    getFollowing(user.id)
      .then(res => setFollowingIds(new Set(res.data.map(item => item.following.id))))
      .catch(() => setFollowingIds(new Set()));
  }, [user]);

  const feed = useMemo(() => {
    if (!reviews) return null;
    if (tab === 'recent') return reviews;
    if (!followingIds) return null;
    return reviews.filter(review => followingIds.has(review.authorId));
  }, [reviews, tab, followingIds]);

  return { feed, error, followingIds };
}
