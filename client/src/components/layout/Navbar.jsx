import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Search, Percent, HelpCircle, LayoutDashboard, Home as HomeIcon } from 'lucide-react';
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
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── DESKTOP FLOATING NAVBAR ── */}
      <div className="hidden lg:flex fixed top-0 w-full z-[100] px-8 py-4 justify-center pointer-events-none">
        <nav className={`pointer-events-auto flex items-center justify-between px-8 py-4 w-full max-w-[1200px] bg-white/85 backdrop-blur-xl border border-white/50 rounded-3xl transition-all duration-300 ${scrolled ? 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] translate-y-0' : 'shadow-sm translate-y-2'}`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-[#FF7043] to-[#F4511E] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_4px_10px_rgba(255,112,67,0.3)]">
                F
             </div>
             <span className="font-heading font-bold text-xl tracking-tight text-gray-900">FoodieExpress</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-[#FF7043]' : 'text-gray-500 hover:text-gray-900'}`}>Home</Link>
            <Link to="/restaurants" className={`font-medium transition-colors ${location.pathname === '/restaurants' ? 'text-[#FF7043]' : 'text-gray-500 hover:text-gray-900'}`}>Search</Link>
            <Link to="/restaurants" className="font-medium text-gray-500 hover:text-gray-900 transition-colors relative">
               Offers
               <span className="absolute -top-2.5 -right-3 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">HOT</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
             {user && (user.role === 'admin' || user.role === 'restaurant_owner') && (
                <Link to="/admin" className="text-sm font-semibold border-2 border-gray-900 text-gray-900 px-4 py-2 rounded-full hover:bg-gray-900 hover:text-white transition-colors">
                  Dashboard
                </Link>
             )}
            
             <Link to="/cart" className="relative p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingCart size={20} className="text-gray-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF7043] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
             </Link>
             
             {user ? (
               <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <Link to="/profile" className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-full bg-[#FFCCBC] text-[#F4511E] flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                     </div>
                  </Link>
                  <button onClick={logout} className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors">Sign Out</button>
               </div>
             ) : (
               <Link to="/login" className="flex items-center gap-2 ml-2 bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  Sign In
               </Link>
             )}
          </div>
        </nav>
      </div>

      {/* ── MOBILE / TABLET TOP HEADER ── */}
      <div className="lg:hidden fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100">
         <div className="px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gradient-to-br from-[#FF7043] to-[#F4511E] rounded-lg flex items-center justify-center text-white font-black shadow-sm">
                  F
               </div>
               <span className="font-heading font-bold text-lg text-gray-900">FoodieExpress</span>
            </Link>
            
            <button className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
               <MapPin size={14} className="text-[#FF7043]" />
               <span className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">Home, Andheri East</span>
            </button>
         </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <div className="lg:hidden fixed bottom-0 w-full z-[100] bg-white border-t border-gray-100 pb-1 pt-2 px-6">
         <div className="flex items-center justify-between pb-2">
            {[
               { to: '/', icon: <HomeIcon size={22} />, label: 'Home' },
               { to: '/restaurants', icon: <Search size={22} />, label: 'Search' },
               { to: '/cart', icon: <ShoppingCart size={22} />, label: 'Cart', badge: cartCount },
               { to: user ? '/profile' : '/login', icon: <User size={22} />, label: user ? 'Profile' : 'Login' },
            ].map(link => {
               const isActive = location.pathname === link.to;
               return (
                  <Link key={link.label} to={link.to} className="relative flex flex-col items-center gap-1">
                     <div className={`p-2 rounded-xl transition-colors ${isActive ? 'text-[#FF7043] bg-[#FF7043]/10' : 'text-gray-500 hover:bg-gray-50'}`}>
                        {link.icon}
                        {link.badge > 0 && (
                          <span className="absolute top-1 right-2 bg-[#F4511E] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                            {link.badge}
                          </span>
                        )}
                     </div>
                     <span className={`text-[10px] font-semibold ${isActive ? 'text-[#FF7043]' : 'text-gray-500'}`}>{link.label}</span>
                  </Link>
               );
            })}
         </div>
      </div>

      {/* ── SPACERS ── */}
      <div className="h-[60px] lg:h-[120px]" />
    </>
  );
};

export default Navbar;
