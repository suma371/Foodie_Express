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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const { data: orderData } = await api.post('/payment/create-order', {
        amount: total,
      });

      const { data: config } = await api.get('/payment/config');

      const options = {
        key: config.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FoodieExpress',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const { data: verifyData } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              await placeOrder('Paid', response);
            }
          } catch (err) {
            toast.error('Verification failed: ' + (err.response?.data?.message || err.message));
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#FC8019',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error('Payment initialization failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (paymentStatus = 'Pending', paymentDetails = null) => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems,
        restaurant: cartItems[0].restaurantId || cartItems[0].restaurant?._id,
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          phone: shippingAddress.phone,
        },
        paymentMethod,
        totalPrice: total,
        paymentStatus,
        paymentDetails,
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! 🍕');
      navigate(`/order-tracking/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'Credit Card') {
      handleRazorpayPayment();
    } else {
      placeOrder();
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
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-[1100px] mx-auto px-6">
         <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ── Form Section ── */}
            <div className="w-full lg:w-[65%] space-y-8">
               <div className="flex flex-col gap-3 mb-8">
                  <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight">Checkout securely</h1>
                  <p className="text-muted font-medium text-sm flex items-center gap-2">
                     <ShieldCheck size={16} className="text-accent" /> 100% Encrypted Transactions
                  </p>
               </div>
               
               <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Delivery Info */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-card rounded-[2rem] p-8 md:p-10 shadow-card border border-border"
                  >
                     <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
                        <div className="flex items-center gap-4">
                           <div className="p-3.5 bg-primary/10 text-primary rounded-2xl">
                             <MapPin size={24} />
                           </div>
                           <div>
                              <h2 className="text-xl font-bold text-secondary">Delivery Address</h2>
                              <p className="text-sm font-medium text-muted mt-1">Where are we heading?</p>
                           </div>
                        </div>
                        {user?.addresses?.length > 0 && (
                           <Link to="/profile" className="hidden sm:flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-4 py-2.5 rounded-xl hover:bg-primary/20 transition-all">
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
                                 className={`min-w-[280px] flex-shrink-0 p-6 rounded-2xl cursor-pointer transition-all border-2 relative overflow-hidden group ${selectedAddressIndex === idx ? 'bg-primary/5 border-primary shadow-md shadow-primary/20' : 'bg-card border-border hover:border-gray-200'}`}
                              >
                                 <div className="flex items-center gap-4 mb-4 border-b border-border pb-4">
                                    <div className={`p-2.5 rounded-xl transition-all ${selectedAddressIndex === idx ? 'bg-primary text-white' : 'bg-background text-muted'}`}>
                                       {getAddressIcon(addr.type)}
                                    </div>
                                    <h4 className={`text-sm font-bold uppercase tracking-wider ${selectedAddressIndex === idx ? 'text-primary' : 'text-muted'}`}>{addr.type}</h4>
                                 </div>
                                 <p className="text-secondary font-bold text-base mb-2 leading-tight pr-8">{addr.street}</p>
                                 <p className="text-sm text-muted font-medium">{addr.city}, {addr.postalCode}</p>
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
                              <label className="text-xs font-bold text-secondary ml-1">Street Address</label>
                              <input 
                                type="text" 
                                required 
                                className="w-full bg-background border border-border focus:border-primary/40 rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm"
                                value={shippingAddress.address} 
                                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                              />
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-secondary ml-1">City</label>
                                 <input 
                                   type="text" 
                                   required 
                                   className="w-full bg-background border border-border focus:border-primary/40 rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm"
                                   value={shippingAddress.city} 
                                   onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-secondary ml-1">Phone Number</label>
                                 <input 
                                   type="tel" 
                                   required 
                                   className="w-full bg-background border border-border focus:border-primary/40 rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm"
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
                     className="bg-card rounded-[2rem] p-8 md:p-10 shadow-card border border-border"
                  >
                     <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
                        <div className="p-3.5 bg-secondary text-white rounded-2xl">
                           <CreditCard size={24} />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-secondary">Payment Gateway</h2>
                           <p className="text-sm font-medium text-muted mt-1">Select your preferred method</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Credit Card', 'PayPal', 'Cash on Delivery'].map(method => (
                           <label 
                              key={method} 
                              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center ${paymentMethod === method ? 'bg-secondary border-secondary text-white shadow-xl transform scale-[1.02]' : 'bg-card text-muted border-border hover:border-gray-300'}`}
                           >
                              <input type="radio" className="hidden" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
                              <div className={`p-4 rounded-xl ${paymentMethod === method ? 'bg-white/10 text-white' : 'bg-background text-muted'}`}>
                                 {method === 'Credit Card' ? <CreditCard size={28} /> : method === 'PayPal' ? <ShoppingBag size={28} /> : <div className="text-2xl">💵</div>}
                              </div>
                              <span className="text-sm font-bold uppercase tracking-wider">{method}</span>
                              {paymentMethod === method && <div className="w-2 h-2 rounded-full bg-accent" />}
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
                  className="bg-card rounded-[2.5rem] p-8 shadow-card border border-border"
               >
                  <h2 className="text-lg font-bold text-secondary mb-8 border-b border-border pb-4">Order Summary</h2>
                  
                  <div className="space-y-5 mb-8 pb-8 border-b border-border">
                     {cartItems.map(item => (
                        <div key={item._id} className="flex justify-between items-start group gap-4">
                           <div className="flex items-start gap-4">
                              <span className="text-xs font-bold text-muted bg-background border border-border w-8 py-1.5 rounded-lg text-center mt-0.5">{item.quantity}x</span>
                              <span className="text-base font-bold text-secondary group-hover:text-primary transition-colors leading-tight">{item.name}</span>
                           </div>
                           <span className="text-base font-bold text-secondary whitespace-nowrap">₹{item.price * item.quantity}</span>
                        </div>
                     ))}
                  </div>

                  <div className="bg-background p-6 rounded-2xl mb-8 space-y-4 border border-border">
                     <div className="flex justify-between items-center text-sm font-medium text-muted">
                        <span>Cart Subtotal</span>
                        <span className="text-secondary font-bold">₹{subtotal.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-medium text-muted">
                        <span>Taxes & GST</span>
                        <span className="text-secondary font-bold">₹{gst.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-medium text-muted">
                        <span>Delivery Fee</span>
                        <span className="text-secondary font-bold">₹{deliveryFee}</span>
                     </div>
                     <div className="w-full h-px bg-border my-4" />
                     <div className="flex justify-between items-end pt-2">
                        <span className="text-base font-bold text-secondary">Total</span>
                        <span className="text-3xl font-black text-accent leading-none">₹{total.toFixed(0)}</span>
                     </div>
                  </div>

                  <button 
                     form="checkout-form"
                     type="submit" 
                     disabled={loading}
                     className="bg-primary hover:bg-primaryDark text-white font-medium px-6 py-5 rounded-lg transition w-full shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] group disabled:opacity-70 disabled:grayscale"
                  >
                     {loading ? <Loader2 className="animate-spin" /> : <>Pay and Order <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1.5 transition-transform" /></>}
                  </button>

                  <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3 mt-6 border border-green-100">
                     <ShieldCheck className="text-accent flex-shrink-0 mt-0.5" size={20} />
                     <p className="text-xs text-muted font-medium leading-relaxed">
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
