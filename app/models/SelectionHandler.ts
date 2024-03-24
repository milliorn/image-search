import { Dispatch, RefObject, SetStateAction } from "react";

export type UseSelectionHandler = {
  setPage: Dispatch<SetStateAction<number>>;
  fetchImages: (query: string, page: number) => void;
  searchInput: RefObject<HTMLInputElement>;
};