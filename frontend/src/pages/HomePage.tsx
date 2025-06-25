import { useState, useEffect } from 'react';
import { useVideos } from '../context/VideoContext';
import CategoryBar from '../components/CategoryBar';
import VideoGrid from '../components/VideoGrid';
import CustomUploadButton from '../components/CustomUploadButton'; // <-- Import it

const HomePage = () => {
  const { videos, getVideosByCategory } = useVideos();
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchFilteredVideos = async () => {
      let results = [];
      if (selectedCategory === 'all') {
        results = videos;
      } else {
        results = await getVideosByCategory(selectedCategory);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(video =>
          video.title.toLowerCase().includes(query)
        );
      }

      results = [...results].sort((a, b) => {
        const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
        const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
        return dateB - dateA;
      });

      setFilteredVideos(results);
    };

    fetchFilteredVideos();
  }, [videos, searchQuery, selectedCategory, getVideosByCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

 /* return (
    <div className="container mx-auto px-4 py-6">
      {/* Upload Button for Creators }
      <CustomUploadButton />

      {/* Search Bar }
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search videos..."
        className="input px-43 rounded-lg "
      />
      <div className="md:block max-w-xl mx-auto mb-6"></div>
      
      {/* Categories }
      <CategoryBar onCategorySelect={handleCategorySelect} />
      <div className='text-center font-semiBold text-lg'> Top Videos</div>
      {/* Videos Grid }
      <div className="mt-8 bg- rounded-lg p-8 text-center  ">
        <VideoGrid 
          videos={filteredVideos}
          columns={4} 
       //   title="Top Videos"
        />
      </div>
    </div>
  );
  */

  return (
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Upload Button */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white">Explore Top Videos</h1>
      
    </div>

    {/* Search Input */}
    <div className="mb-zy">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search videos..."
        className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-gray-100 text-white placeholder-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Category Filter */}
    <CategoryBar onCategorySelect={handleCategorySelect} />

    {/* Section Title */}

<div className="relative mt-2   mb-[2px] px-6 py-10 rounded-2xl overflow-hidden text-center bg-[#0B1D2C] border border-purple-500/20 shadow-2xl">

  {/* ✨ Background Glow */}
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent)] blur-2xl" />

  {/* 🎨 Doodles and Abstract Lines */}
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Pencil */}
    <svg className="absolute top-6 left-6 w-6 h-6 text-pink-400 opacity-40 animate-bounce-slow" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>

    {/* Sparkle */}
    <svg className="absolute bottom-6 right-8 w-5 h-5 text-yellow-300 opacity-30 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l1.09 3.41L16 6l-2.91 2.09L14 12l-2-1.5L10 12l.91-3.91L8 6l2.91-.59L12 2z" />
    </svg>

    {/* Ruler */}
    <svg className="absolute top-10 right-12 w-7 h-7 text-blue-400 opacity-25 animate-float" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 17.25V21h3.75L21 6.75l-3.75-3.75L3 17.25z" />
    </svg>

    {/* Line Graph */}
    <svg className="absolute bottom-10 left-12 w-6 h-6 text-purple-300 opacity-25 animate-float" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 17l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>

    {/* ✏️ Abstract lines (like pencil strokes) */}
    <div className="absolute top-12 left-[45%] w-20 h-0.5 bg-purple-400 rotate-12 opacity-20"></div>
    <div className="absolute bottom-12 right-[20%] w-24 h-0.5 bg-pink-300 -rotate-12 opacity-25"></div>
    <div className="absolute top-1/2 left-[10%] w-16 h-0.5 bg-indigo-300 rotate-45 opacity-20"></div>
    <div className="absolute bottom-4 left-[60%] w-14 h-0.5 bg-blue-400 -rotate-45 opacity-15"></div>
  </div>

  {/*  Title Content */}
  <h2 className="text-4xl md:text-5xl font-extrabold text-transparent  bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-300  drop-shadow-md text-shiny2">
    Top Videos
  </h2>
  <p className="text-sm mt-2 italic text-gray-50 tracking-wide">
     Trending content curated just for you 
  </p>
</div>

{/* Videos Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
  <VideoGrid videos={filteredVideos} columns={4} />
</div>








   
  </div>
);

};

export default HomePage;
