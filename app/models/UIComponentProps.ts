/** Props types for general UI components: FilterButtonsGrid, LoadingIndicator, PaginationControls, and SearchInput. */

import type { MutableRefObject, FormEvent } from "react";

type FilterButtonsGridProps = {
  imageButtons: string[];
  onFilterSelect: (filter: string) => void;
};

type LoadingIndicatorProps = {
  color?: string;
  height?: number;
};

type PaginationControlsProps = {
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};

type SearchInputProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  searchRef: MutableRefObject<HTMLInputElement | null>;
};

export type {
  FilterButtonsGridProps,
  LoadingIndicatorProps,
  PaginationControlsProps,
  SearchInputProps,
};
