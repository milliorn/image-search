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
import { imageButtons, IMAGES_PER_PAGE, PER_PAGE_OPTIONS } from "./utils/constants";

function Home() {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ImageDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [perPage, setPerPage] = useState(IMAGES_PER_PAGE);

  const fetchImages = useFetchImages(
    searchInput,
    setLoading,
    setError,
    page,
    perPage,
    setImages,
    setTotalPages,
  );

  // Resets to page 1 and fetches on form submit.
  const onChange = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchInput.current?.value?.trim() ?? "";
    
    if (!query) { return; }

    setHasSearched(true);
    // If already on page 1, setPage is a no-op and won't trigger the useEffect,
    // so call fetchImages directly. Otherwise let the page change drive the fetch.
    if (page === 1) {
      fetchImages(query, 1);
    } else {
      setPage(1);
    }
  };

  // Resets to page 1 and refetches when per-page count changes.
  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    if (page !== 1) {
      setPage(1);
    }
  };

  // Sets the input value to the selected filter and fetches from page 1.
  const handleSelection = (selection: string) => {
    if (searchInput.current) {
      searchInput.current.value = selection;
      setHasSearched(true);
      if (page === 1) {
        fetchImages(selection, 1);
      } else {
        setPage(1);
      }
    } else {
      console.error("searchInput ref is not attached to the DOM");
    }
  };

  // Initialize dark mode from OS preference.
  useEffect(() => {
    setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Sync dark class to <html> whenever isDark changes.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Fetch on mount and whenever fetchImages is recreated (e.g. page change).
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Image Search</h1>
      <SearchInput onSubmit={onChange} searchRef={searchInput} />
      <div className="flex justify-center items-center gap-4 my-4">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <select
          value={perPage}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n} results</option>
          ))}
        </select>
      </div>
      <FilterButtonsGrid
        imageButtons={imageButtons}
        onFilterSelect={handleSelection}
      />
      {loading ? (
        <LoadingIndicator color="#3949AB" height={16} />
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-400 mt-8">{error}</p>
      ) : !hasSearched ? (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          Search for images above to get started.
        </p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">No results found.</p>
      ) : (
        <ImageGrid images={images} />
      )}
      <PaginationControls
        loading={loading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </main>
  );
}

export default Home;
