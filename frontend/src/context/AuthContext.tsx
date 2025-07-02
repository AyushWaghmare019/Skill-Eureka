import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI, creatorAPI, uploadAPI } from '../services/api.js';

// Types for User and Creator
export type User = {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio: string;
  profilePic: string;
  isCreator: false;
  followingCreators: string[];
  likedVideos: string[];
  savedVideos: string[];
  watchLaterVideos: string[];
};

export type Creator = {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio: string;
  profilePic: string;
  youtubeChannel?: string;
  instagramHandle?: string;
  linkedinProfile?: string;
  followers: string[];
  videos: string[];
  isVerified: boolean;
  followersCount?: number;
  videosCount?: number;
  isCreator: true;
};

type CurrentUser = User | Creator;

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isCreator: boolean;
  loading: boolean;
  login: (username: string, password: string, type?: 'user' | 'creator') => Promise<boolean>;
  signup: (userData: Partial<User> | Partial<Creator>, type?: 'user' | 'creator') => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>, profilePic?: File) => Promise<boolean>;
  getCreator: (creatorId: string) => Promise<Creator | null>;
  refreshUserData: () => Promise<void>;
  followCreator: (creatorId: string) => Promise<void>;
  unfollowCreator: (creatorId: string) => Promise<void>;
  likeVideo: (videoId: string) => Promise<void>;
  unlikeVideo: (videoId: string) => Promise<void>;
  saveVideo: (videoId: string) => Promise<void>;
  unsaveVideo: (videoId: string) => Promise<void>;
  addToWatchLater: (videoId: string) => Promise<void>;
  removeFromWatchLater: (videoId: string) => Promise<void>;
  applyAsCreator: (data: { name: string; email: string; youtubeChannel?: string; reason: string }) => Promise<string>;
  verifyCreator: (email: string, confirmationCode: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsCreator(user.isCreator);
    }
    setLoading(false);
  }, []);

  // Always keep localStorage in sync when currentUser changes
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser, isAuthenticated]);

  const refreshUserData = async () => {
    try {
      if (!currentUser) return;
      if (currentUser.isCreator) {
        const response = await creatorAPI.getById(currentUser.id);
        const updated = { ...response.data, isCreator: true };
        setCurrentUser(updated);
        localStorage.setItem('currentUser', JSON.stringify(updated));
      } else {
        const response = await userAPI.getProfile();
        const updated = { ...response.data, isCreator: false };
        setCurrentUser(updated);
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const login = async (username: string, password: string, type: 'user' | 'creator' = 'user') => {
    try {
      const response = type === 'creator'
        ? await authAPI.loginCreator(username, password)
        : await authAPI.loginUser(username, password);

      const {  user, creator } = response.data;
      //localStorage.setItem('authToken', token);

      if (type === 'creator') {
        let creatorProfile = creator;
        if (!creatorProfile) {
          const profileRes = await creatorAPI.getById(response.data.id);
          creatorProfile = profileRes.data;
        }
        const creatorUser = { ...creatorProfile, isCreator: true };
        setCurrentUser(creatorUser);
        setIsCreator(true);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(creatorUser));
      } else {
        let userProfile = user;
        if (!userProfile) {
          const profileRes = await userAPI.getProfile();
          userProfile = profileRes.data;
        }
        const normalUser = { ...userProfile, isCreator: false };
        setCurrentUser(normalUser);
        setIsCreator(false);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(normalUser));
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Partial<User> | Partial<Creator>, type: 'user' | 'creator' = 'user') => {
    try {
      const response = type === 'creator'
        ? await authAPI.registerCreator(userData)
        : await authAPI.registerUser(userData);

      const { token, user, creator } = response.data;
      localStorage.setItem('authToken', token);

      if (type === 'creator') {
        let creatorProfile = creator;
        if (!creatorProfile) {
          const profileRes = await creatorAPI.getById(response.data.id);
          creatorProfile = profileRes.data;
        }
        const creatorUser = { ...creatorProfile, isCreator: true };
        setCurrentUser(creatorUser);
        setIsCreator(true);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(creatorUser));
      } else {
        let userProfile = user;
        if (!userProfile) {
          const profileRes = await userAPI.getProfile();
          userProfile = profileRes.data;
        }
        const normalUser = { ...userProfile, isCreator: false };
        setCurrentUser(normalUser);
        setIsCreator(false);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(normalUser));
      }
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsCreator(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  const updateUserProfile = async (userData: Partial<User>, profilePic?: File) => {
    try {
      let profilePicUrl = userData.profilePic;
      if (profilePic) {
        const uploadResponse = await uploadAPI.uploadProfilePic(profilePic);
        profilePicUrl = uploadResponse.data.url;
      }
      const updateData = { ...userData, profilePic: profilePicUrl };
      const response = await userAPI.updateProfile(updateData);
      const updatedUser = { ...currentUser, ...response.data.user };
      setCurrentUser(updatedUser as CurrentUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const getCreator = async (creatorId: string) => {
    try {
      const response = await creatorAPI.getById(creatorId);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const followCreator = async (creatorId: string) => {
    try {
      await userAPI.followCreator(creatorId);
      await refreshUserData();
    } catch (error) {
      console.error('Follow creator error:', error);
    }
  };

  const unfollowCreator = async (creatorId: string) => {
    try {
      await userAPI.unfollowCreator(creatorId);
      await refreshUserData();
    } catch (error) {
      console.error('Unfollow creator error:', error);
    }
  };

  // --- VIDEO ACTIONS ---
  const likeVideo = async (videoId: string) => {
    try {
      await userAPI.likeVideo(videoId);
      await refreshUserData();
    } catch (error) {
      console.error('Like video error:', error);
    }
  };

  const unlikeVideo = async (videoId: string) => {
    try {
      await userAPI.unlikeVideo(videoId);
      await refreshUserData();
    } catch (error) {
      console.error('Unlike video error:', error);
    }
  };

  const saveVideo = async (videoId: string) => {
    try {
      await userAPI.saveVideo(videoId);
      await refreshUserData();
    } catch (error) {
      console.error('Save video error:', error);
    }
  };

  const unsaveVideo = async (videoId: string) => {
    try {
      // Implement if you have an endpoint, otherwise leave as a stub
      // await userAPI.unsaveVideo(videoId);
      // await refreshUserData();
      console.warn('unsaveVideo not implemented');
    } catch (error) {
      console.error('Unsave video error:', error);
    }
  };

  const addToWatchLater = async (videoId: string) => {
    try {
      await userAPI.addToWatchLater(videoId);
      await refreshUserData();
    } catch (error) {
      console.error('Add to watch later error:', error);
    }
  };

  const removeFromWatchLater = async (videoId: string) => {
    try {
      // Implement if you have an endpoint, otherwise leave as a stub
      // await userAPI.removeFromWatchLater(videoId);
      // await refreshUserData();
      console.warn('removeFromWatchLater not implemented');
    } catch (error) {
      console.error('Remove from watch later error:', error);
    }
  };

  // --- APPLY AS CREATOR ---
  // const applyAsCreator = async (data: { name: string; email: string; youtubeChannel?: string; reason: string }) => {
  //   try {
  //     // If you have an API endpoint, use it:
  //     // const res = await authAPI.applyCreator(data);
  //     // return res.data.confirmationCode;

  //     // For now, return a mock confirmation code:
  //     return Math.random().toString(36).substring(2, 10);
  //   } catch (error) {
  //     throw new Error('Failed to apply as creator');
  //   }
  // };

const applyAsCreator = async ({
  name,
  email,
  youtubeChannel,
  reason,
}: { name: string; email: string; youtubeChannel?: string; reason: string }): Promise<string> => {
  try {
    const response = await authAPI.applyCreator({
      username: name, // : send as `username`, because in frontend we use `name` as username
      email,
      youtubeChannel,
      reason,
    });
    // If your backend returns a confirmation code or message, return it here:
    // return response.data.confirmationCode || 'Application submitted successfully';
    // If not, return a generic success message:
    return 'Application submitted successfully';
  } catch (err) {
    throw new Error('Failed to apply as creator');
  }
};


  // --- VERIFY CREATOR ---
  const verifyCreator = async (email: string, confirmationCode: string): Promise<boolean> => {
    try {
      await authAPI.verifyCreator(email, confirmationCode);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isCreator,
      loading,
      login,
      signup,
      logout,
      updateUserProfile,
      getCreator,
      refreshUserData,
      followCreator,
      unfollowCreator,
      likeVideo,
      unlikeVideo,
      saveVideo,
      unsaveVideo,
      addToWatchLater,
      removeFromWatchLater,
      applyAsCreator,
      verifyCreator,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
