import React from "react";
import { Search, MapPin } from "lucide-react";

interface ExploreSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceFilter: "all" | "paid" | "donation";
  setPriceFilter: (filter: "all" | "paid" | "donation") => void;
  onGetCurrentLocation?: () => void;
}

const CATEGORIES = [
  "All",
  "Bakery",
  "Beverages",
  "Fast Food",
  "Wet Food",
  "Dry Food",
  "Vegetables",
  "Fruits",
  "Meat & Seafood",
];

export const ExploreSearch: React.FC<ExploreSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceFilter,
  setPriceFilter,
  onGetCurrentLocation,
}) => {
  return (
    <div className="space-y-5 mb-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          What do you want to eat today? 🍔
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Find delicious surplus food near you.
        </p>
      </div>

      {/* Row 1: Search + Price Segment + Location */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm text-sm"
            placeholder="Search food, restaurants, or categories..."
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
          {/* Price Segmented Controller */}
          <div className="flex bg-slate-200/65 p-1 rounded-2xl border border-slate-200/30 shadow-inner w-fit">
            {[
              { id: "all", label: "All Types" },
              { id: "paid", label: "Discount" },
              { id: "donation", label: "Donation" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setPriceFilter(type.id as any)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none active:scale-95
                  ${priceFilter === type.id
                    ? "bg-palette-800 text-white shadow-md hover:bg-palette-900"
                    : "text-slate-500 hover:text-slate-800"}
                `}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Current Location Button */}
          <button
            onClick={onGetCurrentLocation}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all duration-200 shadow-sm font-bold text-sm cursor-pointer select-none active:scale-95 whitespace-nowrap"
          >
            <MapPin size={16} className="text-primary-500" />
            <span>Current Location</span>
          </button>
        </div>
      </div>

      {/* Row 2: Categories with hidden scrollbar */}
      <div className="w-full">
        {/* Chips Container */}
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer select-none active:scale-95
                ${selectedCategory === category
                  ? "bg-palette-800 text-white shadow-md hover:bg-palette-900"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"}
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
