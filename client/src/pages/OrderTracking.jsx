import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Phone, MessageSquare, ChevronLeft, ArrowRight, MapPin, ChefHat, Bike, House } from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('placed'); // placed, preparing, out, nearby, delivered
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Simulate status updates
  useEffect(() => {
    const sequence = [
      { status: 'placed', delay: 2000, msg: 'Order received by restaurant!' },
      { status: 'preparing', delay: 5000, msg: 'Chef is preparing your meal 👨‍🍳' },
      { status: 'out', delay: 8000, msg: 'Delivery partner has picked up your order 🏍️' },
      { status: 'nearby', delay: 12000, msg: 'Delivery partner is nearby your location!' },
    ];

    let timer;
    sequence.forEach((step, index) => {
      timer = setTimeout(() => {
        setStatus(step.status);
        setNotificationMsg(step.msg);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }, step.delay);
    });

    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { id: 'placed', label: 'Order Placed', icon: <Check size={16} /> },
    { id: 'preparing', label: 'Preparing', icon: <ChefHat size={16} /> },
    { id: 'out', label: 'On the Way', icon: <Bike size={16} /> },
    { id: 'delivered', label: 'Delivered', icon: <House size={16} /> },
  ];

  return (
    <div className="tracking-page-root">
      <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/orders" className="back-btn-tracking">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="results-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Order #FX-{id?.slice(-4) || '7721'}</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700' }}>ARIVING IN 25 MINS</p>
          </div>
        </div>

        {/* ── TRACKING ANIMATION SECTION (Zomato Style) ── */}
        <div className="tracking-visual-card">
          <div className="map-view-container">
            {/* SVG Map Path */}
            <svg viewBox="0 0 500 200" className="map-svg">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e23744" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#e23744" />
                </linearGradient>
              </defs>
              {/* The Path */}
              <path 
                className="road-path"
                d="M 50 150 Q 150 50 250 150 T 450 100" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
              <path 
                className="active-progress-path"
                d="M 50 150 Q 150 50 250 150 T 450 100" 
                fill="none" 
                stroke="url(#pathGradient)" 
                strokeWidth="12" 
                strokeLinecap="round" 
                style={{ 
                  strokeDasharray: 500, 
                  strokeDashoffset: status === 'placed' ? 500 : status === 'preparing' ? 400 : status === 'out' ? 250 : 0,
                  transition: 'stroke-dashoffset 3s ease-in-out'
                }}
              />

              {/* Restaurant Icon */}
              <circle cx="50" cy="150" r="28" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
              <foreignObject x="35" y="135" width="30" height="30">
                <div style={{ color: '#e23744', display: 'flex', justifyContent: 'center' }}>
                   <ChefHat size={30} />
                </div>
              </foreignObject>

              {/* Delivery Boy Icon (Animated along path) */}
              <motion.g
                animate={{ 
                  offsetDistance: status === 'placed' ? "0%" : status === 'preparing' ? "20%" : status === 'out' ? "60%" : "100%"
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
                style={{ offsetPath: "path('M 50 150 Q 150 50 250 150 T 450 100')", offsetRotate: "auto" }}
              >
                <circle r="22" fill="#e23744" />
                <foreignObject x="-11" y="-11" width="22" height="22">
                  <div style={{ color: 'white', display: 'flex', justifyContent: 'center' }}>
                     <Bike size={22} />
                  </div>
                </foreignObject>
              </motion.g>

              {/* Home Icon */}
              <circle cx="450" cy="100" r="28" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
              <foreignObject x="435" y="85" width="30" height="30">
                <div style={{ color: '#e23744', display: 'flex', justifyContent: 'center' }}>
                   <House size={30} />
                </div>
              </foreignObject>
            </svg>

            {/* Pulsing "Finding Delivery Partner" state */}
            {status === 'placed' && (
              <div className="finding-partner-overlay">
                <div className="pulse-circle" />
                <p>Finding your delivery hero...</p>
              </div>
            )}
          </div>

          <div className="tracking-info-footer">
            <h2 className="tracking-status-title">
              {status === 'placed' ? 'Order Placed' : status === 'preparing' ? 'Preparing Your Food' : status === 'out' ? 'On the Way!' : 'Arrived at your location!'}
            </h2>
            <div className="status-progress-bar">
              {steps.map((s, i) => {
                const isActive = steps.findIndex(st => st.id === status) >= i;
                return (
                  <div key={s.id} className="status-step">
                    <div className={`step-dot ${isActive ? 'active' : ''}`}>
                      {isActive && <Check size={10} />}
                    </div>
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Partner Info */}
        <AnimatePresence>
          {status !== 'placed' && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="delivery-partner-card"
            >
               <div className="partner-avatar">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" alt="Partner" />
               </div>
               <div className="partner-details">
                  <h4>Rahul Sharma</h4>
                  <div className="partner-rating">
                    <Star size={12} style={{ fill: '#eab308', color: '#eab308' }} />
                    <span>4.9 • Delivery Hero</span>
                  </div>
               </div>
               <div className="partner-actions">
                  <button className="action-circle-btn"><Phone size={20} /></button>
                  <button className="action-circle-btn"><MessageSquare size={20} /></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Notification Bubble */}
        <AnimatePresence>
          {showNotification && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="tracking-notif"
            >
              <div className="notif-icon"><Bike size={18} /></div>
              <span>{notificationMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderTracking;
