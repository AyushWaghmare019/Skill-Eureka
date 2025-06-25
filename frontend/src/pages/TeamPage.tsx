/*import {Linkedin, Github } from 'lucide-react';
import { mockTeamMembers } from '../data/mockData';
import { Instagram } from 'lucide-react';

const TeamPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 ">
      <h1 className="text-3xl font-bold text-center mb-12">Our Team</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {mockTeamMembers.map(member => (
          <div key={member.id} className="bg-primary-light rounded-lg shadow-card overflow-hidden">
            <div className="h-64 bg-primary-light">
              <img 
                src={member.profilePic} 
                alt={member.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-[#4FC3F7] font-medium">{member.role}</p>
              
              <p className="mt-4 text-gray-600">
                {member.bio}
              </p>
              
              <div className="mt-6 flex space-x-4">
                {member.socialLinks.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#0077B5]  hover:bg-primary-dark rounded-lg p-1 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                
                {member.socialLinks.github && (
                  <a 
                    href={member.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                     className="text-[#0077B5]  hover:bg-primary-dark rounded-lg p-1 transition-colors"
                   
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                
 {member.socialLinks.instagram && (
                <a 
                  href={member.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077B5]  hover:bg-primary-dark rounded-lg p-1 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;*/




import { useState } from 'react';
import { Linkedin, Github, Instagram } from 'lucide-react';
import { mockTeamMembers } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '../assets/blueImg.jpeg';
import { Pencil } from 'lucide-react';
import Doodles from '../components/Doodles'; 

const TeamPage = () => {
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const founder = mockTeamMembers.find(member => member.role.toLowerCase().includes('founder'));
  const others = mockTeamMembers.filter(member => member.id !== founder?.id);

  return (
    <div
      className="min-h-screen px-4 py-12 bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
    <div className="relative text-center mb-16">
 

  <motion.h1
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className="relative text-4xl md:text-5xl font-bold text-white inline-block z-10"
  >
    Our Team

    {/* Pencil Icon */}
    <motion.span
      className="absolute -top-6 -right-10 text-blue-300"
      initial={{ rotate: -30, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <Pencil size={36} />
    </motion.span>

    {/* Underline sketch effect */}
    <motion.div
      className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 h-1 w-32 bg-white rounded-full"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ transformOrigin: 'center' }}
    />
  </motion.h1>
</div>

      {/* Founder Card Full Width */}
      {founder && (
        <motion.div
          className="mb-12 w-full max-w-6xl mx-auto backdrop-blur-md bg-white/10 rounded-2xl shadow-xl overflow-hidden relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="overflow-hidden">
              <img
                src={founder.profilePic}
                alt={founder.name}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setPopupImage(founder.profilePic)}
              />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-1 text-cyan-200">{founder.name}</h2>
              <p className="text-lg text-blue-300 font-semibold mb-2">{founder.role}</p>
              <p className="text-md text-blue-100">{founder.bio}</p>
              <div className="mt-4 flex space-x-4">
                {founder.socialLinks.linkedin && (
                  <a href={founder.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-6 w-6 text-blue-400 hover:text-white transition" />
                  </a>
                )}
                {founder.socialLinks.github && (
                  <a href={founder.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-6 w-6 text-blue-400 hover:text-white transition" />
                  </a>
                )}
                {founder.socialLinks.instagram && (
                  <a href={founder.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-6 w-6 text-blue-400 hover:text-white transition" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {others.map(member => (
          <motion.div
            key={member.id}
            className="relative rounded-2xl overflow-hidden backdrop-blur-lg bg-white/10 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <img
              src={member.profilePic}
              alt={member.name}
              className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setPopupImage(member.profilePic)}
            />
            <div className="p-5 relative z-10">
              <h3 className="text-2xl font-semibold text-blue-100">{member.name}</h3>
              <p className="text-blue-300 mb-2">{member.role}</p>
              <p className="text-blue-100 text-sm mb-4">{member.bio}</p>
              <div className="flex space-x-4">
                {member.socialLinks.linkedin && (
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5 text-blue-400 hover:text-white transition" />
                  </a>
                )}
                {member.socialLinks.github && (
                  <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5 text-blue-400 hover:text-white transition" />
                  </a>
                )}
                {member.socialLinks.instagram && (
                  <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-blue-400 hover:text-white transition" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Popup */}
      <AnimatePresence>
        {popupImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupImage(null)}
          >
            <motion.img
              src={popupImage}
              alt="Popup"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl border-4 border-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
