import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import PageWrapper from '../components/layout/PageWrapper';

const FILTERS = ['Rating 4.0+', 'Offers', 'Rs. 300-600', 'Fast Delivery', 'Pure Veg', 'Newly Added'];

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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
    <PageWrapper>
      <div className="bg-background min-h-screen">

        {/* ── Search Header ── */}
        <div className="bg-card border-b border-border sticky top-16 sm:top-[80px] z-40 shadow-sm">
           <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-6 sm:py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest mb-3">
                       <span className="hover:text-primary cursor-pointer transition-colors">Home</span>
                       <ChevronDown size={14} className="-rotate-90" />
                       <span className="hover:text-primary cursor-pointer transition-colors">City</span>
                       <ChevronDown size={14} className="-rotate-90" />
                       <span className="text-secondary">Explore</span>
                    </nav>
                    <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
                       Discover Restaurants
                    </h1>
                 </div>

                 <div className="w-full md:w-96 relative group transition duration-200 ease-in-out hover:scale-[1.01]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input
                       value={search}
                       onChange={e => setSearch(e.target.value)}
                       placeholder="Search for restaurants and food"
                       className="w-full bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary rounded-xl py-3.5 pl-12 pr-5 font-medium text-secondary transition-all shadow-sm"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
                 <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl font-bold text-xs text-secondary uppercase tracking-widest hover:border-gray-300 transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95 shadow-sm">
                    Filter <SlidersHorizontal size={14} />
                 </button>
                 {FILTERS.map(f => (
                    <button
                       key={f}
                       onClick={() => toggleFilter(f)}
                       className={`flex-shrink-0 whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border shadow-sm transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95 ${
                          activeFilters.includes(f)
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                          : 'bg-card border-border text-muted hover:border-gray-300'
                       }`}
                    >
                       {f}
                    </button>
                 ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest shrink-0">
                 Sort By:
                 <span className="text-primary cursor-pointer flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all hover:scale-105">
                    Relevance <ChevronDown size={14} />
                 </span>
              </div>
           </div>

           {/* Result Count */}
           <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-secondary tracking-tight">
                 {loading ? 'Finding the best spots...' : `${filtered.length} Local Options`}
              </h2>
              {search && (
                 <p className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
                    Matching "{search}"
                 </p>
              )}
           </div>

           {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-xl p-3 border border-border">
                       <div className="h-40 rounded-xl mb-3 animate-shimmer"></div>
                       <div className="h-4 w-3/4 mb-2 rounded animate-shimmer"></div>
                       <div className="h-3 w-1/2 mb-2 rounded animate-shimmer"></div>
                       <div className="h-3 w-1/3 rounded animate-shimmer"></div>
                    </div>
                 ))}
              </div>
           ) : filtered.length > 0 ? (
              <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="show"
                 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                 {filtered.map((r) => (
                    <motion.div key={r._id} variants={itemVariants}>
                       <RestaurantCard restaurant={r} />
                    </motion.div>
                 ))}
              </motion.div>
           ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-[3rem] border border-border shadow-card">
                 <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-6">
                    <MapPin size={40} className="text-gray-300" />
                 </div>
                 <h3 className="text-2xl font-black text-secondary tracking-tight mb-3">
                    No matches found
                 </h3>
                 <p className="text-muted font-medium mb-8 max-w-sm mx-auto">
                    We couldn't locate any restaurants matching your search criteria. Try a different cuisine or area.
                 </p>
                 <button
                    onClick={() => setSearch('')}
                    className="bg-primary hover:bg-primaryDark text-white font-medium px-8 py-3.5 rounded-lg transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95 shadow-lg text-sm uppercase tracking-widest"
                 >
                    Browse All
                 </button>
              </div>
           )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default RestaurantList;
