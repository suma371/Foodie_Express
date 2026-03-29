import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, MapPin, ChevronDown, ClipboardList, Home, UtensilsCrossed } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen ] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  return (
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
          <button className="navbar-location lg-only">
            <MapPin size={16} style={{ color: 'var(--primary-brand)', flexShrink: 0 }} />
            <span className="location-text">Mumbai</span>
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
      {isMenuOpen && (
        <div className="navbar-mobile-dropdown md-hidden">
          <div className="mobile-dropdown-inner">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
