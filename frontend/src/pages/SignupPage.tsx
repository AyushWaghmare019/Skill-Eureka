import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI, creatorAPI, uploadAPI } from '../services/api.js';

// User and Creator types
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
  signup: (
    userData: Omit<Partial<User>, 'password'> | Omit<Partial<Creator>, 'password'>,
    password: string,
    type?: 'user' | 'creator'
  ) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>, profilePic?: File) => Promise<boolean>;
  getCreator: (creatorId: string) => Promise<Creator | null>;
  refreshUserData: () => Promise<void>;
  followCreator: (creatorId: string) => Promise<void>;
  unfollowCreator: (creatorId: string) => Promise<void>;
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

      const { token, user, creator } = response.data;
      localStorage.setItem('authToken', token);

      if (type === 'creator') {
        setCurrentUser({ ...creator, isCreator: true });
        setIsCreator(true);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify({ ...creator, isCreator: true }));
      } else {
        setCurrentUser({ ...user, isCreator: false });
        setIsCreator(false);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify({ ...user, isCreator: false }));
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (
    userData: Omit<Partial<User>, 'password'> | Omit<Partial<Creator>, 'password'>,
    password: string,
    type: 'user' | 'creator' = 'user'
  ): Promise<boolean> => {
    try {
      const dataToSend = { ...userData, password };
      const response = type === 'creator'
        ? await authAPI.registerCreator(dataToSend)
        : await authAPI.registerUser(dataToSend);

      const { token, user, creator } = response.data;
      localStorage.setItem('authToken', token);

      if (type === 'creator') {
        setCurrentUser({ ...creator, isCreator: true });
        setIsCreator(true);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify({ ...creator, isCreator: true }));
      } else {
        setCurrentUser({ ...user, isCreator: false });
        setIsCreator(false);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify({ ...user, isCreator: false }));
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
      unfollowCreator
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
