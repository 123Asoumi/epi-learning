
import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center space-x-2 md:space-x-4">
      <div className="relative flex-grow">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'React', 'Docker', or 'WebSockets'"
          disabled={isLoading}
          className="w-full p-4 pl-5 pr-16 text-gray-100 bg-gray-900/80 border border-gray-800 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200 placeholder-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-full text-white bg-green-600 rounded-full hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchInput;