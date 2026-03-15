"use client";

/** Renders previous/next buttons, a page counter, and a direct page jump input. */

import { useEffect, useState } from "react";
import type { ChangeEvent, JSX, KeyboardEvent } from "react";
import type { PaginationControlsProps } from "../models/UIComponentProps";
import { UNSPLASH_MAX_PAGES } from "../utils/constants";

/**
 * Clamps totalPages to 200 to match the Unsplash API maximum.
 * The input field commits navigation on Enter or when the Go button is clicked.
 */
const PaginationControls = ({
  loading,
  page,
  setPage,
  totalPages,
}: PaginationControlsProps): JSX.Element | null => {
  const totalPagesMax =
    totalPages <= UNSPLASH_MAX_PAGES ? totalPages : UNSPLASH_MAX_PAGES;
  const [inputPage, setInputPage] = useState(page.toString());
  const parsedInputPage = parseInt(inputPage, 10);

  const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const goToPage = () => {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPagesMax) {
      setPage(pageNum);
    }
  };

  useEffect(() => {
    setInputPage(page.toString());
  }, [page]);

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between sm:justify-evenly w-full">
        <button
          disabled={loading || page === 1}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="text-center mt-2 text-sm sm:text-base">
          {`Page ${page} of ${totalPagesMax}`}
        </span>

        <button
          disabled={loading || page === totalPagesMax}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <button
          aria-label="Decrease page"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded"
          disabled={loading || isNaN(parsedInputPage) || parsedInputPage <= 1}
          onClick={() =>
            setInputPage((prev) => {
              const n = parseInt(prev, 10);
              return String(Math.max(1, isNaN(n) ? 1 : n - 1));
            })
          }
        >
          −
        </button>
        <input
          type="number"
          className="text-center w-16 bg-white text-black border rounded py-2 px-2"
          value={inputPage}
          onChange={handlePageChange}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && goToPage()
          }
          disabled={loading}
          id="pageInput"
          min="1"
          max={totalPagesMax}
          aria-label="Page Number Input"
        />
        <button
          aria-label="Increase page"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded"
          disabled={
            loading ||
            isNaN(parsedInputPage) ||
            parsedInputPage >= totalPagesMax
          }
          onClick={() =>
            setInputPage((prev) => {
              const n = parseInt(prev, 10);
              return String(Math.min(totalPagesMax, isNaN(n) ? 1 : n + 1));
            })
          }
        >
          +
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          disabled={
            loading ||
            isNaN(parsedInputPage) ||
            parsedInputPage < 1 ||
            parsedInputPage > totalPagesMax
          }
          onClick={goToPage}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
