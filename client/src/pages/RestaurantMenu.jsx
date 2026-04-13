import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Star, Clock, Search, MapPin, ChevronRight, ChevronDown, Plus, Minus, Loader2, ShoppingCart } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-xs font-black text-dark uppercase tracking-[0.4em]">Cooking your menu...</p>
    </div>
  );

  if (!restaurant) return (
    <div className="p-20 text-center font-bold text-dark-muted">Restaurant not found.</div>
  );

  return (
    <div className="bg-white min-h-screen">

      {/* Breadcrumbs */}
      <div className="max-w-[860px] mx-auto px-4 pt-5 flex items-center gap-1.5 text-[10px] font-black text-dark-light uppercase tracking-widest flex-wrap">
        <Link to="/" className="hover:text-dark">Home</Link>
        <ChevronRight size={10} />
        <Link to="/restaurants" className="hover:text-dark">{restaurant?.address?.city || 'Mumbai'}</Link>
        <ChevronRight size={10} />
        <span className="text-dark-muted truncate">{restaurant?.name}</span>
      </div>

      <div className="max-w-[860px] mx-auto px-4 pb-32 pt-6">

        {/* ── Restaurant Header ── */}
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-between items-start gap-4 mb-5">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black text-dark tracking-tighter uppercase italic mb-1 leading-tight">
                {restaurant?.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-dark-muted italic truncate">
                {restaurant?.cuisines?.join(', ')}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-dark-muted mt-1.5">
                <MapPin size={12} className="text-primary flex-shrink-0" />
                <span className="truncate">{restaurant?.address?.city}, 1.2 km</span>
              </div>
            </div>

            {/* Rating Box */}
            <div className="border border-gray-200 rounded-2xl px-4 py-3 text-center shadow-sm flex-shrink-0">
              <div className="flex items-center gap-1 text-green-600 font-black border-b border-gray-100 pb-2 mb-1.5 justify-center">
                <Star size={14} fill="currentColor" />
                <span className="text-sm">{restaurant?.rating || '4.2'}</span>
              </div>
              <span className="text-[9px] font-black text-dark-muted uppercase tracking-tight">1K+ ratings</span>
            </div>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-6 py-4 border-t border-dashed border-gray-200">
            <div className="flex items-center gap-2 text-xs font-black text-dark uppercase italic">
              <div className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center">
                <Clock size={12} />
              </div>
              30 Mins
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-dark uppercase italic">
              <div className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center text-[10px] font-serif">₹</div>
              ₹400 for Two
            </div>
          </div>

          {/* Coupon Chips */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-3 -mx-4 px-4">
            {[
              { label: '60% OFF UPTO ₹120', code: 'STEAL60', icon: '🎁' },
              { label: 'FLAT ₹100 OFF', code: 'SAVE100', icon: '💰' },
              { label: 'EXTRA 20% OFF', code: 'ICICI20', icon: '💳' }
            ].map((c, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-2.5 border border-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[180px]">
                <span className="text-lg">{c.icon}</span>
                <div>
                  <p className="text-[10px] font-black text-dark uppercase tracking-tight">{c.label}</p>
                  <p className="text-[9px] font-bold text-dark-light mt-0.5">USE {c.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sticky Menu Controls ── */}
        <div className="sticky top-[64px] sm:top-[72px] z-30 bg-white/95 backdrop-blur-sm -mx-4 px-4 py-3 border-y border-gray-100 mb-8 flex items-center justify-between gap-4 shadow-sm">
          {/* Veg Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
            <span className="text-[10px] font-black text-dark-muted uppercase tracking-widest hidden sm:block">Veg Only</span>
            <div
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${isVegOnly ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isVegOnly ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-[10px] font-black text-dark-muted uppercase tracking-widest sm:hidden">Veg</span>
          </label>

          {/* Search */}
          <div className="relative group flex-grow max-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={15} />
            <input
              type="text"
              placeholder="Search in menu.."
              className="w-full bg-gray-50 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold outline-none border-2 border-transparent focus:border-primary/20 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ── Menu Sections ── */}
        <div className="space-y-10">
          {menuSections.length === 0 ? (
            <div className="text-center py-20 text-dark-muted font-bold text-sm">No items found. Try adjusting your search.</div>
          ) : (
            menuSections.map((section) => (
              <section key={section.title} className="scroll-mt-32">
                <div className="flex justify-between items-center mb-5 pb-3 border-b-4 border-gray-50">
                  <h2 className="text-base sm:text-lg font-black text-dark uppercase italic tracking-tighter">
                    {section.title} <span className="text-dark-light font-semibold text-sm">({section.items.length})</span>
                  </h2>
                  <ChevronDown size={18} className="text-dark-muted" />
                </div>

                <div className="divide-y divide-gray-100">
                  {section.items.map(item => {
                    const count = getItemCount(item._id);
                    return (
                      <div key={item._id} className="py-6 sm:py-8 flex justify-between gap-4 sm:gap-8">
                        {/* Item Info */}
                        <div className="flex-grow min-w-0">
                          {/* Veg/Non-veg Dot */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-500'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
                            </div>
                            {item.isBestSeller && (
                              <span className="text-[10px] font-black text-orange-500 tracking-wider uppercase">⭐ Bestseller</span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-dark tracking-tight mb-1 uppercase italic line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-sm font-black text-dark mb-2">₹{item.price}</p>
                          <p className="text-[11px] text-dark-light font-semibold leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Item Image + Add Button */}
                        <div className="relative flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300'}
                            className="w-full h-full object-cover rounded-2xl shadow-sm"
                            alt={item.name}
                            loading="lazy"
                          />
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[90%]">
                            {count > 0 ? (
                              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl py-1.5 px-2 shadow-md text-primary">
                                <button onClick={() => updateQuantity(item._id, count - 1)} className="p-1 hover:scale-110 active:scale-95 transition-transform">
                                  <Minus size={14} strokeWidth={3} />
                                </button>
                                <span className="font-black text-sm w-4 text-center">{count}</span>
                                <button onClick={() => updateQuantity(item._id, count + 1)} className="p-1 hover:scale-110 active:scale-95 transition-transform">
                                  <Plus size={14} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { addToCart(item); toast.success(`${item.name} added!`, { icon: '🍽️' }); }}
                                className="w-full bg-white border border-gray-200 text-green-600 text-xs font-black py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-widest"
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
            className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 sm:pb-6"
          >
            <Link
              to="/cart"
              className="max-w-[860px] mx-auto flex items-center justify-between bg-green-600 hover:bg-green-700 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-green-600/30 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-700 rounded-xl p-1.5">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-80">{cartCount} item{cartCount > 1 ? 's' : ''}</p>
                  <p className="text-sm font-black uppercase italic tracking-tight leading-none mt-0.5">View Cart</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black italic">₹{cartTotal}</span>
                <ChevronRight size={20} strokeWidth={3} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantMenu;
