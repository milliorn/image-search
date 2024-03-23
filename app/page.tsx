"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { BarLoader } from "react-spinners";
import { ImageDetails } from "./models/ImageDetails";
import { imageButtons } from "./utils/constants";

/**
 * Renders the Home component.
 * This component displays an image search page with a search input, filter buttons, and a grid of images.
 */
export default function Home() {
  /**
   * Ref to the search input element.
   */
  const searchInput = useRef<HTMLInputElement | null>(null);

  /**
   * State variable to store the fetched images.
   */
  const [images, setImages] = useState([]);

  /**
   * State variable to indicate if images are being fetched.
   */
  const [loading, setLoading] = useState(false);

  /**
   * State variable to store the current page number.
   */
  const [page, setPage] = useState(1);

  /**
   * State variable to store the total number of pages.
   */
  const [totalPages, setTotalPages] = useState(0);

  /**
   * Fetches images from the API based on the search query and current page.
   */
  const fetchImages = useCallback(async () => {
    // Ensure searchInput.current is not null before accessing .value
    if (searchInput.current && searchInput.current.value) {
      setLoading(true);

      try {
        const apiURL = `/api/images?query=${encodeURIComponent(
          searchInput.current.value
        )}&page=${page}`;

        const response = await fetch(apiURL);
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
      console.error("handleSelection: searchInput.current is null");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Image Search</h1>
      <form onSubmit={handleInputChange} className="mb-4">
        <input
          className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          id="searchInput"
          placeholder="Type something to search..."
          ref={searchInput}
          type="search"
        />
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 justify-center gap-2 mb-4 text-black">
        {imageButtons.map((filter) => (
          <button
            className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded text-xl"
            key={filter}
            onClick={() => handleSelection(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <BarLoader color="#3949AB" loading={loading} height={16} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {images.map((image: ImageDetails) => {
            console.log(image);
            console.log(typeof image.alternative_slugs);

            const img_height: number = image.height as number;
            const img_width: number = image.width as number;

            return (
              <Image
                alt={image.alt_description || "image"}
                blurDataURL={image.blur_hash}
                className="rounded shadow-lg"
                height={img_height}
                key={image.id}
                placeholder="blur"
                src={image.urls.thumb}
                width={img_width}
                onLoad={() => console.log(`Image ID : ${image.id}`)}
                onError={(e) =>
                  console.error(`Failed to load image: ${e.target}`)
                }
              />
            );
          })}
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
