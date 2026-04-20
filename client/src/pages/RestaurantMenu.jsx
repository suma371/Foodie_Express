import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Star, Clock, Search, MapPin, ChevronRight, Plus, Minus, Loader2, ShoppingCart, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RestaurantMenu = () => {
  const { id } = useParams();
  const { addToCart, cartItems, updateQuantity } = useCartContext();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/restaurants/${id}`),
      api.get(`/fooditems/restaurant/${id}`)
    ]).then(([resRes, foodRes]) => {
      setRestaurant(resRes.data);
      setFoodItems(foodRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const cartTotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const categories = ['All', ...new Set(foodItems.map(i => i.category))];

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVeg = !isVegOnly || item.isVeg;
    return matchesSearch && matchesVeg;
  });

  const menuSections = categories
    .filter(cat => cat !== 'All')
    .map(cat => ({
      title: cat,
      items: filteredItems.filter(i => i.category === cat)
    }))
    .filter(s => s.items.length > 0);

  const getItemCount = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="text-sm font-bold text-muted uppercase tracking-widest">Preparing the Menu...</p>
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen flex items-center justify-center text-center text-xl font-bold text-muted bg-background">
      Restaurant not found
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-32">
      
      {/* ── Breadcrumbs ── */}
      <div className="bg-card border-b border-border sticky top-0 md:top-[90px] z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center gap-2 text-xs font-semibold text-muted">
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/restaurants" className="hover:text-secondary transition-colors">{restaurant?.address?.city || 'City'}</Link>
          <ChevronRight size={12} />
          <span className="text-secondary truncate">{restaurant?.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 pt-10">

        {/* ── Restaurant Header Card ── */}
        <div className="bg-card rounded-[2rem] p-6 sm:p-8 shadow-card border border-border mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight mb-2">
                {restaurant?.name}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-muted truncate mb-4">
                {restaurant?.cuisines?.join(', ')}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted">
                <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full">
                   <Clock size={16} className="text-primary" />
                   <span>{restaurant.deliveryTime || '25-30'} mins</span>
                </div>
                <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full">
                   <MapPin size={16} className="text-primary" />
                   <span>{restaurant?.address?.city}, 1.2 km</span>
                </div>
              </div>
            </div>

            {/* Rating Box */}
            <div className="bg-rating text-white rounded-2xl px-5 py-4 text-center shadow-lg flex-shrink-0 flex sm:flex-col items-center gap-2 sm:gap-1">
              <div className="flex items-center gap-1 font-black text-xl">
                <Star size={18} fill="currentColor" />
                <span>{restaurant?.rating || '4.2'}</span>
              </div>
              <div className="w-px h-10 bg-white/20 sm:hidden"></div>
              <div className="sm:border-t sm:border-white/20 sm:pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">1K+ Ratings</span>
              </div>
            </div>
          </div>

          {/* Coupon Chips */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pt-8 mt-8 border-t border-dashed border-border">
            {[
              { label: '60% OFF UPTO ₹120', code: 'STEAL60', icon: <Percent size={20}/> },
              { label: 'FLAT ₹100 OFF', code: 'SAVE100', icon: <Percent size={20}/> },
            ].map((c, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-3 border border-border bg-background rounded-xl px-5 py-4 hover:border-primary transition-colors cursor-pointer min-w-[220px]">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary">{c.label}</p>
                  <p className="text-[10px] font-bold text-muted mt-0.5">USE {c.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sticky Menu Controls ── */}
        <div className="sticky top-[64px] md:top-[160px] z-30 bg-background/95 backdrop-blur-xl py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          
          <div className="relative group w-full sm:max-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search in menu..."
              className="w-full bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary rounded-xl py-3 pl-11 pr-4 text-sm font-medium transition-all placeholder:text-muted text-secondary shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto bg-card shadow-card border border-transparent px-4 py-3 rounded-2xl">
            <span className="text-xs font-bold text-muted">Veg Only</span>
            <div
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${isVegOnly ? 'bg-accent' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isVegOnly ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        </div>

        {/* ── Menu Sections ── */}
        <div className="space-y-12 mt-6">
          {menuSections.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-[2rem] border border-dashed border-border">
               <p className="text-muted font-bold text-lg">No items match your search.</p>
            </div>
          ) : (
            menuSections.map((section) => (
              <section key={section.title} className="bg-card rounded-[2rem] p-6 sm:p-8 shadow-card border border-border">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                  <h2 className="text-xl font-bold text-secondary">
                    {section.title} <span className="text-muted text-base">({section.items.length})</span>
                  </h2>
                </div>

                <div className="divide-y divide-border">
                  {section.items.map(item => {
                    const count = getItemCount(item._id);
                    return (
                      <div key={item._id} className="py-6 flex justify-between gap-6 sm:gap-10 group">
                        {/* Item Info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-4 h-4 flex items-center justify-center rounded-[4px] border ${item.isVeg ? 'border-accent bg-green-50' : 'border-danger bg-red-50'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-accent' : 'bg-danger'}`} />
                            </div>
                            {item.isBestSeller && (
                              <span className="text-[10px] font-bold text-white bg-rating px-2 py-0.5 rounded-md tracking-wide">BESTSELLER</span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-secondary leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-base font-bold text-secondary mb-3">₹{item.price}</p>
                          <p className="text-sm text-muted font-medium leading-relaxed max-w-xl">
                            {item.description}
                          </p>
                        </div>

                        {/* Item Image + Add Button */}
                        <div className="relative flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300'}
                            className="w-full h-full object-cover rounded-[1.5rem] shadow-card transform group-hover:scale-[1.02] transition-transform duration-300"
                            alt={item.name}
                            loading="lazy"
                          />
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%]">
                            {count > 0 ? (
                              <div className="flex items-center justify-between bg-card border border-primary rounded-lg py-2 px-3 shadow-lg text-primary">
                                <button onClick={() => updateQuantity(item._id, count - 1)} className="p-1 hover:bg-primary/10 rounded-md transition-colors">
                                  <Minus size={16} strokeWidth={3} />
                                </button>
                                <span className="font-bold text-base w-6 text-center">{count}</span>
                                <button onClick={() => updateQuantity(item._id, count + 1)} className="p-1 hover:bg-primary/10 rounded-md transition-colors">
                                  <Plus size={16} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                               <button
                                 onClick={() => { addToCart(item); toast.success(`${item.name} added!`, { icon: '😋' }); }}
                                 className="bg-primary hover:bg-primaryDark text-white font-medium px-6 py-2 rounded-lg w-full shadow-lg transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95"
                               >
                                 ADD
                               </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* ── Sticky Bottom Cart Bar ── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 lg:pb-8"
          >
            <Link
              to="/cart"
              className="max-w-[900px] mx-auto flex items-center justify-between bg-accent text-white px-6 py-5 rounded-[2rem] shadow-hover transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-xl p-2.5 backdrop-blur-sm">
                  <ShoppingCart size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold opacity-90">{cartCount} Item{cartCount > 1 ? 's' : ''}</p>
                  <p className="text-xs font-medium opacity-80 mt-0.5">Extra charges may apply</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">₹{cartTotal}</span>
                <div className="bg-white text-accent font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1 group">
                   View Cart
                   <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantMenu;
