import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Clock, MapPin, CheckCircle2, Truck, Utensils, Store, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active, past
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const steps = [
    { label: 'Placed', status: 'Pending', icon: <Package size={16} /> },
    { label: 'Preparing', status: 'Preparing', icon: <Utensils size={16} /> },
    { label: 'On Way', status: 'Out for Delivery', icon: <Truck size={16} /> },
    { label: 'Delivered', status: 'Delivered', icon: <CheckCircle2 size={16} /> },
  ];

  const getStepIndex = (status) => {
    return steps.findIndex(s => s.status === status);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'active') return order.status !== 'Delivered';
    return order.status === 'Delivered';
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted font-bold uppercase tracking-widest text-xs">Loading Orders</p>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-10 sm:py-16">
      <div className="max-w-[850px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-end mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight mb-2">My Orders</h1>
            <p className="text-muted font-medium">Track your delicious meals in real-time</p>
          </div>

          <div className="flex items-center p-1.5 bg-card rounded-2xl border border-border">
            <button 
              onClick={() => setFilter('active')}
              className={`px-8 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'active' ? 'bg-secondary text-white shadow-sm' : 'text-muted hover:text-secondary'}`}
            >
              Live
            </button>
            <button 
              onClick={() => setFilter('past')}
              className={`px-8 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'past' ? 'bg-secondary text-white shadow-sm' : 'text-muted hover:text-secondary'}`}
            >
              History
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredOrders.length > 0 ? (
            <motion.div 
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {filteredOrders.map((order, index) => {
                const currentStep = getStepIndex(order.status);
                const isExpanded = expandedOrder === order._id;
                const isDelivered = order.status === 'Delivered';
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={order._id} 
                    className="bg-card rounded-[2rem] overflow-hidden shadow-card border border-border"
                  >
                    <div className="p-6 sm:p-8">
                      
                      {/* Order Quick Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 border-b border-border pb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl shrink-0">
                               <Store size={28} />
                            </div>
                            <div>
                               <h3 className="text-xl font-bold text-secondary mb-1">{order.restaurant?.name || 'Local Kitchen'}</h3>
                               <p className="text-muted text-xs font-bold uppercase tracking-wider">Order #{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                         </div>
                         <div className="text-left sm:text-right flex flex-col items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
                            <span className="text-2xl font-black text-secondary mb-2">₹{(order.totalAmount || 0).toFixed(0)}</span>
                            <div className="flex items-center gap-2 bg-green-50 text-accent px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                               Success • Paid
                            </div>
                         </div>
                      </div>

                      {/* Timeline Stepper */}
                      <div className="relative mb-10 mt-6 max-w-md mx-auto hidden sm:block">
                        <div className="absolute top-4 left-4 right-4 h-1 bg-background rounded-full" />
                        <div 
                          className="absolute top-4 left-4 h-1 bg-accent rounded-full transition-all duration-700 ease-out"
                          style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 32px)` }}
                        />
                        
                        <div className="flex justify-between relative z-10">
                          {steps.map((step, i) => {
                             const completed = i <= currentStep;
                             return (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${completed ? 'bg-accent text-white shadow-emerald-500/30' : 'bg-card border-2 border-border text-muted'}`}>
                                {step.icon}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${completed ? 'text-secondary' : 'text-muted'}`}>
                                {step.label}
                              </span>
                            </div>
                          )})}
                        </div>
                      </div>

                      <div className="sm:hidden mb-8 p-4 bg-background rounded-2xl flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                            {steps[Math.max(0, currentStep)].icon}
                         </div>
                         <div>
                            <p className="text-xs text-muted font-bold uppercase tracking-widest">Current Status</p>
                            <p className="text-base font-bold text-secondary">{order.status}</p>
                         </div>
                      </div>

                      {/* Action & Info Bar */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border items-center justify-between">
                         <div className="flex items-center flex-wrap gap-4 text-muted text-xs font-semibold">
                            <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            <span className="flex items-center gap-1.5"><MapPin size={16} /> {order.address?.city || 'Your Location'}</span>
                         </div>
                         <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                            {!isDelivered && (
                               <Link to={`/order-tracking/${order._id}`} className="flex-1 sm:flex-none bg-primary hover:bg-primaryDark text-white font-medium px-6 py-3 rounded-lg transition text-xs uppercase tracking-widest text-center shadow-lg">
                                  Track Details
                               </Link>
                            )}
                            <button 
                               onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                               className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-muted font-bold text-xs uppercase tracking-widest bg-background hover:bg-gray-200 px-6 py-3 rounded-lg transition-all"
                            >
                               View Items <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                         </div>
                      </div>

                      {/* Expandable Item List */}
                      <AnimatePresence>
                         {isExpanded && (
                            <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="overflow-hidden"
                            >
                               <div className="pt-8 mt-6 border-t border-border">
                                  <div className="bg-background rounded-2xl p-6">
                                     <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Order Items</h4>
                                     <div className="space-y-4">
                                        {(order.items || []).map((item, idx) => (
                                           <div key={idx} className="flex justify-between items-center text-sm">
                                              <div className="flex items-center gap-3">
                                                 <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{item.quantity}x</span>
                                                 <span className="font-bold text-secondary">{item.name}</span>
                                              </div>
                                              <span className="font-bold text-secondary">₹{item.price * item.quantity}</span>
                                           </div>
                                        ))}
                                     </div>
                                     <div className="h-px bg-border my-4" />
                                     <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-muted uppercase tracking-widest">Delivery Address</span>
                                        <span className="text-sm font-semibold text-secondary max-w-[200px] text-right">{order.address?.address || order.address || 'N/A'}</span>
                                     </div>
                                  </div>
                                </div>
                            </motion.div>
                         )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-card rounded-[3rem] border border-border shadow-card"
            >
              <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-secondary mb-2">No {filter} orders</h3>
              <p className="text-muted font-medium max-w-sm mx-auto mb-8">
                {filter === 'active' 
                  ? "You don't have any hungry cravings being fulfilled right now." 
                  : "Let's start your food journey today!"}
              </p>
              <Link to="/restaurants" className="inline-block bg-primary hover:bg-primaryDark text-white font-medium px-8 py-4 rounded-lg transition shadow-lg text-sm uppercase tracking-widest">
                Explore Menu
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
