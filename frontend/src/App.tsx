import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Context Providers
import { VideoProvider } from './context/VideoContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import CreatorsPage from './pages/CreatorsPage';
import MyLibraryPage from './pages/MyLibraryPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import UpdatesPage from './pages/UpdatesPage';
import VideoPage from './pages/VideoPage';
import ProfilePage from './pages/ProfilePage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Use this for registration
import CreatorApplicationPage from './pages/CreatorApplicationPage';
import CreatorConfirmationPage from './pages/CreatorConfirmationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsOfService from './pages/TermsofService';


// Route protection components
import ProtectedRoute from './components/ProtectedRoute';
import CreatorProtectedRoute from './components/CreatorProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
   return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001927] via-[#011f2f] to-black relative overflow-hidden">
    
    {/* 3D Floating Glow Circles */}
    <div className="absolute top-10 left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-float1" />
    <div className="absolute bottom-16 right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-float2" />

    {/* Loader Card */}
    <div className="relative z-10 px-8 py-10 bg-white/10 border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl text-center transform hover:scale-[1.01] transition-transform duration-500">

      {/* Neon Loader Spinner */}
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-md shadow-cyan-500/30" />

      <h2 className="text-2xl font-semibold text-cyan-100 tracking-wide animate-pulse">Loading Skill Eureka...</h2>
    </div>
  </div>
);

  }

  return (
    <AuthProvider>
      <VideoProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="creators" element={<CreatorsPage />} />
              <Route path="library" element={<MyLibraryPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="updates" element={<UpdatesPage />} />
              <Route path="video/:id" element={<VideoPage />} />
              <Route path="terms-of-service" element={<TermsOfService />} />


              {/* Protected user profile */}
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Protected creator profile */}
              <Route element={<CreatorProtectedRoute />}>
                <Route path="creator/:id" element={<CreatorProfilePage />} />
              </Route>

              {/* Public routes */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="become-creator" element={<CreatorApplicationPage />} />
              <Route path="creator-confirmation" element={<CreatorConfirmationPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;




