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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF7043] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Orders</p>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="max-w-[850px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-end mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 tracking-tight mb-2">My Orders</h1>
            <p className="text-gray-500 font-medium">Track your delicious meals in real-time</p>
          </div>

          <div className="flex items-center p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/50">
            <button 
              onClick={() => setFilter('active')}
              className={`px-8 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Live
            </button>
            <button 
              onClick={() => setFilter('past')}
              className={`px-8 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
                    className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100"
                  >
                    <div className="p-6 sm:p-8">
                      
                      {/* Order Quick Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 border-b border-gray-100 pb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#FF7043]/10 text-[#FF7043] flex items-center justify-center rounded-2xl shrink-0">
                               <Store size={28} />
                            </div>
                            <div>
                               <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">{order.restaurant?.name || 'Local Kitchen'}</h3>
                               <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Order #{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                         </div>
                         <div className="text-left sm:text-right flex flex-col items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
                            <span className="text-2xl font-heading font-black text-gray-900 mb-2">₹{order.totalPrice.toFixed(0)}</span>
                            <div className="flex items-center gap-2 bg-emerald-50 text-[#10B981] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                               Success • Paid
                            </div>
                         </div>
                      </div>

                      {/* Timeline Stepper */}
                      <div className="relative mb-10 mt-6 max-w-md mx-auto hidden sm:block">
                        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-100 rounded-full" />
                        <div 
                          className="absolute top-4 left-4 h-1 bg-[#10B981] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 32px)` }}
                        />
                        
                        <div className="flex justify-between relative z-10">
                          {steps.map((step, i) => {
                             const completed = i <= currentStep;
                             return (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${completed ? 'bg-[#10B981] text-white shadow-emerald-500/30' : 'bg-white border-2 border-gray-200 text-gray-300'}`}>
                                {step.icon}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          )})}
                        </div>
                      </div>

                      <div className="sm:hidden mb-8 p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                            {steps[Math.max(0, currentStep)].icon}
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Current Status</p>
                            <p className="text-base font-bold text-gray-900">{order.status}</p>
                         </div>
                      </div>

                      {/* Action & Info Bar */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50/80 items-center justify-between">
                         <div className="flex items-center flex-wrap gap-4 text-gray-500 text-xs font-semibold">
                            <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="flex items-center gap-1.5"><MapPin size={16} /> {order.shippingAddress.city}</span>
                         </div>
                         <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                            {!isDelivered && (
                               <Link to={`/order-tracking/${order._id}`} className="flex-1 sm:flex-none text-center bg-[#FF7043] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#F4511E] transition-colors shadow-sm">
                                  Track Details
                               </Link>
                            )}
                            <button 
                               onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                               className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-gray-600 font-bold text-xs uppercase tracking-widest bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-xl transition-all"
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
                               <div className="pt-8 mt-6 border-t border-gray-100">
                                  <div className="bg-gray-50/50 rounded-2xl p-6">
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</h4>
                                     <div className="space-y-4">
                                        {order.orderItems.map((item, idx) => (
                                           <div key={idx} className="flex justify-between items-center text-sm">
                                              <div className="flex items-center gap-3">
                                                 <span className="font-bold text-[#FF7043] bg-[#FF7043]/10 px-2 py-0.5 rounded-lg">{item.quantity}x</span>
                                                 <span className="font-bold text-gray-800">{item.name}</span>
                                              </div>
                                              <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                                           </div>
                                        ))}
                                     </div>
                                     <div className="h-px bg-gray-200 my-4" />
                                     <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Address</span>
                                        <span className="text-sm font-semibold text-gray-800 max-w-[200px] text-right">{order.shippingAddress.address}</span>
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
              className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-heading font-black text-gray-900 mb-2">No {filter} orders</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
                {filter === 'active' 
                  ? "You don't have any hungry cravings being fulfilled right now." 
                  : "Let's start your food journey today!"}
              </p>
              <Link to="/restaurants" className="inline-block bg-[#FF7043] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_8px_20px_rgba(255,112,67,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all">
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
