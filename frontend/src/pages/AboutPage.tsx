import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react';
import About_Bg from '../assets/About_bg.jpg';
import header from '../assets/header.jpeg';

const AboutPage = () => {
  return (
    <div className="relative w-full overflow-hidden pt-20 mb-6 bg-[#001927] text-white">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[.3] animate-fade-in"
        style={{ backgroundImage: `url(${About_Bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#001927]/90 to-black/80 backdrop-blur-sm" />

      {/* Floating Doodles */}
      <img src={header} alt="doodle" className="absolute top-10 left-10 w-16 h-16 opacity-10 animate-float1 pointer-events-none" />
      <img src={header} alt="doodle" className="absolute bottom-10 right-10 w-20 h-20 opacity-10 animate-float2 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-8 md:px-16 py-24 flex justify-center items-center">
        <div className="max-w-4xl w-full bg-white/10 border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-lg p-6 sm:p-12 transition-transform hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(0,191,255,0.25)] duration-500">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center md:text-left text-blue-300 animate-slide-in-top">
            About Skill Eureka
          </h2>

          <p className="text-base sm:text-lg leading-relaxed mb-4 text-center md:text-left text-white/90 animate-fade-in delay-100">
            Skill Eureka is a not-for-profit initiative by Bright Eureka, with a mission to make
            high-quality education accessible to everyone—completely free from ads, subscriptions, or distractions.
          </p>

          <p className="text-base sm:text-lg leading-relaxed mb-6 text-center md:text-left text-white/80 animate-fade-in delay-300">
            Built by a passionate development team from IIT Guwahati, Skill Eureka is a platform
            where educators can share content and learners can explore a library of valuable resources without barriers.
            Our goal is to build an open, inclusive ecosystem that prioritizes learning over monetization.
          </p>

          {/* Contact Info */}
          <div className="mt-8 grid gap-4 text-white/90 text-sm sm:text-base animate-fade-in delay-500">
            <div className="flex items-center gap-3 bg-[#052032]/60 p-3 rounded-xl shadow-md hover:shadow-cyan-500/20 transition-transform hover:scale-105">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>Ceobrighteureka@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 bg-[#052032]/60 p-3 rounded-xl shadow-md hover:shadow-cyan-500/20 transition-transform hover:scale-105">
              <Phone className="w-5 h-5 text-green-400" />
              <span>+91 62380 53002</span>
            </div>
            <a
              href="https://www.linkedin.com/company/bright-eureka/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#052032]/60 p-3 rounded-xl shadow-md hover:shadow-blue-500/30 transition-transform hover:scale-105"
            >
              <Linkedin className="w-5 h-5 text-blue-500" />
              <span>LinkedIn /bright-eureka</span>
            </a>
            <a
              href="https://www.instagram.com/bright_eureka_?igsh=bnZrbzFhNW1nczZ5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#052032]/60 p-3 rounded-xl shadow-md hover:shadow-pink-500/30 transition-transform hover:scale-105"
            >
              <Instagram className="w-5 h-5 text-pink-500" />
              <span>@bright_eureka_</span>
            </a>
          </div>

          <div className="mt-10 text-center animate-pop-in delay-700">
            <Link
              to="/become-creator"
              className="relative px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-lg text-white hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span className="relative z-10">Become a Creator</span>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 blur-lg opacity-50 animate-pulse pointer-events-none" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
