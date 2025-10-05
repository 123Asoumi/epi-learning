import React from 'react';
import { GroundingChunk } from '../types';
import SourceList from './SourceList';
import VideoEmbed from './VideoEmbed';

interface ResultsDisplayProps {
  text: string;
  sources: GroundingChunk[];
}

const formatText = (text: string) => {
    const lines = text.split('\n');
    
    const parseInline = (line: string): React.ReactNode[] => {
        const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
        const parts = line.split(regex).filter(Boolean);

        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-semibold text-gray-100">{parseInline(part.slice(2, -2))}</strong>;
            }
            
            const linkMatch = part.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/);
            if (linkMatch) {
                const linkTextContent = linkMatch[1];
                const url = linkMatch[2];
                
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    return <VideoEmbed key={index} url={url} linkText={parseInline(linkTextContent)} />;
                }

                return <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{parseInline(linkTextContent)}</a>;
            }
            
            return part;
        });
    };

    return lines.map((line, index) => {
        line = line.trim();
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold text-gray-100 mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('* ')) {
            return <li key={index} className="ml-6 list-disc text-gray-300 my-1">{parseInline(line.substring(2))}</li>;
        }
        if (line.length > 0) {
            return <p key={index} className="my-2 text-gray-300 leading-relaxed">{parseInline(line)}</p>;
        }
        return null;
    });
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ text, sources }) => {
  return (
    <div className="w-full bg-gray-900/50 rounded-lg p-6 md:p-8 mt-6 border border-gray-800 backdrop-blur-sm">
      <div className="prose prose-invert max-w-none">
        {formatText(text)}
      </div>
      <SourceList sources={sources} />
    </div>
  );
};

export default ResultsDisplay;