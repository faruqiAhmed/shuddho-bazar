import React from 'react';
import { CATEGORIES } from '../data/mockData';

// Hand-drawn artisan illustrated category icons matching screenshot
import gheeImg from '../assets/images/cat_ghee_jar_1789556518945.jpg';
import organicImg from '../assets/images/cat_organic_oil_1789556533988.jpg';
import honeyImg from '../assets/images/cat_honey_pot_1789556546160.jpg';
import datesImg from '../assets/images/cat_dates_plate_1789556556720.jpg';
import spicesImg from '../assets/images/cat_spice_bowl_1789556569183.jpg';
import nutsImg from '../assets/images/cat_nuts_bowl_1789556582652.jpg';

interface CategoryItemConfig {
  id: string;
  primaryLabel: string;
  bengaliSubtitle: string;
  image: string;
  itemCount: number;
}

const CATEGORY_ITEMS: CategoryItemConfig[] = [
  {
    id: 'ghee',
    primaryLabel: 'Oil & Ghee',
    bengaliSubtitle: 'ঘি ও তেল',
    image: gheeImg,
    itemCount: 4,
  },
  {
    id: 'seeds',
    primaryLabel: 'Organic',
    bengaliSubtitle: 'অর্গানিক সিডস',
    image: organicImg,
    itemCount: 3,
  },
  {
    id: 'honey',
    primaryLabel: 'Honey',
    bengaliSubtitle: 'খাঁটি মধু',
    image: honeyImg,
    itemCount: 4,
  },
  {
    id: 'dates',
    primaryLabel: 'Dates',
    bengaliSubtitle: 'খেজুর ও গুড়',
    image: datesImg,
    itemCount: 3,
  },
  {
    id: 'spices',
    primaryLabel: 'Spices',
    bengaliSubtitle: 'খাঁটি মশলা',
    image: spicesImg,
    itemCount: 3,
  },
  {
    id: 'nuts',
    primaryLabel: 'Nuts & Mix',
    bengaliSubtitle: 'বাদাম ও কাজু',
    image: nutsImg,
    itemCount: 3,
  },
];

interface FeaturedCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const handleSelect = (id: string) => {
    onSelectCategory(id);
    const el = document.getElementById('product-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Visual Category Row styled strictly matching user's reference screenshot */}
      <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-2 px-1 justify-start md:justify-center">
        {/* All Products Option */}
        <div
          onClick={() => handleSelect('all')}
          className="flex flex-col items-center shrink-0 cursor-pointer group"
        >
          <div
            className={`w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[22px] sm:rounded-[28px] md:rounded-[32px] bg-white flex flex-col items-center justify-center p-3 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border ${
              selectedCategory === 'all'
                ? 'border-emerald-700 ring-2 ring-emerald-700/30 -translate-y-1'
                : 'border-stone-100 hover:border-stone-200 hover:-translate-y-1 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl sm:text-2xl font-bold group-hover:scale-105 transition-transform">
              ✨
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-800 mt-1">
              All Products
            </span>
          </div>

          <div className="mt-2.5 text-center">
            <span
              className={`block text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                selectedCategory === 'all'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-800 group-hover:text-emerald-800'
              }`}
            >
              All Items
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
              সব পণ্য
            </span>
          </div>
        </div>

        {/* Hand-Drawn Sketch Category Cards (Matching User's Screenshot) */}
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = selectedCategory === item.id;

          return (
            <div
              key={item.id}
              id={`cat-card-${item.id}`}
              onClick={() => handleSelect(item.id)}
              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              {/* White Squircle Rounded Box */}
              <div
                className={`w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[22px] sm:rounded-[28px] md:rounded-[32px] bg-white flex items-center justify-center p-2.5 sm:p-4 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border relative ${
                  isSelected
                    ? 'border-emerald-700 ring-2 ring-emerald-700/30 -translate-y-1 shadow-md'
                    : 'border-stone-100 hover:border-stone-200 hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {/* Hand-drawn artwork inside white squircle */}
                <img
                  src={item.image}
                  alt={item.primaryLabel}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
                />

                {/* Selected Indicator dot */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                )}
              </div>

              {/* Centered Label Placed Underneath the Card (Exact Match to Screenshot) */}
              <div className="mt-2.5 text-center">
                <span
                  className={`block text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                    isSelected
                      ? 'text-emerald-800 font-bold'
                      : 'text-stone-800 group-hover:text-emerald-800'
                  }`}
                >
                  {item.primaryLabel}
                </span>
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                  {item.bengaliSubtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
