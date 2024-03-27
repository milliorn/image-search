"use client";

import { useCallback, MutableRefObject, SetStateAction } from 'react';

/**
 * Fetches images from the API based on the search query and current page.
 * This would normally be a service, but it uses another hook, useCallback, to memoize the function.
 */
const useFetchImages = (
  searchInput: MutableRefObject<HTMLInputElement | null>,
  setLoading: (value: SetStateAction<boolean>) => void,
  page: number,
  setImages: (value: SetStateAction<never[]>) => void,
  setTotalPages: (value: SetStateAction<number>) => void
): (() => Promise<void>) => {
  return useCallback(async () => {
    // Ensure searchInput.current is not null before accessing .value
    if (searchInput.current && searchInput.current.value) {
      setLoading(true);

      try {
        const apiURL = `/api/images?query=${encodeURIComponent(searchInput.current.value)}&page=${page}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        setImages(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [ page, searchInput, setImages, setLoading, setTotalPages ]);
};

export default useFetchImages;
