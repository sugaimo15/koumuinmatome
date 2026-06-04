'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'koumuinmatome_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const toggle = useCallback((examId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(examId)
        ? prev.filter((id) => id !== examId)
        : [...prev, examId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (examId: string) => favorites.includes(examId),
    [favorites]
  );

  return { favorites, toggle, isFavorite, ready };
}
