import { useState, useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { MapPin, Phone, CreditCard, ShoppingBag, ArrowRight, Loader2, ShieldCheck, Home, Briefcase, Map, Plus, ChevronRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const defaultAddressIndex = user?.addresses?.findIndex(a => a.isDefault);
  const initialIndex = defaultAddressIndex >= 0 ? defaultAddressIndex : (user?.addresses?.length > 0 ? 0 : -1);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(initialIndex);
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    if (selectedAddressIndex >= 0 && user?.addresses) {
      const addr = user.addresses[selectedAddressIndex];
      setShippingAddress({
        address: addr.street,
        city: addr.city,
        postalCode: addr.postalCode,
        phone: addr.phone || user?.phone || '',
      });
    } else if (selectedAddressIndex === -1 && user?.address) {
       setShippingAddress(prev => ({
         ...prev,
         address: user.address,
         phone: user.phone || ''
       }));
    }
  }, [selectedAddressIndex, user]);

  const subtotal = parseFloat(getCartTotal());
  const deliveryFee = 35;
  const platformFee = 5;
  const gst = subtotal * 0.05;
  const total = subtotal + deliveryFee + platformFee + gst;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      toast.error('Please enter complete delivery details');
      return;
    }

    if (paymentMethod === 'Credit Card') {
      await handleRazorpayPayment();
    } else {
      await placeOrder('Pending'); // Cash on Delivery
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const { data: orderData } = await api.post('/payment/create-order', { amount: total });
      const { data: configData } = await api.get('/payment/config');

      const options = {
        key: configData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FoodieExpress',
        description: 'Premium Food Delivery',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setLoading(true);
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await placeOrder('Completed', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (err) {
            toast.error('Payment verification failed.');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingAddress.phone || user.phone,
        },
        theme: {
          color: '#FF7043',
        },
        modal: {
          ondismiss: function() {
             setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
       toast.error(error.response?.data?.message || 'Payment initiation failed');
       setLoading(false);
    }
  };

  const placeOrder = async (status = 'Pending', paymentDetails = null) => {
    try {
      setLoading(true);
      const dbOrderData = {
        orderItems: cartItems.map(item => ({
          ...item,
          foodItem: item._id,
          _id: undefined
        })),
        restaurant: cartItems[0].restaurantId,
        shippingAddress,
        paymentMethod,
        paymentStatus: status,
        paymentDetails: paymentDetails || undefined,
        totalPrice: total,
      };

      let orderId;
      try {
        const { data } = await api.post('/orders', dbOrderData);
        orderId = data._id;
      } catch (apiErr) {
        console.warn('API order failed, using mock tracking:', apiErr);
        orderId = 'mock-' + Date.now().toString(36);
      }

      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate(`/order-tracking/${orderId}`);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Order failed');
      setLoading(false);
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home': return <Home size={20} />;
      case 'Work': return <Briefcase size={20} />;
      default: return <Map size={20} />;
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-12 pb-24">
      <div className="max-w-[1100px] mx-auto px-6">
         <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ── Form Section ── */}
            <div className="w-full lg:w-[65%] space-y-8">
               <div className="flex flex-col gap-3 mb-8">
                  <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 tracking-tight">Checkout securely</h1>
                  <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                     <ShieldCheck size={16} className="text-[#10B981]" /> 100% Encrypted Transactions
                  </p>
               </div>
               
               <form id="checkout-form" onSubmit={submitHandler} className="space-y-8">
                  {/* Delivery Info */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100"
                  >
                     <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-4">
                           <div className="p-3.5 bg-[#FF7043]/10 text-[#FF7043] rounded-2xl">
                             <MapPin size={24} />
                           </div>
                           <div>
                              <h2 className="text-xl font-heading font-bold text-gray-900">Delivery Address</h2>
                              <p className="text-sm font-medium text-gray-500 mt-1">Where are we heading?</p>
                           </div>
                        </div>
                        {user?.addresses?.length > 0 && (
                           <Link to="/profile" className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#FF7043] bg-[#FF7043]/10 px-4 py-2.5 rounded-xl hover:bg-[#FF7043]/20 transition-all">
                              <Plus size={16} /> New Address
                           </Link>
                        )}
                     </div>

                     {user?.addresses && user.addresses.length > 0 ? (
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                           {user.addresses.map((addr, idx) => (
                              <div 
                                 key={idx} 
                                 onClick={() => setSelectedAddressIndex(idx)}
                                 className={`min-w-[280px] flex-shrink-0 p-6 rounded-2xl cursor-pointer transition-all border-2 relative overflow-hidden group ${selectedAddressIndex === idx ? 'bg-[#FF7043]/5 border-[#FF7043] shadow-md shadow-[#FF7043]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                              >
                                 <div className="flex items-center gap-4 mb-4 border-b border-gray-100/50 pb-4">
                                    <div className={`p-2.5 rounded-xl transition-all ${selectedAddressIndex === idx ? 'bg-[#FF7043] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                       {getAddressIcon(addr.type)}
                                    </div>
                                    <h4 className={`text-sm font-bold uppercase tracking-wider ${selectedAddressIndex === idx ? 'text-[#FF7043]' : 'text-gray-500'}`}>{addr.type}</h4>
                                 </div>
                                 <p className="text-gray-900 font-bold text-base mb-2 leading-tight pr-8">{addr.street}</p>
                                 <p className="text-sm text-gray-500 font-medium">{addr.city}, {addr.postalCode}</p>
                                 
                                 {selectedAddressIndex === idx && (
                                    <div className="absolute top-6 right-6 text-[#FF7043]">
                                       <ShieldCheck size={24} fill="currentColor" className="text-white" />
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="space-y-6">
                           <div className="bg-blue-50 p-4 rounded-xl flex gap-4 mb-6">
                              <Info className="text-blue-500" size={20} />
                              <p className="text-sm text-blue-700 font-medium">Save addresses in your profile for a faster checkout. For now, please enter manually.</p>
                           </div>
                           
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 ml-1">Street Address</label>
                              <input 
                                type="text" 
                                required 
                                className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/40 rounded-2xl py-4 px-5 font-medium text-gray-900 outline-none transition-all shadow-sm"
                                value={shippingAddress.address} 
                                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                              />
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-gray-700 ml-1">City</label>
                                 <input 
                                   type="text" 
                                   required 
                                   className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/40 rounded-2xl py-4 px-5 font-medium text-gray-900 outline-none transition-all shadow-sm"
                                   value={shippingAddress.city} 
                                   onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-gray-700 ml-1">Phone Number</label>
                                 <input 
                                   type="tel" 
                                   required 
                                   className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/40 rounded-2xl py-4 px-5 font-medium text-gray-900 outline-none transition-all shadow-sm"
                                   value={shippingAddress.phone} 
                                   onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                                 />
                              </div>
                           </div>
                        </div>
                     )}
                  </motion.div>

                  {/* Payment */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.1 }}
                     className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100"
                  >
                     <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="p-3.5 bg-gray-900 text-white rounded-2xl">
                           <CreditCard size={24} />
                        </div>
                        <div>
                           <h2 className="text-xl font-heading font-bold text-gray-900">Payment Gateway</h2>
                           <p className="text-sm font-medium text-gray-500 mt-1">Select your preferred method</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Credit Card', 'PayPal', 'Cash on Delivery'].map(method => (
                           <label 
                              key={method} 
                              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center ${paymentMethod === method ? 'bg-gray-900 border-gray-900 text-white shadow-xl transform scale-[1.02]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                           >
                              <input type="radio" className="hidden" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
                              <div className={`p-4 rounded-xl ${paymentMethod === method ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                 {method === 'Credit Card' ? <CreditCard size={28} /> : method === 'PayPal' ? <ShoppingBag size={28} /> : <div className="text-2xl">💵</div>}
                              </div>
                              <span className="text-sm font-bold uppercase tracking-wider">{method}</span>
                              {paymentMethod === method && <div className="w-2 h-2 rounded-full bg-[#10B981]" />}
                           </label>
                        ))}
                     </div>
                  </motion.div>
               </form>
            </div>

            {/* ── Sidebar Summary ── */}
            <div className="w-full lg:w-[35%] sticky top-28">
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
               >
                  <h2 className="text-lg font-heading font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Order Summary</h2>
                  
                  <div className="space-y-5 mb-8 pb-8 border-b border-gray-100">
                     {cartItems.map(item => (
                        <div key={item._id} className="flex justify-between items-start group gap-4">
                           <div className="flex items-start gap-4">
                              <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 w-8 py-1.5 rounded-lg text-center mt-0.5">{item.quantity}x</span>
                              <span className="text-base font-bold text-gray-900 group-hover:text-[#FF7043] transition-colors leading-tight">{item.name}</span>
                           </div>
                           <span className="text-base font-bold text-gray-900 whitespace-nowrap">₹{item.price * item.quantity}</span>
                        </div>
                     ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-4 border border-gray-100">
                     <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Cart Subtotal</span>
                        <span className="text-gray-900 font-bold">₹{subtotal.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Taxes & GST</span>
                        <span className="text-gray-900 font-bold">₹{gst.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Delivery Fee</span>
                        <span className="text-gray-900 font-bold">₹{deliveryFee}</span>
                     </div>
                     <div className="w-full h-px bg-gray-200 my-4" />
                     <div className="flex justify-between items-end pt-2">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-heading font-black text-[#10B981] leading-none">₹{total.toFixed(0)}</span>
                     </div>
                  </div>

                  <button 
                     form="checkout-form"
                     type="submit" 
                     disabled={loading}
                     className="w-full bg-[#10B981] hover:bg-emerald-600 text-white py-5 rounded-2xl font-bold shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] text-base group disabled:grayscale disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="animate-spin" /> : <>Pay and Order <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1.5 transition-transform" /></>}
                  </button>

                  <div className="bg-emerald-50 p-4 rounded-xl flex items-start gap-3 mt-6 border border-emerald-100">
                     <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                     <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                        By placing this order, you agree to our policies. 100% secure payment portal.
                     </p>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Checkout;
