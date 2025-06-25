import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import blueImg from '../assets/blueImg.jpeg';

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    bio: string;
    profilePic: string;
    type: string;
    followingCreators?: string[];
  };
  updateUserProfile: (userData: any, profilePic?: File) => Promise<boolean>;
  logout: () => void;
}

const DEFAULT_PFP = '/default-pfp.png';

const UserProfile: React.FC<UserProfileProps> = ({ user, updateUserProfile, logout }) => {
  // Fallback for missing user (should not render at all, but just in case)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No user found.
      </div>
    );
  }

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
  });
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.profilePic || DEFAULT_PFP);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setNewProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const success = await updateUserProfile(
      { ...user, ...formData },
      newProfilePic || undefined
    );
    if (success) setEditMode(false);
    setLoading(false);
  };

  const followingCount = user.followingCreators?.length || 0;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center px-4"
      style={{ backgroundImage: `url(${blueImg})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-black/60 text-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative"
      >
        {/* Profile Section */}
        <div className="flex items-center gap-6 mb-6">
          <motion.img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md cursor-pointer transition-transform duration-300 hover:scale-110"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPopup(true)}
            onError={(e) => (e.currentTarget.src = DEFAULT_PFP)}
          />
          <div>
            <h2 className="text-3xl font-semibold mb-[20px]">@{formData.username}</h2>
            <p className="text-blue-300  mb-[4px]">{formData.name}</p>
            <p className="text-sm text-gray-300">Following : {followingCount}</p>
          </div>
        </div>

        {/* Edit Mode Section */}
        {editMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full px-4 py-2  rounded-lg bg-white text-black "
            />
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full px-4 py-2 rounded-lg bg-white text-black"
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              placeholder="Bio"
              className="w-full px-4 py-2 rounded-lg bg-white text-black"
            />
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="text-sm text-white"
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="bg-[#014c76] hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-200 shadow hover:scale-105"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all duration-200 shadow hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <p className="italic text-gray-300 mb-4">{formData.bio || 'No bio yet'}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setEditMode(true)}
                className="btn px-6 py-2 rounded-lg 
            bg-[#00111A] text-white border border-white
            hover:bg-[#014C76] hover:text-gray-100 hover:font-semibold hover:scale-105  
            active:translate-y-1 transition-all duration-200 ease-in-out"
              >
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="btn block text-gray-800  py-3 px-6 bg-[#c7d5d8] hover:bg-[#9fbfc4]  text-center font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95  hover:border hover:border-gray-300 hover:text-gray-100 font-semibold px-6 py-2 rounded-lg hover:bg-[#A020F0] "
              >
                Logout
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Image Popup Overlay */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowPopup(false)} // Close on outside click
          >
            <motion.img
              src={preview}
              alt="Popup Profile"
              className="rounded-full w-72 h-72 border-4 border-white shadow-2xl z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking on image
              onError={(e) => (e.currentTarget.src = DEFAULT_PFP)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
