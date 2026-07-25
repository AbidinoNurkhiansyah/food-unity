import React from "react";
import { X, Check, Filter } from "lucide-react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceFilter: "all" | "paid" | "donation";
  setPriceFilter: (filter: "all" | "paid" | "donation") => void;
  categories: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  priceFilter,
  setPriceFilter,
  categories,
}) => {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-100 p-6 flex flex-col gap-6
          transition-all duration-300 ease-in-out transform md:translate-x-0 md:static md:z-10 md:h-[calc(100vh-10rem)] md:rounded-2xl md:border md:shadow-sm
          ${isOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
        `}
      >
        {/* Header - Mobile Only */}
        <div className="flex items-center justify-between md:hidden border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Filter size={18} className="text-primary-500" />
            Filter Products
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-2 font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-50 pb-3">
          <Filter size={16} className="text-primary-500" />
          Filters
        </div>

        {/* Section 1: Sale Type */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Sale Type
          </h4>
          <div className="space-y-1">
            {[
              { id: "all", label: "All Types" },
              { id: "paid", label: "Discount" },
              { id: "donation", label: "Donation" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setPriceFilter(type.id as any)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    priceFilter === type.id
                      ? "bg-palette-50 text-palette-800 shadow-sm border border-palette-100/50"
                      : "hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-transparent"
                  }
                `}
              >
                <span>{type.label}</span>
                {priceFilter === type.id && (
                  <Check
                    size={16}
                    className="text-palette-700 animate-in zoom-in duration-200"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Categories */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 hide-scrollbar">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Categories
          </h4>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    selectedCategory === category
                      ? "bg-palette-50 text-palette-800 shadow-sm border border-palette-100/50"
                      : "hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-transparent"
                  }
                `}
              >
                <span>{category}</span>
                {selectedCategory === category && (
                  <Check
                    size={16}
                    className="text-palette-700 animate-in zoom-in duration-200"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Quick Button */}
        {(priceFilter !== "all" || selectedCategory !== "All") && (
          <button
            onClick={() => {
              setPriceFilter("all");
              setSelectedCategory("All");
            }}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200/50 text-center"
          >
            Clear Filters
          </button>
        )}
      </aside>
    </>
  );
};
