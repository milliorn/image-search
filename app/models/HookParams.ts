"use client";

import type * as React from "react";

type HandleInputChangeParams = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchImages: (q?: string, page?: number) => void | Promise<void>;
  searchInput: React.RefObject<HTMLInputElement>;
};

type UseSelectionHandler = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchImages: (q: string, page: number) => void | Promise<void>;
  searchInput: React.RefObject<HTMLInputElement>;
};

export type { HandleInputChangeParams, UseSelectionHandler };
