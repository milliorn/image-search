/** Renders a search form with a text input and submit button. */

"use client";

import type { SearchInputProps } from "../models/UIComponentProps";

/** Attaches the provided ref to the input so the parent can read its value on submit. */
const SearchInput = ({ onSubmit, searchRef }: SearchInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 flex justify-between items-center"
    >
      <input
        className="form-input mt-0 block w-full rounded-lg border-gray-300 shadow-sm text-black mr-2 py-1 pl-4 text-xs sm:text-base bg-white"
        id="search-input"
        name="search-input"
        placeholder="Type something to search..."
        ref={searchRef}
        type="search"
      />
      <button
        className="bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-4 rounded-lg"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
