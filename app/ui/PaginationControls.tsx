"use client";

type PaginationControlsProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};

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
  return (
    <div className="flex justify-between sm:justify-evenly mt-4">
      <button
        disabled={page === 1}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
      <span className="text-center mt-2">
        {totalPages === 0 ? "" : `Page ${page} of ${totalPages}`}
      </span>
      <button
        disabled={page === totalPages}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
