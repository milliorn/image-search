"use client";

import { ChangeEvent, JSX, useEffect, useState } from "react";
import { PaginationControlsProps } from "../models/UIComponentProps";

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
}: PaginationControlsProps): JSX.Element => {
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
          {totalPages === 0
            ? "Page 0 of 0"
            : `Page ${page} of ${totalPagesMax}`}
        </span>

        <button
          disabled={page === totalPagesMax}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      <div className="text-center">
        <input
          type="number" // Changing type to number to enforce numeric input
          className="text-center w-16 text-black border rounded py-2 px-4"
          value={inputPage}
          onChange={handlePageChange}
          id="pageInput"
          min="1"
          max={totalPagesMax}
          aria-label="Page Number Input"
        />
        <button
          className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={goToPage}
        >
          Go to Page
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
