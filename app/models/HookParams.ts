"use client";

import { Dispatch, RefObject, SetStateAction } from "react";

type HandleInputChangeParams = {
  setPage: Dispatch<SetStateAction<number>>;
  fetchImages: (query: string, page: number) => void;
  searchInput: RefObject<HTMLInputElement>;
};

type UseSelectionHandler = {
  setPage: Dispatch<SetStateAction<number>>;
  fetchImages: (query: string, page: number) => void;
  searchInput: RefObject<HTMLInputElement>;
};

export type {
  HandleInputChangeParams,
  UseSelectionHandler,
}