import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const FILTERS = ['Rating 4.0+', 'Offers', 'Rs. 300-600', 'Fast Delivery', 'Pure Veg', 'New on Swiggy'];

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    api.get('/restaurants')
      .then(({ data }) => setRestaurants(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFilter = (f) => {
    setActiveFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ── Search Header ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-5 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <nav className="flex items-center gap-1.5 text-[10px] font-black text-dark-light uppercase tracking-[0.15em] mb-3 italic">
              <span>Home</span>
              <ChevronDown size={10} className="-rotate-90" />
              <span>Mumbai</span>
              <ChevronDown size={10} className="-rotate-90" />
              <span className="text-dark">Explore</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark tracking-tighter uppercase italic leading-tight">
              Restaurants in Mumbai
            </h1>
          </div>

          <div className="w-full md:w-80 lg:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for restaurants.."
              className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl py-3 pl-11 pr-5 font-semibold text-sm text-dark outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Filter Bar (sticky) ── */}
      <div className="sticky top-16 sm:top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-gray-200 rounded-full font-black text-[11px] text-dark uppercase tracking-wider hover:border-dark-muted transition-all shadow-sm">
              Filter <SlidersHorizontal size={12} strokeWidth={3} />
            </button>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-black text-[11px] uppercase tracking-wider border-2 transition-all ${
                  activeFilters.includes(f)
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white border-gray-200 text-dark-muted hover:border-dark-muted shadow-sm'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-black text-dark-muted uppercase tracking-wider flex-shrink-0">
            Sort:
            <span className="text-primary cursor-pointer flex items-center gap-0.5">
              Relevance <ChevronDown size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20">

        {/* Result Count */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-black text-dark tracking-tighter uppercase italic">
            {loading ? 'Finding the best spots...' : `${filtered.length} results`}
          </h2>
          {search && (
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing results for "{search}"
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl" />
                <div className="space-y-2 px-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <RestaurantCard restaurant={r} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-6">🍴</div>
            <h3 className="text-xl font-black text-dark tracking-tighter uppercase italic mb-2">
              No results found
            </h3>
            <p className="text-xs text-dark-muted font-semibold mb-6">
              Try adjusting your search or explore our top categories.
            </p>
            <button
              onClick={() => setSearch('')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-primary/25 uppercase italic tracking-tighter text-sm hover:bg-primary-dark transition-colors active:scale-95"
            >
              Browse All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
