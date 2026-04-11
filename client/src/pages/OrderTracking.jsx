import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Phone, MessageSquare, ChevronLeft, ArrowRight, MapPin, ChefHat, Bike, Home } from 'lucide-react';

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
    { id: 'delivered', label: 'Delivered', icon: <Home size={16} /> },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <Link to="/orders" className="p-3 bg-gray-50 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
            <ChevronLeft size={24} strokeWidth={3} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-dark tracking-tighter uppercase italic">Order Tracking</h1>
            <p className="text-[10px] font-black text-gray-400 tracking-[0.2em]">ID: #FX-{id?.slice(-4) || '7721'}</p>
          </div>
          <div className="ml-auto flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
             <Clock size={18} className="text-primary" />
             <span className="text-sm font-black text-primary uppercase tracking-widest">Ariving in 25 mins</span>
          </div>
        </div>

        {/* ── TRACKING VISUAL ── */}
        <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 mb-12 border border-gray-100 overflow-hidden relative">
          
          <div className="h-[250px] relative mb-12">
            <svg viewBox="0 0 500 200" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fc8019" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#fc8019" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
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
                stroke="#e2e8f0" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              <path 
                className="active-progress-path"
                d="M 50 150 Q 150 50 250 150 T 450 100" 
                fill="none" 
                stroke="url(#pathGradient)" 
                strokeWidth="14" 
                strokeLinecap="round" 
                style={{ 
                  strokeDasharray: 500, 
                  strokeDashoffset: status === 'placed' ? 500 : status === 'preparing' ? 400 : status === 'out' ? 250 : 0,
                  transition: 'stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />

              {/* Start Point */}
              <circle cx="50" cy="150" r="28" fill="white" className="shadow-lg" />
              <foreignObject x="35" y="135" width="30" height="30">
                <div className="text-primary flex justify-center">
                   <ChefHat size={30} strokeWidth={2.5} />
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
                <circle r="22" fill="#fc8019" filter="url(#glow)" />
                <foreignObject x="-11" y="-11" width="22" height="22">
                  <div className="text-white flex justify-center">
                     <Bike size={22} fill="white" />
                  </div>
                </foreignObject>
              </motion.g>

              {/* Destination */}
              <circle cx="450" cy="100" r="28" fill="white" className="shadow-lg" />
              <foreignObject x="435" y="85" width="30" height="30">
                <div className="text-primary flex justify-center">
                   <Home size={30} strokeWidth={2.5} />
                </div>
              </foreignObject>
            </svg>

            {status === 'placed' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-3"
              >
                <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                </div>
                <p className="text-[10px] font-black text-dark uppercase tracking-[0.3em]">Finding Delivery Hero</p>
              </motion.div>
            )}
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-black text-dark tracking-tighter mb-8 uppercase italic text-center">
              {status === 'placed' ? 'Order Confirmed' : status === 'preparing' ? 'Chef is working magic' : status === 'out' ? 'On the Move!' : 'Savor the moment!'}
            </h2>
            
            <div className="flex justify-between relative max-w-xl mx-auto items-center h-4">
              <div className="absolute inset-x-0 h-1 bg-gray-200" />
              {steps.map((s, i) => {
                const isActive = steps.findIndex(st => st.id === status) >= i;
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-gray-100 text-gray-400'}`}>
                      {isActive ? <Check size={14} strokeWidth={4} /> : React.cloneElement(s.icon, { size: 14 })}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-dark' : 'text-gray-300'}`}>{s.label}</span>
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
               className="bg-dark rounded-[3rem] p-8 flex flex-wrap md:flex-nowrap items-center gap-8 shadow-2xl relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="w-24 h-24 rounded-[2rem] overflow-hidden flex-shrink-0 border-4 border-white/10 shadow-xl relative z-10">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Partner" />
               </div>
               
               <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                     <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Rahul Sharma</h4>
                     <div className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Gold Partner</div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 text-yellow-500 font-black">
                       <Star size={16} fill="currentColor" />
                       <span>4.9</span>
                     </div>
                     <span className="text-white/40 text-[10px] uppercase font-black tracking-widest">3500+ Orders Delivered</span>
                  </div>
               </div>

               <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                  <button className="flex-1 md:flex-none p-5 bg-white/10 text-white rounded-2xl hover:bg-primary transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest">
                     <Phone size={20} /> CALL
                  </button>
                  <button className="flex-1 md:flex-none p-5 bg-white/10 text-white rounded-2xl hover:bg-white hover:text-dark transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest">
                     <MessageSquare size={20} /> CHAT
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="fixed bottom-10 right-10 bg-white shadow-elevated border-l-4 border-primary rounded-2xl p-6 z-50 flex items-center gap-6 max-w-sm"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl shadow-inner">
                 <Bike size={24} className="animate-bounce" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Update</p>
                 <span className="text-sm font-black text-dark uppercase tracking-tighter italic leading-none">{notificationMsg}</span>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-gray-300 hover:text-dark"><X size={18} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Internal Clock Icon Helper
const Clock = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
// Internal X Icon Helper
const X = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

import React from 'react';
export default OrderTracking;
