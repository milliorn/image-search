"use client";

/**
 * Hook that returns a memoized fetch function for querying the Unsplash image API.
 * Each call aborts any pending request before starting a new one, preventing
 * stale responses from overwriting fresh results.
 */

import { useCallback, useRef } from "react";
import type { RefObject, SetStateAction } from "react";
import type { ApiResponse } from "../models/ApiResponse";
import type { ImageDetails } from "../models/ImageDetails";

const useFetchImages = (
  searchInput: RefObject<HTMLInputElement | null>,
  setLoading: (value: SetStateAction<boolean>) => void,
  setError: (message: string | null) => void,
  page: number,
  perPage: number,
  lang: string,
  username: string,
  userFetchMode: "photos" | "likes" | "collections",
  setImages: (value: SetStateAction<ImageDetails[]>) => void,
  setTotalPages: (value: SetStateAction<number>) => void,
): ((queryOverride?: string, pageOverride?: number) => Promise<void>) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  return useCallback(
    async (queryOverride?: string, pageOverride?: number) => {
      const resolvedPage = pageOverride ?? page;

      let url: string;

      if (username) {
        const params = new URLSearchParams({
          page: String(resolvedPage),
          per_page: String(perPage),
        });
        url = `/api/users/${username}/${userFetchMode}?${params.toString()}`;
      } else {
        const query = queryOverride ?? searchInput.current?.value ?? "";
        if (!query) {return;}
        const params = new URLSearchParams({
          query,
          page: String(resolvedPage),
          per_page: String(perPage),
          lang,
        });
        url = `/api/images?${params.toString()}`;
      }

      // Abort any pending request before starting a new one.
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const { signal } = abortControllerRef.current;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
          const body = await response.json().catch(() => null) as { message?: string } | null;
          setError(body?.message ?? `Failed to fetch images: ${response.statusText}`);
          setLoading(false);
          return;
        }

        let data: ApiResponse;

        try {
          data = (await response.json()) as ApiResponse;
        } catch {
          setError("Received an unexpected response from the server.");
          setLoading(false);
          return;
        }

        if (!("results" in data)) {
          setError(data.message ?? "Unexpected response from the server.");
          setLoading(false);
          return;
        }

        const unique = [
          ...new Map(data.results.map((img) => [img.id, img])).values(),
        ];
        setImages(unique);
        setTotalPages(data.total_pages);
        setLoading(false);
      } catch (error) {
        // AbortError is expected when a newer request cancels this one.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error(error);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    },
    [lang, page, perPage, userFetchMode, username, searchInput, setError, setImages, setLoading, setTotalPages],
  );
};

export default useFetchImages;
