import { useState } from 'react';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, X, Percent, ArrowRight, Minus, Plus, ShieldCheck, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);

  const subtotal = parseFloat(getCartTotal());
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const platformFee = 7;
  const gst = subtotal * 0.05;
  const total = subtotal + deliveryFee + platformFee + gst - discount;

  const coupons = [
    { code: 'STEAL60', label: '60% OFF UPTO ₹120', min: 200, disc: 120 },
    { code: 'WELCOME', label: 'FLAT ₹100 OFF', min: 400, disc: 100 },
    { code: 'FREEDEL', label: 'FREE DELIVERY', min: 300, disc: 40 }
  ];

  const applyCoupon = (c) => {
    if (subtotal < c.min) {
      toast.error(`Minimum order value ₹${c.min} required`);
      return;
    }
    setCouponCode(c.code);
    setDiscount(c.disc);
    setShowCoupons(false);
    toast.success('Coupon applied!');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="w-80 h-80 mb-8 relative">
           <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_ybi7ss" className="w-full h-full object-contain opacity-80" alt="Empty" />
           <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2"
           >
              <ShoppingBag size={48} className="text-gray-200" />
           </motion.div>
        </div>
        <h2 className="text-2xl font-black text-dark tracking-tighter uppercase italic mb-2">Your cart is empty</h2>
        <p className="text-sm font-bold text-dark-muted tracking-wide uppercase italic mb-10">You can go to home page to view more restaurants</p>
        <Link to="/" className="bg-primary text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-[1.05] transition-transform active:scale-95 uppercase tracking-tighter italic">
          SEE RESTAURANTS NEAR YOU
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-4 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Main Content Area */}
          <div className="w-full lg:w-[65%] space-y-6">
             <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
                <div className="p-8 md:p-10">
                   <div className="flex items-center gap-6 mb-10">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                         <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="RS" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-dark tracking-tighter uppercase italic leading-none">{cartItems[0]?.restaurantName || 'Restaurant'}</h2>
                         <p className="text-xs font-bold text-dark-muted uppercase tracking-widest mt-2">{cartItems[0]?.address?.city || 'Downtown'}</p>
                      </div>
                   </div>

                   <div className="divide-y divide-gray-100">
                      {cartItems.map(item => (
                        <div key={item._id} className="py-8 flex items-center justify-between group">
                           <div className="flex items-start gap-4">
                              <div className={`w-4 h-4 border-2 p-0.5 rounded-sm flex-shrink-0 mt-1 ${item.isVeg ? 'border-success' : 'border-red-500'}`}>
                                 <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-success' : 'bg-red-500'}`} />
                              </div>
                              <div>
                                 <h4 className="text-base font-black text-dark-muted group-hover:text-primary transition-colors tracking-tighter uppercase italic leading-tight">{item.name}</h4>
                                 <p className="text-xs font-black text-dark tracking-widest mt-1 italic">₹{item.price}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-8">
                              <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl py-2 px-3 shadow-sm text-success w-24">
                                 <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="hover:scale-110 active:scale-95 transition-transform"><Minus size={14} strokeWidth={3} /></button>
                                 <span className="font-black text-sm">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="hover:scale-110 active:scale-95 transition-transform"><Plus size={14} strokeWidth={3} /></button>
                              </div>
                              <span className="text-sm font-black text-dark w-16 text-right italic">₹{item.price * item.quantity}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-gray-50 p-6 flex items-center gap-4 italic">
                   <div className="p-3 bg-white rounded-xl shadow-sm"><Info size={20} className="text-dark-muted" /></div>
                   <p className="text-[10px] font-black text-dark-muted uppercase tracking-widest leading-relaxed">
                      Any suggestions? We will pass them on to the restaurant. Extra charges may apply.
                   </p>
                </div>
             </div>

             {/* Offers Section */}
             <button 
                onClick={() => setShowCoupons(true)}
                className="w-full bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between group"
             >
                <div className="flex items-center gap-5">
                   <div className="p-4 bg-primary/5 text-primary rounded-2xl group-hover:scale-110 transition-transform"><Percent size={24} /></div>
                   <div className="text-left">
                      <p className="text-sm font-black text-dark tracking-tight uppercase italic">{couponCode ? `APPLIED: ${couponCode}` : 'APPLY COUPON'}</p>
                      <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest mt-1">Save big on your daily meal</p>
                   </div>
                </div>
                <ChevronRight size={24} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
             </button>
          </div>

          {/* Sidebar Area: Bill Summary */}
          <div className="w-full lg:w-[35%] sticky top-28">
             <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-elevated border border-gray-100">
                <h3 className="text-xs font-black text-dark-light uppercase tracking-[0.3em] mb-8">Bill Details</h3>
                
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center text-xs font-bold text-dark-muted uppercase tracking-widest italic">
                      <span>Item Total</span>
                      <span>₹{subtotal.toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold text-dark-muted uppercase tracking-widest italic">
                      <div className="flex items-center gap-2">
                         <span>Delivery Fee</span>
                         <div className="w-3 h-3 bg-gray-100 rounded-full flex items-center justify-center text-[8px] font-black">?</div>
                      </div>
                      <span className={deliveryFee === 0 ? 'text-success' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold text-dark-muted uppercase tracking-widest italic">
                      <div className="flex items-center gap-2 text-primary">
                         <span>Platform Fee</span>
                      </div>
                      <span>₹{platformFee}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold text-dark-muted uppercase tracking-widest italic border-b border-gray-50 pb-4">
                      <span>GST and Restaurant Charges</span>
                      <span>₹{gst.toFixed(0)}</span>
                   </div>
                   {discount > 0 && (
                     <div className="flex justify-between items-center text-xs font-bold text-success uppercase tracking-widest italic animate-pulse">
                        <span>Coupon Discount</span>
                        <span>-₹{discount}</span>
                     </div>
                   )}
                </div>

                <div className="flex justify-between items-end mb-10">
                   <span className="text-sm font-black text-dark uppercase tracking-[0.2em] mb-1">TO PAY</span>
                   <span className="text-3xl font-black text-dark tracking-tighter italic leading-none">₹{total.toFixed(0)}</span>
                </div>

                <div className="bg-green-50/50 p-5 rounded-2xl flex gap-4 mb-10 border border-green-100">
                   <ShieldCheck className="text-green-600 flex-shrink-0" size={24} />
                   <p className="text-[10px] text-green-700 font-black leading-relaxed uppercase">
                      100% Secure Payments with 256-bit SSL encryption.
                   </p>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-lg uppercase italic tracking-tighter group"
                >
                  PROCEED TO PAY <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal/Drawer */}
      <AnimatePresence>
        {showCoupons && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setShowCoupons(false)}
               className="fixed inset-0 bg-dark/70 backdrop-blur-md z-[100]" 
            />
            <motion.div 
               initial={{ y: '100%' }} 
               animate={{ y: 0 }} 
               exit={{ y: '100%' }} 
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[3rem] p-8 md:p-12 max-h-[80vh] overflow-y-auto no-scrollbar"
            >
               <div className="max-w-[700px] mx-auto">
                  <div className="flex justify-between items-center mb-10">
                     <div>
                        <h3 className="text-2xl font-black text-dark uppercase italic tracking-tighter leading-none">Available Offers</h3>
                        <p className="text-[10px] font-black text-dark-light uppercase tracking-widest mt-2">{coupons.length} DISCOUNT CODES FOUND</p>
                     </div>
                     <button onClick={() => setShowCoupons(false)} className="p-3 bg-gray-50 rounded-2xl"><X size={24} /></button>
                  </div>

                  <div className="space-y-6">
                     {coupons.map((c, i) => (
                        <div key={i} className="border-2 border-dashed border-gray-100 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/50 transition-colors bg-gray-50/50">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">🎟️</div>
                              <div>
                                 <span className="bg-white border border-gray-100 px-4 py-1.5 rounded-lg text-sm font-black text-dark tracking-widest">{c.code}</span>
                                 <p className="text-lg font-black text-dark uppercase italic racking-tighter mt-3">{c.label}</p>
                                 <p className="text-xs font-bold text-dark-muted mt-1">On orders above ₹{c.min}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => applyCoupon(c)}
                             className="bg-dark text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors shadow-lg active:scale-95"
                           >
                              APPLY NOW
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
  );
};

export default Cart;
