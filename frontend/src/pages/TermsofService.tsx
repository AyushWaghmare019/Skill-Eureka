import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001927] via-[#011f2f] to-black text-white px-6 py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto bg-[#0b1c2c]/90 backdrop-blur-lg border border-cyan-500/20 shadow-xl rounded-3xl p-8 md:p-12 transition-all duration-300 hover:shadow-cyan-500/10">
        
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-6 text-center animate-slide-in-top">
          📜 Terms and Conditions – Skill Eureka
        </h1>

        <p className="text-white/90 text-lg mb-8 text-center">
          Effective Date: <span className="text-cyan-400 font-medium">02/07/2025</span> <br />
          Platform Owner: <span className="text-cyan-400 font-medium">Bright Eureka</span>
        </p>
<p className="space-y-6 text-white/80 text-sm sm:text-base leading-relaxed">These Terms and Conditions (“Terms”) govern your access to and use of Skill Eureka, a not-for-profit educational social media platform built to promote learning, skills, and creativity among children and young adults. By using this platform, you agree to comply with and be bound by these Terms.
</p>
 <br /><br />
        <div className="space-y-6 text-white/80 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">1. Purpose of the Platform</h2>
            <p>
              Skill Eureka is developed solely for educational, skill-sharing, and community learning purposes. It is operated as a not-for-profit initiative, offering creators a platform to showcase educational content while providing users free access to quality learning materials.
              <br /><br />
              There is no monetization, no revenue sharing, and no financial benefit to creators or the platform.
              <br />
              The platform is focused on social impact, skill development, and safe education access.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">2. Eligibility</h2>
            <p>
              Skill Eureka is primarily intended for learners under the age of 18, though creators of any age may share educational content.
              <br /><br />
              By using Skill Eureka, you confirm that you are:
              <ul className="list-disc list-inside ml-4">
                <li>A learner under adult supervision (if below age of digital consent), or</li>
                <li>A content creator submitting your own original educational work.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">3. Content Ownership and License</h2>
            <p>
              All content uploaded by users remains the intellectual property of the respective creators.
              <br /><br />
              By submitting content, creators grant Skill Eureka a non-exclusive, royalty-free, worldwide license to host, display, and distribute the content for educational and promotional purposes within the platform.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">4. User Responsibility for Copyright Compliance</h2>
            <p>
              All users are solely responsible for ensuring that their content does not infringe on any copyright, trademark, or intellectual property rights.
              <br /><br />
              Skill Eureka does not accept liability for content uploaded by users.
              <br />
              If Skill Eureka receives a valid copyright infringement claim, the content in question may be removed without prior notice.
              <br />
              Repeat copyright violations may result in account suspension or permanent ban.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">5. Content Standards and Restrictions</h2>
            <p>
              To maintain the integrity and safety of the platform:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Only educational, skill-based, and age-appropriate content is allowed.</li>
                <li className="mt-2 font-medium">The following are strictly prohibited:</li>
                <ul className="list-disc list-inside ml-6">
                  <li>Adult content or sexually explicit material</li>
                  <li>Hate speech or discrimination</li>
                  <li>Political propaganda</li>
                  <li>Content promoting violence, substance use, or misinformation</li>
                </ul>
              </ul>
              <br />
              Content receiving excessive dislikes or valid reports will be reviewed and may be permanently removed. Repeat violations may result in account suspension or banning.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">6. No Monetization or Revenue Sharing</h2>
            <p>
              Skill Eureka is a zero-profit platform:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>No ad revenue is shared or earned.</li>
                <li>Creators do not receive compensation.</li>
              </ul>
              <br />
              The platform exists to give exposure to educators and creators, not income.
              <br />
              Creators may include links to their verified learning platforms (e.g., YouTube, portfolio, or course site), subject to approval and compliance with Skill Eureka’s guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">7. Platform Moderation and Governance</h2>
            <p>
              Skill Eureka reserves the right to moderate, approve, or reject any content at its discretion.
              <br /><br />
              Users violating content standards or engaging in harmful activity may be restricted, suspended, or permanently banned.
              <br />
              Moderation decisions are final and may not be appealed, except under clearly documented cases of error.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">8. Privacy and Data Use</h2>
            <p>
              Skill Eureka respects your privacy. Personal information is collected only where strictly necessary and is never sold or disclosed to third parties.
              <br /><br />
              All content is public unless explicitly marked otherwise by platform rules.
              <br />
              Children’s data is protected in accordance with Indian data protection laws.
              <br />
              Please also read our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-cyan-200 font-semibold mb-2">9. Changes to Terms</h2>
            <p>
              These Terms may be updated from time to time. Any modifications will be posted here with a revised effective date.
              <br />
              Continued use of the platform after changes are published constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section className="pt-2">
            <p className="text-white/70 italic text-center mt-6">
              Skill Eureka is a Bright Eureka initiative — where learning comes first, always.
            </p>
          </section>
        </div>
        
      </div>
    </div>
  );
};

export default TermsOfService;
