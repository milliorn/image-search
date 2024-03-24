import { FormEvent } from "react";
import { HandleInputChangeParams } from "../models/HandleInputChangeParams";

/**
 * Event handler for the search input change event.
 * Resets the page number to 1 and fetches images.
 * @param setPage - The function to update the page state variable.
 * @param fetchImages - The function to fetch images from the API.
 * @param searchInput - The reference to the search input element.
 * @returns The event handler function.
 */
export const handleInputChange = ({
  setPage,
  fetchImages,
  searchInput,
}: HandleInputChangeParams) => {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchInput.current?.value || "";
    setPage(1);
    fetchImages(query, 1);
  };
};
