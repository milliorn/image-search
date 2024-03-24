import { UseSelectionHandler } from "../models/SelectionHandler";

export const useSelectionHandler = ({
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
