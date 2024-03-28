// ui/forms/SearchInput.tsx
import React, { FormEvent, RefObject } from "react";

type SearchInputProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  searchRef: RefObject<HTMLInputElement>;
};

/**
 * Renders a search input element.
 * @param onSubmit - The event handler for the form submit event.
 * @param searchRef - The reference to the search input element.
 */
const SearchInput = ({ onSubmit, searchRef }: SearchInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 flex justify-between items-center"
    >
      <input
        className="form-input mt-0 block w-full rounded-lg border-gray-300 shadow-sm text-black mr-2 py-1 pl-4 text-xs sm:text-base"
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
