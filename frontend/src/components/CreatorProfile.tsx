import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVideos, Video } from '../context/VideoContext';
import VideoGrid from './VideoGrid';
import UploadVideoForm from './UploadVideoForm';
import { videoAPI } from '../services/api';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import blueImg from '../assets/blueImg.jpeg';

// Type guard to check if currentUser is a User (not Creator)
function isUser(user: any): user is { followingCreators: string[] } {
  return user && Array.isArray(user.followingCreators);
}

interface CreatorProfileProps {
  creatorId: string;
  isOwner?: boolean;
  logout?: () => void;
}

const CreatorProfile = ({ creatorId, isOwner = false, logout }: CreatorProfileProps) => {
  const { getCreator, followCreator, unfollowCreator, currentUser, isAuthenticated } = useAuth();
  const { getVideosByCreator, deleteVideo, uploadVideo } = useVideos();

  const [creator, setCreator] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch creator info
  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCreator(creatorId);
        if (!data) {
          setError('Creator not found');
          setCreator(null);
        } else {
          setCreator(data);
        }
      } catch (err) {
        setError('Failed to fetch creator');
        setCreator(null);
      }
      setLoading(false);
    };
    fetchCreator();
  }, [creatorId, getCreator]);

  // Fetch creator's videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const vids = await getVideosByCreator(creatorId);
        setVideos(vids || []);
      } catch {
        setVideos([]);
      }
      setLoading(false);
    };
    fetchVideos();
  }, [creatorId, getVideosByCreator]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{error || 'Creator not found'}</h2>
          <button
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isFollowing = isUser(currentUser) && currentUser.followingCreators.includes(creatorId);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (isFollowing) {
      await unfollowCreator(creatorId);
    } else {
      await followCreator(creatorId);
    }
  };

  const handleVideoDelete = async (videoId: string) => {
    await deleteVideo(videoId);
    setVideos(videos.filter(v => v.id !== videoId));
  };

  // Handle video upload and refresh list
  const handleUpload = async (formData: FormData) => {
    try {
      await uploadVideo(formData);
      const vids = await getVideosByCreator(creatorId);
      setVideos(vids || []);
      setShowUpload(false);
    } catch (err) {
      console.error('Video upload failed', err);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black mt-[-45px] mb-[0px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${blueImg})` }}
      />
      {/* Foreground Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-12 py-16">
        <div className="bg-black bg-opacity-50 text-white rounded-xl p-6 sm:p-10 max-w-3xl w-full">
          {/* Upload Button */}
          {isOwner && (
            <div className="mb-6 text-right">
              {!showUpload ? (
                <button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
                  onClick={() => setShowUpload(true)}
                >
                  🚀 Upload Video
                </button>
              ) : (
                <UploadVideoForm onUpload={handleUpload} />
              )}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-inner mx-auto md:mx-0 mb-6 md:mb-0">
                <img
                  src={creator.profilePic}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:ml-8 text-center md:text-left">
                <h1 className="text-3xl font-extrabold tracking-wide">{creator.name}</h1>
                <p className="text-gray-300 italic mt-1">{creator.bio}</p>
                <div className="flex gap-6 mt-3 justify-center md:justify-start text-sm">
                  <span>👥 Followers: <b>{creator.followersCount}</b></span>
                  <span>🎬 Videos: <b>{creator.videosCount}</b></span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start mt-4 gap-4">
                  {!isOwner && (
                    <button
                      onClick={handleFollowToggle}
                      className={`px-5 py-2 rounded-lg transition-all shadow-md ${
                        isFollowing
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                  <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg shadow-md transition">
                    Share
                  </button>
                </div>
                <div className="flex justify-center md:justify-start mt-4 space-x-5 text-xl">
                  {creator.instagramHandle && (
                    <a href={creator.instagramHandle} target="_blank" rel="noreferrer" className="hover:text-[#E1306C]">
                      <Instagram />
                    </a>
                  )}
                  {creator.youtubeChannel && (
                    <a href={creator.youtubeChannel} target="_blank" rel="noreferrer" className="hover:text-[#FF0000]">
                      <Youtube />
                    </a>
                  )}
                  {creator.linkedinProfile && (
                    <a href={creator.linkedinProfile} target="_blank" rel="noreferrer" className="hover:text-[#0077B5]">
                      <Linkedin />
                    </a>
                  )}
                </div>
                {isOwner && logout && (
                  <button
                    onClick={logout}
                    className="mt-5 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="mt-10">
            <VideoGrid
              videos={videos}
              columns={2}
              title="Videos"
              isCreatorVideos={true}
              onDelete={isOwner ? handleVideoDelete : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
