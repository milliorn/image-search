"use client";

/** Renders a row of preset category filter buttons. */

import type { FilterButtonsGridProps } from "../models/UIComponentProps";

/** Renders each filter label as a clickable button that triggers onFilterSelect. */
const FilterButtonsGrid = ({
  imageButtons,
  onFilterSelect,
}: FilterButtonsGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 justify-center gap-2 mb-4 text-black">
    {imageButtons.map((filter: string) => (
      <button
        className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg text-xl"
        key={filter}
        onClick={() => onFilterSelect(filter)}
      >
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </button>
    ))}
  </div>
);

export default FilterButtonsGrid;
