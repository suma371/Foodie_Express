import { useState, useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { ShoppingBag, Star, Plus, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCartContext();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await api.get('/food');
        setFoods(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#FAFAFA]">
         <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF7043] rounded-full animate-spin mb-4"></div>
         <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Menu</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-[#FAFAFA]">
         <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-bold max-w-lg text-center shadow-sm">
            Failed to load menu: {error}
         </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
         
         <div className="mb-12 sm:mb-16 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 tracking-tight mb-4">Explore Our World</h1>
            <p className="text-gray-500 font-medium text-base sm:text-lg">
               Discover a wide variety of delicious meals, from hearty burgers to fresh salads, all prepared with the finest ingredients and delivered piping hot.
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence>
               {foods.map((food, index) => (
                  <motion.div 
                     key={food._id}
                     initial={{ opacity: 0, y: 20 }}
                     opacity={1}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: index * 0.05 }}
                     container 
                     className="bg-white rounded-[2rem] border border-gray-100 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] group hover:shadow-xl hover:border-gray-200 transition-all flex flex-col"
                  >
                     <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-5 bg-gray-50">
                        <img 
                           src={food.image} 
                           alt={food.name} 
                           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-900 uppercase tracking-widest shadow-sm">
                           {food.category}
                        </div>
                     </div>
                     
                     <div className="flex flex-col flex-grow">
                        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2 leading-tight pr-4">{food.name}</h3>
                        
                        <div className="flex items-center gap-1.5 mb-3">
                           <Star size={14} className="text-[#F59E0B]" fill="currentColor" />
                           <span className="text-sm font-bold text-gray-900">4.8</span>
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">(124)</span>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                           {food.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                           <span className="text-xl font-heading font-black text-gray-900">₹{food.price}</span>
                           <button 
                              onClick={() => handleAddToCart(food)}
                              className="w-10 h-10 bg-[#FF7043] text-white flex items-center justify-center rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#FF7043]/20"
                              aria-label="Add to cart"
                           >
                              <Plus size={20} strokeWidth={2.5} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

export default Menu;
