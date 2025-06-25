import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const UpdatesPage = () => {
  const { getNotificationsForUser, markAllAsRead, unreadCount } = useNotifications();
  const { isAuthenticated } = useAuth();

  const notifications = getNotificationsForUser();

  useEffect(() => {
    if (isAuthenticated) {
      markAllAsRead();
    }
  }, [isAuthenticated, markAllAsRead]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D] text-white text-center animate-fadeIn px-4">
        <h1 className="text-3xl font-bold mb-4">🔔 Updates</h1>
        <p className="mb-6">Please sign in to see your notifications</p>
        <Link to="/login" className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all shadow-xl hover:scale-105">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031B33] to-[#00111D] text-white px-4 py-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold drop-shadow-lg">🔔 Updates</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm bg-white/20 text-white backdrop-blur-sm shadow-md">
              <Bell className="h-4 w-4 mr-2" />
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3 animate-pulse" />
              <h3 className="text-xl font-medium text-white">No notifications</h3>
              <p className="text-gray-400 mt-1">
                Follow creators to get updates when they upload new videos
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {notifications.map(notification => (
                <li key={notification.id} className={`p-4 hover:bg-white/10 transition-colors duration-300 ease-in-out ${!notification.isRead ? 'bg-purple-900/30' : ''}`}>
                  <Link to={`/video/${notification.videoId}`} className="block">
                    <p className="text-white text-base font-medium">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 italic">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatesPage;