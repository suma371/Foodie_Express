import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Loader2, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import PageWrapper from '../components/layout/PageWrapper';
import { RestaurantSkeleton } from '../components/common/Skeleton';
import { staggerContainer, fadeUp as itemVariants } from '../utils/motion';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cuisine, setCuisine] = useState('');
  const [minRating, setMinRating] = useState(0);
  
  const navigate = useNavigate();
  const observer = useRef();

  const categories = [
    { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=288&h=288' },
  ];

  // Infinite Scroll Observer
  const lastElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const fetchRestaurants = async (pageNum = 1, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const { data } = await api.get(`/restaurants`, {
        params: {
          pageNumber: pageNum,
          cuisine: cuisine,
          minRating: minRating > 0 ? minRating : undefined,
          pageSize: 8
        }
      });

      const newBatch = data.restaurants || data;
      const totalPages = data.pages || 1;

      setRestaurants(prev => pageNum === 1 ? newBatch : [...prev, ...newBatch]);
      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger on filter change
  useEffect(() => {
    setPage(1);
    fetchRestaurants(1, true);
  }, [cuisine, minRating]);

  // Trigger on Infinite Scroll page increment
  useEffect(() => {
    if (page > 1) {
      fetchRestaurants(page, false);
    }
  }, [page]);

  const resetFilters = () => {
    setCuisine('');
    setMinRating(0);
    setPage(1);
  };

  return (
    <PageWrapper>
      <div className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-8 sm:py-12">

          {/* ── Section 1: Categories ── */}
          <section className="mb-14 sm:mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <h2 className="text-2xl sm:text-[28px] font-black text-secondary tracking-tight">
                What's on your mind?
              </h2>
              
              <Link to="/search" className="relative group w-full md:max-w-md cursor-text">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-hover:text-primary transition-colors" size={20} />
                <div className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold transition-all shadow-sm flex items-center text-muted/60">
                   Search for restaurants or food...
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              </Link>
            </div>

            <div className="flex gap-5 sm:gap-8 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth">
              {categories.map((cat, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCuisine(cat.name);
                    setPage(1);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center gap-3 group outline-none ${cuisine === cat.name ? 'opacity-100' : 'opacity-80'}`}
                >
                  <div className={`w-[85px] sm:w-[110px] h-[85px] sm:h-[110px] rounded-full overflow-hidden shadow-card border-[4px] ${cuisine === cat.name ? 'border-primary' : 'border-card'} group-hover:border-primary/30 transition-all relative`}>
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className={`text-[13px] sm:text-sm font-bold ${cuisine === cat.name ? 'text-primary' : 'text-muted'} group-hover:text-primary transition-colors whitespace-nowrap`}>
                    {cat.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* ── Section 2: Filter Controls ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <h2 className="text-2xl sm:text-[28px] font-black text-secondary tracking-tight">
                {cuisine ? `${cuisine} Spots` : 'Top restaurant chains'}
              </h2>
              
              {(cuisine || minRating > 0) && (
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primaryDark transition-colors"
                >
                  <X size={14} /> Clear all filters
                </button>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
              <button 
                onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full border font-bold text-xs shadow-sm transition-all whitespace-nowrap ${
                  minRating === 4 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-card border-border text-muted hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star size={14} fill={minRating === 4 ? "white" : "none"} /> Ratings 4.0+
                </div>
              </button>
              
              {['Fast Delivery', 'Pure Veg', 'Offers', 'Less than Rs. 300'].map((opt, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full border border-border bg-card text-muted font-bold text-xs hover:border-primary/50 shadow-sm transition-all whitespace-nowrap"
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* ── Section 3: Restaurant Grid ── */}
          <section>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <RestaurantSkeleton key={i} />
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <div className="py-24 text-center bg-card rounded-[3rem] border border-dashed border-border shadow-card max-w-2xl mx-auto">
                <div className="inline-flex p-8 bg-background rounded-full shadow-inner mb-6">
                  <Search className="text-border" size={48} />
                </div>
                <h3 className="text-2xl font-black text-secondary mb-3">No results found</h3>
                <p className="text-sm text-muted font-semibold max-w-xs mx-auto mb-8">Try adjusting your filters or search terms to find what you're looking for.</p>
                <button onClick={resetFilters} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-primaryDark transition-all">
                  Show all restaurants
                </button>
              </div>
            ) : (
              <>
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
                >
                  {restaurants.map((restaurant, index) => (
                    <motion.div 
                      key={restaurant._id} 
                      variants={itemVariants}
                      ref={index === restaurants.length - 1 ? lastElementRef : null}
                    >
                      <RestaurantCard restaurant={restaurant} />
                    </motion.div>
                  ))}
                </motion.div>

                <AnimatePresence>
                  {loadingMore && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-center mt-12 py-8"
                    >
                      <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-border">
                        <Loader2 className="animate-spin text-primary" size={20} />
                        <span className="text-xs font-black text-secondary uppercase tracking-[0.2em]">Finding more eats...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!hasMore && restaurants.length > 0 && (
                  <div className="text-center py-16 mt-8 border-t border-dashed border-border opacity-50">
                    <p className="text-sm font-bold text-muted uppercase tracking-widest italic">You've reached the end of the feast! 🍴</p>
                  </div>
                )}
              </>
            )}
          </section>

        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
