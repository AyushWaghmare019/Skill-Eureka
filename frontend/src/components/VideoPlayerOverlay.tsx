import React, { useRef, useState, useEffect } from 'react';
import { Video } from '../context/VideoContext';

interface VideoPlayerOverlayProps {
  video: Video;
  creatorName: string;
  creatorImage: string;
  onClose: () => void;
}

const DEFAULT_CREATOR_IMAGE = '/default-profile.png';

const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({
  video,
  creatorName,
  creatorImage,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [creatorImgSrc, setCreatorImgSrc] = useState(creatorImage || DEFAULT_CREATOR_IMAGE);

  // Keyboard accessibility: close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-500 ease-in-out ${
        isMinimized ? 'items-end justify-end p-4' : ''
      }`}
      style={isMinimized ? { alignItems: 'flex-end', justifyContent: 'flex-end' } : {}}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 relative transform transition-all duration-500 ${
          isMinimized ? 'w-80 h-56 hover:scale-105' : 'max-w-2xl w-full'
        }`}
        style={isMinimized ? { width: 320, height: 220 } : {}}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          ×
        </button>

        {/* Creator Info */}
        <div className="flex items-center mb-2">
          <img
            src={creatorImgSrc}
            alt={creatorName}
            className="w-10 h-10 rounded-full mr-3 ring-2 ring-primary-light shadow-md"
            onError={() => setCreatorImgSrc(DEFAULT_CREATOR_IMAGE)}
          />
          <span className="font-semibold text-gray-800 dark:text-white">{creatorName}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white animate-fade-in">
          {video.title}
        </h2>

        {/* Video */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls
          className="w-full rounded-lg shadow-md hover:scale-[1.01] transition-transform"
          style={isMinimized ? { height: 120 } : {}}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 my-3">
          {!isMinimized ? (
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow transition-all"
              onClick={handleMinimize}
            >
              Minimize
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow transition-all"
              onClick={handleMaximize}
            >
              Maximize
            </button>
          )}

          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow transition-all"
            onClick={handleFullscreen}
          >
            Fullscreen
          </button>

          <button
            className={`px-4 py-2 rounded-md transition-all shadow ${
              isLiked
                ? 'bg-primary text-white hover:scale-105'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setIsLiked((prev) => !prev)}
          >
            {isLiked ? 'Liked ❤️' : 'Like'}
          </button>

          <button
            className={`px-4 py-2 rounded-md transition-all shadow ${
              isFollowed
                ? 'bg-primary text-white hover:scale-105'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setIsFollowed((prev) => !prev)}
          >
            {isFollowed ? 'Following 👥' : 'Follow'}
          </button>

          <button
            className={`px-4 py-2 rounded-md transition-all shadow ${
              isSaved
                ? 'bg-primary text-white hover:scale-105'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setIsSaved((prev) => !prev)}
          >
            {isSaved ? 'Saved 📁' : 'Save'}
          </button>
        </div>

        {/* Description */}
        {!isMinimized && (
          <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-relaxed animate-fade-in-slow">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerOverlay;
