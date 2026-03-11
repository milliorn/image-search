"use client";

import { useCallback, useRef } from "react";
import type { RefObject, SetStateAction } from "react";
import type { ImageDetails } from "../models/ImageDetails";

type ApiResponse = {
  message?: string;
  results?: ImageDetails[];
  total_pages?: number;
};

/**
 * Fetches images from the API based on the search query and current page.
 * Cancels any in-flight request before starting a new one.
 */
const useFetchImages = (
  searchInput: RefObject<HTMLInputElement | null>,
  setLoading: (value: SetStateAction<boolean>) => void,
  page: number,
  setImages: (value: SetStateAction<ImageDetails[]>) => void,
  setTotalPages: (value: SetStateAction<number>) => void,
): ((queryOverride?: string, pageOverride?: number) => Promise<void>) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  return useCallback(async (queryOverride?: string, pageOverride?: number) => {
    const query = queryOverride ?? searchInput.current?.value ?? "";
    const resolvedPage = pageOverride ?? page;

    if (!query) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);

    const params = new URLSearchParams({
      query,
      page: String(resolvedPage),
    });

    try {
      const response = await fetch(`/api/images?${params.toString()}`, { signal });

      if (!response.ok) {
        console.error("Image fetch failed:", response.statusText);
        setLoading(false);
        return;
      }

      let data: ApiResponse = {};
      try {
        data = (await response.json()) as ApiResponse;
      } catch {
        // ignore non-JSON responses
      }

      setImages(data.results ?? []);
      setTotalPages(data.total_pages ?? 0);
      setLoading(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error(error);
      setLoading(false);
    }
  }, [page, searchInput, setImages, setLoading, setTotalPages]);
};

export default useFetchImages;
