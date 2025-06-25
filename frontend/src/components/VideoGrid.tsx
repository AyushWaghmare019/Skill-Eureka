import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { useVideos, Video } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import VideoPlayerOverlay from './VideoPlayerOverlay';

const DEFAULT_CREATOR_IMAGE = '/default-profile.png';

interface VideoGridProps {
  videos: Video[];
  columns?: number;
  title?: string;
  isCreatorVideos?: boolean;
  onDelete?: (videoId: string) => void;
}

const VideoGrid = ({
  videos,
  columns = 2,
  title,
  isCreatorVideos = false,
  onDelete,
}: VideoGridProps) => {
  const { getCreator } = useAuth();
  const [creatorsMap, setCreatorsMap] = useState<Record<string, { name: string; image: string }>>({});
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCreators = async () => {
      const creatorData: Record<string, { name: string; image: string }> = {};

      for (const video of videos) {
        if (!creatorData[video.creatorId]) {
          try {
            const creator = await getCreator(video.creatorId);
            if (creator) {
              creatorData[video.creatorId] = {
                name: creator.name,
                image: creator.profilePic || DEFAULT_CREATOR_IMAGE,
              };
            } else {
              creatorData[video.creatorId] = {
                name: 'Unknown Creator',
                image: DEFAULT_CREATOR_IMAGE,
              };
            }
          } catch {
            creatorData[video.creatorId] = {
              name: 'Unknown Creator',
              image: DEFAULT_CREATOR_IMAGE,
            };
          }
        }
      }

      if (isMounted) setCreatorsMap(creatorData);
    };

    fetchCreators();
    return () => { isMounted = false; };
  }, [videos, getCreator]);

  const getColumnClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No videos to display</p>
      </div>
    );
  }

  // Keyboard accessibility for closing modal
  useEffect(() => {
    if (!selectedVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo]);

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-3xl font-bold mb-6 text-cyan-300 tracking-wide animate-fade-in">
          {title}
        </h2>
      )}

      <div className={`grid ${getColumnClass()} gap-6 animate-slide-in`}>
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20 rounded-xl"
            style={{ cursor: 'pointer', perspective: '1000px' }}
          >
            <div className="transition-transform duration-300 ease-in-out hover:-translate-y-1">
              <VideoCard
                video={video}
                creatorName={creatorsMap[video.creatorId]?.name || 'Unknown Creator'}
                creatorImage={creatorsMap[video.creatorId]?.image || DEFAULT_CREATOR_IMAGE}
                isCreatorCard={isCreatorVideos}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-[#0b1c2c]/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in-fast"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          onClick={() => setSelectedVideo(null)}
        >
          <div onClick={e => e.stopPropagation()}>
            <VideoPlayerOverlay
              video={selectedVideo}
              creatorName={creatorsMap[selectedVideo.creatorId]?.name || 'Unknown Creator'}
              creatorImage={creatorsMap[selectedVideo.creatorId]?.image || DEFAULT_CREATOR_IMAGE}
              onClose={() => setSelectedVideo(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
