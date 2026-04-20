import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Phone, MessageSquare, ChevronLeft, ArrowRight, MapPin, ChefHat, Bike, Home, Clock, X } from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('placed'); // placed, preparing, out, nearby, delivered
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Simulate status updates
  useEffect(() => {
    const sequence = [
      { status: 'placed', delay: 2000, msg: 'Order received by restaurant!' },
      { status: 'preparing', delay: 5000, msg: 'Chef is preparing your meal ⭐' },
      { status: 'out', delay: 8000, msg: 'Delivery partner has picked up your order 🚀' },
      { status: 'nearby', delay: 12000, msg: 'Delivery partner is nearby your location!' },
    ];

    const timers = [];
    sequence.forEach((step, index) => {
      const t = setTimeout(() => {
        setStatus(step.status);
        setNotificationMsg(step.msg);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }, step.delay);
      timers.push(t);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const steps = [
    { id: 'placed', label: 'Order Placed', icon: <Check size={18} /> },
    { id: 'preparing', label: 'Preparing', icon: <ChefHat size={18} /> },
    { id: 'out', label: 'On the Way', icon: <Bike size={18} /> },
    { id: 'delivered', label: 'Delivered', icon: <Home size={18} /> },
  ];

  return (
    <div className="bg-background min-h-screen py-10 sm:py-16">
      <div className="max-w-[850px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <Link to="/orders" className="p-3.5 bg-card rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors border border-border">
              <ChevronLeft size={22} strokeWidth={2.5} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight mb-1">Order Tracking</h1>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">ID: #FX-{id?.slice(-4) || '7721'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-5 py-3 rounded-2xl border border-green-100 w-full sm:w-auto">
             <Clock size={16} className="text-accent" />
             <span className="text-sm font-bold text-accent uppercase tracking-wider">Arriving in 25 mins</span>
          </div>
        </div>

        {/* ── TRACKING VISUAL ── */}
        <div className="bg-card rounded-[2rem] p-8 md:p-12 mb-10 shadow-card border border-border overflow-hidden relative">
          
          <div className="h-[250px] relative mb-12">
            <svg viewBox="0 0 500 200" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <path 
                className="road-path"
                d="M 50 150 Q 150 50 250 150 T 450 100" 
                fill="none" 
                stroke="var(--color-background)" 
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
                  transition: 'stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />

              {/* Start Point */}
              <circle cx="50" cy="150" r="24" fill="white" className="shadow-lg" />
              <foreignObject x="38" y="138" width="24" height="24">
                <div className="text-muted flex justify-center">
                   <ChefHat size={24} />
                </div>
              </foreignObject>

              {/* Delivery Partner */}
              <motion.g
                animate={{ 
                  offsetDistance: status === 'placed' ? "0%" : status === 'preparing' ? "25%" : status === 'out' ? "65%" : "100%"
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
                style={{ offsetPath: "path('M 50 150 Q 150 50 250 150 T 450 100')", offsetRotate: "auto" }}
              >
                <circle r="18" fill="#10B981" filter="url(#glow)" />
                <foreignObject x="-10" y="-10" width="20" height="20">
                  <div className="text-white flex justify-center">
                     <Bike size={20} />
                  </div>
                </foreignObject>
              </motion.g>

              {/* Destination */}
              <circle cx="450" cy="100" r="24" fill="white" className="shadow-lg" />
              <foreignObject x="438" y="88" width="24" height="24">
                <div className="text-muted flex justify-center">
                   <Home size={24} />
                </div>
              </foreignObject>
            </svg>

            {status === 'placed' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-3"
              >
                <div className="flex gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" />
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">Assigning Partner</p>
              </motion.div>
            )}
          </div>

          <div className="pt-8 border-t border-border">
            <h2 className="text-2xl font-black text-secondary mb-8 text-center">
              {status === 'placed' ? 'Order Confirmed!' : status === 'preparing' ? 'Chef is working magic' : status === 'out' ? 'On the Move!' : 'Savor the moment!'}
            </h2>
            
            <div className="flex justify-between relative max-w-lg mx-auto items-center h-2">
              <div className="absolute inset-x-0 h-1.5 bg-background rounded-full" />
              {steps.map((s, i) => {
                const isActive = steps.findIndex(st => st.id === status) >= i;
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-accent text-white shadow-lg shadow-emerald-500/30' : 'bg-background text-muted'}`}>
                      {isActive ? <Check size={18} strokeWidth={3} /> : React.cloneElement(s.icon, { size: 18 })}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-secondary' : 'text-muted'}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Partner */}
        <AnimatePresence>
          {status !== 'placed' && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-card rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-card border border-border relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent opacity-50" />
               
               <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-card shadow-xl relative z-10">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Partner" />
               </div>
               
               <div className="flex-grow relative z-10 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                     <h4 className="text-xl font-black text-secondary">Emily Chen</h4>
                     <div className="bg-amber-100 text-rating text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">Star Partner</div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                     <div className="flex items-center gap-1.5 text-secondary bg-background px-3 py-1 rounded-full font-bold text-sm border border-border">
                       <Star size={14} className="text-rating" fill="currentColor" />
                       <span>4.9</span>
                     </div>
                     <span className="text-muted text-[10px] uppercase font-bold tracking-widest">3500+ Deliveries</span>
                  </div>
               </div>

               <div className="flex items-center gap-4 relative z-10 w-full md:w-auto mt-4 md:mt-0">
                  <button className="flex-1 md:flex-none py-4 px-6 bg-accent/10 text-accent rounded-2xl hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest">
                     <Phone size={18} /> Call
                  </button>
                  <button className="flex-1 md:flex-none py-4 px-6 bg-background text-muted rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest border border-border">
                     <MessageSquare size={18} /> Chat
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-secondary shadow-2xl rounded-2xl p-4 sm:p-5 z-50 flex items-center gap-5 w-[90%] max-w-sm"
            >
              <div className="w-10 h-10 bg-white/10 text-white flex items-center justify-center rounded-xl shrink-0">
                 <div className="animate-pulse"><Bike size={20} /></div>
              </div>
              <div className="flex-grow">
                 <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Live Update</p>
                 <span className="text-sm font-bold text-white pr-4 block">{notificationMsg}</span>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-white/40 hover:text-white p-2">
                 <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderTracking;
