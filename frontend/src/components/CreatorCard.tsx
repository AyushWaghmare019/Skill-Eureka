// src/components/CreatorCard.tsx

// 1. Import React (optional for React 17+), and types if needed
import React from 'react';

// 2. Define the Creator type (or import it if you already have it)
export type Creator = {
  id: string;
  name: string;
  bio: string;
  profilePic?: string;
  // Add other fields as needed
};

// 3. Define the props interface
export interface CreatorCardProps {
  creator: Creator;
}

// 4. The CreatorCard component
const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
   <div className="card p-6 flex flex-col items-center text-center bg-[#0b1c2c] text-white rounded-xl shadow-lg border border-cyan-500/20 transition-transform duration-300 hover:scale-[1.03] hover:shadow-cyan-500/30 hover:shadow-2xl animate-fade-in backdrop-blur-sm">
  <div className="relative w-24 h-24 mb-4">
    <img
      src={creator.profilePic || '/default-profile.png'}
      alt={creator.name}
      className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400 shadow-md hover:shadow-cyan-300 transition duration-300"
    />
    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0b1c2c]" title="Active now"></div>
  </div>

  <h2 className="text-lg font-bold text-cyan-300 hover:text-cyan-400 transition">
    {creator.name}
  </h2>

  <p className="text-gray-300 text-sm mt-1 hover:text-white transition duration-300">
    {creator.bio}
  </p>

  {/* Add more details or social icons if needed */}
</div>

  );
};

export default CreatorCard;
