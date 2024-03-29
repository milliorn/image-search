"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BarLoader } from "react-spinners";
import useFetchImages from "./hooks/fetchImages";
import useHandleInputChange from "./hooks/handleInputChange";
import useSelectionHandler from "./hooks/selectionHandler";
import { ImageDetails } from "./models/ImageDetails";
import { imageButtons } from "./utils/constants";
import SearchInput from "./ui/SearchInput";
import FilterButtonsGrid from "./ui/FilterButtonsGrid";
import LoadingIndicator from "./ui/LoadingIndicator";

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
  const fetchImages = useFetchImages(
    searchInput,
    setLoading,
    page,
    setImages,
    setTotalPages
  );

  /**
   * Event handler for the search input change event.
   * Resets the page number to 1 and fetches images.
   */
  const onChange = useHandleInputChange({
    setPage,
    fetchImages,
    searchInput,
  });

  /**
   * Event handler for the filter buttons.
   * Fetches images based on the selected filter.
   */
  const handleSelection = useSelectionHandler({
    setPage,
    fetchImages,
    searchInput,
  });

  /**
   * Fetch images when the component mounts.
   */
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Image Search</h1>
      <SearchInput onSubmit={onChange} searchRef={searchInput} />

      <FilterButtonsGrid
        imageButtons={imageButtons}
        onFilterSelect={handleSelection}
      />

      {loading ? (
        <LoadingIndicator color="#3949AB" loading={loading} height={16} />
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
