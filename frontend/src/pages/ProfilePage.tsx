import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, creatorAPI } from '../services/api.js';
import UserProfile from '../components/UserProfile';
import CreatorProfile from '../components/CreatorProfile';

interface Profile {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string;
  profilePic: string;
  type: string;
}

const ProfilePage = () => {
  const { isAuthenticated, isCreator, currentUser, updateUserProfile, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(!currentUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        if (isCreator) {
          const res = await creatorAPI.getById(currentUser.id);
          if (!res.data || !res.data.username) {
            setError('No creator found.');
            setProfile(null);
          } else {
            setProfile({
              id: res.data.id || res.data._id,
              username: res.data.username,
              email: res.data.email ?? '',
              name: res.data.name,
              bio: res.data.bio ?? '',
              profilePic: res.data.profilePic ?? '',
              type: 'creator',
            });
          }
        } else {
          const res = await userAPI.getProfile();
          if (!res.data || !res.data.username) {
            setError('No user found.');
            setProfile(null);
          } else {
            setProfile({
              id: res.data.id || res.data._id,
              username: res.data.username,
              email: res.data.email ?? '',
              name: res.data.name,
              bio: res.data.bio ?? '',
              profilePic: res.data.profilePic ?? '',
              type: 'user',
            });
          }
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          'Failed to load profile.'
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isAuthenticated, isCreator, currentUser?.id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#031B33] to-[#00111D] text-white px-4">
        <div className="max-w-md bg-[#0b1c2c]/80 rounded-2xl p-6 shadow-lg border border-cyan-500/30">
          <h2 className="text-2xl font-semibold mb-4">{error}</h2>
          <button
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition mb-2"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </button>
          <button
            className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </button>
          <button
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition mt-2"
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
              logout?.();
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No user or creator found.
      </div>
    );
  }

  return (
    <div className="bg-secondary-light min-h-screen py-6">
      {isCreator ? (
        <CreatorProfile creatorId={profile.id} isOwner={true} logout={logout} />
      ) : (
        <UserProfile user={profile} updateUserProfile={updateUserProfile} logout={logout} />
      )}
    </div>
  );
};

export default ProfilePage;
