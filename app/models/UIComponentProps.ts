import type { RefObject, SyntheticEvent } from "react";

/** Props types for general UI components: FilterButtonsGrid, LoadingIndicator, PaginationControls, and SearchInput. */
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
  loading: boolean;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  searchRef: RefObject<HTMLInputElement | null>;
};

export type {
  FilterButtonsGridProps,
  LoadingIndicatorProps,
  PaginationControlsProps,
  SearchInputProps,
};
