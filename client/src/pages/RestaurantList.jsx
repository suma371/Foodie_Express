import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const FILTERS = ['Rating 4.0+', 'Offers', 'Rs. 300-600', 'Fast Delivery', 'Pure Veg', 'Newly Added'];

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
    <div className="bg-[#FAFAFA] min-h-screen">

      {/* ── Search Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 sm:top-[72px] z-40 shadow-sm">
         <div className="max-w-[1200px] mx-auto px-6 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                     <span className="hover:text-[#FF7043] cursor-pointer transition-colors">Home</span>
                     <ChevronDown size={14} className="-rotate-90" />
                     <span className="hover:text-[#FF7043] cursor-pointer transition-colors">City</span>
                     <ChevronDown size={14} className="-rotate-90" />
                     <span className="text-gray-900">Explore</span>
                  </nav>
                  <h1 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 tracking-tight leading-tight">
                     Discover Restaurants
                  </h1>
               </div>

               <div className="w-full md:w-96 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7043] transition-colors" size={20} />
                  <input
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     placeholder="Search for your favorites..."
                     className="w-full bg-gray-50 border border-transparent focus:border-[#FF7043]/30 focus:bg-white focus:shadow-sm rounded-2xl py-3.5 pl-12 pr-5 font-bold text-gray-900 outline-none transition-all"
                  />
               </div>
            </div>
         </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
               <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-xs text-gray-700 uppercase tracking-widest hover:border-gray-300 transition-all shadow-sm">
                  Filter <SlidersHorizontal size={14} />
               </button>
               {FILTERS.map(f => (
                  <button
                     key={f}
                     onClick={() => toggleFilter(f)}
                     className={`flex-shrink-0 whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all shadow-sm ${
                        activeFilters.includes(f)
                        ? 'bg-[#FF7043] text-white border-[#FF7043] shadow-md shadow-[#FF7043]/20'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                     }`}
                  >
                     {f}
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">
               Sort By:
               <span className="text-[#FF7043] cursor-pointer flex items-center gap-1 bg-[#FF7043]/10 px-3 py-1.5 rounded-lg hover:bg-[#FF7043]/20 transition-colors">
                  Relevance <ChevronDown size={14} />
               </span>
            </div>
         </div>

         {/* Result Count */}
         <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline gap-3">
            <h2 className="text-xl sm:text-2xl font-heading font-black text-gray-900 tracking-tight">
               {loading ? 'Finding the best spots...' : `${filtered.length} Local Options`}
            </h2>
            {search && (
               <p className="text-xs font-bold text-[#FF7043] uppercase tracking-widest">
                  Matching "{search}"
               </p>
            )}
         </div>

         {/* ── Grid ── */}
         {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
               {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4">
                     <div className="aspect-[4/3] bg-gray-100 rounded-2xl w-full" />
                     <div className="space-y-3 px-2 pb-2">
                        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                        <div className="h-3 bg-gray-100 rounded-full w-full mt-2" />
                     </div>
                  </div>
               ))}
            </div>
         ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
               <AnimatePresence>
                  {filtered.map((r, i) => (
                     <motion.div
                        key={r._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                     >
                        <RestaurantCard restaurant={r} />
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <MapPin size={40} className="text-gray-300" />
               </div>
               <h3 className="text-2xl font-heading font-black text-gray-900 tracking-tight mb-3">
                  No matches found
               </h3>
               <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                  We couldn't locate any restaurants matching your search criteria. Try a different cuisine or area.
               </p>
               <button
                  onClick={() => setSearch('')}
                  className="bg-[#FF7043] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_8px_20px_rgba(255,112,67,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
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
