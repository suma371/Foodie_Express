import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, ArrowLeft, History, TrendingUp, Star, Clock, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PageWrapper from '../components/layout/PageWrapper';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ restaurants: [], dishes: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Popular Cuisines (Swiggy Style)
  const popularCuisines = [
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=200&h=200' },
  ];

  // Load Recent Searches
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
    // Auto-focus search on load
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults({ restaurants: [], dishes: [] });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchTerm = query) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/restaurants/search?query=${searchTerm}`);
      setResults(data);
      
      // Save to recent if not empty
      if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
        const updated = [searchTerm.trim(), ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults({ restaurants: [], dishes: [] });
  };

  return (
    <PageWrapper>
      <div className="bg-background min-h-screen">
        {/* ── Search Header ── */}
        <div className="sticky top-0 bg-white z-[110] border-b border-border transition-all duration-300">
          <div className="max-w-4xl mx-auto px-6 h-20 md:h-24 flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-background rounded-full transition-colors text-muted hover:text-primary"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="flex-1 relative group">
              <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-primary animate-pulse' : 'text-muted group-focus-within:text-primary'}`} size={20} />
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="Search for restaurants and food..."
                className="w-full bg-background border-none focus:ring-0 py-4 pl-12 pr-12 text-sm md:text-base font-bold text-secondary placeholder:text-muted/60"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button 
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white rounded-full transition-colors text-muted"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            {!query ? (
              <motion.div 
                key="discovery"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <History size={18} className="text-muted" />
                      <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em]">Recent Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {recentSearches.map((s, i) => (
                        <button 
                          key={i}
                          onClick={() => setQuery(s)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-xl text-sm font-bold text-secondary hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* Popular Cuisines */}
                <section>
                  <div className="flex items-center gap-2 mb-8">
                    <TrendingUp size={18} className="text-primary" />
                    <h3 className="text-sm font-black text-secondary tracking-tight">Popular Cuisines</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-10">
                    {popularCuisines.map((cuisine, i) => (
                      <button 
                        key={i}
                        onClick={() => setQuery(cuisine.name)}
                        className="flex flex-col items-center gap-3 group transition-transform hover:scale-105"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors shadow-lg">
                          <img src={cuisine.img} alt={cuisine.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <span className="text-[12px] font-black text-muted group-hover:text-primary transition-colors">{cuisine.name}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12 pb-20"
              >
                {/* Restaurant Results */}
                {results.restaurants.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black text-secondary tracking-tight">Restaurants</h3>
                       <span className="text-xs font-bold text-muted">{results.restaurants.length} results</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {results.restaurants.map((rest) => (
                        <RestaurantCard key={rest._id} restaurant={rest} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Dish Results */}
                {results.dishes.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black text-secondary tracking-tight">Dishes</h3>
                       <span className="text-xs font-bold text-muted">{results.dishes.length} items found</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {results.dishes.map((dish) => (
                        <motion.div 
                          key={dish._id}
                          whileHover={{ scale: 1.01 }}
                          className="bg-white rounded-3xl p-5 border border-border shadow-sm flex items-center gap-5 cursor-pointer hover:shadow-md transition-all group"
                          onClick={() => navigate(`/restaurant/${dish.restaurantId._id}`)}
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-border">
                            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                               <span className={`w-3 h-3 border-2 flex-shrink-0 ${dish.isVeg ? 'border-green-500' : 'border-red-500'} rounded-sm flex items-center justify-center p-[2px]`}>
                                  <div className={`w-full h-full rounded-full ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                               </span>
                               <h4 className="text-base font-black text-secondary truncate">{dish.name}</h4>
                            </div>
                            <p className="text-xs font-black text-primary mb-2 flex items-center gap-1">
                               <Star size={10} fill="currentColor" /> {dish.restaurantId.rating} • {dish.restaurantId.name}
                            </p>
                            <div className="flex items-center justify-between">
                               <span className="text-sm font-black text-secondary">₹{dish.price}</span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1">
                                  <Clock size={10} /> {dish.restaurantId.deliveryTime}
                               </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* No Results Fallback */}
                {!loading && results.restaurants.length === 0 && results.dishes.length === 0 && (
                  <div className="text-center py-20 px-8">
                    <div className="inline-flex p-8 bg-background rounded-[2rem] border-2 border-dashed border-border mb-6">
                       <ChefHat size={48} className="text-muted" />
                    </div>
                    <h3 className="text-2xl font-black text-secondary mb-2">Uh oh! No munchies found.</h3>
                    <p className="text-sm text-muted font-bold max-w-xs mx-auto">We couldn't find any results for "{query}". Try a different craving!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Search;
