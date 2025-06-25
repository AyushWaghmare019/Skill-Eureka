import { useState } from 'react';
import { useVideos, Category } from '../context/VideoContext';

interface CategoryBarProps {
  onCategorySelect: (categoryId: string) => void;
}

const CategoryBar = ({ onCategorySelect }: CategoryBarProps) => {
  const { categories = [] } = useVideos();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    onCategorySelect(categoryId === selectedCategory ? 'all' : categoryId);
  };

  return (
  <div className="w-full overflow-x-auto mt-[5px] py-6 bg-[#061c30] rounded-xl shadow-inner">
  {/* Category Icons */}
  <div className="flex space-x-4 px-6 min-w-max animate-slide-in">
    {categories.map((category: Category) => (
      <button
        key={category.id}
        title={category.name} // Tooltip on hover
        onClick={() => handleCategoryClick(category.id)}
        className={`
          category-icon transition-all duration-300 ease-in-out transform
          hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:animate-bounce-slow
          ${selectedCategory === category.id
            ? 'ring-2 ring-cyan-400 bg-gradient-to-br from-cyan-400 to-cyan-600 text-[#0b1c2c]'
            : 'bg-[#102132] text-cyan-100 border border-cyan-500/20'}
          rounded-full w-14 h-14 flex items-center justify-center text-xl font-semibold shadow-md
        `}
      >
        {category.icon}
      </button>
    ))}
  </div>

  {/* Category Names */}
  <div className="flex space-x-4 px-6 mt-3 min-w-max animate-fade-in text-center">
    {categories.map((category: Category) => (
      <div
        key={category.id}
        className="w-16 md:w-20 text-xs font-medium text-cyan-200"
      >
        {category.name}
      </div>
    ))}
  </div>
</div>


  );
};

export default CategoryBar;
