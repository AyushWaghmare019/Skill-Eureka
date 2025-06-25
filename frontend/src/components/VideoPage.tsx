import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, Bookmark, Clock, Share2, Copy, X } from 'lucide-react';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

// Type guard for user
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch video, creator, and related videos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const videoData = await getVideo(id);
        setVideo(videoData);
        if (videoData) {
          const creatorData = await getCreator(videoData.creatorId);
          setCreator(creatorData);
          const vids = await getVideosByCreator(videoData.creatorId);
          setRelatedVideos((vids || []).filter((v: any) => v.id !== id));
        } else {
          setCreator(null);
          setRelatedVideos([]);
        }
      } catch (e) {
        setVideo(null);
        setCreator(null);
        setRelatedVideos([]);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  // Update like, save, watch later state
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

  // User actions
  const handleLikeToggle = async () => {
    if (!isAuthenticated) return (window.location.href = '/login');
    if (!video) return;
    if (isLiked) {
      await unlikeVideo(video.id);
      setIsLiked(false);
    } else {
      await likeVideo(video.id);
      setIsLiked(true);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) return (window.location.href = '/login');
    if (!video) return;
    if (isSaved) {
      await unsaveVideo(video.id);
      setIsSaved(false);
    } else {
      await saveVideo(video.id);
      setIsSaved(true);
    }
  };

  const handleWatchLaterToggle = async () => {
    if (!isAuthenticated) return (window.location.href = '/login');
    if (!video) return;
    if (isWatchLater) {
      await removeFromWatchLater(video.id);
      setIsWatchLater(false);
    } else {
      await addToWatchLater(video.id);
      setIsWatchLater(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-pulse text-white">
        <div>Loading...</div>
      </div>
    );
  }

  if (!video || !creator) {
    return <div className="text-center text-white py-20">Video not found</div>;
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#021520] to-[#00111d] text-white animate-fadeIn">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Floating bubbles */}
        <div className="absolute top-0 left-0 w-52 h-52 bg-blue-800 opacity-20 blur-3xl rounded-full animate-float-slow"></div>
        <div className="absolute bottom-0 right-10 w-40 h-40 bg-purple-500 opacity-20 blur-2xl rounded-full animate-float-delay"></div>

        {/* Video Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="rounded-xl overflow-hidden border border-cyan-400/20 backdrop-blur-lg bg-[#0b1c2c]/70 shadow-xl hover:scale-[1.01] transition-transform duration-300">
            <VideoPlayer videoUrl={video.videoUrl} title={video.title} />
          </div>

          <h1 className="text-3xl font-bold text-cyan-300 drop-shadow">{video.title}</h1>

          <div className="flex items-center gap-4">
            <Link to={`/creator/${creator.id}`} className="flex items-center hover:scale-105 transition-transform">
              <img src={creator.profilePic} alt={creator.name} className="w-10 h-10 rounded-full border-2 border-cyan-300 shadow-md" />
              <span className="ml-3 font-medium text-cyan-100">{creator.name}</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-[1.05] shadow-md ${isLiked ? 'bg-cyan-400 text-black' : 'bg-[#1a2a3c] text-cyan-100 hover:bg-cyan-600 hover:text-white'}`}
            >
              <ThumbsUp className="h-5 w-5" />
              Like
            </button>
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-[1.05] shadow-md ${isSaved ? 'bg-cyan-400 text-black' : 'bg-[#1a2a3c] text-cyan-100 hover:bg-cyan-600 hover:text-white'}`}
            >
              <Bookmark className="h-5 w-5" />
              Save
            </button>
            <button
              onClick={handleWatchLaterToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-[1.05] shadow-md ${isWatchLater ? 'bg-cyan-400 text-black' : 'bg-[#1a2a3c] text-cyan-100 hover:bg-cyan-600 hover:text-white'}`}
            >
              <Clock className="h-5 w-5" />
              Watch Later
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-[#1a2a3c] text-cyan-100 hover:bg-cyan-600 hover:text-white transition-all duration-300 hover:scale-[1.05] shadow-md"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>

        {/* Related Videos */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold text-cyan-200 mb-4">More from this creator</h2>
          <div className="space-y-4">
            {relatedVideos.length > 0 ? relatedVideos.map(video => (
              <Link key={video.id} to={`/video/${video.id}`} className="flex items-start gap-4 bg-[#0e1f2e] hover:bg-[#1b2f45] p-3 rounded-xl transition hover:scale-[1.02] shadow-md hover:shadow-cyan-500/20">
                <img src={video.thumbnail} alt={video.title} className="w-32 h-20 object-cover rounded-lg border border-cyan-500/10" />
                <div className="text-sm text-cyan-100">
                  <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-cyan-400 mt-1">{creator.name}</p>
                </div>
              </Link>
            )) : (
              <p className="text-gray-400 italic">No more videos from this creator</p>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fadeIn backdrop-blur-sm">
          <div className="bg-[#0b1c2c] border border-cyan-500/20 text-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">🔗 Share this video</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-cyan-300 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 bg-[#132a3a] p-2 rounded-md">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 bg-transparent text-cyan-100 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-1 bg-cyan-400 hover:bg-cyan-500 rounded-md text-gray-900 font-medium"
              >
                <Copy className="h-4 w-4" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;

