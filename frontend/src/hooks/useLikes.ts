import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import type { ApiResponse } from "../types/ApiResponse";
import type { ActionResult, Like } from "../types/likes";
import { getErrorMessage } from "../utils/requestError";

interface LikesApi {
  findMany: (targetId: string) => Promise<ApiResponse<Like[]>>;
  like: (targetId: string) => Promise<ApiResponse<ActionResult>>;
  unlike: (targetId: string) => Promise<ApiResponse<ActionResult>>;
}

export function useLikes(targetId: string, api: LikesApi, onError: (message: string) => void) {
  const { user, profile } = useAuth();
  const [likes, setLikes] = useState<Like[] | null>(null);
  const serverLiked = useRef(false);
  const desiredLiked = useRef(false);
  const isSyncing = useRef(false);
  const onErrorRef = useRef(onError);
  const { findMany, like, unlike } = api;

  useEffect(() => {
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let isMounted = true;

    findMany(targetId)
      .then(res => {
        if (!isMounted) return;
        const liked = res.data.some(item => item.user.id === user?.id);
        serverLiked.current = liked;
        desiredLiked.current = liked;
        setLikes(res.data);
      })
      .catch(() => {
        if (isMounted) setLikes([]);
      });

    return () => {
      isMounted = false;
    };
  }, [targetId, user?.id, findMany]);

  const applyLiked = useCallback((liked: boolean) => {
    if (!user) return;

    setLikes(current => {
      const others = (current ?? []).filter(item => item.user.id !== user.id);
      if (!liked) return others;

      return [
        ...others,
        {
          createdAt: new Date().toISOString(),
          user: { id: user.id, username: profile?.username ?? '', email: profile?.email ?? '', name: profile?.name ?? null },
        },
      ];
    });
  }, [user, profile]);

  const sync = useCallback(async () => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      while (serverLiked.current !== desiredLiked.current) {
        const target = desiredLiked.current;
        await (target ? like(targetId) : unlike(targetId));
        serverLiked.current = target;
      }
    } catch (error) {
      desiredLiked.current = serverLiked.current;
      applyLiked(serverLiked.current);
      onErrorRef.current(getErrorMessage(error));
    } finally {
      isSyncing.current = false;
    }
  }, [targetId, like, unlike, applyLiked]);

  const isLiked = Boolean(likes?.some(item => item.user.id === user?.id));

  const toggle = () => {
    if (!user || likes === null) return;
    onErrorRef.current('');
    desiredLiked.current = !isLiked;
    applyLiked(desiredLiked.current);
    sync();
  };

  return { likes, isLiked, toggle };
}
