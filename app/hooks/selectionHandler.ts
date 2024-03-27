"use client";

import { UseSelectionHandler } from "../models/SelectionHandler";

/**
 * Event handler for the selection of an item from the dropdown.
 * Sets the search input value to the selected item and fetches images.
 * @param setPage - The function to update the page state variable.
 * @param fetchImages - The function to fetch images from the API.
 * @param searchInput - The reference to the search input element.
 * @returns The event handler function.
 */
const useSelectionHandler = ({
  setPage,
  fetchImages,
  searchInput,
}: UseSelectionHandler) => {
  const handleSelection = (selection: string) => {
    if (searchInput.current) {
      searchInput.current.value = selection;
      setPage(1);
      fetchImages(selection, 1);
    } else {
      console.error("handleSelection: searchInput.current is null");
    }
  };

  return handleSelection;
};

export default useSelectionHandler;