import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001927] via-[#011f2f] to-black text-white px-6 py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto bg-[#0b1c2c]/90 backdrop-blur-lg border border-cyan-500/20 shadow-xl rounded-3xl p-8 md:p-12 transition-all duration-300 hover:shadow-cyan-500/10">
        
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-6 text-center animate-slide-in-top">
          📜 Terms of Service
        </h1>

        <p className="text-white/90 text-lg mb-8 text-center">
          Welcome to <span className="font-semibold text-cyan-400">Skill Eureka</span>. By using our platform, you agree to the following terms and conditions that govern your use of our services.
        </p>

        <div className="space-y-6 text-white/80 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Skill Eureka, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">2. Use of Platform</h2>
            <p>
              Our platform is provided for educational purposes only. You agree to use it lawfully and not to engage in any harmful, offensive, or illegal activities.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">3. Content Ownership</h2>
            <p>
              All content uploaded by creators remains their intellectual property. By uploading content, you grant us a non-exclusive license to display and distribute your materials to learners.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">4. Privacy</h2>
            <p>
              We are committed to protecting your data. Please refer to our <Link to="/privacy-policy" className="text-cyan-400 underline">Privacy Policy</Link> for full details.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts found violating our community guidelines or misusing the platform.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">6. Changes to Terms</h2>
            <p>
              We may update these terms periodically. Continued use of the platform after updates means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">7. Contact Us</h2>
            <p>
              For any questions or concerns regarding these terms, please reach out to us at <a href="mailto:ceobrighteureka@gmail.com" className="text-cyan-400 underline">ceobrighteureka@gmail.com</a>.
            </p>
          </section>
        </div>

        
      </div>
    </div>
  );
};

export default TermsOfService;
