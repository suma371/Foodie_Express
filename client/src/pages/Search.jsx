import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import PageWrapper from '../components/layout/PageWrapper';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ restaurants: [], dishes: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const cuisines = [
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=150&h=150' }
  ];

  useEffect(() => {
    // Load recent searches
    try {
      const saved = JSON.parse(localStorage.getItem('foodie_recent_searches')) || [];
      setRecentSearches(saved);
    } catch(e) {}
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ restaurants: [], dishes: [] });
        return;
      }

      setIsSearching(true);
      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults({ restaurants: data.restaurants || [], dishes: data.dishes || [] });
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300); // 300ms debounce
    return () => clearTimeout(debounce);
  }, [query]);

  const saveSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('foodie_recent_searches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query) {
      setSearchParams({ q: query });
      saveSearch(query);
    }
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    setSearchParams({ q: term });
  };

  return (
    <PageWrapper>
      <div className="bg-background min-h-screen pb-20">
        
        {/* Sticky Header with Search Input */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-secondary" />
            </button>
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                autoFocus
                placeholder="Search for restaurants, cuisines, or dishes"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchParams(e.target.value ? { q: e.target.value } : {});
                }}
                className="w-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary rounded-xl py-3 pl-4 pr-12 text-sm font-semibold transition-all shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary p-1">
                <SearchIcon size={20} />
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6">

          {/* Discovery View (When no query) */}
          {!query && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-secondary tracking-widest uppercase mb-4 pl-2 border-l-4 border-primary">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleRecentClick(term)}
                        className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-full text-sm font-bold text-muted hover:border-primary hover:text-primary transition-all shadow-sm"
                      >
                        <Clock size={14} />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Cuisines */}
              <div>
                <h3 className="text-sm font-black text-secondary tracking-widest uppercase mb-6 pl-2 border-l-4 border-accent">Popular Cuisines</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {cuisines.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => handleRecentClick(cat.name)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 group"
                    >
                      <div className="w-[80px] h-[80px] rounded-full overflow-hidden shadow-card border-[3px] border-white group-hover:border-primary/50 transition-all">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="text-xs font-bold text-muted group-hover:text-primary transition-colors">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Search Results */}
          {query && (
            <div className="space-y-10">
              
              {/* Is Searching Indicator */}
              {isSearching && (
                <div className="flex justify-center py-10">
                   <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                </div>
              )}

              {!isSearching && results.restaurants.length === 0 && results.dishes.length === 0 && (
                <div className="text-center py-20 px-4">
                  <div className="inline-flex p-6 bg-white rounded-full shadow-inner mb-6">
                    <SearchIcon className="text-muted" size={40} />
                  </div>
                  <h3 className="text-xl font-black text-secondary mb-2">No results found for "{query}"</h3>
                  <p className="text-sm text-muted">Try a different dish, cuisine, or restaurant name.</p>
                </div>
              )}

              {/* Dish Results */}
              {!isSearching && results.dishes.length > 0 && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <h3 className="text-lg font-black text-secondary mb-4 flex items-center gap-2">
                    <TrendingUp className="text-accent" size={20} /> Dishes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.dishes.map(dish => (
                      <div key={dish._id} className="bg-white p-4 rounded-2xl border border-border shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-bold text-secondary truncate">{dish.name}</h4>
                          {dish.restaurantId && (
                            <p className="text-xs font-semibold text-muted truncate mt-1">From: {dish.restaurantId.name}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-black text-secondary">₹{dish.price}</span>
                            {dish.restaurantId && (
                               <button 
                                 onClick={() => navigate(`/restaurant/${dish.restaurantId._id}`)}
                                 className="text-[10px] font-bold text-primary uppercase flex items-center hover:bg-primary/5 px-2 py-1 rounded transition-colors"
                               >
                                 Go to Menu <ChevronRight size={12} />
                               </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Restaurant Results */}
              {!isSearching && results.restaurants.length > 0 && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h3 className="text-lg font-black text-secondary mb-4 flex items-center gap-2">
                    <SearchIcon className="text-primary" size={20} /> Restaurants
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.restaurants.map(rest => (
                      <RestaurantCard key={rest._id} restaurant={rest} />
                    ))}
                  </div>
                </motion.div>
              )}

            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
};

export default Search;
