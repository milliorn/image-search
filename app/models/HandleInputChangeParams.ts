import { SetStateAction, Dispatch, RefObject } from "react";

/**
 * Parameters for the handleInputChange function.
 */
export type HandleInputChangeParams = {
  setPage: Dispatch<SetStateAction<number>>;
  fetchImages: (query: string, page: number) => void;
  searchInput: RefObject<HTMLInputElement>;
};
