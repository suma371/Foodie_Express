import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import PageWrapper from '../components/layout/PageWrapper';

import { staggerContainer, fadeUp as itemVariants } from '../utils/motion';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=288&h=288' },
  ];

  useEffect(() => {
    api.get('/restaurants')
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <div className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-8 sm:py-12">

          {/* ── Section 1: Categories ── */}
          <section className="mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-[28px] font-black text-secondary tracking-tight mb-8">
              What's on your mind?
            </h2>
            <div className="flex gap-5 sm:gap-8 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth">
              {categories.map((cat, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/restaurants?cuisine=${cat.name}`)}
                  className="flex-shrink-0 flex flex-col items-center gap-3 group outline-none"
                >
                  <div className="w-[85px] sm:w-[110px] h-[85px] sm:h-[110px] rounded-full overflow-hidden shadow-card border-[4px] border-card group-hover:border-primary/30 transition-all relative">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className="text-[13px] sm:text-sm font-semibold text-muted group-hover:text-primary transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* ── Section 2: Top Brands ── */}
          <section className="mb-14 sm:mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-[28px] font-black text-secondary tracking-tight">
                Top restaurant chains in Bangalore
              </h2>
            </div>
            
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 sm:mx-0 sm:px-0">
              {loading
                ? Array(5).fill(0).map((_, i) => (
                    <div key={i} className="min-w-[260px] sm:min-w-[280px] bg-card border border-border rounded-[1.5rem] h-[280px] animate-pulse flex-shrink-0" />
                  ))
                : restaurants.slice(0, 6).map((restaurant) => (
                    <div key={restaurant._id} className="min-w-[260px] sm:min-w-[280px]">
                      <RestaurantCard restaurant={restaurant} />
                    </div>
                  ))
              }
            </div>
          </section>

          {/* ── Section 3: All Restaurants ── */}
          <section>
            <div className="mb-8 border-t border-border pt-10">
              <h2 className="text-2xl sm:text-[28px] font-black text-secondary tracking-tight mb-6">
                Restaurants with online food delivery
              </h2>

              {/* Filter Chips */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
                <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-xs shadow-lg hover:bg-secondary transition-all">
                  <SlidersHorizontal size={14} /> Filter
                </button>
                {['Rating 4.0+', 'Offers', 'Rs. 300-600', 'Fast Delivery', 'Pure Veg'].map((opt, i) => (
                  <button
                    key={i}
                    className="flex-shrink-0 px-5 py-2.5 rounded-full border border-border bg-card text-muted font-semibold text-xs hover:border-border hover:bg-background shadow-card transition-all whitespace-nowrap transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-3 animate-pulse border border-border">
                     <div className="h-40 rounded-xl mb-3 animate-shimmer"></div>
                     <div className="h-4 w-3/4 mb-2 rounded animate-shimmer"></div>
                     <div className="h-3 w-1/2 mb-2 rounded animate-shimmer"></div>
                     <div className="h-3 w-1/3 rounded animate-shimmer"></div>
                  </div>
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <div className="py-24 text-center bg-card rounded-3xl border border-dashed border-border shadow-card">
                <div className="inline-flex p-6 bg-background rounded-full shadow-inner mb-6">
                  <Search className="text-gray-300" size={40} />
                </div>
                <h3 className="text-2xl font-black text-secondary mb-2">No Restaurants Nearby</h3>
                <p className="text-sm text-muted font-medium max-w-xs mx-auto">Try changing your location or removing some filters to find great food.</p>
              </div>
            ) : (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {restaurants.map((restaurant) => (
                  <motion.div key={restaurant._id} variants={itemVariants}>
                    <RestaurantCard restaurant={restaurant} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>

        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
