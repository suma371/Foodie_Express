import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { Search, ChevronRight, ChevronLeft, SlidersHorizontal, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Swiggy Categories ("What's on your mind?")
  const categories = [
    { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=288&h=360' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=288&h=360' },
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b11adbc5d9?auto=format&fit=crop&q=80&w=288&h=360' },
    { name: 'Cakes', img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=288&h=360' },
    { name: 'North Indian', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=288&h=360' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=288&h=360' },
    { name: 'South Indian', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=288&h=360' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=288&h=360' }
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        // Fallback or Empty state handled in UI
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filterOptions = [
    'Filter', 'Sort By', 'Fast Delivery', 'New on Swiggy', 'Ratings 4.0+', 'Pure Veg', 'Offers', 'Rs. 300-Rs. 600'
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        
        {/* Section 1: "What's on your mind?" */}
        <section className="mb-14 border-b border-gray-100 pb-12">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-black text-dark tracking-tighter uppercase italic">What's on your mind?</h2>
            <div className="flex gap-2">
               <button className="p-2.5 bg-gray-100/80 rounded-full hover:bg-gray-200 transition-colors text-dark"><ChevronLeft size={20} /></button>
               <button className="p-2.5 bg-gray-100/80 rounded-full hover:bg-gray-200 transition-colors text-dark"><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0">
             {categories.map((cat, i) => (
                <motion.div 
                   key={i}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="flex-shrink-0 cursor-pointer text-center group"
                   onClick={() => navigate(`/restaurants?cuisine=${cat.name}`)}
                >
                   <div className="w-32 h-32 sm:w-40 sm:h-40 overflow-hidden relative mb-2">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-contain" />
                   </div>
                   <span className="text-sm font-extrabold text-dark-muted group-hover:text-primary transition-colors tracking-tighter uppercase italic">{cat.name}</span>
                </motion.div>
             ))}
          </div>
        </section>

        {/* Section 2: Top Brands Scroll */}
        <section className="mb-14 border-b border-gray-100 pb-12">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-2xl font-black text-dark tracking-tighter uppercase italic">Top restaurant chains in Mumbai</h2>
            <div className="flex gap-2">
               <button className="p-2.5 bg-gray-100/80 rounded-full hover:bg-gray-200 transition-colors text-dark"><ChevronLeft size={20} /></button>
               <button className="p-2.5 bg-gray-100/80 rounded-full hover:bg-gray-200 transition-colors text-dark"><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="flex items-stretch gap-8 overflow-x-auto no-scrollbar py-4 -mx-4 px-4 sm:mx-0">
             {restaurants.slice(0, 6).map((restaurant) => (
                <div key={restaurant._id} className="min-w-[280px] sm:min-w-[320px]">
                   <RestaurantCard restaurant={restaurant} layout="vertical" />
                </div>
             ))}
             {loading && Array(4).fill(0).map((_, i) => (
                <div key={i} className="min-w-[320px] bg-gray-50 rounded-[2rem] h-64 animate-pulse" />
             ))}
          </div>
        </section>

        {/* Section 3: Restaurants with Online Delivery */}
        <section>
          <div className="mb-10 px-2">
            <h2 className="text-2xl font-black text-dark tracking-tighter uppercase italic mb-6">Restaurants with online food delivery in Mumbai</h2>
            
            {/* Filter Bar */}
            <div className="flex overflow-x-auto no-scrollbar gap-3 py-2 -mx-4 px-4 sm:mx-0">
               {filterOptions.map((opt, i) => (
                  <button 
                    key={i} 
                    className={`flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full border-2 transition-all font-black text-xs uppercase tracking-widest ${i === 0 ? 'bg-dark text-white border-dark' : 'bg-white text-dark-muted border-gray-100 hover:border-dark-light shadow-sm'}`}
                  >
                    {opt} {i === 0 && <SlidersHorizontal size={14} strokeWidth={3} />}
                  </button>
               ))}
            </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
                <Loader2 size={40} className="animate-spin text-primary" />
                <p className="font-black text-dark tracking-widest uppercase text-xs">Curating our top menus for you...</p>
             </div>
          ) : restaurants.length === 0 ? (
             <div className="py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <div className="inline-flex p-6 bg-white rounded-3xl shadow-lg mb-6"><Search className="text-dark-light" size={40} /></div>
                <h3 className="text-xl font-black text-dark mb-2">NO RESTAURANTS NEARBY</h3>
                <p className="text-sm text-dark-muted font-bold tracking-widest uppercase">Try changing your location or category</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {restaurants.map((restaurant) => (
                <motion.div
                   key={restaurant._id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.4 }}
                >
                   <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Footer Catch Phrase */}
        <div className="mt-32 pt-20 border-t border-gray-100 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Every bite counts</p>
           <h4 className="text-5xl md:text-7xl font-black text-dark tracking-tighter leading-tight italic uppercase opacity-5">DELIVERING HAPPINESS</h4>
        </div>
      </div>
    </div>
  );
};

export default Home;
