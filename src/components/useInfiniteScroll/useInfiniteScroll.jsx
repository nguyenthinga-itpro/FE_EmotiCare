import { useState, useCallback } from "react";

export default function usePaginatedPostcards(fetchFunction, pageSize = 4) {
  const [paginatedPostcards, setPaginatedPostcards] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPostcards = useCallback(
    async ({ reset = false } = {}) => {
      if (loadingMore) return;
      setLoadingMore(true);

      const startAfterId = reset ? null : cursor;

      try {
        const result = await fetchFunction({ pageSize, startAfterId });
        const newCards = result?.postcards || [];
        const nextCursor = result?.nextCursor || null;

        setPaginatedPostcards((prev) => {
          const base = reset ? [] : prev;
          const existingIds = new Set(base.map((c) => c.id));
          const filtered = newCards.filter((c) => !existingIds.has(c.id));
          return [...base, ...filtered];
        });

        setCursor(nextCursor);
      } catch (err) {
        console.error("Failed to load postcards:", err);
      } finally {
        setLoadingMore(false);
      }
    },
    [cursor, loadingMore, pageSize, fetchFunction]
  );

  const reset = useCallback(() => {
    setPaginatedPostcards([]);
    setCursor(null);
    // không tự gọi loadPostcards
  }, []);

  return { paginatedPostcards, cursor, loadingMore, loadPostcards, reset };
}
