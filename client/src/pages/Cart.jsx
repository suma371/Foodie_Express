import { useState } from 'react';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, X, Percent, ArrowRight, Minus, Plus, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';

const Cart = () => {
  const { cartItems, updateQty, getCartTotal, clearCart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);

  const subtotal = parseFloat(getCartTotal());
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const platformFee = 7;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + platformFee + gst - discount;

  const coupons = [
    { code: 'STEAL60', label: '60% OFF UPTO ₹120', min: 200, disc: 120 },
    { code: 'WELCOME', label: 'FLAT ₹100 OFF', min: 400, disc: 100 },
    { code: 'FREEDEL', label: 'FREE DELIVERY', min: 300, disc: 40 },
  ];

  const applyCoupon = (c) => {
    if (subtotal < c.min) { toast.error(`Minimum order ₹${c.min} required`); return; }
    setCouponCode(c.code);
    setDiscount(c.disc);
    setShowCoupons(false);
    toast.success('Coupon applied! 🎉');
  };

  // ── Empty State ──
  if (cartItems.length === 0) return (
    <PageWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-6 text-center">
        <div className="mb-6">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
            <ShoppingBag size={100} className="text-gray-200 mx-auto" />
          </motion.div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">Your cart is empty</h2>
        <p className="text-base font-medium text-muted mb-8 max-w-sm mx-auto leading-relaxed">
          Good food is always cooking! Go ahead, order some yummy items from the menu.
        </p>
        <Link
          to="/"
          className="bg-primary hover:bg-primaryDark text-white font-black px-10 py-5 rounded-2xl transition shadow-xl text-xs uppercase tracking-[0.2em]"
        >
          Explore Restaurants
        </Link>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="bg-background min-h-screen py-8 sm:py-12 pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
          <h1 className="text-3xl font-black text-secondary mb-8 tracking-tighter">Your Shopping Baggie</h1>

          {/* Layout: stacks on mobile, side-by-side on desktop */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left Column: Cart Items ── */}
            <div className="w-full lg:w-[62%] space-y-6">

              {/* Restaurant Header & Item Details */}
              <div className="bg-card rounded-[2.5rem] p-6 sm:p-10 shadow-card border border-border">
                <div className="flex items-center justify-between pb-8 border-b border-border mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden shadow-lg flex-shrink-0 border-2 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200"
                        className="w-full h-full object-cover"
                        alt="Restaurant"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-2xl font-black text-secondary tracking-tight truncate">
                        {cartItems[0]?.restaurantName || 'Authentic Eatery'}
                      </h2>
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">
                        {cartItems[0]?.address?.city || 'Downtown Central'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-8">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex items-start justify-between gap-6 group">
                      {/* Item Info */}
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-[4px] mt-1 ${item.isVeg ? 'border-accent bg-green-50' : 'border-danger bg-red-50'}`}>
                          <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-accent' : 'bg-danger'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[17px] font-black text-secondary group-hover:text-primary transition-colors leading-tight">{item.name}</p>
                          <p className="text-xs text-muted font-bold mt-1">₹{item.price}</p>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <div className="flex items-center border border-border bg-background rounded-2xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => updateQty(item._id, item.quantity - 1)}
                            className="px-3.5 py-2 text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Minus size={14} strokeWidth={4} />
                          </button>
                          <span className="w-8 text-center font-black text-sm text-secondary">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item._id, item.quantity + 1)}
                            className="px-3.5 py-2 text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Plus size={14} strokeWidth={4} />
                          </button>
                        </div>
                        <span className="text-[17px] font-black text-secondary">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestion Note */}
              <div className="bg-white rounded-[2rem] p-6 border border-border flex items-start gap-4 shadow-card">
                <Info size={22} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="w-full">
                   <input 
                     type="text" 
                     placeholder="Cooking instructions? (e.g. Make it extra spicy!)" 
                     className="w-full bg-transparent outline-none placeholder:text-muted/60 text-sm font-bold text-secondary"
                   />
                </div>
              </div>
            </div>

            {/* ── Right Column: Bill Summary ── */}
            <div className="w-full lg:w-[38%] space-y-6 lg:sticky lg:top-[120px]">
              
              {/* Coupon Button */}
              <button
                onClick={() => setShowCoupons(true)}
                className={`w-full bg-card rounded-[2.5rem] p-8 shadow-card border-2 flex items-center justify-between group transition-all duration-500 ${couponCode ? 'border-accent bg-green-50/20' : 'border-transparent hover:border-primary/20'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${couponCode ? 'bg-accent text-white shadow-lg shadow-green-500/30' : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-all`}>
                    <Percent size={24} strokeWidth={3} />
                  </div>
                  <div className="text-left">
                    <p className={`text-base font-black ${couponCode ? 'text-accent' : 'text-secondary'} uppercase tracking-tight`}>
                      {couponCode ? `Code: ${couponCode}` : 'Exclusive Offers'}
                    </p>
                    <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">
                       {couponCode ? 'Tap to change' : 'Apply and save big'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={24} className={couponCode ? 'text-accent' : 'text-gray-300 group-hover:text-primary group-hover:translate-x-2 transition-all'} />
              </button>
              
              {/* Bill Info */}
              <div className="bg-card rounded-[2.5rem] p-8 sm:p-10 shadow-card border border-border">
                <h3 className="text-xl font-black text-secondary mb-8 uppercase tracking-widest text-xs border-b border-border pb-4">Transactional Details</h3>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Cart Subtotal', value: `₹${subtotal.toFixed(0)}` },
                    { label: 'Delivery Premium', value: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`, green: deliveryFee === 0 },
                    { label: 'Platform & Tech Fee', value: `₹${platformFee}` },
                    { label: 'GST (Inclusive of all)', value: `₹${gst}` },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-bold text-muted">
                      <span>{row.label}</span>
                      <span className={row.green ? 'text-accent font-black tracking-widest' : 'text-secondary font-black'}>{row.value}</span>
                    </div>
                  ))}
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm font-black text-accent bg-green-50 border border-accent/20 p-4 rounded-2xl -mx-2">
                      <span className="uppercase tracking-widest">Coupon Savings</span>
                      <span>−₹{discount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end border-t border-border pt-8 mb-10">
                  <div>
                    <span className="text-sm font-black text-secondary uppercase tracking-widest block mb-1">Grand Total</span>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">All taxes accounted</span>
                  </div>
                  <span className="text-4xl font-black text-secondary tracking-tighter">₹{total.toFixed(0)}</span>
                </div>

                {/* Secure Badge */}
                <div className="bg-background rounded-2xl p-5 flex items-start gap-4 mb-10 border border-border">
                  <ShieldCheck size={24} className="text-accent flex-shrink-0" />
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider leading-relaxed">
                    PCI-DSS Compliant Payments. 100% data encryption and zero-risk checkout experience.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-primaryDark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  Confirm Address
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Coupon Drawer ── */}
        <AnimatePresence>
          {showCoupons && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCoupons(false)}
                className="fixed inset-0 bg-secondary/40 backdrop-blur-md z-[100]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed bottom-0 left-0 right-0 bg-card z-[101] rounded-t-[3rem] p-8 sm:p-12 max-h-[85vh] overflow-y-auto no-scrollbar shadow-[0_-20px_60px_rgba(0,0,0,0.2)]"
              >
                <div className="max-w-[800px] mx-auto">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-4xl font-black text-secondary tracking-tighter">Unlocked Offers</h3>
                      <p className="text-sm font-bold text-muted uppercase tracking-widest mt-3">Curated rewards just for you</p>
                    </div>
                    <button onClick={() => setShowCoupons(false)} className="w-12 h-12 flex items-center justify-center bg-background rounded-2xl hover:rotate-90 transition-all duration-300">
                      <X size={24} className="text-secondary" />
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {coupons.map((c, i) => (
                      <div key={i} className="border-2 border-border bg-card hover:border-primary/30 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8 transition-all">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center shadow-inner flex-shrink-0">
                            <Percent size={28} strokeWidth={3}/>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="bg-secondary text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">{c.code}</span>
                            </div>
                            <p className="text-xl font-black text-secondary mb-1 leading-tight">{c.label}</p>
                            <p className="text-xs font-bold text-muted uppercase tracking-widest">Min. order value: ₹{c.min}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => applyCoupon(c)}
                          className="w-full sm:w-auto bg-primary hover:bg-primaryDark text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95"
                        >
                          APPLY
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Cart;
 </AnimatePresence>
    </div>
  );
};

export default Cart;
