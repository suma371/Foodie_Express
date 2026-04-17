import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { Search, ChevronRight, ChevronLeft, SlidersHorizontal, Loader2 } from 'lucide-react';
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

  const filterOptions = ['Sort By', 'Fast Delivery', 'New on FoodieExpress', 'Ratings 4.0+', 'Pure Veg', 'Offers', 'Rs. 300 - Rs. 600'];

  useEffect(() => {
    api.get('/restaurants')
      .then(({ data }) => setRestaurants(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-8 sm:py-12">

        {/* ── Section 1: Categories ── */}
        <section className="mb-14 sm:mb-16">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-gray-900 tracking-tight">
              What's on your mind?
            </h2>
            <div className="hidden sm:flex gap-3">
              <button className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors text-gray-700">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors text-gray-700">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-5 sm:gap-8 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth">
            {categories.map((cat, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/restaurants?cuisine=${cat.name}`)}
                className="flex-shrink-0 flex flex-col items-center gap-3 group outline-none"
              >
                <div className="w-[85px] sm:w-[110px] h-[85px] sm:h-[110px] rounded-full overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.06)] border-[4px] border-white group-hover:border-[#FFCCBC] transition-all relative">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[13px] sm:text-sm font-semibold text-gray-600 group-hover:text-[#FF7043] transition-colors whitespace-nowrap">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Section 2: Top Restaurant Chains ── */}
        <section className="mb-14 sm:mb-16">
          <div className="flex justify-between items-center mb-6 sm:mb-8 border-t border-gray-200/60 pt-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-gray-900 tracking-tight">
              Top restaurant chains
            </h2>
            <div className="hidden sm:flex gap-3">
              <button className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors text-gray-700">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-colors text-gray-700">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 sm:mx-0 sm:px-0">
            {loading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} className="min-w-[260px] sm:min-w-[300px] bg-white border border-gray-100 rounded-[1.5rem] h-[280px] skeleton flex-shrink-0" />
                ))
              : restaurants.slice(0, 8).map(r => (
                  <div key={r._id} className="min-w-[260px] sm:min-w-[300px] flex-shrink-0">
                    <RestaurantCard restaurant={r} />
                  </div>
                ))
            }
          </div>
        </section>

        {/* ── Section 3: All Restaurants ── */}
        <section>
          <div className="mb-8 border-t border-gray-200/60 pt-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-gray-900 tracking-tight mb-6">
              Restaurants with online food delivery
            </h2>

            {/* Filter Chips */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
              <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white font-bold text-xs shadow-md shadow-gray-900/20 hover:shadow-lg transition-all">
                <SlidersHorizontal size={14} /> Filter
              </button>
              {filterOptions.map((opt, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-600 font-semibold text-xs hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <Loader2 size={40} className="animate-spin text-[#FF7043]" />
              <p className="font-heading font-bold text-gray-500 text-lg">Curating the best menus...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <div className="inline-flex p-6 bg-gray-50 rounded-full shadow-inner mb-6">
                <Search className="text-gray-300" size={40} />
              </div>
              <h3 className="text-2xl font-heading font-black text-gray-900 mb-2">No Restaurants Nearby</h3>
              <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">Try changing your location or removing some filters to find great food.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {restaurants.map((restaurant, i) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Home;
