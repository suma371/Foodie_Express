import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Search, ChevronDown, ListOrdered, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCartContext();
  const { user, logout } = useAuthContext();
  const cartCount = getCartCount();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', icon: <HomeIcon size={22} />, label: 'Home' },
    { to: '/cart', icon: <ShoppingCart size={22} />, label: 'Cart', badge: cartCount },
    { to: user ? '/orders' : '/login', icon: <ListOrdered size={22} />, label: 'Orders' },
    { to: user ? '/profile' : '/login', icon: <User size={22} />, label: user ? 'Account' : 'Login' },
  ];

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-border/50 py-2' 
        : 'bg-white border-b border-transparent py-4'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-18">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white font-black px-4 py-1.5 rounded-xl shadow-lg shadow-primary/20 tracking-tighter text-xl"
              >
                FX
              </motion.div>
              <span className="hidden lg:block font-black text-secondary text-2xl tracking-tighter">Foodie<span className="text-primary">Express</span></span>
            </Link>

            <div className="hidden xl:flex items-center gap-3 text-sm text-secondary cursor-pointer group px-4 py-2 hover:bg-background rounded-2xl transition-all">
              <MapPin size={18} className="text-primary" />
              <div className="flex flex-col">
                 <span className="font-black leading-none group-hover:text-primary transition-colors">Indiranagar</span>
                 <span className="text-[10px] text-muted font-bold truncate max-w-[120px]">Bangalore, Karnataka</span>
              </div>
              <ChevronDown size={14} className="text-muted group-hover:text-primary group-hover:rotate-180 transition-all duration-300" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-10">
            <Link to="/search" className="hidden md:flex items-center gap-2 relative group account-nav cursor-text">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-hover:text-primary transition-colors" size={18} />
               <div className="bg-background border border-transparent group-hover:border-primary/20 group-hover:bg-white rounded-2xl py-2.5 pl-12 pr-6 text-sm font-bold text-muted w-[250px] lg:w-[350px] transition-all flex items-center">
                 Search for 'Sushi'...
               </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-8">
                {user ? (
                  <div className="flex items-center gap-2 md:gap-8">
                    {(user.role === 'admin' || user.role === 'restaurant_owner') && (
                      <Link to="/admin" className="flex items-center gap-2 text-primary font-black hover:scale-105 transition-transform">
                         <span className="text-[10px] uppercase tracking-[0.2em] bg-primary/10 px-4 py-2 rounded-full border border-primary/20">Dashboard</span>
                      </Link>
                    )}
                    <Link to="/orders" className="hidden lg:flex items-center gap-2 text-secondary font-black hover:text-primary transition-all group">
                      <ListOrdered size={20} className="group-hover:-translate-y-1 transition-transform" />
                      <span className="text-sm uppercase tracking-widest text-[11px]">Orders</span>
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 text-secondary group">
                       <div className="w-10 h-10 rounded-2xl bg-secondary text-white flex items-center justify-center font-black group-hover:bg-primary transition-colors shadow-lg shadow-secondary/10">
                          {user.name.charAt(0)}
                       </div>
                       <div className="hidden lg:flex flex-col">
                          <span className="text-xs font-black leading-none">{user.name.split(' ')[0]}</span>
                          <span className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">Prime Member</span>
                       </div>
                    </Link>
                    <button onClick={logout} className="hidden sm:block text-[9px] font-black text-muted hover:text-danger uppercase tracking-[0.2em] transition-colors ml-2">Log Out</button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-secondary font-black hover:text-primary transition-all group">
                    <User size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] uppercase tracking-widest">Sign In</span>
                  </Link>
                )}

                <Link to="/cart" className="relative flex items-center gap-2 text-secondary font-black hover:text-primary transition-all group">
                  <div className="bg-background group-hover:bg-primary/10 p-3 rounded-2xl transition-colors">
                    <ShoppingCart size={22} />
                  </div>
                  <span className="hidden lg:inline text-[11px] uppercase tracking-widest">Cart</span>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-xl shadow-accent/20"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-border flex justify-around items-center py-4 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-4">
        {navLinks.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link 
              key={link.label} 
              to={link.to} 
              className={`relative flex flex-col items-center gap-1.5 transition-all duration-500 ${isActive ? 'text-primary' : 'text-muted'}`}
            >
              <div className={`relative p-2 rounded-2xl transition-all duration-500 ${isActive ? 'bg-primary/10' : ''}`}>
                 {link.icon}
                 {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-primary/10 rounded-2xl z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                 )}
                 {link.badge > 0 && (
                   <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                     {link.badge}
                   </span>
                 )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-1'}`}>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Page Spacer */}
      <div className="h-16 md:h-18" />
    </>
  );
};

export default Navbar;
