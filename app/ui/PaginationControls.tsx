"use client";

import { ChangeEvent, useState } from "react";
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
  const [inputPage, setInputPage] = useState(page);

  const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const pageNum = parseInt(e.target.value, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setInputPage(pageNum);
    }
  };

  const goToPage = () => {
    setPage(inputPage);
  };

  return (
    <>
      <div className="flex justify-between sm:justify-evenly mt-4">
        <button
          disabled={page === 1}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="text-center mt-2 text-sm sm:text-base">
          {totalPages === 0 ? "Page 0 of 0" : `Page ${page} of ${totalPages}`}
        </span>

        <button
          disabled={page === totalPages}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {/* <div className="mx-auto text-center my-4">
        <button className="text-center mt-2 mr-2 border rounded px-2 py-2 bg-gray-500">
          Go to Page
        </button>
        <input
          type="text"
          className="text-center w-16 text-black"
          value={inputPage}
          onChange={handlePageChange}
          onBlur={goToPage}
        />
      </div> */}
    </>
  );
};

export default PaginationControls;
