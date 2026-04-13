import { useState } from 'react';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, X, Percent, ArrowRight, Minus, Plus, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, getCartTotal, clearCart } = useCartContext();
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-6">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ShoppingBag size={80} className="text-gray-200 mx-auto" />
        </motion.div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-dark tracking-tighter uppercase italic mb-2">Your cart is empty!</h2>
      <p className="text-sm font-semibold text-dark-muted mb-8 max-w-xs">
        You haven't added anything to your cart yet. Explore restaurants and add items.
      </p>
      <Link
        to="/"
        className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/25 hover:bg-primary-dark transition-colors uppercase tracking-tighter italic text-sm"
      >
        See Restaurants Near You
      </Link>
    </div>
  );

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-4 sm:py-6 pb-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* Layout: stacks on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">

          {/* ── Left Column: Cart Items ── */}
          <div className="w-full lg:w-[62%] space-y-4">

            {/* Restaurant Header */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200"
                    className="w-full h-full object-cover"
                    alt="Restaurant"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-dark tracking-tighter uppercase italic truncate">
                    {cartItems[0]?.restaurantName || 'Your Order'}
                  </h2>
                  <p className="text-xs font-semibold text-dark-muted mt-0.5">
                    {cartItems[0]?.address?.city || 'Downtown'}
                  </p>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {cartItems.map(item => (
                  <div key={item._id} className="py-4 sm:py-5 flex items-center justify-between gap-3">
                    {/* Veg dot + Name */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm flex-shrink-0 mt-0.5 ${item.isVeg ? 'border-green-600' : 'border-red-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-dark truncate uppercase italic">{item.name}</p>
                        <p className="text-xs text-dark-muted font-semibold mt-0.5">₹{item.price}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center border border-green-600 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <Minus size={13} strokeWidth={3} />
                        </button>
                        <span className="px-2 font-black text-sm text-green-600">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <Plus size={13} strokeWidth={3} />
                        </button>
                      </div>
                      <span className="text-sm font-black text-dark w-14 text-right italic">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestion Note */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
              <Info size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-dark-muted leading-relaxed">
                Any suggestions? We will pass it on to the restaurant. Extra charges for add-ons may apply.
              </p>
            </div>

            {/* Coupon Button */}
            <button
              onClick={() => setShowCoupons(true)}
              className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                  <Percent size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-dark uppercase italic">
                    {couponCode ? `Applied: ${couponCode}` : 'Apply Coupon'}
                  </p>
                  <p className="text-[11px] text-dark-muted font-semibold mt-0.5">Save big on your order</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* ── Right Column: Bill Summary ── */}
          <div className="w-full lg:w-[38%] lg:sticky lg:top-[85px]">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Bill Details</h3>

              <div className="space-y-3 mb-5">
                {[
                  { label: 'Item Total', value: `₹${subtotal.toFixed(0)}` },
                  { label: 'Delivery Fee', value: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`, green: deliveryFee === 0 },
                  { label: 'Platform Fee', value: `₹${platformFee}` },
                  { label: 'GST & Charges', value: `₹${gst}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-semibold text-dark-muted">
                    <span>{row.label}</span>
                    <span className={row.green ? 'text-green-600 font-black' : ''}>{row.value}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs font-black text-green-600">
                    <span>Coupon Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mb-5">
                <span className="text-sm font-black text-dark uppercase tracking-wider">To Pay</span>
                <span className="text-2xl font-black text-dark italic">₹{total.toFixed(0)}</span>
              </div>

              {/* Secure Badge */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2.5 mb-5">
                <ShieldCheck size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-green-700 font-semibold leading-relaxed">
                  Safe & secure payments. 100% authentic products.
                </p>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-black shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 uppercase italic tracking-tighter text-base group"
              >
                Proceed to Pay
                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-3xl p-5 sm:p-8 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="max-w-[640px] mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-dark uppercase italic tracking-tighter">Available Offers</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{coupons.length} codes available</p>
                  </div>
                  <button onClick={() => setShowCoupons(false)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {coupons.map((c, i) => (
                    <div key={i} className="border border-dashed border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100 flex-shrink-0">🎟️</div>
                        <div>
                          <span className="inline-block bg-white border border-gray-200 px-3 py-1 rounded-lg text-xs font-black text-dark tracking-widest mb-1">{c.code}</span>
                          <p className="text-sm font-black text-dark uppercase italic">{c.label}</p>
                          <p className="text-xs text-dark-muted font-semibold mt-0.5">Min order ₹{c.min}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => applyCoupon(c)}
                        className="w-full sm:w-auto bg-dark text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors active:scale-95"
                      >
                        Apply
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
