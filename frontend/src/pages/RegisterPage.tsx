import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.js';

type FormState = {
  [key: string]: string | boolean;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  bio: string;
  profilePic: string;
  isCreator: boolean;
  youtubeChannel: string;
  instagramHandle: string;
  linkedinProfile: string;
  confirmationCode: string;
};

const RegisterPage = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    bio: '',
    profilePic: '',
    isCreator: false,
    youtubeChannel: '',
    instagramHandle: '',
    linkedinProfile: '',
    confirmationCode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' && 'checked' in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Password confirmation check
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // For creators, require confirmation code
    if (form.isCreator && !form.confirmationCode.trim()) {
      setError('Confirmation code is required for creator registration.');
      return;
    }

    setLoading(true);

    try {
      // Normalize username and email before sending to backend
      const normalizedUsername = form.username.trim().toLowerCase();
      const normalizedEmail = form.email.trim().toLowerCase();

      // Build payload with normalized username/email, DO NOT trim/lowercase password!
      const registrationPayload = {
        ...form,
        username: normalizedUsername,
        email: normalizedEmail,
        password: form.password,
        confirmPassword: form.confirmPassword
      };

      if (form.isCreator) {
        await authAPI.registerCreator(registrationPayload);
        setSuccess('Creator registered successfully! You can now log in.');
      } else {
        await authAPI.registerUser(registrationPayload);
        setSuccess('User registered successfully! You can now log in.');
      }
      setTimeout(() => {
  setLoading(false); // stop showing "Registering..."
  navigate('/login');
}, 1500);
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response
      ) {
        // @ts-ignore
        setError(err.response.data?.message || 'Registration failed. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    // Basic validation for required fields
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.name ||
      loading
    ) return false;
    // For creators, confirmation code is required
    if (form.isCreator && !form.confirmationCode.trim()) return false;
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001F3F] to-[#014C76] px-4">
      <form
        className="bg-[#0B1E2D] text-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center tracking-wide">
          {form.isCreator ? 'Register as Creator' : 'Register as User'}
        </h2>

        {(error || success) && (
          <div className={`mb-4 text-center font-medium ${error ? 'text-red-400' : 'text-green-400'}`}>
            {error || success}
          </div>
        )}

        {/* Inputs */}
        {[
          { label: "Username", name: "username", type: "text", autoComplete: "username" },
          { label: "Email", name: "email", type: "email", autoComplete: "email" },
          { label: "Password", name: "password", type: "password", autoComplete: "new-password" },
          { label: "Confirm Password", name: "confirmPassword", type: "password", autoComplete: "new-password" },
          { label: "Name", name: "name", type: "text" },
        ].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block mb-1 font-semibold">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name] as string}
              onChange={handleChange}
              required
              autoComplete={field.autoComplete || ""}
              className="w-full px-4 py-2 bg-[#15334A] text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        ))}

        {/* Bio */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            name="bio"
            value={form.bio as string}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#15334A] text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        {/* Profile Pic */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Profile Picture URL</label>
          <input
            type="text"
            name="profilePic"
            value={form.profilePic as string}
            onChange={handleChange}
            placeholder="https://example.com/profile.jpg"
            className="w-full px-4 py-2 bg-[#15334A] text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        {/* Creator Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isCreator"
            name="isCreator"
            checked={!!form.isCreator}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isCreator" className="font-medium">
            Register as Creator
          </label>
        </div>

        {/* Creator-only fields */}
        {form.isCreator && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">YouTube Channel</label>
              <input
                type="text"
                name="youtubeChannel"
                value={form.youtubeChannel as string}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#15334A] text-white rounded-lg border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Instagram Handle</label>
              <input
                type="text"
                name="instagramHandle"
                value={form.instagramHandle as string}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#15334A] text-white rounded-lg border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">LinkedIn Profile</label>
              <input
                type="text"
                name="linkedinProfile"
                value={form.linkedinProfile as string}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#15334A] text-white rounded-lg border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            {/* Confirmation Code */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-cyan-300">Confirmation Code*</label>
              <input
                type="text"
                name="confirmationCode"
                value={form.confirmationCode as string}
                onChange={handleChange}
                required={!!form.isCreator}
                className="w-full px-4 py-2 bg-[#15334A] text-white rounded-lg border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="Enter the code you received via email"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#00A6FB] hover:bg-[#0091e6] active:translate-y-1 text-white py-2 mt-4 rounded-lg font-semibold tracking-wide transition-all duration-300"
          disabled={!isFormValid()}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">Log in</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
