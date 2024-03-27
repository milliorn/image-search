"use client";

import { Dispatch, RefObject, SetStateAction } from "react";

/**
 * Parameters for the useSelectionHandler function.
 */
export type UseSelectionHandler = {
  setPage: Dispatch<SetStateAction<number>>;
  fetchImages: (query: string, page: number) => void;
  searchInput: RefObject<HTMLInputElement>;
};