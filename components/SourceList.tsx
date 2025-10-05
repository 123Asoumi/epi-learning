import React from 'react';
// Fix: Import WebSource to use in the type guard.
import { GroundingChunk, WebSource } from '../types';

interface SourceListProps {
  sources: GroundingChunk[];
}

const SourceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);


const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  // Fix: Filter sources to only include those with a URI and use a type guard for type safety.
  const validSources = sources.filter(
    (source): source is GroundingChunk & { web: WebSource & { uri: string } } => !!source.web?.uri
  );

  if (validSources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-800">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">Sources</h3>
      <ul className="space-y-3">
        {validSources.map((source, index) => (
          <li key={index} className="flex items-start">
            <SourceIcon />
            <a
              href={source.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 hover:underline transition-colors duration-200 break-all"
            >
              {source.web.title || source.web.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;