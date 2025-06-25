import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useVideos, Video } from './VideoContext';
// import { mockNotifications } from '../data/mockData';
import { userAPI } from '../services/api.js'; // <-- Use your backend API

export type Notification = {
  id: string;
  userId: string;
  creatorId: string;
  videoId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  createNotification: (creatorId: string, videoId: string) => Promise<void>;
  getNotificationsForUser: () => Notification[];
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();
  const { getVideo } = useVideos();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await userAPI.getNotifications();
      setNotifications(res.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [currentUser]);

  const unreadCount = notifications.filter(
    n => !n.isRead && n.userId === currentUser?.id
  ).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    // Optionally, call backend to mark as read
    userAPI.markNotificationRead(notificationId).catch(() => {});
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.userId === currentUser.id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    // Optionally, call backend to mark all as read
    // userAPI.markAllNotificationsRead().catch(() => {});
  };

  // Async because getVideo may be async
  const createNotification = async (creatorId: string, videoId: string) => {
    if (!currentUser) return;
    // Get the video details (async)
    const video = await getVideo(videoId);
    if (!video) return;

    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      userId: currentUser.id,
      creatorId,
      videoId,
      message: `${video.title} was uploaded by a creator you follow`,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    // Optionally, send to backend
    // await userAPI.createNotification(newNotification);
  };

  const getNotificationsForUser = () => {
    if (!currentUser) return [];
    return notifications
      .filter(n => n.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const contextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    getNotificationsForUser,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
