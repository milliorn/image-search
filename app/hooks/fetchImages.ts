"use client";

import { useCallback } from "react";
import type { RefObject, SetStateAction } from "react"; // Changed MutableRefObject to RefObject

/**
 * Fetches images from the API based on the search query and current page.
 * This would normally be a service, but it uses another hook, useCallback, to memoize the function.
 */
const useFetchImages = (
  searchInput: RefObject<HTMLInputElement | null>, // Changed MutableRefObject to RefObject
  setLoading: (value: SetStateAction<boolean>) => void,
  page: number,
  setImages: (value: SetStateAction<never[]>) => void,
  setTotalPages: (value: SetStateAction<number>) => void,
): ((queryOverride?: string, pageOverride?: number) => Promise<void>) => {
  return useCallback(async (queryOverride?: string, pageOverride?: number) => {
    const query = queryOverride ?? searchInput.current?.value ?? "";
    const resolvedPage = pageOverride ?? page;

    if (query) {
      setLoading(true);

      try {
        const apiURL = `/api/images?query=${encodeURIComponent(query)}&page=${resolvedPage}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        if (!response.ok) {
          console.error("Image fetch failed:", data.message);
          return;
        }

        setImages(data.results ?? []);
        setTotalPages(data.total_pages ?? 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [page, searchInput, setImages, setLoading, setTotalPages]);
};

export default useFetchImages;
