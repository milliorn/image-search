"use client";

import React, { FormEvent, RefObject } from "react";

type FilterButtonsGridProps = {
  imageButtons: string[];
  onFilterSelect: (filter: string) => void;
};

type LoadingIndicatorProps = {
  loading: boolean;
  color?: string;
  height?: number;
};

type PaginationControlsProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};

type SearchInputProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  searchRef: RefObject<HTMLInputElement>;
};

export type {
  FilterButtonsGridProps,
  LoadingIndicatorProps,
  PaginationControlsProps,
  SearchInputProps
};
