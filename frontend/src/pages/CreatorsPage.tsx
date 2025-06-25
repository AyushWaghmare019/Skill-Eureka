import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatorProfile from '../components/CreatorProfile';

const CreatorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCreator, currentUser, logout } = useAuth();
  const [creator, setCreator] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const creatorData = await getCreator(id);
          if (!creatorData) {
            setError('No creators found.');
            setCreator(null);
          } else {
            setCreator(creatorData);
            setIsOwner(!!(currentUser?.isCreator && currentUser.id === id));
          }
        } else {
          setError('No creators found.');
          setCreator(null);
        }
      } catch (err) {
        setError('Failed to fetch creator data');
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [id, getCreator, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D]">
        <div className="backdrop-blur-lg bg-white/20 px-8 py-6 rounded-2xl shadow-2xl border border-white/20 text-white animate-pulse text-xl font-medium">
          Loading creator profile...
        </div>
      </div>
    );
  }

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
              logout?.();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!creator) {
    // Instead of redirecting, show a friendly message.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D] text-white text-center px-4">
        <div className="max-w-md bg-[#0b1c2c]/80 rounded-2xl p-6 shadow-lg border border-cyan-500/30">
          <h2 className="text-2xl font-semibold mb-4">No creators found.</h2>
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
              logout?.();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#031B33] to-[#00111D] min-h-screen relative overflow-hidden text-white">
      {/* Decorative floating shapes for 3D feeling */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl animate-float-slow z-0"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-cyan-400 rounded-full opacity-10 blur-2xl animate-float-delay z-0"></div>

      {/* Upload Button */}
      {isOwner && (
        <div className="p-4 z-10 relative">
          <button
            className="px-6 py-3 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            onClick={() => alert('Show upload video form or navigate to upload page')}
          >
            ⬆️ Upload Video
          </button>
        </div>
      )}

      {/* Profile Component */}
      <div className="px-4 pb-10 z-10 relative animate-fadeIn">
        <CreatorProfile creatorId={id || ''} isOwner={isOwner} />
      </div>
    </div>
  );
};

export default CreatorProfilePage;
