import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { videoAPI, categoryAPI } from '../services/api.js';

// 1. Video type
export type Video = {
  id: string;
  title: string;
  creatorId: string;
  videoUrl: string; // always required
  thumbnail: string; // always required
  description?: string;
  category?: string;
  uploadDate?: string;
  // add other fields as needed
};

// 2. Category type
export type Category = {
  id: string;
  name: string;
  icon?: string;
};

// 3. Context type
export type VideoContextType = {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  fetchVideos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  getVideosByCreator: (creatorId: string) => Promise<Video[]>;
  getLikedVideos: (videoIds: string[]) => Promise<Video[]>;
  getSavedVideos: (videoIds: string[]) => Promise<Video[]>;
  getWatchLaterVideos: (videoIds: string[]) => Promise<Video[]>;
  uploadVideo: (formData: FormData) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  getVideo: (id: string) => Promise<Video | undefined>;
  getVideosByCategory: (category: string) => Promise<Video[]>;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch all videos
  const fetchVideos = async () => {
    try {
      const res = await videoAPI.getAll();
      setVideos(res.data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Get videos by creator
  const getVideosByCreator = async (creatorId: string): Promise<Video[]> => {
    try {
      // Always fetch fresh from API to get latest thumbnails, etc.
      const res = await videoAPI.getVideos(creatorId);
      return res.data as Video[];
    } catch (error) {
      console.error('Failed to fetch creator videos:', error);
      return [];
    }
  };

  // Get liked videos
  const getLikedVideos = async (videoIds: string[]): Promise<Video[]> => {
    try {
      if (!videoIds.length) return [];
      // Always use the latest videos state
      return videos.filter(v => videoIds.includes(v.id));
    } catch (error) {
      console.error('Failed to fetch liked videos:', error);
      return [];
    }
  };

  // Get saved videos
  const getSavedVideos = async (videoIds: string[]): Promise<Video[]> => {
    try {
      if (!videoIds.length) return [];
      return videos.filter(v => videoIds.includes(v.id));
    } catch (error) {
      console.error('Failed to fetch saved videos:', error);
      return [];
    }
  };

  // Get watch later videos
  const getWatchLaterVideos = async (videoIds: string[]): Promise<Video[]> => {
    try {
      if (!videoIds.length) return [];
      return videos.filter(v => videoIds.includes(v.id));
    } catch (error) {
      console.error('Failed to fetch watch later videos:', error);
      return [];
    }
  };

  // Get single video by id
  const getVideo = async (id: string): Promise<Video | undefined> => {
    try {
      // Try to find in current videos state first
      const found = videos.find(v => v.id === id);
      if (found) return found;
      // Otherwise fetch from API
      const res = await videoAPI.getById(id);
      return res.data as Video;
    } catch (error) {
      console.error('Failed to fetch video:', error);
      return undefined;
    }
  };

  // Get videos by category (for HomePage filtering)
  const getVideosByCategory = async (category: string): Promise<Video[]> => {
    try {
      if (category === 'all') return videos;
      return videos.filter(v => v.category === category);
    } catch (error) {
      console.error('Failed to fetch videos by category:', error);
      return [];
    }
  };

  // Upload a new video (accepts FormData with video and thumbnail)
  const uploadVideo = async (formData: FormData) => {
    try {
      await videoAPI.upload(formData);
      await fetchVideos(); // Refresh video list after upload
    } catch (error) {
      console.error('Failed to upload video:', error);
    }
  };

  // Delete a video
  const deleteVideo = async (videoId: string) => {
    try {
      await videoAPI.delete(videoId);
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videos,
        setVideos,
        categories,
        setCategories,
        fetchVideos,
        fetchCategories,
        getVideosByCreator,
        getLikedVideos,
        getSavedVideos,
        getWatchLaterVideos,
        uploadVideo,
        deleteVideo,
        getVideo,
        getVideosByCategory,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};
