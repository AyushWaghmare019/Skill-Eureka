import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatorConfirmationPage = () => {
  const navigate = useNavigate();
  const { verifyCreator } = useAuth();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem('pendingCreatorEmail');
    const name = sessionStorage.getItem('pendingCreatorName');
    if (!email) {
      navigate('/become-creator');
      return;
    }
    setCreatorEmail(email);
    setCreatorName(name || '');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmationCode.trim()) {
      setError('Please enter your confirmation code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const success = await verifyCreator(creatorEmail, confirmationCode);
      if (success) {
        // Store code for registration page (optional)
        sessionStorage.setItem('pendingCreatorCode', confirmationCode);
        navigate('/register'); // Go to creator registration page
      } else {
        setError('Invalid or expired confirmation code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#061c30] to-[#0f2e4f] px-4">
      <div className="w-full max-w-md p-8 bg-[#0b1c2c]/80 text-white rounded-2xl shadow-2xl border border-cyan-500/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] animate-fade-in-slow">
        <h1 className="text-3xl font-bold text-center mb-3 text-cyan-300">
          🔐 Verify Your Account
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Thanks for your application{creatorName ? `, ${creatorName}` : ''}! Please check your email for a confirmation code.
        </p>

        <div className="mb-6 p-4 rounded-lg bg-[#102132] border border-cyan-500/20 text-cyan-100 shadow-inner animate-slide-in">
          <p>
            📬 Our team will review your details and send a confirmation code to <strong className="text-cyan-300">{creatorEmail}</strong> if your application is accepted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className="mb-6">
            <label htmlFor="confirmationCode" className="block text-sm font-semibold text-cyan-300 mb-1">
              🔑 Confirmation Code
            </label>
            <input
              type="text"
              id="confirmationCode"
              value={confirmationCode}
              onChange={(e) => {
                setConfirmationCode(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 bg-[#102132] text-white border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 transition placeholder:text-gray-400 shadow-md"
              placeholder="Enter your code"
              maxLength={16}
              autoComplete="off"
              disabled={loading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-[#0b1c2c] font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? 'Verifying...' : '✅ Verify Code'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-cyan-200 hover:text-cyan-400 text-sm transition hover:underline"
          >
            ⏭️ Skip to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatorConfirmationPage;
