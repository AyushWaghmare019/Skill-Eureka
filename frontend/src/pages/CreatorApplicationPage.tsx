import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatorApplicationPage = () => {
  const navigate = useNavigate();
  const { applyAsCreator } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    youtubeChannel: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.reason) {
      setError('Name, email, and reason are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Just await the application, do NOT expect a code in response
      await applyAsCreator({
        name: formData.name,
        email: formData.email,
        youtubeChannel: formData.youtubeChannel,
        reason: formData.reason,
      });

      setSubmitted(true);
    } catch (error) {
      setError('An error occurred during application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#031B33] to-[#00111D] text-white px-4">
        <div className="max-w-md bg-[#0b1c2c]/80 rounded-2xl p-8 shadow-lg border border-cyan-500/30 text-center">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Application Received!</h2>
          <p className="mb-4">
            Thank you for applying to become a creator. Our team will review your application and contact you with a confirmation code if you are accepted.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 bg-cyan-400 text-[#0b1c2c] rounded-lg font-semibold shadow hover:bg-cyan-500 transition"
          >
            ⏮️ Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Why Join Section */}
        <div className="bg-[#0b1c2c] text-white rounded-2xl shadow-xl p-10 mb-10 border border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]">
          <h1 className="text-3xl font-bold text-center mb-8 text-cyan-400 animate-fade-in">
            Why EdTech Creators Should Join Skill Eureka
          </h1>
          <ul className="space-y-5 mb-10">
            {[
              ["🎯 Support a Mission-Driven Platform", "Help make education truly free and accessible, especially for underserved communities."],
              ["📚 Reach a Dedicated Learner Base", "Your content reaches learners who are focused and not distracted by ads or paywalls."],
              ["🚀 Grow Your Personal Brand", "Users can access your social media profiles directly from the platform—bringing you organic reach."],
              ["📈 Get Long-Term Visibility", "Content stays relevant without pressure from algorithms or ads."],
              ["🎓 Gain Credibility", "Be part of a platform developed by IIT Guwahati and Bright Eureka."],
              ["📖 Leave a Legacy", "Your content contributes to a permanent library for future learners."],
              ["🤝 Join a Like-Minded Community", "Collaborate with other passionate educators."],
            ].map(([title, desc], i) => (
              <li className="flex items-start space-x-3 animate-slide-in" key={i}>
                <div className="h-6 w-6 rounded-full bg-cyan-400 flex items-center justify-center text-[#0b1c2c] font-extrabold text-sm">✓</div>
                <p>
                  <strong className="text-cyan-300">{title}:</strong> {desc}
                </p>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <a href="#apply" className="bg-cyan-400 hover:bg-cyan-500 transition px-8 py-3 text-lg rounded-md font-semibold text-[#0b1c2c] shadow-md animate-pulse">
              Become a Creator
            </a>
          </div>
        </div>

        {/* Application Form */}
        <div id="apply" className="bg-[#0b1c2c] text-white rounded-2xl shadow-xl p-10 border border-blue-500/20 backdrop-blur-lg animate-fade-in-slow">
          <h2 className="text-2xl font-bold text-center mb-6 text-cyan-300">
            Creator Application Form
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1">Full Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-[#102132] border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-[#102132] border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="youtubeChannel" className="block text-sm font-semibold mb-1">YouTube Channel (if any)</label>
              <input
                type="url"
                id="youtubeChannel"
                name="youtubeChannel"
                value={formData.youtubeChannel}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-[#102132] border border-cyan-500 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="https://youtube.com/channel/..."
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-semibold mb-1">Why do you want to become a creator?*</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleFormChange}
                className="w-full px-4 py-3 bg-[#102132] border border-cyan-500 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-[#0b1c2c] font-semibold rounded-lg shadow-lg transition duration-300"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>

            <div className="mt-4 text-center text-sm text-gray-400">
              By applying, you agree to our <a href="#" className="text-cyan-300 hover:underline">Terms of Service</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatorApplicationPage;
