"use client";

/** Main image search page. Manages search state and renders the full search UI. */

import { useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import useFetchImages from "./hooks/fetchImages";
import type { ImageDetails } from "./models/ImageDetails";
import FilterButtonsGrid from "./ui/FilterButtonsGrid";
import ImageGrid from "./ui/image/ImageGrid";
import LoadingIndicator from "./ui/LoadingIndicator";
import PaginationControls from "./ui/PaginationControls";
import SearchInput from "./ui/SearchInput";
import { imageButtons } from "./utils/constants";

function Home() {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ImageDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchImages = useFetchImages(
    searchInput,
    setLoading,
    setError,
    page,
    setImages,
    setTotalPages,
  );

  // Resets to page 1 and fetches on form submit.
  const onChange = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchInput.current?.value || "";
    // If already on page 1, setPage is a no-op and won't trigger the useEffect,
    // so call fetchImages directly. Otherwise let the page change drive the fetch.
    if (page === 1) {
      fetchImages(query, 1);
    } else {
      setPage(1);
    }
  };

  // Sets the input value to the selected filter and fetches from page 1.
  const handleSelection = (selection: string) => {
    if (searchInput.current) {
      searchInput.current.value = selection;
      if (page === 1) {
        fetchImages(selection, 1);
      } else {
        setPage(1);
      }
    } else {
      console.error("searchInput ref is not attached to the DOM");
    }
  };

  // Fetch on mount and whenever fetchImages is recreated (e.g. page change).
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Image Search</h1>
      <SearchInput onSubmit={onChange} searchRef={searchInput} />
      <FilterButtonsGrid
        imageButtons={imageButtons}
        onFilterSelect={handleSelection}
      />
      {loading ? (
        <LoadingIndicator color="#3949AB" loading={loading} height={16} />
      ) : error ? (
        <p className="text-center text-red-400 mt-8">{error}</p>
      ) : (
        <ImageGrid images={images} />
      )}
      <PaginationControls
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </main>
  );
}

export default Home;
