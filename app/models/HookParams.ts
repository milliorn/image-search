"use client";

import { Dispatch, RefObject, SetStateAction } from "react";

type HandleInputChangeParams = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchImages: (q?: string, page?: number) => void | Promise<void>;
  searchInput: React.MutableRefObject<HTMLInputElement | null>;
};

type UseSelectionHandler = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchImages: (q: string, page: number) => void | Promise<void>;
  searchInput: React.MutableRefObject<HTMLInputElement | null>;
};

export type {
  HandleInputChangeParams,
  UseSelectionHandler,
}