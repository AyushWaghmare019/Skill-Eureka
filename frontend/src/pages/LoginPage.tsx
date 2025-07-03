import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loginType, setLoginType] = useState<'user' | 'creator' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Normalize username before sending to backend
      const normalizedUsername = formData.username.trim().toLowerCase();
      const password = formData.password; // send as-is

      if (!loginType) {
        setError('Please select login type.');
        setLoading(false);
        return;
      }

      const success = await login(normalizedUsername, password, loginType);
      if (success) {
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        // @ts-ignore
        err.code === 'ECONNABORTED'
      ) {
        setError('Server timeout. Please try again later.');
      } else if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        // @ts-ignore
        err.response &&
        typeof err.response === 'object' &&
        // @ts-ignore
        'data' in err.response
      ) {
        // @ts-ignore
        setError(err.response.data?.message || err.response.data?.error || 'Login failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type: 'user' | 'creator') => {
    setLoginType(type);
    setFormData({ username: '', password: '' });
    setError('');
  };

  if (!loginType) {
   return (
  <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-[#001F33] to-[#014C76] px-4">
    <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold text-center mb-10">Welcome to <span className="text-[#3ec2ff]">Skill Eureka</span></h1>

      <div className="space-y-5">
        {/* User Button */}
        <button
          onClick={() => handleTypeSelect('user')}
          className="w-full py-3 px-6 bg-[#014C76] hover:bg-[#016397] text-white font-semibold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Login as User
        </button>

        {/* Creator Button */}
        <button
          onClick={() => handleTypeSelect('creator')}
          className="w-full py-3 px-6 bg-[#013b5b] hover:bg-[#01507a] text-white font-semibold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Login as Creator
        </button>

        {/* Skip Button */}
        <a
          href="/"
          className="w-full block py-3 px-6 bg-[#c7d5d8] hover:bg-[#9fbfc4] text-gray-800 text-center font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Skip to Home
        </a>
      </div>
    </div>
  </div>
);

  }

  
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "linear-gradient(to bottom right, #001f33, #014C76)",
      }}
    >
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl text-white animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-2">
          {loginType === 'user' ? 'User Login' : 'Creator Login'}
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Sign in to continue to <span className="text-blue-300 font-semibold">Skill Eureka</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2 text-sm">
          <a href="/forgot-password" className="text-blue-300 hover:text-white underline">
            Forgot password?
          </a>
          <p>
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-300 hover:text-white underline">
              Sign up
            </a>
          </p>
          {loginType === 'creator' && (
            <p>
              Want to become a creator?{' '}
              <a href="/become-creator" className="text-blue-300 hover:text-white underline">
                Apply here
              </a>
            </p>
          )}
          <button
            onClick={() => setLoginType(null)}
            className="mt-3 text-gray-300 hover:text-white underline transition duration-200"
          >
            Back to login options
          </button>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card">
        <h1 className="text-2xl font-bold text-center mb-2">
          {loginType === 'user' ? 'User Login' : 'Creator Login'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue to Skill Eureka
        </p>
        {error && (
          <div className="mb-4 p-3 bg-error-light text-error-dark rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              className="input"
              required
              autoComplete="username"
              aria-label="Username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="input"
              required
              autoComplete="current-password"
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary-DEFAULT text-gray-800 rounded-md font-medium hover:bg-primary-dark transition-colors"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline block mb-2">
            Forgot password?
          </a>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-primary-dark hover:underline">
              Sign up
            </a>
          </p>
          {loginType === 'creator' && (
            <p className="mt-2 text-gray-600">
              Want to become a creator?{' '}
              <a href="/become-creator" className="text-primary-dark hover:underline">
                Apply here
              </a>
            </p>
          )}
          <button
            onClick={() => setLoginType(null)}
            className="mt-4 text-gray-600 hover:text-gray-900"
          >
            Back to login options
          </button>
        </div>
      </div>
    </div>
  ); 
};

export default LoginPage;
