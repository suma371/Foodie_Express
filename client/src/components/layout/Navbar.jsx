import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, MapPin, ChevronDown, ClipboardList, Home, UtensilsCrossed, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen ] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentCity, setCurrentCity] = useState('Mumbai');
  
  const { getCartCount } = useCartContext();
  const { user, logout } = useAuthContext();
  const cartCount = getCartCount();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => setIsMenuOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={17} /> },
    { to: '/restaurants', label: 'Restaurants', icon: <UtensilsCrossed size={17} /> },
  ];

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'
  ];

  return (
    <>
      <nav className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="page-container">
          <div className="navbar-inner">

            {/* Brand */}
            <Link to="/" className="navbar-brand">
              <div className="brand-logo-container">
                <UtensilsCrossed size={20} style={{ strokeWidth: 2.5 }} />
              </div>
              <span className="brand-text">
                FOODIE<span>EXPRESS</span>
              </span>
            </Link>

            {/* Location Selector (desktop) */}
            <button 
              className="navbar-location lg-only"
              onClick={() => setShowLocationModal(true)}
            >
              <MapPin size={16} style={{ color: 'var(--primary-brand)', flexShrink: 0 }} />
              <span className="location-text">{currentCity}</span>
              <ChevronDown size={14} style={{ color: '#64748b' }} />
            </button>

            {/* Desktop Nav Links */}
            <div className="navbar-nav-links md-only">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active-link' : ''}`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              {user && (
                <Link 
                  to="/orders" 
                  className={`nav-link ${location.pathname === '/orders' ? 'active-link' : ''}`}
                >
                  <ClipboardList size={17} /> Orders
                </Link>
              )}
            </div>

            {/* Right Actions (desktop) */}
            <div className="navbar-actions md-only">
              {/* Cart */}
              <Link to="/cart" className="nav-link" style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <ShoppingCart size={22} style={{ strokeWidth: 2 }} />
                  {cartCount > 0 && (
                    <span className="cart-badge">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="lg-only">Cart</span>
              </Link>

              {user ? (
                <div className="navbar-actions">
                  <Link to="/profile" className="nav-link">
                    <div className="user-avatar-small">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="lg-only">{user.name?.split(' ')[0]}</span>
                  </Link>
                  <button onClick={logout} className="sign-out-btn">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Sign In</Link>
              )}
            </div>

            {/* Mobile Right Actions */}
            <div className="navbar-mobile-actions md-hidden">
              <Link to="/cart" className="nav-link" style={{ color: '#1e293b' }}>
                <div style={{ position: 'relative' }}>
                  <ShoppingCart size={24} style={{ strokeWidth: 2 }} />
                  {cartCount > 0 && (
                    <span className="cart-badge">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="navbar-mobile-toggle"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="navbar-mobile-dropdown md-hidden"
            >
              <div className="mobile-dropdown-inner">
                <button 
                  className="mobile-nav-link" 
                  style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                  onClick={() => { setShowLocationModal(true); setIsMenuOpen(false); }}
                >
                  <MapPin size={17} /> Deliver to: {currentCity}
                </button>
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} className="mobile-nav-link">
                    {link.icon} {link.label}
                  </Link>
                ))}
                {user && (
                  <Link to="/orders" className="mobile-nav-link">
                    <ClipboardList size={17} /> My Orders
                  </Link>
                )}
                {user && (
                  <Link to="/profile" className="mobile-nav-link">
                    <User size={17} /> Profile
                  </Link>
                )}
                <div style={{ paddingTop: '1rem' }}>
                  {!user ? (
                    <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Sign In / Create Account</Link>
                  ) : (
                    <button onClick={logout} className="btn btn-outline" style={{ width: '100%', borderColor: '#fecdd3', color: '#ef4444' }}>
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
              className="coupon-sheet-overlay"
              style={{ zIndex: 2000 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="location-modal"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '900', color: '#0f172a' }}>Select Location</h3>
                <button onClick={() => setShowLocationModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Search for area, street name.." 
                  className="input-field-premium"
                  style={{ paddingLeft: '3rem', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', border: '1.5px solid #f1f5f9', borderRadius: '1.25rem', cursor: 'pointer', marginBottom: '2rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-brand)'} onMouseOut={e => e.currentTarget.style.borderColor = '#f1f5f9'}>
                <MapPin size={20} style={{ color: 'var(--primary-brand)' }} />
                <div>
                  <p style={{ fontWeight: '800', fontSize: '0.875rem', color: 'var(--primary-brand)' }}>Detect current location</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Using GPS</p>
                </div>
              </div>

              <h4 style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Popular Cities</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {popularCities.map(city => (
                  <button 
                    key={city}
                    onClick={() => { setCurrentCity(city); setShowLocationModal(false); }}
                    style={{ 
                      padding: '1rem', border: '1.5px solid #f1f5f9', borderRadius: '1rem', backgroundColor: city === currentCity ? '#fef2f2' : 'white', 
                      borderColor: city === currentCity ? 'var(--primary-brand)' : '#f1f5f9', color: city === currentCity ? 'var(--primary-brand)' : '#475569',
                      fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                    }}
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
