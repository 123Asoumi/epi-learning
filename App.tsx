import React, { useState, useCallback } from 'react';
import { fetchToolInfo } from './services/geminiService';
import { GeminiSearchResult } from './types';
import SearchInput from './components/SearchInput';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [searchResult, setSearchResult] = useState<GeminiSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    setHasSearched(true);

    try {
      const result = await fetchToolInfo(query);
      setSearchResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Epi-Learning!</h2>
        <p className="text-gray-400">
            Enter a technology, tool, or topic above to get a curated list of learning materials.
        </p>
    </div>
  );

  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-8 bg-red-900/50 rounded-lg border border-red-700">
        <h2 className="text-2xl font-bold text-red-300 mb-2">An Error Occurred</h2>
        <p className="text-red-400">{message}</p>
    </div>
  );


  return (
    <>
      {/* Star background container */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="stars-wrapper stars"></div>
        <div className="stars-wrapper stars2"></div>
        <div className="stars-wrapper stars3"></div>
      </div>

      {/* Main app content */}
      <div className="relative min-h-screen text-white font-sans p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-3xl">
          <header className="text-center my-8 md:my-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Epi-Learning
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Find the best articles, videos, and documentation to learn any technology.
            </p>
          </header>

          <main>
            <div className="mb-6">
              <SearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>

            <div className="mt-8">
              {isLoading && <LoadingSpinner />}
              {error && <ErrorDisplay message={error} />}
              {searchResult && <ResultsDisplay text={searchResult.text} sources={searchResult.sources} />}
              {!isLoading && !error && !searchResult && hasSearched && (
                  <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-800">
                      <p className="text-gray-400">No results found. Please try another query.</p>
                  </div>
              )}
              {!hasSearched && <WelcomeMessage />}
            </div>
          </main>

          <footer className="text-center mt-12 py-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm">Fourni par EPTEKIN</p>
              <p className="text-gray-600 text-xs mt-1">Powered by Google Gemini</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;