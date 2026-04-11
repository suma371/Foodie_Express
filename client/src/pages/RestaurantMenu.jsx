import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Star, Clock, Search, MapPin, ChevronRight, Share2, Info, ChevronDown, Plus, Minus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RestaurantMenu = () => {
  const { id } = useParams();
  const { addToCart, cartItems, updateQuantity } = useCartContext();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVegOnly, setIsVegOnly ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, foodRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/fooditems/restaurant/${id}`)
        ]);
        setRestaurant(resRes.data);
        setFoodItems(foodRes.data);
      } catch (err) {
        console.error('Menu fetch failed:', err);
        // Fallback or Mock data can be injected here if needed
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const categories = ['All', ...new Set(foodItems.map(item => item.category))];

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVeg = !isVegOnly || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  const getItemCount = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const menuSections = categories.map(cat => ({
    title: cat,
    items: filteredItems.filter(i => cat === 'All' ? true : i.category === cat)
  }));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-6">
       <Loader2 className="animate-spin text-primary" size={48} />
       <p className="text-sm font-black text-dark text-[10px] uppercase tracking-[0.4em]">Cooking your menu...</p>
    </div>
  );

  if (!restaurant && !loading) return <div className="p-20 text-center">Restaurant not found</div>;

  return (
    <div className="bg-white min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-[800px] mx-auto pt-8 px-4 flex items-center gap-2 text-[10px] font-extrabold text-dark-light uppercase tracking-widest">
         <Link to="/" className="hover:text-dark">Home</Link>
         <ChevronRight size={12} />
         <Link to="/restaurants" className="hover:text-dark">{restaurant?.address?.city || 'Mumbai'}</Link>
         <ChevronRight size={12} />
         <span className="text-dark-muted">{restaurant?.name}</span>
      </div>

      <div className="max-w-[800px] mx-auto pb-32 pt-10 px-4">
        
        {/* Restaurant Profile Header (Swiggy Style) */}
        <div className="mb-14">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h1 className="text-3xl font-black text-dark tracking-tighter uppercase italic mb-2 leading-none">{restaurant?.name}</h1>
                 <p className="text-sm font-bold text-dark-muted italic">{restaurant?.cuisines?.join(', ')}</p>
                 <div className="flex items-center gap-2 text-xs font-bold text-dark-muted mt-2">
                    <MapPin size={14} className="text-primary" />
                    <span>{restaurant?.address?.city}, 1.2 km</span>
                 </div>
              </div>
              <div className="border border-gray-100 rounded-[1.5rem] p-3 text-center shadow-sm flex flex-col items-center">
                 <div className="flex items-center gap-1.5 text-success font-black border-b border-gray-50 pb-2 mb-2 w-full justify-center">
                    <Star size={18} fill="currentColor" />
                    <span className="text-base">{restaurant?.rating || '4.2'}</span>
                 </div>
                 <span className="text-[10px] font-black text-dark-muted uppercase tracking-tighter">10K+ ratings</span>
              </div>
           </div>

           <div className="flex items-center gap-6 py-4 border-t border-dashed border-gray-200">
              <div className="flex items-center gap-3 font-black text-xs text-dark tracking-tighter uppercase italic">
                 <div className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center"><Clock size={12} /></div>
                 <span>30 MINS</span>
              </div>
              <div className="flex items-center gap-3 font-black text-xs text-dark tracking-tighter uppercase italic">
                 <div className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center font-serif text-[10px]">₹</div>
                 <span>₹400 FOR TWO</span>
              </div>
           </div>

           {/* Coupons Slider */}
           <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 -mx-2 px-2">
              {[
                { label: '60% OFF UPTO ₹120', code: 'USE STEAL60', icon: '🎁' },
                { label: 'FLAT ₹100 OFF', code: 'USE SAVE100', icon: '💰' },
                { label: 'EXTRA 20% OFF', code: 'USE ICICI20', icon: '💳' }
              ].map((c, i) => (
                <div key={i} className="min-w-[200px] border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 italic">
                   <div className="text-xl">{c.icon}</div>
                   <div>
                      <p className="text-[10px] font-black text-dark uppercase tracking-tight mb-1">{c.label}</p>
                      <p className="text-[9px] font-bold text-dark-light">{c.code}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Menu Controls */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm -mx-4 px-4 py-4 border-b border-gray-50 mb-10 flex items-center justify-between shadow-sm lg:shadow-none">
           <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="text-[10px] font-black text-dark-muted uppercase tracking-widest">Veg Only</div>
                  <div 
                    onClick={() => setIsVegOnly(!isVegOnly)}
                    className={`w-10 h-5 rounded-full relative transition-all ${isVegOnly ? 'bg-success shadow-lg shadow-success/20' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isVegOnly ? 'left-5' : 'left-1 shadow-sm'}`} />
                  </div>
              </label>
           </div>
           <div className="relative group max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-light group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search menus.." 
                className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-primary/10 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-12">
           {menuSections.map((section, sidx) => (
              <section key={section.title} className="scroll-mt-40">
                 <div className="flex justify-between items-center mb-8 border-b-8 border-gray-50 pb-4">
                    <h2 className="text-xl font-black text-dark uppercase italic tracking-tighter">{section.title} ({section.items.length})</h2>
                    <ChevronDown size={20} className="text-dark-muted" />
                 </div>

                 <div className="divide-y divide-gray-100 italic">
                    {section.items.map((item) => {
                       const count = getItemCount(item._id);
                       return (
                          <div key={item._id} className="py-10 flex justify-between gap-10 group hover:bg-gray-50/50 -mx-4 px-4 rounded-3xl transition-colors">
                             <div className="flex-grow">
                                <div className="flex items-start gap-3 mb-2">
                                   <div className={`w-4 h-4 border-2 p-0.5 rounded-sm flex-shrink-0 ${item.isVeg ? 'border-success' : 'border-red-500'}`}>
                                      <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-success' : 'bg-red-500'}`} />
                                   </div>
                                   {item.isBestSeller && <span className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase">Bestseller</span>}
                                </div>
                                <h3 className="text-lg font-black text-dark tracking-tighter mb-1 uppercase group-hover:text-primary transition-colors">{item.name}</h3>
                                <p className="text-sm font-black text-dark mb-4 italic tracking-tighter">₹{item.price}</p>
                                <p className="text-xs text-dark-light font-bold leading-relaxed line-clamp-2 uppercase tracking-tight">{item.description}</p>
                             </div>
                             <div className="relative flex-shrink-0 w-32 h-32 md:w-36 md:h-36">
                                <img 
                                   src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300'} 
                                   className="w-full h-full object-cover rounded-[1.5rem] shadow-sm transform group-hover:scale-105 transition-transform duration-500" 
                                   alt={item.name} 
                                />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24">
                                   {count > 0 ? (
                                      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl py-2 px-3 shadow-lg shadow-primary/5 text-primary">
                                         <button onClick={() => updateQuantity(item._id, count - 1)} className="hover:scale-110 active:scale-95 transition-transform"><Minus size={14} strokeWidth={3} /></button>
                                         <span className="font-black text-sm">{count}</span>
                                         <button onClick={() => updateQuantity(item._id, count + 1)} className="hover:scale-110 active:scale-95 transition-transform"><Plus size={14} strokeWidth={3} /></button>
                                      </div>
                                   ) : (
                                      <button 
                                        onClick={() => addToCart(item)}
                                        className="w-full bg-white border border-gray-100 text-success text-sm font-black py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all active:scale-95 uppercase tracking-widest"
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
           ))}
        </div>
      </div>

      {/* Sticky Bottom Cart Indicator (Mobile-friendly) */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4"
          >
             <Link to="/cart" className="flex items-center justify-between bg-success text-white p-5 rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''}</span>
                   <span className="text-lg font-black tracking-tighter uppercase italic">VIEW CART</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-10 w-px bg-white/20" />
                   <div className="flex items-center gap-2">
                      <span className="text-xl font-black italic">₹{cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)}</span>
                      <ChevronRight size={24} strokeWidth={3} />
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
