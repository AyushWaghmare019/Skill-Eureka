import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'user' | 'creator' | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Make handleSubmit async and await login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize username before sending
    const normalizedUsername = formData.username.trim().toLowerCase();

    // Await the login function from context
    const success = await login(normalizedUsername, formData.password, loginType || 'user');

    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleTypeSelect = (type: 'user' | 'creator') => {
    setLoginType(type);
    setError('');
    setFormData({ username: '', password: '' });
  };

  if (!loginType) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card">
          <h1 className="text-2xl font-bold text-center mb-8">Welcome to Skill Eureka</h1>
          <div className="space-y-4">
            <button
              onClick={() => handleTypeSelect('user')}
              className="w-full py-3 bg-primary text-gray-800 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Login as User
            </button>
            <button
              onClick={() => handleTypeSelect('creator')}
              className="w-full py-3 bg-accent text-gray-800 rounded-lg font-medium hover:bg-accent-dark transition-colors"
            >
              Login as Creator
            </button>
            <Link to="/" className="block text-center py-2 text-gray-600 hover:text-gray-900">
              Skip to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, #001f33, #014C76)',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white/10 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/20 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-2">
          {loginType === 'user' ? 'User Login' : 'Creator Login'}
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Sign in to continue to <span className="text-blue-300 font-semibold">Skill Eureka</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-200 text-red-900 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              className="w-full px-4 py-2 bg-white text-gray-900 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full px-4 py-2 pr-10 bg-white text-gray-900 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center space-y-2 text-sm">
          <p>
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-300 hover:text-white underline">
              Sign up
            </Link>
          </p>

          {loginType === 'creator' && (
            <p>
              Want to become a creator?{' '}
              <Link to="/become-creator" className="text-blue-300 hover:text-white underline">
                Apply here
              </Link>
            </p>
          )}

          <button
            onClick={() => setLoginType(null)}
            className="mt-2 text-gray-300 hover:text-white underline transition"
          >
            Back to login options
          </button>
        </div>
      </div>
    </div>
  );



};

export default LoginPage;
