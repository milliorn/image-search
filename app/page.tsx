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
import {
  COLORS,
  imageButtons,
  IMAGES_PER_PAGE,
  LANGUAGES,
  PER_PAGE_OPTIONS,
} from "./utils/constants";

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
  const [lang, setLang] = useState("en");
  const [orderBy, setOrderBy] = useState<"relevance" | "latest">("relevance");
  const [color, setColor] = useState("");
  const [username, setUsername] = useState("");
  const [userFetchMode, setUserFetchMode] = useState<
    "photos" | "likes" | "collections"
  >("photos");
  const [isRandom, setIsRandom] = useState(false);

  const fetchImages = useFetchImages(
    searchInput,
    setLoading,
    setError,
    page,
    perPage,
    lang,
    orderBy,
    color,
    username,
    userFetchMode,
    setImages,
    setTotalPages,
    isRandom,
  );

  // Resets to page 1 and fetches on form submit.
  const onChange = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchInput.current?.value?.trim() ?? "";

    if (!query) {
      return;
    }

    setUsername("");
    setHasSearched(true);

    if (page === 1) {
      fetchImages(query, 1);
    } else {
      setPage(1);
    }
  };

  // Resets the app to its default state.
  const handleReset = () => {
    setImages([]);
    setError(null);
    setPage(1);
    setTotalPages(0);
    setHasSearched(false);
    setUsername("");
    setUserFetchMode("photos");
    setIsRandom(false);
    setOrderBy("relevance");
    setColor("");

    if (searchInput.current) {
      searchInput.current.value = "";
    }
  };

  // Switches to user photos mode and fetches from page 1.
  const handleAuthorClick = (authorUsername: string) => {
    setIsRandom(false);
    setUserFetchMode("photos");
    setUsername(authorUsername);
    setHasSearched(true);
    setPage(1);
  };

  // Switches to user likes mode and fetches from page 1.
  const handleLikesClick = (authorUsername: string) => {
    setIsRandom(false);
    setUserFetchMode("likes");
    setUsername(authorUsername);
    setHasSearched(true);
    setPage(1);
  };

  // Switches to user collections mode and fetches from page 1.
  const handleCollectionsClick = (authorUsername: string) => {
    setIsRandom(false);
    setUserFetchMode("collections");
    setUsername(authorUsername);
    setHasSearched(true);
    setPage(1);
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
      setUsername("");
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
      <h1 className="text-4xl font-bold text-center mb-4">
        <button
          onClick={handleReset}
          className="cursor-pointer hover:opacity-75"
        >
          Image Search
        </button>
      </h1>
      <SearchInput
        loading={loading}
        onSubmit={onChange}
        searchRef={searchInput}
      />
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 mb-8">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg text-xl cursor-pointer"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() =>
            setOrderBy((prev) =>
              prev === "relevance" ? "latest" : "relevance",
            )
          }
          className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg text-xl cursor-pointer"
        >
          {orderBy === "relevance" ? "Relevance" : "Latest"}
        </button>
        <button
          onClick={() => setIsRandom((prev) => !prev)}
          className={`${isRandom ? "bg-indigo-900" : "bg-indigo-600"} hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg text-xl cursor-pointer`}
        >
          {isRandom ? "Random 👍" : "Random 👎"}
        </button>
        <label htmlFor="per-page" className="sr-only">
          Results per page
        </label>
        <select
          id="per-page"
          name="per-page"
          value={perPage}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg text-xl cursor-pointer text-center"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} results
            </option>
          ))}
        </select>
        <label htmlFor="lang" className="sr-only">
          Language
        </label>
        <select
          id="lang"
          name="lang"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg text-xl cursor-pointer text-center"
        >
          {LANGUAGES.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
        <label htmlFor="color" className="sr-only">
          Color filter
        </label>
        <select
          id="color"
          name="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg text-xl cursor-pointer text-center"
        >
          {COLORS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
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
        <p className="text-center text-red-600 dark:text-red-400 mt-8">
          {error}
        </p>
      ) : !hasSearched ? (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          Search for images above to get started.
        </p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          No results found.
        </p>
      ) : (
        <ImageGrid
          activeMode={userFetchMode}
          activeUsername={username}
          images={images}
          onAuthorClick={handleAuthorClick}
          onCollectionsClick={handleCollectionsClick}
          onLikesClick={handleLikesClick}
        />
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
