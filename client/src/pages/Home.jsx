import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { Search, ChevronRight, ChevronLeft, SlidersHorizontal, Loader2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b11adbc5d9?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Cakes', img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'North Indian', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'South Indian', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Thali', img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=288&h=288' },
    { name: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=288&h=288' },
  ];

  const filterOptions = ['Sort By', 'Fast Delivery', 'New on Swiggy', 'Ratings 4.0+', 'Pure Veg', 'Offers', 'Rs. 300-Rs. 600'];

  useEffect(() => {
    api.get('/restaurants')
      .then(({ data }) => setRestaurants(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* ── Section 1: What's on your mind? ── */}
        <section className="mb-10 sm:mb-14 border-b border-gray-100 pb-8 sm:pb-12">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-dark tracking-tighter uppercase italic">
              What's on your mind?
            </h2>
            <div className="hidden sm:flex gap-2">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-dark">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-dark">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/restaurants?cuisine=${cat.name}`)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className="w-[100px] sm:w-[118px] h-[100px] sm:h-[118px] rounded-[1.25rem] overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-dark-muted group-hover:text-primary transition-colors tracking-tighter uppercase italic whitespace-nowrap">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Section 2: Top Restaurant Chains ── */}
        <section className="mb-10 sm:mb-14 border-b border-gray-100 pb-8 sm:pb-12">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-dark tracking-tighter uppercase italic leading-tight">
              Top restaurant chains
            </h2>
            <div className="hidden sm:flex gap-2">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-dark">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-dark">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {loading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} className="min-w-[220px] sm:min-w-[260px] bg-gray-100 rounded-[1.5rem] h-52 animate-pulse flex-shrink-0" />
                ))
              : restaurants.slice(0, 8).map(r => (
                  <div key={r._id} className="min-w-[220px] sm:min-w-[260px] flex-shrink-0">
                    <RestaurantCard restaurant={r} />
                  </div>
                ))
            }
          </div>
        </section>

        {/* ── Section 3: All Restaurants ── */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-dark tracking-tighter uppercase italic leading-tight">
                Restaurants with online food delivery
              </h2>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-white border-2 border-dark font-black text-[11px] uppercase tracking-wider">
                <SlidersHorizontal size={12} strokeWidth={3} /> Filter
              </button>
              {filterOptions.map((opt, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 px-4 py-2 rounded-full border-2 border-gray-200 bg-white text-dark-muted font-black text-[11px] uppercase tracking-wider hover:border-dark-muted shadow-sm transition-all whitespace-nowrap"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4 opacity-50">
              <Loader2 size={36} className="animate-spin text-primary" />
              <p className="font-black text-dark tracking-widest uppercase text-xs">Curating our top menus for you...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="inline-flex p-5 bg-white rounded-2xl shadow-lg mb-5">
                <Search className="text-gray-300" size={36} />
              </div>
              <h3 className="text-lg font-black text-dark mb-2 uppercase italic">No Restaurants Nearby</h3>
              <p className="text-xs text-dark-muted font-bold tracking-widest uppercase">Try changing your location or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {restaurants.map((restaurant, i) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Tagline */}
        <div className="mt-20 sm:mt-28 pt-12 border-t border-gray-100 text-center overflow-hidden">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-3">Every bite counts</p>
          <h4 className="text-5xl sm:text-7xl lg:text-9xl font-black text-dark tracking-tighter leading-tight italic uppercase opacity-[0.03] select-none">
            DELIVERING HAPPINESS
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Home;
