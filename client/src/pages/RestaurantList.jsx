import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, MapPin, ChevronDown, Loader2 } from 'lucide-react';
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
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
      } catch (err) {
        console.error('API failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const toggleFilter = (f) => {
    setActiveFilters(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* Search Header */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="max-w-xl">
              <nav className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-dark-light uppercase mb-4 italic">
                 <span>Home</span> <ChevronDown size={10} className="-rotate-90" /> <span>Mumbai</span> <ChevronDown size={10} className="-rotate-90" /> <span className="text-dark">Explore</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-black text-dark tracking-tighter uppercase italic leading-tight">
                 Restaurants in Mumbai
              </h1>
           </div>
           
           <div className="w-full md:w-96 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-light group-focus-within:text-primary transition-colors" size={20} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for your favorite meals.."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.5rem] py-4 pl-14 pr-6 font-black text-dark outline-none transition-all shadow-inner"
              />
           </div>
        </div>
      </div>

      {/* Modern Filter Chips Bar (Sticky) */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 mb-12 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-100 rounded-full font-black text-xs text-dark uppercase tracking-widest hover:border-dark-muted transition-all shadow-sm">
                Filter <SlidersHorizontal size={14} strokeWidth={3} />
             </button>
             {FILTERS.map(f => (
               <button
                 key={f}
                 onClick={() => toggleFilter(f)}
                 className={`whitespace-nowrap px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border-2 ${activeFilters.includes(f) ? 'bg-dark text-white border-dark shadow-lg' : 'bg-white border-gray-100 text-dark-muted hover:border-dark-muted shadow-sm'}`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-dark-muted uppercase tracking-[0.1em]">
              SORT BY: <span className="text-primary font-black cursor-pointer flex items-center gap-1">RELEVANCE <ChevronDown size={14} /></span>
           </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-32">
        
        {/* Results Info */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-black text-dark tracking-tighter uppercase italic">
                 {loading ? 'Finding the best spots...' : `${filtered.length} CURATED RESULTS`}
              </h2>
              {search && <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Showing results for "{search}"</p>}
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic border-l-2 border-primary pl-4">Delivery in under 30 mins</p>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                 <div className="aspect-[4/3] bg-gray-50 rounded-[2rem] border border-gray-100" />
                 <div className="space-y-3 px-2">
                    <div className="h-6 bg-gray-50 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-50 rounded-lg w-1/2" />
                 </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            <AnimatePresence>
              {filtered.map(r => (
                <motion.div 
                   key={r._id}
                   layout
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                >
                   <RestaurantCard restaurant={r} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 shadow-xl">
               🍴
            </div>
            <h3 className="text-3xl font-black text-dark tracking-tighter uppercase italic mb-4">No results for your taste</h3>
            <p className="text-dark-muted font-bold uppercase tracking-widest text-xs mb-10 opacity-70">
               Try refining your search or explore our top categories.
            </p>
            <button 
              onClick={() => setSearch('')}
              className="bg-primary text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-95 uppercase italic tracking-tighter"
            >
              BROWSE ALL RESTAURANTS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
