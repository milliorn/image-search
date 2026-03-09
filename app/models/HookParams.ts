"use client";

import type * as React from "react";

type HandleInputChangeParams = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchImages: (q?: string, page?: number) => void | Promise<void>;
  searchInput: React.RefObject<HTMLInputElement | null>;
};

type UseSelectionHandler = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchImages: (q?: string, page?: number) => void | Promise<void>;
  searchInput: React.RefObject<HTMLInputElement | null>;
};

export type { HandleInputChangeParams, UseSelectionHandler };
