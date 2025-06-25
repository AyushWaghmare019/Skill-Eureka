import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Video } from '../context/VideoContext';

type VideoCardProps = {
  video: Video;
  creatorName: string;
  creatorImage: string;
  isCreatorCard?: boolean;
  onDelete?: (videoId: string) => void;
};

const DEFAULT_THUMBNAIL = '/default-thumbnail.jpg'; // Place a default image in your public folder
const DEFAULT_CREATOR_IMAGE = '/default-profile.png';

const VideoCard = ({
  video,
  creatorName,
  creatorImage,
  isCreatorCard = false,
  onDelete,
}: VideoCardProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(video.thumbnail || DEFAULT_THUMBNAIL);
  const [creatorImgSrc, setCreatorImgSrc] = useState(creatorImage || DEFAULT_CREATOR_IMAGE);
  const { isCreator, currentUser } = useAuth();

  const isOwner = isCreator && currentUser?.id === video.creatorId;

  const handleDelete = () => {
    if (onDelete) {
      if (window.confirm('Are you sure you want to delete this video?')) {
        onDelete(video.id);
      }
    }
    setShowOptions(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className={`
        video-card relative bg-[#0b1c2c]/90 backdrop-blur-md border border-cyan-500/20 
        rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/30 
        transition-all duration-300 transform hover:scale-[1.02] group
        animate-fade-in
      `}
    >
      <Link to={`/video/${video.id}`} className="block">
        {/* Video Thumbnail */}
        <div className="relative overflow-hidden h-48 bg-gray-900">
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
            onError={() => setThumbSrc(DEFAULT_THUMBNAIL)}
          />
        </div>

        {/* Video Info */}
        <div className="p-4 text-white">
          <h3 className="font-semibold text-cyan-300 line-clamp-2 group-hover:text-cyan-400 transition">
            {video.title}
          </h3>

          {!isCreatorCard && (
            <div className="flex items-center mt-3">
              <div
                className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-cyan-500 bg-gray-800"
                title={creatorName}
              >
                <img
                  src={creatorImgSrc}
                  alt={creatorName}
                  className="h-full w-full object-cover"
                  onError={() => setCreatorImgSrc(DEFAULT_CREATOR_IMAGE)}
                />
              </div>
              <span className="ml-3 text-sm text-cyan-100">{creatorName}</span>
            </div>
          )}

          <div className="text-xs text-gray-400 mt-2">
            {formatDate(video.uploadDate)}
          </div>
        </div>
      </Link>

      {/* Owner Options */}
      {isOwner && (
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
            title="More options"
          >
            <MoreVertical size={16} />
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-44 bg-[#102132] text-white rounded-md shadow-2xl py-2 z-10 border border-cyan-500/10 animate-fade-in">
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1c2a3a] transition"
              >
                🗑️ Delete this video
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
