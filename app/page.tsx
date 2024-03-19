"use client";

import Image from "next/image";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 10;

export default function Home() {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setPage(1);
    fetchImages();
  };

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
          className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          ref={searchInput}
          id="searchInput"
        />
      </form>

      <div className="flex justify-center gap-4 mb-4">
        {["random", "nature", "holidays", "cooking"].map((filter) => (
          <button
            key={filter}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
        <div className="grid grid-cols-3 gap-4">
          {images.map(
            (image: {
              height: number | `${number}` | undefined;
              width: number | `${number}` | undefined;
              alt_description?: string;
              id: string;
              urls: { small: string };
            }) => {
              // Log the image object to see its properties
              console.log(image);
              const img_width: number = (image.width as number) * 0.1;
              const img_height: number = (image.height as number) * 0.1;

              return (
                <Image
                  alt={image.alt_description || "image"}
                  className="rounded shadow-lg"
                  key={image.id}
                  src={image.urls.small}
                  width={img_width}
                  height={img_height}
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
