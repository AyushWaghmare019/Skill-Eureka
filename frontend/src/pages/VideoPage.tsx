import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, Bookmark, Clock, Share2 } from 'lucide-react';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

function isUser(user: any): user is {
  likedVideos: string[];
  savedVideos: string[];
  watchLaterVideos: string[];
} {
  return (
    user &&
    Array.isArray(user.likedVideos) &&
    Array.isArray(user.savedVideos) &&
    Array.isArray(user.watchLaterVideos)
  );
}

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getVideo, getVideosByCreator } = useVideos();
  const {
    getCreator,
    likeVideo,
    unlikeVideo,
    saveVideo,
    unsaveVideo,
    addToWatchLater,
    removeFromWatchLater,
    currentUser,
    isAuthenticated,
  } = useAuth();

  const [video, setVideo] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        const videoData = await getVideo(id);
        setVideo(videoData);

        if (videoData) {
          const creatorData = await getCreator(videoData.creatorId);
          setCreator(creatorData);

          const vids = await getVideosByCreator(videoData.creatorId);
          setRelatedVideos((vids || []).filter((v: any) => v.id !== id));
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id, getVideo, getCreator, getVideosByCreator]);

  useEffect(() => {
    if (currentUser && video && isUser(currentUser)) {
      setIsLiked(currentUser.likedVideos.includes(video.id));
      setIsSaved(currentUser.savedVideos.includes(video.id));
      setIsWatchLater(currentUser.watchLaterVideos.includes(video.id));
    } else {
      setIsLiked(false);
      setIsSaved(false);
      setIsWatchLater(false);
    }
  }, [currentUser, video]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (video && isUser(currentUser)) {
      if (isLiked) {
        await unlikeVideo(video.id);
      } else {
        await likeVideo(video.id);
      }
      setIsLiked(!isLiked);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (video && isUser(currentUser)) {
      if (isSaved) {
        await unsaveVideo(video.id);
      } else {
        await saveVideo(video.id);
      }
      setIsSaved(!isSaved);
    }
  };

  const handleWatchLaterToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (video && isUser(currentUser)) {
      if (isWatchLater) {
        await removeFromWatchLater(video.id);
      } else {
        await addToWatchLater(video.id);
      }
      setIsWatchLater(!isWatchLater);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-pulse text-white">
        <div>Loading...</div>
      </div>
    );
  }

  if (!video || !creator) {
    return (
      <div className="text-center py-10 text-white">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#031B33] to-[#00111D] px-4 py-8 text-white animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/3">
          <VideoPlayer videoUrl={video.videoUrl} title={video.title} />

          <div className="mt-6 bg-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h1 className="text-2xl font-bold mb-2 text-white drop-shadow-md">{video.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/creator/${creator.id}`} className="flex items-center gap-2 hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500">
                  <img src={creator.profilePic} alt={creator.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-purple-300">{creator.name}</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleLikeToggle} className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all shadow-lg ${isLiked ? 'bg-purple-600 text-white' : 'bg-white text-black hover:bg-purple-200'}`}>
                <ThumbsUp className="h-5 w-5" />
                Like
              </button>
              <button onClick={handleSaveToggle} className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all shadow-lg ${isSaved ? 'bg-purple-600 text-white' : 'bg-white text-black hover:bg-purple-200'}`}>
                <Bookmark className="h-5 w-5" />
                Save
              </button>
              <button onClick={handleWatchLaterToggle} className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all shadow-lg ${isWatchLater ? 'bg-purple-600 text-white' : 'bg-white text-black hover:bg-purple-200'}`}>
                <Clock className="h-5 w-5" />
                Watch Later
              </button>
              <button className="flex items-center gap-2 px-5 py-2 rounded-full font-medium bg-white text-black hover:bg-purple-200 transition-all shadow-lg">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4 text-purple-200">More from this creator</h2>
          <div className="space-y-4">
            {relatedVideos.map((video) => (
              <Link to={`/video/${video.id}`} key={video.id} className="flex gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md shadow-md">
                <div className="w-32 h-20 rounded-xl overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-purple-300 mt-1">{creator.name}</p>
                </div>
              </Link>
            ))}
            {relatedVideos.length === 0 && (
              <p className="text-gray-400 italic">No more videos from this creator</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;