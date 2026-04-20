import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { slideUp } from '../../utils/motion';
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
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          
          {/* Left: Logo & Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 transition duration-200 ease-in-out hover:scale-105">
              <div className="bg-primary text-white font-bold px-3 py-1 rounded-lg shadow-sm">
                Foodie
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 text-sm text-secondary cursor-pointer group transition-all">
              <MapPin size={18} className="text-secondary group-hover:text-primary transition-colors" />
              <span className="font-bold border-b-2 border-secondary group-hover:border-primary group-hover:text-primary transition-all">Bangalore</span>
              <span className="text-primary text-[10px]"><ChevronDown size={14} /></span>
            </div>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative transition duration-200 ease-in-out hover:scale-[1.01]">
            <input
              type="text"
              placeholder="Search for restaurants or food"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background/50 focus:bg-white transition-all text-sm font-medium"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-8">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
                  <User size={20} />
                  <span className="hidden sm:inline text-sm uppercase tracking-wide">Help</span>
                </Link>
                <div className="h-4 w-px bg-border hidden sm:block"></div>
                <Link to="/profile" className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
                   <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                   </div>
                   <span className="hidden sm:inline text-sm truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="hidden sm:block text-[10px] font-black text-muted hover:text-danger uppercase tracking-tighter transition-colors">Sign Out</button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
                <User size={20} />
                <span className="hidden sm:inline text-sm">Sign In</span>
              </Link>
            )}

            <Link to="/cart" className="relative flex items-center gap-2 text-secondary font-bold hover:text-primary transition duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-3 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <motion.div 
        variants={slideUp}
        initial="hidden"
        animate="show"
        className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border flex justify-around items-center py-3 z-[100] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
      >
        {[
          { to: '/', icon: <Search size={22} />, label: 'Search' },
          { to: '/cart', icon: <ShoppingCart size={22} />, label: 'Cart', badge: cartCount },
          { to: user ? '/profile' : '/login', icon: <User size={22} />, label: user ? 'Account' : 'Login' },
        ].map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link key={link.label} to={link.to} className={`relative flex flex-col items-center gap-1 transition-all duration-200 ${isActive ? 'text-primary scale-110' : 'text-muted'}`}>
              {link.icon}
              <span className="text-[10px] font-bold uppercase tracking-tight">{link.label}</span>
              {link.badge > 0 && (
                <span className="absolute top-0 right-1 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </motion.div>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
