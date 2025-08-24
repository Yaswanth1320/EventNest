"use client";
import React from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  searchText: string;
  setSearchText: (text: string) => void;
};

const SearchBar = ({ searchText, setSearchText }: SearchBarProps) => {
  const searchButtonClick = () => {
    // You could optionally trigger some additional action here
    console.log("Searching for:", searchText);
  };

  return (
    <div className="w-full flex justify-center mb-3">
      <div className="glass flex items-center rounded-full px-4 py-3 w-[90%] md:w-[60%] max-w-xl shadow-md">
        <input
          type="text"
          placeholder="Enter your city or pincode"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 font-mono placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          className="ml-2 bg-primary hover:bg-primary/80 text-white p-3 dark:text-black rounded-full transition"
          onClick={searchButtonClick}
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
