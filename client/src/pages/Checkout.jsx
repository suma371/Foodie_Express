import { useState, useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { 
  MapPin, Phone, CreditCard, ShoppingBag, 
  ArrowRight, Loader2, ShieldCheck, Home, 
  Briefcase, Map, Plus, ChevronRight, Info,
  CheckCircle2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

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
    }
  }, [selectedAddressIndex, user]);

  const subtotal = parseFloat(getCartTotal());
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const platformFee = 5;
  const gst = subtotal * 0.05;
  const total = subtotal + deliveryFee + platformFee + gst;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      toast.error('Payment gateway failed to load. Please check your connection.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order on Backend
      const { data: orderData } = await api.post('/payment/create-order', {
        amount: total,
      });

      // 2. Get Config
      const { data: config } = await api.get('/payment/config');

      const options = {
        key: config.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FoodieExpress',
        description: 'Authentic Cuisines Delivery',
        image: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            setLoading(true);
            const { data: verifyData } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              await placeOrder('Paid', response);
            }
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingAddress.phone || user.phone,
        },
        theme: {
          color: '#FC8019',
        },
        modal: {
            ondismiss: function() {
                setLoading(false);
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Could not initialize payment: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const placeOrder = async (paymentStatus = 'Pending', paymentDetails = null) => {
    setLoading(true);
    try {
      const payload = {
        orderItems: cartItems,
        restaurant: cartItems[0].restaurantId || cartItems[0].restaurant?._id,
        shippingAddress,
        paymentMethod,
        totalPrice: total,
        paymentStatus,
        paymentDetails,
      };

      const { data } = await api.post('/orders', payload);
      setPlacedOrderId(data._id);
      setOrderPlaced(true);
      clearCart();
      
      // Success delay for animation
      setTimeout(() => {
        navigate(`/order-tracking/${data._id}`);
      }, 3000);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.address || !shippingAddress.phone) {
        return toast.error('Please complete delivery details');
    }

    if (paymentMethod === 'Credit Card') {
      handleRazorpayPayment();
    } else {
      placeOrder();
    }
  };

  if (orderPlaced) return (
     <PageWrapper>
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-32 h-32 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-8"
            >
                <CheckCircle2 size={64} />
            </motion.div>
            <motion.h2 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-4xl font-black text-secondary tracking-tight mb-4"
            >
                Order Placed Successfully!
            </motion.h2>
            <motion.p 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="text-muted font-semibold max-w-sm"
            >
                Your feast is being prepared. We are redirecting you to the live tracking dashboard...
            </motion.p>
            <div className="mt-12 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        </div>
     </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="bg-background min-h-screen pt-12 pb-24">
        <div className="max-w-[1100px] mx-auto px-6">
           <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* ── Main Panel ── */}
              <div className="w-full lg:w-[65%] space-y-8">
                 <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-none">Complete Order</h1>
                    <p className="text-muted font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                       <ShieldCheck size={16} className="text-accent" /> Secured Checkout Portal
                    </p>
                 </div>
                 
                 <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                    {/* ── Address ── */}
                    <div className="bg-card rounded-[2.5rem] p-8 md:p-10 shadow-card border border-border overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
                       <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
                          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                             <MapPin size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-secondary">Drop-off Location</h2>
                             <p className="text-sm font-semibold text-muted">Select or add a new address</p>
                          </div>
                       </div>

                       {user?.addresses?.length > 0 ? (
                          <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar -mx-2 px-2">
                             {user.addresses.map((addr, idx) => (
                                <div 
                                   key={idx} 
                                   onClick={() => setSelectedAddressIndex(idx)}
                                   className={`min-w-[280px] p-6 rounded-3xl cursor-pointer transition-all border-2 relative ${selectedAddressIndex === idx ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'bg-background border-transparent hover:border-border grayscale opacity-60 hover:grayscale-0 hover:opacity-100'}`}
                                >
                                   <div className="flex items-center gap-3 mb-4">
                                      <div className={`p-2 rounded-lg ${selectedAddressIndex === idx ? 'bg-primary text-white' : 'bg-card text-muted'}`}>
                                         {addr.type === 'Home' ? <Home size={18} /> : addr.type === 'Work' ? <Briefcase size={18} /> : <Map size={18} />}
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-widest">{addr.type}</span>
                                   </div>
                                   <p className="text-secondary font-black text-base truncate mb-1">{addr.street}</p>
                                   <p className="text-xs text-muted font-bold">{addr.city}, {addr.postalCode}</p>
                                </div>
                             ))}
                             <Link to="/profile" className="min-w-[120px] rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted hover:text-primary hover:border-primary transition-all group">
                                <Plus size={32} />
                                <span className="text-[10px] font-black uppercase tracking-widest">New</span>
                             </Link>
                          </div>
                       ) : (
                          <div className="space-y-6">
                             <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-700">
                                <AlertTriangle size={20} className="flex-shrink-0" />
                                <p className="text-xs font-bold leading-relaxed">No saved addresses found. Please enter manually or add one in your profile.</p>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Street Address</label>
                                  <input 
                                    className="w-full bg-background border border-border rounded-xl px-5 py-3.5 font-bold text-sm focus:ring-2 focus:ring-primary transition-all"
                                    value={shippingAddress.address}
                                    onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Phone</label>
                                  <input 
                                    className="w-full bg-background border border-border rounded-xl px-5 py-3.5 font-bold text-sm focus:ring-2 focus:ring-primary transition-all"
                                    value={shippingAddress.phone}
                                    onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})}
                                  />
                                </div>
                             </div>
                          </div>
                       )}
                    </div>

                    {/* ── Payment ── */}
                    <div className="bg-card rounded-[2.5rem] p-8 md:p-10 shadow-card border border-border">
                       <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
                          <div className="p-4 bg-secondary text-white rounded-2xl">
                             <CreditCard size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-secondary">Payment Method</h2>
                             <p className="text-sm font-semibold text-muted">Select your gateway</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[
                            { id: 'Credit Card', label: 'Online Pay', icon: <CreditCard size={24} />, tag: 'Fast' },
                            { id: 'COD', label: 'Cash / UPI', icon: <ShoppingBag size={24} />, tag: 'Standard' }
                          ].map(method => (
                             <label 
                                key={method.id}
                                className={`cursor-pointer p-6 rounded-3xl border-2 transition-all relative overflow-hidden flex flex-col items-center gap-4 text-center ${paymentMethod === method.id ? 'bg-secondary border-secondary text-white shadow-xl shadow-secondary/20' : 'bg-background border-transparent grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                             >
                                <input type="radio" className="hidden" value={method.id} checked={paymentMethod === method.id} onChange={e => setPaymentMethod(e.target.value)} />
                                <div className="text-primary bg-white/10 p-4 rounded-2xl mb-2">
                                  {method.icon}
                                </div>
                                <span className="font-black text-xs uppercase tracking-widest">{method.label}</span>
                                {paymentMethod === method.id && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent animate-pulse" />}
                             </label>
                          ))}
                       </div>
                    </div>
                 </form>
              </div>

              {/* ── Sidebar Summary ── */}
              <div className="w-full lg:w-[35%] sticky top-28">
                 <div className="bg-card rounded-[2.5rem] p-8 shadow-card border border-border">
                    <h2 className="text-lg font-black text-secondary mb-8 border-b border-border pb-4 uppercase tracking-widest">Summary</h2>
                    
                    <div className="space-y-6 mb-8 pb-8 border-b border-border max-h-[300px] overflow-y-auto no-scrollbar">
                       {cartItems.map(item => (
                          <div key={item._id} className="flex justify-between items-start gap-4">
                             <div className="flex items-start gap-3">
                                <span className="text-[10px] font-black text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg mt-0.5">{item.quantity}×</span>
                                <div className="flex flex-col">
                                   <span className="text-sm font-bold text-secondary truncate max-w-[150px]">{item.name}</span>
                                   <span className="text-[10px] font-bold text-muted">₹{item.price} each</span>
                                </div>
                             </div>
                             <span className="text-sm font-black text-secondary">₹{item.price * item.quantity}</span>
                          </div>
                       ))}
                    </div>

                    <div className="bg-background p-6 rounded-3xl mb-8 space-y-4 border border-border shadow-inner">
                       <div className="flex justify-between items-center text-xs font-bold text-muted">
                          <span>Subtotal</span>
                          <span className="text-secondary">₹{subtotal.toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-bold text-muted">
                          <span>Delivery & Platform</span>
                          <span className={`${deliveryFee === 0 ? 'text-accent' : 'text-secondary'}`}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee + platformFee}`}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-bold text-muted">
                          <span>GST (5%)</span>
                          <span className="text-secondary">₹{gst.toFixed(0)}</span>
                       </div>
                       <div className="w-full h-px bg-border my-4 border-dashed" />
                       <div className="flex justify-between items-end pt-2">
                          <span className="text-base font-black text-secondary uppercase">To Pay</span>
                          <span className="text-4xl font-black text-accent leading-none font-serif tracking-tighter">₹{total.toFixed(0)}</span>
                       </div>
                    </div>

                    <button 
                       form="checkout-form"
                       type="submit" 
                       disabled={loading}
                       className="w-full bg-primary hover:bg-primaryDark text-white py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                       {loading ? <Loader2 className="animate-spin" /> : (
                         <>
                            <span className="font-black uppercase tracking-widest text-xs">Verify & Order</span>
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                         </>
                       )}
                    </button>

                    <div className="mt-8 pt-8 border-t border-border flex items-center gap-4 opacity-70">
                        <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-accent border border-border">
                            <ShieldCheck size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-tight">Your data is secured with SSL encryption and PCI-compliant gateways.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Checkout;
