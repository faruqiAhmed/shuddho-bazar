import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { 
  Sparkles, 
  Droplet, 
  Milk, 
  Wheat, 
  Flame, 
  Sun, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface MobileCategoryScrollProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenAllCategories?: () => void;
}

export const MobileCategoryScroll: React.FC<MobileCategoryScrollProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenAllCategories,
}) => {
  // Category icon mapping
  const renderCategoryIcon = (id: string) => {
    switch (id) {
      case 'all':
        return <Layers className="w-5 h-5 text-emerald-700" />;
      case 'honey':
        return <span className="text-xl">🍯</span>;
      case 'oils':
        return <Droplet className="w-5 h-5 text-amber-600" />;
      case 'ghee':
        return <span className="text-xl">🧈</span>;
      case 'nuts':
        return <span className="text-xl">🥜</span>;
      case 'seeds':
        return <Wheat className="w-5 h-5 text-emerald-600" />;
      case 'spices':
        return <Flame className="w-5 h-5 text-rose-600" />;
      case 'dates':
        return <Sun className="w-5 h-5 text-amber-700" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="lg:hidden bg-white border-b border-stone-200/80 py-2.5 px-3 sticky top-[53px] sm:top-[61px] z-30 shadow-2xs backdrop-blur-md bg-white/95">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
          ক্যাটাগরি সমূহ (Categories)
        </span>
        {onOpenAllCategories ? (
          <button
            onClick={onOpenAllCategories}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 cursor-pointer"
          >
            <span>সব দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-emerald-700">
            {CATEGORIES.length} Categories
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5 px-0.5 scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-scroll-item-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-xs scale-102 ring-2 ring-emerald-800/20'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/70'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-emerald-700 text-white' : 'bg-white shadow-2xs'
              }`}>
                {renderCategoryIcon(cat.id)}
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="whitespace-nowrap">{cat.bengaliName}</span>
                <span className={`text-[9px] font-medium mt-0.5 ${
                  isSelected ? 'text-emerald-200' : 'text-stone-400'
                }`}>
                  {cat.name}
                </span>
              </div>
              {cat.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                  isSelected 
                    ? 'bg-amber-400 text-emerald-950' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
