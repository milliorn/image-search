"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";

/**
 * Renders the Home component.
 * This component displays an image search page with a search input, filter buttons, and a grid of images.
 */
export default function Home() {
  const imageButtons = [
    "random",
    "animals",
    "anime",
    "art",
    "food",
    "home",
    "nature",
    "seasons",
    "space",
    "sports",
    "travel",
    "wallpaper",
  ];

  /**
   * Ref to the search input element.
   */
  const searchInput = useRef<HTMLInputElement | null>(null);

  /**
   * State variable to store the fetched images.
   */
  const [images, setImages] = useState([]);

  /**
   * State variable to store the current page number.
   */
  const [page, setPage] = useState(1);

  /**
   * State variable to store the total number of pages.
   */
  const [totalPages, setTotalPages] = useState(0);

  /**
   * State variable to indicate if images are being fetched.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Fetches images from the API based on the search query and current page.
   */
  const fetchImages = useCallback(async () => {
    // Ensure searchInput.current is not null before accessing .value
    if (searchInput.current && searchInput.current.value) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/images?query=${encodeURIComponent(
            searchInput.current.value
          )}&page=${page}`
        );

        const data = await response.json();

        setImages(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  /**
   * Event handler for the search input change event.
   * Resets the page number to 1 and fetches images.
   * @param event - The input change event.
   */
  const handleInputChange = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setPage(1);
    fetchImages();
  };

  /**
   * Event handler for the filter button selection.
   * Sets the search input value to the selected filter, resets the page number to 1, and fetches images.
   * @param selection - The selected filter.
   */
  const handleSelection = (selection: string) => {
    // Ensure searchInput.current is not null before accessing .value
    if (searchInput.current) {
      searchInput.current.value = selection;
      setPage(1);
      fetchImages();
    } else {
      console.error("searchInput.current is null");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Image Search</h1>
      <form onSubmit={handleInputChange} className="mb-4">
        <input
          type="search"
          placeholder="Type something to search..."
          className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          ref={searchInput}
          id="searchInput"
        />
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 justify-center gap-2 mb-4 text-black">
        {imageButtons.map((filter) => (
          <button
            key={filter}
            className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleSelection(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <SyncLoader
          color="#4A90E2"
          loading={loading}
          cssOverride={{ display: "block", margin: "0 auto" }}
          size={15}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {images.map(
            (image: {
              blur_hash: string;
              likes: number;
              description: string;
              height: number | `${number}` | undefined;
              width: number | `${number}` | undefined;
              alt_description?: string;
              id: string;
              urls: { small: string };
            }) => {
              // Log the image object to see its properties
              console.log(image);
              const img_width: number = image.width as number;
              const img_height: number = image.height as number;

              return (
                <Image
                  alt={image.alt_description || "image"}
                  blurDataURL={image.blur_hash}
                  className="rounded shadow-lg"
                  height={img_height}
                  key={image.id}
                  placeholder="blur"
                  src={image.urls.small}
                  width={img_width}
                  onLoad={() => console.log(`Image ID : ${image.id}`)}
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target}`)
                  }
                />
              );
            }
          )}
        </div>
      )}

      <div className="flex justify-between mt-4">
        {page > 1 && (
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
        )}
        {page < totalPages && (
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
