import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.js';

const ForgotPasswordPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    newPassword: '',
    isCreator: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (form.isCreator) {
        await authAPI.forgotPasswordCreator(
          form.email,
          form.username,
          form.newPassword
        );
        setSuccess('✅ Password reset successful! You can now log in as creator.');
      } else {
        await authAPI.forgotPassword(
          form.email,
          form.username,
          form.newPassword
        );
        setSuccess('✅ Password reset successful! You can now log in as user.');
      }
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        '❌ Password reset failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031B33] to-[#00111D] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md animate-fadeIn"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight drop-shadow-lg">
          🔐 Reset Password
        </h2>

        {error && <div className="text-red-400 text-center mb-4 animate-pulse">{error}</div>}
        {success && <div className="text-green-400 text-center mb-4 animate-bounce">{success}</div>}

        <label className="block text-white font-medium mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 rounded-xl bg-white/90 text-black shadow-inner focus:shadow-lg focus:outline-none transition duration-300"
        />

        <label className="block text-white font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 rounded-xl bg-white/90 text-black shadow-inner focus:shadow-lg focus:outline-none transition duration-300"
        />

        <label className="block text-white font-medium mb-1">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 rounded-xl bg-white/90 text-black shadow-inner focus:shadow-lg focus:outline-none transition duration-300"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="isCreator"
            checked={form.isCreator}
            onChange={handleChange}
            id="isCreator"
            className="mr-2 scale-110 accent-purple-500"
          />
          <label htmlFor="isCreator" className="text-white font-medium">I am a Creator</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-xl transform hover:scale-[1.03] transition-all duration-300 hover:shadow-2xl"
        >
          {loading ? '🔄 Resetting...' : 'Reset Password'}
        </button>

        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-white hover:underline hover:text-purple-300 transition duration-300"
          >
            🔙 Back to Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
