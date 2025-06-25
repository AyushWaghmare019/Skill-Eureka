import axios from 'axios';

// Use VITE_API_URL from .env, fallback to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Auth API ---
export const authAPI = {
  // User
  registerUser: (userData) => api.post('/auth/register/user', userData),
  loginUser: (username, password) => api.post('/auth/login/user', { username, password }),
  forgotPassword: (email, username, newPassword) =>
    api.post('/auth/forgot-password', { email, username, newPassword }),

  // Creator
  registerCreator: (creatorData) => api.post('/auth/register/creator', creatorData),
  loginCreator: (username, password) => api.post('/auth/login/creator', { username, password }),
  forgotPasswordCreator: (email, username, newPassword) =>
    api.post('/auth/forgot-password/creator', { email, username, newPassword }),

  // (Optional) If you use verification
  applyCreator: (creatorData) => api.post('/auth/apply/creator', creatorData),
  verifyCreator: (email, confirmationCode) =>
    api.post('/auth/verify/creator', { email, confirmationCode }),
};

// --- User API ---
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  followCreator: (creatorId) => api.post(`/users/follow/${creatorId}`),
  unfollowCreator: (creatorId) => api.delete(`/users/follow/${creatorId}`),
  likeVideo: (videoId) => api.post(`/users/like/${videoId}`),
  unlikeVideo: (videoId) => api.delete(`/users/like/${videoId}`),
  saveVideo: (videoId) => api.post(`/users/save/${videoId}`),
  addToWatchLater: (videoId) => api.post(`/users/watch-later/${videoId}`),
  // addToHistory removed as per previous instructions
  getNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (notificationId) => api.put(`/users/notifications/${notificationId}/read`),
};

// --- Creator API ---
export const creatorAPI = {
  getAll: (search = '') => api.get('/creators', { params: { search } }),
  getById: (id) => api.get(`/creators/${id}`),
  getVideos: (id) => api.get(`/creators/${id}/videos`), // <-- This line is crucial!
  updateProfile: (creatorData) => api.put('/creators/profile', creatorData),
  getFollowers: (id) => api.get(`/creators/${id}/followers`),
};

// --- Video API ---
export const videoAPI = {
  getAll: (params = {}) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  getVideos: (creatorId) => api.get(`/creators/${creatorId}/videos`), // <-- Add this line!
  upload: (videoData) => api.post('/videos/upload', videoData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }), // for creators
  delete: (id) => api.delete(`/videos/${id}`),
};

// --- Category API ---
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// --- Upload API ---
export const uploadAPI = {
  uploadProfilePic: (file) => {
    const formData = new FormData();
    formData.append('profilePic', file);
    return api.post('/upload/profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadThumbnail: (file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return api.post('/upload/thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Optionally, export the axios instance for custom use
export default api;
