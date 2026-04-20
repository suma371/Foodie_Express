import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Star, Clock, Search, MapPin, ChevronRight, 
  Plus, Minus, Loader2, ShoppingBag, Percent, 
  ChevronDown, ArrowLeft, Heart, Share2, Filter,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItemSkeleton } from '../components/common/Skeleton';
import PageWrapper from '../components/layout/PageWrapper';

const RestaurantMenu = () => {
  const { id } = useParams();
  const { addToCart, cartItems, updateQty } = useCartContext();
  const { user } = useAuthContext();
  
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Stats / Refs for Scroll
  const categoryRefs = useRef({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, foodRes, reviewRes] = await Promise.all([
        api.get(`/restaurants/${id}`),
        api.get(`/fooditems/restaurant/${id}`),
        api.get(`/restaurants/${id}/reviews`)
      ]);
      setRestaurant(resRes.data);
      setFoodItems(foodRes.data);
      setReviews(reviewRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const scrollToCategory = (cat) => {
    const element = categoryRefs.current[cat];
    if (element) {
      const offset = 180;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveCategory(cat);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to submit a review');
    setSubmitting(true);
    try {
      await api.post(`/restaurants/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVeg = !isVegOnly || item.isVeg;
    return matchesSearch && matchesVeg;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const cat = item.category || 'Main Course';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);

  if (loading) return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <div className="h-48 bg-card animate-shimmer rounded-[2.5rem] mb-12 border border-border"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <MenuItemSkeleton key={i} />)}
        </div>
      </div>
    </PageWrapper>
  );

  if (!restaurant) return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center text-secondary font-black uppercase tracking-widest">
        Restaurant not found
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="bg-background min-h-screen pb-32">
        
        {/* ── Breadcrumbs ── */}
        <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-10">
          <nav className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/restaurants" className="hover:text-primary transition-colors">{restaurant?.address?.city || 'City'}</Link>
            <ChevronRight size={12} />
            <span className="text-secondary">{restaurant?.name}</span>
          </nav>

          {/* ── Restaurant Header Card ── */}
          <div className="bg-card rounded-[2.5rem] p-6 sm:p-10 shadow-card border border-border mb-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 relative z-10">
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight mb-4">
                  {restaurant?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted mb-8">
                  <div className="flex items-center gap-1.5 bg-background px-4 py-2 rounded-full border border-border shadow-sm">
                     <Clock size={16} className="text-primary" />
                     <span>{restaurant.deliveryTime || '25-30'} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-background px-4 py-2 rounded-full border border-border shadow-sm">
                     <MapPin size={16} className="text-primary" />
                     <span>{restaurant?.address?.city}, 1.2 km</span>
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {[
                    { label: '60% OFF', code: 'STEAL60' },
                    { label: 'FLAT ₹100', code: 'SAVE100' }
                  ].map((c, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Percent size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-secondary">{c.label}</p>
                        <p className="text-[9px] font-bold text-muted">USE {c.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Box */}
              <div className="bg-rating text-white rounded-2xl px-6 py-5 text-center shadow-lg flex-shrink-0 flex sm:flex-col items-center gap-3 sm:gap-1">
                <div className="flex items-center gap-1 font-black text-2xl">
                  <Star size={22} fill="white" />
                  <span>{restaurant?.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="w-px h-10 bg-white/20 sm:hidden"></div>
                <div className="sm:border-t sm:border-white/20 sm:pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-90">{restaurant?.numReviews || 0} Ratings</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sticky Menu Controls ── */}
          <div className="sticky top-[64px] z-40 bg-background/80 backdrop-blur-xl -mx-4 px-4 py-6 mb-8 border-b border-border/40">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
              <div className="relative group w-full md:max-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search in menu..."
                  className="w-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold transition-all placeholder:text-muted/60 text-secondary"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setIsVegOnly(!isVegOnly)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                    isVegOnly ? 'bg-accent text-white shadow-xl' : 'bg-card text-muted border border-border hover:border-accent/40'
                  }`}
                >
                  <div className={`w-3 h-3 border-2 ${isVegOnly ? 'border-white' : 'border-accent'} p-0.5 rounded-sm`}>
                    <div className="w-full h-full bg-accent rounded-full"></div>
                  </div>
                  Veg Only
                </button>

                <div className="h-8 w-px bg-border hidden md:block"></div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => scrollToCategory(cat)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        activeCategory === cat ? 'bg-secondary text-white shadow-lg' : 'text-muted hover:bg-card border border-transparent hover:border-border'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Categorized Menu List ── */}
          <div className="max-w-4xl mx-auto pb-20">
            {categories.length === 0 ? (
              <div className="py-20 text-center bg-card rounded-[2rem] border border-dashed border-border opacity-50">
                <p className="text-lg font-bold text-muted italic">No dishes match your filters.</p>
              </div>
            ) : (
              categories.map((cat) => (
                <div key={cat} ref={el => categoryRefs.current[cat] = el} className="mb-14">
                  <div className="flex items-center justify-between gap-4 mb-6 sticky top-[150px] md:top-[120px] bg-background/90 backdrop-blur py-4 z-10">
                    <h3 className="text-xl font-black text-secondary tracking-tight border-l-4 border-primary pl-4">
                      {cat} <span className="text-primary opacity-40 text-sm ml-2 font-black">({groupedItems[cat].length})</span>
                    </h3>
                    <ChevronDown className={`text-muted transition-transform duration-500 ${activeCategory === cat ? 'rotate-180 text-primary' : ''}`} />
                  </div>

                  <div className="space-y-4">
                    {groupedItems[cat].map((item) => {
                      const cartItem = cartItems.find(i => i._id === item._id);
                      return (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="flex justify-between items-start gap-8 py-10 border-b border-border/40 group last:border-0"
                        >
                          <div className="flex-1">
                            <div className={`w-3.5 h-3.5 border-2 ${item.isVeg ? 'border-accent' : 'border-danger'} p-0.5 rounded-sm mb-3`}>
                              <div className={`w-full h-full ${item.isVeg ? 'bg-accent' : 'bg-danger'} rounded-full`}></div>
                            </div>
                            <h4 className="text-xl font-black text-secondary mb-1 group-hover:text-primary transition-colors duration-300">{item.name}</h4>
                            <p className="text-lg font-black text-secondary mb-4">₹{item.price}</p>
                            <p className="text-sm font-semibold text-muted leading-relaxed max-w-[480px] opacity-80">
                              {item.description || 'Our signature dish prepared with premium ingredients and traditional slow-cooking techniques.'}
                            </p>
                          </div>

                          <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
                            <img 
                              src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400&h=400'} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-[2rem] shadow-xl border-4 border-card group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                              {cartItem ? (
                                <div className="bg-white text-primary border border-primary/20 shadow-2xl rounded-2xl flex items-center justify-between w-[110px] h-[44px] px-3 font-black overflow-hidden">
                                  <button onClick={() => updateQty(item._id, cartItem.quantity - 1)} className="hover:bg-primary/10 p-1.5 rounded-xl transition-colors">
                                    <Minus size={18} />
                                  </button>
                                  <span className="text-sm">{cartItem.quantity}</span>
                                  <button onClick={() => updateQty(item._id, cartItem.quantity + 1)} className="hover:bg-primary/10 p-1.5 rounded-xl transition-colors">
                                    <Plus size={18} />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => addToCart(item)}
                                  className="bg-white text-accent border border-border shadow-2xl hover:shadow-primary/10 hover:border-accent rounded-2xl px-10 py-3 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 whitespace-nowrap"
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Review Section ── */}
        <section id="reviews-section" className="max-w-4xl mx-auto px-4 py-20 border-t border-border mt-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <AlertCircle size={14} />
                Transparency Report
             </div>
             <h2 className="text-4xl font-black text-secondary tracking-tight">Customer Experiences</h2>
             <p className="text-muted font-semibold mt-2">Authenticated reviews from recent diners</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Add Review Form */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-card">
              <h3 className="text-xl font-black text-secondary mb-6">Add your voice</h3>
              {user ? (
                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block">Your Rating</label>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(s => (
                         <button 
                           key={s} 
                           type="button" 
                           onClick={() => setRating(s)}
                           className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= s ? 'bg-primary text-white shadow-lg' : 'bg-background text-muted grayscale opacity-40'}`}
                         >
                           <Star size={20} fill={rating >= s ? "white" : "none"} />
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 block">Detailed Feedback</label>
                    <textarea 
                      className="w-full bg-background border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none text-sm font-semibold transition-all min-h-[120px]"
                      placeholder="Was the food fresh? Hot? Tell the community..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    disabled={submitting}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-primaryDark active:scale-95 transition-all text-xs disabled:opacity-50"
                  >
                    {submitting ? 'Authenticating...' : 'Submit Professional Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 opacity-60">
                   <p className="font-bold text-secondary mb-4">Login to share your experience</p>
                   <Link to="/login" className="text-primary font-black uppercase text-xs tracking-widest border-b-2 border-primary">Sign In</Link>
                </div>
              )}
            </div>

            {/* Review List */}
            <div className="space-y-6 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
               {reviews.length === 0 ? (
                 <div className="text-center py-20 opacity-40 italic font-bold">No reviews yet. Be the first!</div>
               ) : (
                 reviews.map((r, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     className="bg-card border border-border p-6 rounded-3xl"
                   >
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-black text-xs uppercase">
                              {r.name?.charAt(0) || 'U'}
                           </div>
                           <div>
                              <p className="text-sm font-black text-secondary">{r.name || 'Anonymous'}</p>
                              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 bg-rating text-white px-3 py-1 rounded-lg text-xs font-black">
                           <Star size={12} fill="white" />
                           {r.rating}
                        </div>
                     </div>
                     <p className="text-sm font-semibold text-muted leading-relaxed italic">"{r.comment}"</p>
                   </motion.div>
                 ))
               )}
            </div>
          </div>
        </section>

        {/* ── Cart Float (Mobile) ── */}
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-24 left-4 right-4 z-50 md:hidden"
            >
              <Link to="/cart" className="bg-accent text-white p-5 rounded-2xl flex items-center justify-between shadow-[0_20px_50px_rgba(96,178,70,0.3)] font-black tracking-tight overflow-hidden relative">
                 <div className="absolute inset-0 bg-white/10 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                 <div className="flex flex-col relative z-10">
                    <span className="text-[10px] uppercase tracking-widest opacity-80">{cartItems.length} ITEMS ADDED</span>
                    <span className="text-base">VIEW YOUR BAGGIE</span>
                 </div>
                 <div className="flex items-center gap-2 relative z-10">
                    <ShoppingBag size={20} />
                    <ChevronRight size={18} />
                 </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default RestaurantMenu;
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

        {/* ── Reviews Section ── */}
        <div className="mt-16 border-t border-border pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Review Stats */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-black text-secondary mb-6">Ratings & Reviews</h2>
              <div className="bg-card rounded-[2rem] p-8 border border-border shadow-card text-center">
                <div className="text-5xl font-black text-secondary mb-2">{restaurant?.rating?.toFixed(1) || '0.0'}</div>
                <div className="flex justify-center gap-1 text-rating mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={20} fill={s <= Math.round(restaurant?.rating || 0) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className="text-sm font-bold text-muted uppercase tracking-widest">{restaurant?.numReviews || 0} Total Reviews</p>
                
                <div className="mt-8 space-y-3">
                  {[5, 4, 3, 2, 1].map(s => {
                    const count = reviews.filter(r => Math.round(r.rating) === s).length;
                    const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={s} className="flex items-center gap-3 text-xs font-bold text-muted">
                        <span className="w-2">{s}</span>
                        <Star size={12} fill="currentColor" />
                        <div className="flex-grow h-1.5 bg-muted/20 rounded-full overflow-hidden">
                          <div className="h-full bg-rating" style={{ width: `${percent}%` }}></div>
                        </div>
                        <span className="w-8">{Math.round(percent)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Review List & Form */}
            <div className="lg:col-span-2 space-y-10">
              {/* Write a Review */}
              <div className="bg-background rounded-[2rem] p-8 border border-dashed border-primary/30">
                <h3 className="text-xl font-bold text-secondary mb-6">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-bold text-muted">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={`${s <= rating ? 'text-rating' : 'text-muted/30'} hover:scale-110 transition-transform`}
                        >
                          <Star size={28} fill={s <= rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Share your experience with this restaurant..."
                    className="w-full bg-card border border-border focus:ring-2 focus:ring-primary rounded-2xl p-4 text-sm font-medium h-32 outline-none resize-none transition-all"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-primaryDark transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Post Review'}
                  </button>
                </form>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-muted font-bold italic">No reviews yet. Be the first to review!</div>
                ) : (
                  reviews.map((rev, i) => (
                    <motion.div
                      key={rev._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-card rounded-3xl p-6 border border-border shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-secondary">{rev.name}</div>
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-rating/10 text-rating px-3 py-1 rounded-full text-xs font-black">
                          {rev.rating} <Star size={12} fill="currentColor" />
                        </div>
                      </div>
                      <p className="text-sm text-muted font-medium leading-relaxed italic">"{rev.comment}"</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
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
