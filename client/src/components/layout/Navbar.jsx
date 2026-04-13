import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, MapPin, ChevronDown, Search, Percent, HelpCircle, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentCity, setCurrentCity] = useState('Mumbai');
  const [currentArea, setCurrentArea] = useState('Andheri East');

  const { getCartCount } = useCartContext();
  const { user, logout } = useAuthContext();
  const cartCount = getCartCount();
  const location = useLocation();

  useEffect(() => setIsMenuOpen(false), [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-4">

          {/* Left: Logo + Location */}
          <div className="flex items-center gap-3 sm:gap-8 min-w-0">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <svg width="34" height="52" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0Z" fill="#FC8019"/>
                <path d="M70 40L30 80M30 40L70 80" stroke="white" strokeWidth="15" strokeLinecap="round"/>
              </svg>
            </Link>

            {/* Location Selector */}
            <button
              className="hidden sm:flex items-center gap-1 cursor-pointer group min-w-0"
              onClick={() => setShowLocationModal(true)}
            >
              <span className="text-sm font-black text-dark border-b-2 border-dark group-hover:text-primary group-hover:border-primary transition-all whitespace-nowrap">
                {currentCity}
              </span>
              <span className="hidden md:block ml-1.5 text-xs font-medium text-dark-muted truncate max-w-[140px]">
                {currentArea}
              </span>
              <ChevronDown className="ml-1 text-primary flex-shrink-0" size={16} />
            </button>
          </div>

          {/* Center/Right: Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            <Link to="/restaurants" className="flex items-center gap-2 font-semibold text-sm text-dark-muted hover:text-primary transition-colors">
              <Search size={18} /> Search
            </Link>
            <Link to="/restaurants" className="flex items-center gap-2 font-semibold text-sm text-dark-muted hover:text-primary transition-colors relative">
              <Percent size={18} /> Offers
              <span className="absolute -top-3 -right-7 bg-green-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-sm tracking-tighter">NEW</span>
            </Link>
            <Link to="/help" className="flex items-center gap-2 font-semibold text-sm text-dark-muted hover:text-primary transition-colors">
              <HelpCircle size={18} /> Help
            </Link>
          </div>

          {/* Right: Auth + Cart + Hamburger */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-6 border-l border-gray-100 pl-8">
              {user ? (
                <div className="flex items-center gap-5">
                  {(user.role === 'admin' || user.role === 'restaurant_owner') && (
                    <Link to="/admin" className="flex items-center gap-2 font-semibold text-sm text-dark-muted hover:text-primary transition-colors">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 font-semibold text-sm text-dark-muted hover:text-primary transition-colors">
                    <User size={18} /> {user.name?.split(' ')[0]}
                  </Link>
                  <button onClick={logout} className="text-[10px] font-black text-gray-400 hover:text-dark uppercase tracking-widest transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 font-semibold text-sm text-dark-muted hover:text-primary transition-colors">
                  <User size={18} /> Sign In
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-1.5 font-semibold text-sm text-dark-muted hover:text-primary transition-colors relative">
              <div className="relative">
                <ShoppingCart size={20} className={cartCount > 0 ? 'text-primary' : ''} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 text-dark hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Location Bar (visible below sm) */}
        <button
          className="sm:hidden w-full px-4 pb-2.5 flex items-center gap-1.5"
          onClick={() => setShowLocationModal(true)}
        >
          <MapPin size={14} className="text-primary flex-shrink-0" />
          <span className="text-xs font-black text-dark truncate">{currentArea}, {currentCity}</span>
          <ChevronDown size={12} className="text-primary ml-auto flex-shrink-0" />
        </button>
      </nav>

      {/* Spacer */}
      <div className="h-16 sm:h-[72px]" />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[70] flex flex-col lg:hidden shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="text-base font-black text-dark tracking-tighter uppercase italic">FoodieExpress</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                  <X size={18} />
                </button>
              </div>

              {/* Location */}
              <button
                className="mx-4 mt-4 flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-100 text-left"
                onClick={() => { setShowLocationModal(true); setIsMenuOpen(false); }}
              >
                <MapPin className="text-primary flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Deliver to</p>
                  <p className="font-black text-dark text-sm truncate">{currentArea}, {currentCity}</p>
                </div>
              </button>

              {/* Nav Links */}
              <div className="flex flex-col gap-1 px-4 mt-4">
                {[
                  { to: '/restaurants', label: 'Search', icon: <Search size={18} /> },
                  { to: '/restaurants', label: 'Offers', icon: <Percent size={18} /> },
                  { to: '/help', label: 'Help', icon: <HelpCircle size={18} /> },
                  ...(user && (user.role === 'admin' || user.role === 'restaurant_owner') ? [{ to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> }] : []),
                  { to: '/orders', label: 'My Orders', icon: <ShoppingCart size={18} /> },
                  { to: '/profile', label: 'Profile', icon: <User size={18} /> },
                ].map(link => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-dark-muted font-bold text-sm hover:bg-orange-50 hover:text-primary transition-all"
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>

              {/* Bottom Auth */}
              <div className="mt-auto px-4 pb-8 pt-4 border-t border-gray-100">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-xl font-black text-base shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-dark text-sm truncate">{user.name}</p>
                        <p className="text-xs text-dark-muted truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full py-3.5 rounded-xl bg-gray-50 text-dark-muted font-bold hover:bg-orange-50 hover:text-primary transition-all text-xs uppercase tracking-widest"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/30 text-sm uppercase italic tracking-tighter"
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-[101]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-dark tracking-tighter uppercase italic">Select Location</h3>
                <button onClick={() => setShowLocationModal(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <X size={20} className="text-dark-muted" />
                </button>
              </div>

              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for area, street name.."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/30 rounded-xl py-3.5 pl-12 pr-4 font-semibold text-sm text-dark outline-none transition-all"
                />
              </div>

              <button className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-gray-100 hover:border-primary/30 hover:bg-orange-50 transition-all mb-6">
                <div className="bg-orange-100 text-primary p-2 rounded-lg">
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <p className="font-black text-dark text-sm">Current Location</p>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Using GPS</p>
                </div>
              </button>

              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">Popular Cities</p>
              <div className="grid grid-cols-2 gap-3">
                {popularCities.map(city => (
                  <button
                    key={city}
                    onClick={() => { setCurrentCity(city); setShowLocationModal(false); }}
                    className={`p-3.5 rounded-xl border-2 font-black text-sm text-left transition-all hover:scale-[1.02] active:scale-95 ${city === currentCity ? 'bg-orange-50 border-primary text-primary' : 'bg-white border-gray-100 text-dark-muted hover:border-gray-200'}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
