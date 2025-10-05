import React, { useState } from 'react';

interface VideoEmbedProps {
  url: string;
  linkText: React.ReactNode;
}

const getYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, linkText }) => {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const videoId = getYoutubeId(url);

  if (!videoId) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
        {linkText}
      </a>
    );
  }

  return (
    <>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
        {linkText}
      </a>
      <button
        onClick={() => setIsEmbedded(!isEmbedded)}
        className="ml-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-200 transition-colors"
      >
        {isEmbedded ? 'Hide' : 'Watch'}
      </button>

      {isEmbedded && (
        <div className="my-4">
            <div className="aspect-ratio-16-9">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded YouTube Video"
                className="w-full h-full rounded-lg"
            />
            </div>
        </div>
      )}
    </>
  );
};

export default VideoEmbed;