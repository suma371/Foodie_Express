import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Clock, MapPin, ChevronRight, CheckCircle2, Circle, Truck, Utensils, Zap, Store, ChevronDown } from 'lucide-react';
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
    { label: 'Placed', status: 'Pending', icon: <Package size={18} /> },
    { label: 'Preparing', status: 'Preparing', icon: <Utensils size={18} /> },
    { label: 'On the Way', status: 'Out for Delivery', icon: <Truck size={18} /> },
    { label: 'Delivered', status: 'Delivered', icon: <CheckCircle2 size={18} /> },
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="results-page" style={{ padding: '4rem 0' }}>
      <div className="page-container" style={{ maxWidth: '900px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }} className="md-flex-row md-items-end">
          <div>
            <h1 className="results-title" style={{ fontSize: '36px', marginBottom: '0.5rem' }}>My Orders</h1>
            <p style={{ color: '#64748b', fontWeight: '500' }}>Track your delicious meals in real-time</p>
          </div>

          <div className="status-filter-container">
            <button 
              onClick={() => setFilter('active')}
              className={`status-filter-btn ${filter === 'active' ? 'active' : ''}`}
            >
              Live
            </button>
            <button 
              onClick={() => setFilter('past')}
              className={`status-filter-btn ${filter === 'past' ? 'active' : ''}`}
            >
              History
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredOrders.length > 0 ? (
            <motion.div 
              key={filter}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
              {filteredOrders.map((order) => {
                const currentStep = getStepIndex(order.status);
                const isExpanded = expandedOrder === order._id;
                
                return (
                  <div key={order._id} className="white-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '2.5rem' }}>
                    <div style={{ padding: '2.5rem' }}>
                      
                      {/* Order Quick Header */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '3rem' }} className="sm-flex-row">
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div className="empty-cart-icon-bg" style={{ width: '5rem', height: '5rem', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-brand)', borderRadius: '1.75rem', padding: '0' }}>
                               <Store size={36} style={{ strokeWidth: 1.5 }} />
                            </div>
                            <div>
                               <h3 className="card-title" style={{ fontSize: '20px', marginBottom: '0.25rem' }}>{order.restaurant?.name || 'Local Kitchen'}</h3>
                               <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order #{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                         </div>
                         <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span className="results-title" style={{ fontSize: '28px' }}>₹{order.totalPrice.toFixed(0)}</span>
                            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em', border: '1px solid #dcfce7' }}>
                               Success • Paid
                            </div>
                         </div>
                      </div>

                      {/* Timeline Stepper (Premium Look) */}
                      <div className="order-timeline">
                        <div className="timeline-bg-line"></div>
                        <div 
                          className="timeline-active-line"
                          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                        
                        <div className="timeline-step-wrapper">
                          {steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div className={`timeline-step-dot ${i <= currentStep ? 'active' : ''}`}>
                                {step.icon}
                              </div>
                              <span className="timeline-step-label" style={{ color: i <= currentStep ? '#0f172a' : '#cbd5e1' }}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action & Info Bar */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid #f8fafc', alignItems: 'center' }} className="md-flex-row">
                         <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {order.shippingAddress.city}</span>
                         </div>
                         <button 
                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-brand)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'none', border: 'none', cursor: 'pointer' }}
                         >
                            View Items <ChevronDown size={16} style={{ transition: 'transform 0.3s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                         </button>
                      </div>

                      {/* Expandable Item List */}
                      <AnimatePresence>
                         {isExpanded && (
                            <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="order-item-expandable"
                            >
                               <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                  {order.orderItems.map((item, idx) => (
                                     <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                           <span style={{ fontWeight: '900', color: '#94a3b8' }}>{item.quantity}x</span>
                                           <span style={{ fontWeight: '700', color: '#334155' }}>{item.name}</span>
                                        </div>
                                        <span style={{ fontWeight: '900', color: '#0f172a' }}>₹{item.price * item.quantity}</span>
                                     </div>
                                  ))}
                                  <div style={{ height: '1px', backgroundColor: '#e2e8f0', marginTop: '1rem' }}></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                                     <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delivery Address</span>
                                     <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{order.shippingAddress.address}</span>
                                  </div>
                               </div>
                            </motion.div>
                         )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '8rem 0', backgroundColor: 'white', borderRadius: '3rem', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
            >
              <div className="empty-cart-icon-bg" style={{ width: '6rem', height: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Package size={48} style={{ color: '#e2e8f0' }} />
              </div>
              <h3 className="results-title" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>No {filter} orders</h3>
              <p style={{ color: '#64748b', marginBottom: '2.5rem', maxWidth: '300px', margin: '0 auto 2.5rem', fontWeight: '500' }}>
                {filter === 'active' 
                  ? "You don't have any hungry cravings being fulfilled right now." 
                  : "Let's start your food journey today!"}
              </p>
              <Link to="/restaurants" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
                Explore More
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
