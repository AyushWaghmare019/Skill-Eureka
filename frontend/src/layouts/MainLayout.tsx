import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, X, Home, Users, Library, Info, Users2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import header from '../assets/header.jpeg';
import clsx from 'clsx';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const showBackLink = location.pathname !== '/' && !location.pathname.includes('/login') && !location.pathname.includes('/signup');
  const showBackToCreators = location.pathname.includes('/creator/');
 
  return (
    <div className="flex flex-col min-h-screen  ">
    
         
            
            
       <header className={`sticky top-0 z-50 header-shimmer bg-[#001927] text-white px-4 py-2 md:px-8 md:py-4  backdrop-blur-md shadow-[0_2px_10px_rgba(255,255,255,0.6)] transition duration-300 ${isScrolled ? 'shadow-[0_6px_15px_rgba(255,255,255,0.3)]' : ''}`}>
  <div className="relative overflow-hidden">
    {/* Animated floating doodle shapes */}
    <div className="absolute -top-4 -left-10 animate-float1 opacity-10 pointer-events-none">
      <img src={header} alt="doodle" className="w-20 h-20" />
    </div>
    <div className="absolute -bottom-4 right-0 animate-float2 opacity-10 pointer-events-none">
      <img src={header} alt="doodle" className="w-16 h-16" />
    </div>

    <div className="container mx-auto px-2 md:px-4">
      <div className="flex items-center justify-between h-16 relative">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group p-2 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hover:scale-110 hover:shadow-lg transition-all"
          >
            <Menu className="h-6 w-6 text-white transition-all duration-300 group-hover:rotate-12" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img src="/src/assets/logo2.png" alt="Skill Eureka" className="h-10 w-10 rounded-lg" />
            <span className="ml-2 text-xl font-semibold text-shiny tracking-wider">Skill Eureka</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
       <nav className="hidden md:flex items-center gap-6 font-semibold text-base">
  {[
    { to: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { to: '/creators', label: 'Community', icon: <Users className="h-5 w-5" /> },
    { to: '/library', label: 'My Library', icon: <Library className="h-5 w-5" /> },
    { to: '/about', label: 'About', icon: <Info className="h-5 w-5" /> },
    { to: '/team', label: 'Team', icon: <Users2 className="h-5 w-5" /> }
  ].map(({ to, label, icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        key={label}
        className={clsx(
          'group flex items-center gap-1 px-3 py-1 rounded-lg transition-all duration-300 relative',
          'hover:scale-[1.05] hover:text-blue-400 hover:shadow-lg',
          isActive
            ? 'text-blue-400 shadow-[inset_0_-2px_5px_rgba(0,0,0,0.4)] bg-white/5'
            : 'text-white'
        )}
      >
        {icon}
        <span>{label}</span>
        <span
          className={clsx(
            'absolute -bottom-1 left-0 h-0.5 bg-blue-400 transition-all duration-300',
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          )}
        />
      </Link>
    );
  })}

  {/* Notifications */}
  <Link to="/updates" className="relative">
    <Bell className="h-6 w-6 text-white hover:text-blue-500 transition-colors" />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </Link>

  {/* User Avatar */}
  {isAuthenticated ? (
    <Link to="/profile">
      <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-blue-400 hover:scale-105 transition-transform duration-200">
        <img
          src={currentUser?.profilePic || 'https://via.placeholder.com/40'}
          alt={currentUser?.name || 'User'}
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  ) : (
    <Link to="/login" className="btn btn-primary px-3 py-1 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:scale-105 transition-transform duration-300">
      Sign In
    </Link>
  )}
</nav>









        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/updates">
            <Bell className="h-6 w-6 text-white" />
          </Link>
          {isAuthenticated ? (
            <Link to="/profile">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img
                  src={currentUser?.profilePic || 'https://via.placeholder.com/40'}
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          ) : (
            <Link to="/login">
              <User className="h-6 w-6 text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* Back Navigation */}
      {showBackLink && (
        <div className="mt-2">
          <Link
            to={showBackToCreators ? "/creators" : "/"}
            className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-all hover:translate-x-1 duration-300"
          >
            ← Back to {showBackToCreators ? 'Creators' : 'Home'}
          </Link>
        </div>
      )}
    </div>
  </div>

</header>











      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className=" fixed inset-0  bg-opacity-50 z-50 md:hidden ">
          <div className={`bg-[#001927] h-full w-64 shadow-xl p-5 space-x-4 relative transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <div className="flex justify-between items-center mb-6 space-x-4">
              <Link to="/" className="flex items-center ">
                <img src="/src/assets/logo2.png" alt="Skill Eureka" className="h-6 w-6 rounded-lg" />
                <span className="ml-2 text-lg  text-white  font-md  ">Skill Eureka</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-3 m-0 px-4 py-3 rounded-xl bg-[#03202e] hover:bg-[#043245] hover:scale-105 hover:text-white active:translate-y-0.5 transition-all duration-300 shadow-md"
>
                <X className="h-6 w-6" />
              </button>
            </div>
                      
            <nav className="flex flex-col space-y-4 px-4 py-4 text-white">
              <Link to="/" className="flex items-center gap-3 m-0 px-4 py-3 rounded-xl bg-[#03202e] hover:bg-[#043245] hover:scale-105 hover:text-white active:translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <Home className="h-5 w-5 text-gray-300 " />
                <span className="font-medium text-gray-300 hover:text-white">Home</span>
              </Link>
              <Link to="/creators" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#03202e] hover:bg-[#043245] hover:scale-105 active:translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <Users  className="h-5 w-5 text-white" />
                <span className="font-medium text-gray-300 hover:text-white">Community</span>
              </Link>
              <Link to="/library" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#03202e] hover:bg-[#043245] hover:scale-105 active:translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <Library className="h-5 w-5 text-white" />
                <span className="font-medium text-gray-300 hover:text-white">My Library</span>
              </Link>
              <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#03202e] hover:bg-[#043245] hover:scale-105 active:translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <Info className="h-5 w-5 text-white" />
                <span className="font-medium text-gray-300 hover:text-white">About</span>
              </Link>
              <Link to="/team" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#03202e] hover:bg-[#043245] hover:scale-105 active:translate-y-0.5 transition-all duration-300 shadow-md"
              >
                < Users2 className="h-5 w-5 text-white" />
                <span className="font-medium text-gray-300 hover:text-white">Team</span>
              </Link>
            </nav>

            <div className="absolute bottom-8 left-0 right-0 px-5">
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2">
                  <Link to="/login\" className="btn btn-primary text-center">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-secondary text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 shadow-[0_3px_10px_rgba(255,255,255,0.6)] shiny-gradient text-white">
        <Outlet />
      </main>


      {/* Footer */}
      <footer className="bg-[#001927] text-white px-4 py-3 md:px-10 md:py-6  mt-[-5px] shadow-[0_-4px_12px_rgba(255,255,255,0.2)]">

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center justify-center md:justify-start">
                <img src="/src/assets/logo2.png" alt="Skill Eureka" className="h-6 w-6 rounded-lg" />
                <span className="ml-2 text-lg font-semibold text-white ">Skill Eureka</span>
              </Link>
              <p className="text-sm text-gray-500 mt-1">Education for everyone, completely free</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-6">

              <Link to="/become-creator" className="text-gray-300 hover:text-primary-dark transition-colors">
                Become a Creator
              </Link>
              <a href="#" className="text-gray-300 hover:text-primary-dark transition-colors">
                Privacy Policy
              </a>
             <Link to="/terms-of-service">Terms of Service</Link>

            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Skill Eureka. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;