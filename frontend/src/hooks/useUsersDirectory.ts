import { useEffect, useState } from "react";
import { findAll } from "../api/users.service";
import type { UserSummary } from "../types/users";

const ttl = 60 * 1000;
let cache: Promise<UserSummary[]> | null = null;
let cachedAt = 0;

export function loadUsers(force = false) {
  if (force || !cache || Date.now() - cachedAt > ttl) {
    cachedAt = Date.now();
    cache = findAll()
      .then(res => res.data)
      .catch(error => {
        cache = null;
        throw error;
      });
  }
  return cache;
}

export function invalidateUsers() {
  cache = null;
}

export function useUsersDirectory() {
  const [users, setUsers] = useState<Record<string, UserSummary>>({});

  useEffect(() => {
    let isMounted = true;

    loadUsers()
      .then(list => {
        if (isMounted) setUsers(Object.fromEntries(list.map(user => [user.id, user])));
      })
      .catch(error => console.error('Failed to fetch users', error));

    return () => {
      isMounted = false;
    };
  }, []);

  return users;
}
