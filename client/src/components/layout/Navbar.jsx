import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, MapPin, ChevronDown, Search, Percent } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen ] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentCity, setCurrentCity] = useState('Mumbai');
  const [currentArea, setCurrentArea] = useState('Andheri East');
  
  const { getCartCount } = useCartContext();
  const { user, logout } = useAuthContext();
  const cartCount = getCartCount();
  const location = useLocation();

  useEffect(() => setIsMenuOpen(false), [location]);

  const navLinks = [
    { to: '/restaurants', label: 'Search', icon: <Search size={20} /> },
    { to: '/restaurants', label: 'Offers', icon: <Percent size={20} />, badge: 'NEW' },
    { to: '/help', label: 'Help', icon: <div className="w-5 h-5 flex items-center justify-center border-2 border-dark text-[10px] font-black rounded-full">?</div> },
  ];

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-premium h-20">
        <div className="max-w-[1240px] mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">

            {/* Left: Logo & Location */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
                <svg width="40" height="60" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0Z" fill="#FC8019"/>
                  <path d="M70 40L30 80M30 40L70 80" stroke="white" strokeWidth="15" strokeLinecap="round"/>
                </svg>
              </Link>

              <button 
                className="flex items-center group cursor-pointer"
                onClick={() => setShowLocationModal(true)}
              >
                <span className="text-sm font-extrabold text-dark border-b-2 border-dark group-hover:text-primary group-hover:border-primary transition-all pb-0.5">
                  {currentCity}
                </span>
                <span className="ml-2 text-xs font-medium text-dark-light line-clamp-1 max-w-[150px] group-hover:text-dark-muted transition-colors">
                  {currentArea}
                </span>
                <ChevronDown className="ml-2 text-primary group-hover:translate-y-0.5 transition-transform" size={18} />
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-12">
              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-12">
                {navLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center gap-3 font-semibold text-dark-muted hover:text-primary transition-colors text-base group relative"
                  >
                    <span className="group-hover:text-primary transition-colors text-dark-muted">{link.icon}</span>
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="absolute -top-3 -right-6 bg-secondary text-[8px] font-black text-white px-1.5 py-0.5 rounded-sm animate-pulse tracking-tighter">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* User/Auth */}
              <div className="hidden lg:block border-l border-gray-100 pl-12">
                {user ? (
                  <div className="flex items-center gap-8">
                    <Link to="/profile" className="flex items-center gap-3 group text-dark-muted hover:text-primary font-semibold transition-colors">
                       <User size={20} />
                       <span>{user.name?.split(' ')[0]}</span>
                    </Link>
                    <button onClick={logout} className="text-[10px] font-black text-gray-400 hover:text-dark uppercase tracking-widest transition-colors">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-3 font-semibold text-dark-muted hover:text-primary transition-colors text-base">
                    <User size={20} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="flex items-center gap-3 font-semibold text-dark-muted hover:text-primary transition-colors text-base relative group">
                <div className="relative">
                  <ShoppingCart size={22} className={cartCount > 0 ? 'text-primary' : 'text-dark-muted'} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {/* Mobile Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-dark hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-dark/60 backdrop-blur-sm lg:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[60] p-8 shadow-2xl flex flex-col lg:hidden"
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="text-xl font-black text-dark tracking-tighter uppercase italic">Foodie Express</span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full text-dark hover:bg-gray-100 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <button 
                    className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-100 mb-6 text-left"
                    onClick={() => { setShowLocationModal(true); setIsMenuOpen(false); }}
                  >
                    <MapPin className="text-primary" size={24} />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Deliver to</p>
                      <p className="font-extrabold text-dark leading-tight">{currentArea}, {currentCity}</p>
                    </div>
                  </button>

                  {navLinks.map(link => (
                    <Link 
                      key={link.label} 
                      to={link.to} 
                      className="flex items-center gap-5 p-5 rounded-2xl text-dark-muted font-bold hover:bg-primary/5 hover:text-primary transition-all text-lg"
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-10 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-6">
                       <div className="flex items-center gap-5 p-2">
                          <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-primary/20">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-dark text-lg leading-tight">{user.name}</p>
                            <p className="text-sm text-dark-muted font-medium">{user.email}</p>
                          </div>
                       </div>
                       <button onClick={logout} className="w-full py-5 rounded-2xl bg-gray-50 text-dark-muted font-bold hover:bg-orange-50 hover:text-primary transition-all text-sm uppercase tracking-widest">
                         Sign Out Account
                       </button>
                    </div>
                  ) : (
                    <Link to="/login" className="flex items-center justify-center w-full py-5 rounded-3xl bg-primary text-white font-black shadow-xl shadow-primary/30 transition-transform active:scale-95 text-lg uppercase italic tracking-tighter">
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <div className="h-20" /> {/* Fixed height spacer */}

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
              className="fixed inset-0 bg-dark/70 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[2.5rem] p-10 shadow-elevated z-[101]"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-dark tracking-tighter uppercase italic">Select Address</h3>
                <button onClick={() => setShowLocationModal(false)} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <X size={24} className="text-dark-muted" />
                </button>
              </div>

              <div className="relative mb-10 group">
                <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-light group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search for area, street name.." 
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.25rem] py-5 pl-16 pr-8 font-black text-dark outline-none transition-all shadow-inner"
                />
              </div>

              <button className="flex items-center gap-5 w-full p-6 rounded-[1.25rem] border-2 border-gray-100 hover:border-primary/20 hover:bg-primary/5 bg-white transition-all group mb-10">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-dark text-lg group-hover:text-primary transition-colors leading-tight">Current Location</p>
                  <p className="text-xs text-dark-light font-bold uppercase tracking-widest mt-1">Using GPS Technology</p>
                </div>
              </button>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-dark-light uppercase tracking-[0.25em] pl-2">Popular Hubs</h4>
                <div className="grid grid-cols-2 gap-4">
                  {popularCities.map(city => (
                    <button 
                      key={city}
                      onClick={() => { setCurrentCity(city); setShowLocationModal(false); }}
                      className={`p-5 rounded-[1.25rem] border-2 font-black text-sm text-left transition-all hover:scale-[1.02] active:scale-95 ${city === currentCity ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-white border-gray-100 text-dark-muted hover:border-gray-200 shadow-sm'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
