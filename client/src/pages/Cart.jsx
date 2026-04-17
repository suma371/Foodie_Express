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
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-6 text-center">
      <div className="mb-6">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <ShoppingBag size={100} className="text-gray-200 mx-auto" />
        </motion.div>
      </div>
      <h2 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 mb-4">Your cart is empty</h2>
      <p className="text-base font-medium text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Good food is always cooking! Go ahead, order some yummy items from the menu.
      </p>
      <Link
        to="/"
        className="bg-[#FF7043] text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_25px_rgba(255,112,67,0.3)] hover:scale-105 transition-all text-sm uppercase tracking-widest"
      >
        Explore Restaurants
      </Link>
    </div>
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8 sm:py-12 pb-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-heading font-black text-gray-900 mb-8">Secure Checkout</h1>

        {/* Layout: stacks on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left Column: Cart Items ── */}
          <div className="w-full lg:w-[62%] space-y-6">

            {/* Restaurant Header & Item Details */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[1rem] overflow-hidden shadow-sm flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200"
                      className="w-full h-full object-cover"
                      alt="Restaurant"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-heading font-bold text-gray-900 truncate">
                      {cartItems[0]?.restaurantName || 'Your Order'}
                    </h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">
                      {cartItems[0]?.address?.city || 'Downtown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-start justify-between gap-4 group">
                    {/* Item Info */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-[4px] mt-0.5 ${item.isVeg ? 'border-green-600 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-gray-900 group-hover:text-[#FF7043] transition-colors">{item.name}</p>
                        <p className="text-sm text-gray-500 font-semibold mt-1">₹{item.price}</p>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-3 py-2 text-[#FF7043] hover:bg-[#FF7043]/10 transition-colors"
                        >
                          <Minus size={16} strokeWidth={3} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-2 text-[#FF7043] hover:bg-[#FF7043]/10 transition-colors"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>
                      <span className="text-base font-bold text-gray-900">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestion Note */}
            <div className="bg-[#FFF5ED] rounded-[1.5rem] p-5 border border-[#FFCCBC] flex items-start gap-4">
              <Info size={20} className="text-[#FF7043] flex-shrink-0 mt-0.5" />
              <div className="w-full">
                 <input 
                   type="text" 
                   placeholder="Any suggestions? We will pass it on." 
                   className="w-full bg-transparent outline-none placeholder:text-[#FF7043]/60 text-sm font-medium text-gray-900"
                 />
              </div>
            </div>
          </div>

          {/* ── Right Column: Bill Summary ── */}
          <div className="w-full lg:w-[38%] space-y-6 lg:sticky lg:top-[120px]">
            
            {/* Coupon Button */}
            <button
              onClick={() => setShowCoupons(true)}
              className={`w-full bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border flex items-center justify-between group transition-all ${couponCode ? 'border-[#10B981]' : 'border-gray-100 hover:border-[#FF7043]/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${couponCode ? 'bg-emerald-50 text-[#10B981]' : 'bg-[#FF7043]/10 text-[#FF7043]'} group-hover:scale-110 transition-transform`}>
                  <Percent size={22} />
                </div>
                <div className="text-left">
                  <p className={`text-base font-heading font-bold ${couponCode ? 'text-[#10B981]' : 'text-gray-900'} uppercase tracking-tight`}>
                    {couponCode ? `Applied: ${couponCode}` : 'Offers & Benefits'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                     {couponCode ? 'Click to change or remove' : 'Apply coupon codes here'}
                  </p>
                </div>
              </div>
              <ChevronRight size={24} className={couponCode ? 'text-[#10B981]' : 'text-gray-300 group-hover:text-[#FF7043] group-hover:translate-x-1 transition-all'} />
            </button>
            
            {/* Bill Info */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Bill Details</h3>

              <div className="space-y-4 mb-6">
                {[
                  { label: 'Item Total', value: `₹${subtotal.toFixed(0)}` },
                  { label: 'Delivery Fee', value: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`, green: deliveryFee === 0 },
                  { label: 'Platform Fee', value: `₹${platformFee}` },
                  { label: 'GST & Charges', value: `₹${gst}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-sm font-medium text-gray-500">
                    <span>{row.label}</span>
                    <span className={row.green ? 'text-[#10B981] font-bold' : 'text-gray-700'}>{row.value}</span>
                  </div>
                ))}
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm font-bold text-[#10B981] bg-emerald-50 p-3 rounded-xl -mx-3">
                    <span>Coupon Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-6 mb-8">
                <div>
                  <span className="text-base font-bold text-gray-900 block">To Pay</span>
                  <span className="text-xs font-medium text-gray-400">Incl. all taxes</span>
                </div>
                <span className="text-2xl font-heading font-black text-gray-900">₹{total.toFixed(0)}</span>
              </div>

              {/* Secure Badge */}
              <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3 mb-8">
                <ShieldCheck size={20} className="text-[#10B981] flex-shrink-0" />
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Safe & secure payments with 256-bit encryption. 100% authentic local partners.
                </p>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#10B981] hover:bg-emerald-600 text-white py-5 rounded-2xl font-bold text-base shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                Proceed to Checkout
                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1.5 transition-transform" />
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
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[2.5rem] p-6 sm:p-10 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="max-w-[700px] mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-heading font-black text-gray-900">Available Offers</h3>
                    <p className="text-sm font-medium text-gray-500 mt-2">{coupons.length} codes available for your order</p>
                  </div>
                  <button onClick={() => setShowCoupons(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                <div className="grid gap-5">
                  {coupons.map((c, i) => (
                    <div key={i} className="border border-gray-100 bg-white shadow-sm hover:shadow-md rounded-[1.5rem] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-[#FF7043]/10 text-[#FF7043] rounded-[1rem] flex items-center justify-center shadow-sm flex-shrink-0">
                          <Percent size={24} strokeWidth={2.5}/>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-gray-900 text-white px-3 py-1 rounded-md text-xs font-bold tracking-widest">{c.code}</span>
                          </div>
                          <p className="text-base font-bold text-gray-900 mb-1">{c.label}</p>
                          <p className="text-sm text-gray-500 font-medium">Use code {c.code} on orders above ₹{c.min}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => applyCoupon(c)}
                        className="w-full sm:w-auto bg-[#FF7043] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#FF7043]/20 hover:scale-105 transition-all active:scale-95"
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
  );
};

export default Cart;
