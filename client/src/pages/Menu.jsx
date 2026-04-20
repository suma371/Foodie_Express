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
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background">
         <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
         <p className="text-muted font-bold uppercase tracking-widest text-xs">Loading Menu</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-background">
         <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-bold max-w-lg text-center shadow-sm">
            Failed to load menu: {error}
         </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
         
         <div className="mb-12 sm:mb-16 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-black text-secondary tracking-tight mb-4">Explore Our World</h1>
            <p className="text-muted font-medium text-base sm:text-lg">
               Discover a wide variety of delicious meals, from hearty burgers to fresh salads, all prepared with the finest ingredients and delivered piping hot.
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence>
               {foods.map((food, index) => (
                  <motion.div 
                     key={food._id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: index * 0.05 }}
                     className="bg-card rounded-[2rem] border border-border p-4 shadow-card group hover:shadow-xl hover:border-gray-500/20 transition-all flex flex-col"
                  >
                     <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-5 bg-background">
                        <img 
                           src={food.image} 
                           alt={food.name} 
                           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-secondary uppercase tracking-widest shadow-sm">
                           {food.category}
                        </div>
                     </div>
                     
                     <div className="flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-secondary mb-2 leading-tight pr-4">{food.name}</h3>
                        
                        <div className="flex items-center gap-1.5 mb-3">
                           <Star size={14} className="text-rating" fill="currentColor" />
                           <span className="text-sm font-bold text-secondary">4.8</span>
                           <span className="text-xs font-bold text-muted uppercase tracking-wider">(124)</span>
                        </div>
                        
                        <p className="text-muted text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                           {food.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                           <span className="text-xl font-black text-secondary">₹{food.price}</span>
                           <button 
                              onClick={() => handleAddToCart(food)}
                              className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
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
