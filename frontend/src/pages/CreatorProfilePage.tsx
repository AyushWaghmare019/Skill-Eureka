import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UploadVideoForm from '../components/UploadVideoForm';
import { useVideos, Video } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';

const CreatorProfilePage: React.FC = () => {
  const { id: creatorId } = useParams<{ id: string }>();
  const { uploadVideo, getVideosByCreator } = useVideos();
  const { currentUser, getCreator, logout } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isOwner = currentUser?.isCreator && currentUser.id === creatorId;

  useEffect(() => {
    if (!creatorId) return;
    setLoading(true);
    setError(null);
    const fetchCreatorAndVideos = async () => {
      try {
        const creatorData = await getCreator(creatorId);
        if (!creatorData) {
          setError('Creator not found');
          setCreator(null);
        } else {
          setCreator(creatorData);
        }
        const vids = await getVideosByCreator(creatorId);
        setVideos(vids);
      } catch (err) {
        setError('Failed to load creator');
        setCreator(null);
        setVideos([]);
      }
      setLoading(false);
    };
    fetchCreatorAndVideos();
  }, [creatorId, getCreator, getVideosByCreator]);

  const handleUpload = async (formData: FormData) => {
    if (!creatorId) return;
    formData.append('creatorId', creatorId);
    await uploadVideo(formData);
    const vids = await getVideosByCreator(creatorId);
    setVideos(vids);
    setShowForm(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'popup-backdrop') {
      setIsImagePopup(false);
    }
  };

  const handleEditSave = () => {
    setShowEditModal(false);
  };

  // Always show fallback UI if error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D] text-white text-center px-4">
        <div className="max-w-md bg-[#0b1c2c]/80 rounded-2xl p-6 shadow-lg border border-cyan-500/30">
          <h2 className="text-2xl font-semibold mb-4">{error}</h2>
          <button
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition mb-2"
            onClick={() => navigate('/creators')}
          >
            Go to Community
          </button>
          <button
            className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
          <button
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition mt-2"
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
              if (logout) logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D]">
        <div className="backdrop-blur-lg bg-white/20 px-8 py-6 rounded-2xl shadow-2xl border border-white/20 text-white animate-pulse text-xl font-medium">
          Loading creator profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031B33] to-[#00111D] text-white px-4 py-10 relative overflow-hidden animate-fadeIn">
      {/* Floating Elements */}
      <div className="absolute top-0 left-0 w-52 h-52 bg-purple-800 opacity-20 blur-3xl rounded-full animate-float-slow"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-500 opacity-20 blur-2xl rounded-full animate-float-delay"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-center drop-shadow-xl">🎥 Creator Profile</h1>

        <div className="flex items-center space-x-4 mb-6 justify-center">
          <img
            src={creator?.profilePic || "/creator-profile.jpg"}
            alt="Creator"
            className="w-24 h-24 rounded-full object-cover shadow-2xl cursor-pointer transform transition-transform duration-300 hover:scale-110 border-4 border-white"
            onClick={() => setIsImagePopup(true)}
          />
          {isOwner && (
            <button
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {isImagePopup && (
          <div
            id="popup-backdrop"
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn"
            onClick={handleOutsideClick}
          >
            <img
              src={creator?.profilePic || "/creator-profile.jpg"}
              alt="Full Size"
              className="max-w-xs w-full rounded-xl shadow-2xl transform scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white text-black rounded-xl shadow-2xl w-full max-w-md p-6 relative">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea className="w-full border border-gray-300 rounded-md p-2" placeholder="Short bio" rows={3}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Picture (.jpg/.png)</label>
                  <input type="file" accept=".jpg, .jpeg, .png" ref={fileInputRef} className="w-full" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="button" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800" onClick={handleEditSave}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isOwner && (
          <div className="mb-8 text-center">
            {!showForm && (
              <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full shadow-xl hover:scale-105 transition-all" onClick={() => setShowForm(true)}>
                ➕ Upload Video
              </button>
            )}
            {showForm && <UploadVideoForm onUpload={handleUpload} />}
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4 text-purple-300 drop-shadow">📼 My Videos</h2>
        <div>
          {videos.length === 0 && <p className="text-gray-400 italic">No videos uploaded yet.</p>}
          {videos.map(video => (
            <div key={video.id} className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.03]">
              <h3 className="font-bold text-white text-lg mb-1">{video.title}</h3>
              {video.thumbnail && (
                <img src={video.thumbnail} alt={video.title} className="w-40 h-24 object-cover rounded-lg shadow mb-2" />
              )}
              <p className="text-white/80 text-sm mb-2 italic">{video.description}</p>
              <video src={video.videoUrl} controls width="100%" className="rounded-lg shadow-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfilePage;
