import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVideos, Video } from '../context/VideoContext';
import VideoGrid from '../components/VideoGrid';

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

const MyLibraryPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { getLikedVideos, getSavedVideos, getWatchLaterVideos } = useVideos();

  const [activeTab, setActiveTab] = useState<'saved' | 'liked' | 'watch-later'>('saved');
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [watchLaterVideos, setWatchLaterVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      if (!isAuthenticated || !currentUser || !isUser(currentUser)) {
        setSavedVideos([]);
        setLikedVideos([]);
        setWatchLaterVideos([]);
        setLoading(false);
        return;
      }
      const saved = await getSavedVideos(currentUser.savedVideos || []);
      const liked = await getLikedVideos(currentUser.likedVideos || []);
      const watchLater = await getWatchLaterVideos(currentUser.watchLaterVideos || []);
      setSavedVideos(saved);
      setLikedVideos(liked);
      setWatchLaterVideos(watchLater);
      setLoading(false);
    };
    fetchVideos();
  }, [isAuthenticated, currentUser, getSavedVideos, getLikedVideos, getWatchLaterVideos]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D] text-white text-center animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">My Library</h1>
        <p className="mb-6">🔒 Please sign in to access your library</p>
        <a href="/login" className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all shadow-xl hover:scale-105">Sign In</a>
      </div>
    );
  }

  if (!currentUser || !isUser(currentUser)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D] text-white text-center animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">My Library</h1>
        <p className="mb-4">⚠️ Library is only available for users.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-white">
        <p className="text-lg animate-pulse">Loading your videos...</p>
      </div>
    );
  }

  const renderTabContent = () => {
    const messageClass = "text-gray-400 text-center py-6 italic";
    if (activeTab === 'saved') {
      return savedVideos.length ? (
        <VideoGrid videos={savedVideos} columns={3} />
      ) : (
        <div className={messageClass}>📁 No saved videos yet.</div>
      );
    }
    if (activeTab === 'liked') {
      return likedVideos.length ? (
        <VideoGrid videos={likedVideos} columns={3} />
      ) : (
        <div className={messageClass}>👍 No liked videos yet.</div>
      );
    }
    if (activeTab === 'watch-later') {
      return watchLaterVideos.length ? (
        <VideoGrid videos={watchLaterVideos} columns={3} />
      ) : (
        <div className={messageClass}>🕒 No videos in Watch Later.</div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031B33] to-[#00111D] text-white px-6 py-8 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-center mb-8 drop-shadow-lg">🎬 My Library</h1>

      <div className="flex justify-center mb-8 border-b border-white/10 pb-2 space-x-6">
        {['saved', 'liked', 'watch-later'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`text-lg font-semibold transition-all transform duration-300 px-4 py-2 rounded-xl shadow-sm hover:scale-105 hover:bg-white/10 backdrop-blur-sm ${
              activeTab === tab ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-300'
            }`}
          >
            {tab === 'saved' ? '📁 Saved' : tab === 'liked' ? '👍 Liked' : '🕒 Watch Later'}
          </button>
        ))}
      </div>

      <div className="transition-all duration-500 ease-in-out">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyLibraryPage;
