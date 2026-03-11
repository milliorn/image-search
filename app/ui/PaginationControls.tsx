"use client";

import type { ChangeEvent, JSX, KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import type { PaginationControlsProps } from "../models/UIComponentProps";

/**
 * Renders pagination controls for navigating between pages.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.page - The current page number.
 * @param {Function} props.setPage - The function to update the current page.
 * @param {number} props.totalPages - The total number of pages.
 * @returns {JSX.Element} The pagination controls component.
 */
const PaginationControls = ({
  page,
  setPage,
  totalPages,
}: PaginationControlsProps): JSX.Element | null => {
  const pagesMax = 200;
  const totalPagesMax = totalPages <= pagesMax ? totalPages : pagesMax;
  const [inputPage, setInputPage] = useState(page.toString());

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
          disabled={page === 1}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="text-center mt-2 text-sm sm:text-base">
          {`Page ${page} of ${totalPagesMax}`}
        </span>

        <button
          disabled={page === totalPagesMax}
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
          disabled={parseInt(inputPage, 10) <= 1}
          onClick={() => setInputPage((prev) => String(Math.max(1, parseInt(prev, 10) - 1)))}
        >
          −
        </button>
        <input
          type="number"
          className="text-center w-16 bg-white text-black border rounded py-2 px-2"
          value={inputPage}
          onChange={handlePageChange}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && goToPage()}
          id="pageInput"
          min="1"
          max={totalPagesMax}
          aria-label="Page Number Input"
        />
        <button
          aria-label="Increase page"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded"
          disabled={parseInt(inputPage, 10) >= totalPagesMax}
          onClick={() => setInputPage((prev) => String(Math.min(totalPagesMax, parseInt(prev, 10) + 1)))}
        >
          +
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={goToPage}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
