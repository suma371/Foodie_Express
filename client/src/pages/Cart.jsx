import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, MapPin, Ticket, X, Tag, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AVAILABLE_COUPONS = [
  { code: 'WELCOME50', discount: 50, type: 'percent', max: 100, desc: '50% off up to ₹100', minOrder: 199 },
  { code: 'SAVEMORE', discount: 20, type: 'percent', max: 500, desc: '20% off up to ₹500', minOrder: 499 },
  { code: 'FREEDEL', discount: 35, type: 'delivery', desc: 'Free delivery on this order', minOrder: 149 },
];

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, getCartTotal } = useCartContext();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [showCouponSheet, setShowCouponSheet] = useState(false);

  const subtotal = parseFloat(getCartTotal());
  const deliveryFee = 35;
  const platformFee = 5;
  const gst = subtotal * 0.05;

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'delivery') return deliveryFee;
    if (appliedCoupon.type === 'percent') {
      const raw = (subtotal * appliedCoupon.discount) / 100;
      return Math.min(raw, appliedCoupon.max);
    }
    return 0;
  };

  const discount = getDiscountAmount();
  const effectiveDelivery = appliedCoupon?.type === 'delivery' ? 0 : deliveryFee;
  const total = subtotal + effectiveDelivery + platformFee + gst - (appliedCoupon?.type !== 'delivery' ? discount : 0);

  const applyCoupon = (code) => {
    const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Minimum order of ₹${found.minOrder} required`);
      return;
    }
    setAppliedCoupon(found);
    setCouponError('');
    setShowCouponSheet(false);
    setCouponInput('');
    toast.success(`🎉 Coupon ${found.code} applied!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    toast('Coupon removed');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-icon-bg">
          <ShoppingBag size={80} style={{ color: '#e2e8f0' }} />
        </div>
        <h2 className="results-title" style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
        <p className="results-subtitle" style={{ marginBottom: '2.5rem', maxWidth: '24rem', marginInline: 'auto' }}>
          Looks like you haven't added anything yet. Go ahead and explore top restaurants!
        </p>
        <Link to="/restaurants" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-container">
        
        <div className="cart-layout">
          
          {/* Main Cart Area */}
          <div className="cart-main-area">
            <div className="white-card">
               <div className="cart-header">
                  <h1 className="results-title" style={{ fontSize: '1.5rem' }}>Your Cart ({cartItems.length} items)</h1>
                  <Link to="/restaurants" className="hover-link" style={{ color: 'var(--primary-brand)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>Add More</Link>
               </div>

               <div>
                  {cartItems.map((item) => (
                    <div key={item._id} className="cart-item-row">
                      <div style={{ position: 'relative' }}>
                         <img 
                           src={item.image} 
                           alt={item.name} 
                           className="cart-item-img"
                         />
                         <div style={{ 
                            position: 'absolute', top: '-4px', left: '-4px', width: '16px', height: '16px', border: '2px solid white', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', backgroundColor: 'white',
                            borderRadius: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                         }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: item.category === 'Veg' ? '#16a34a' : '#dc2626' }}></div>
                         </div>
                      </div>
                      
                      <div className="flex-grow" style={{ textAlign: 'center' }}>
                        <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1.25rem' }}>From: {item.restaurant?.name || 'Local Kitchen'}</p>
                        
                        <div className="cart-item-actions">
                          <div className="qty-pill">
                            <button 
                              onClick={() => updateQty(item._id, item.quantity > 1 ? item.quantity - 1 : 1)}
                              className="qty-btn"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ width: '1.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '900', color: '#1e293b' }}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQty(item._id, item.quantity + 1)}
                              className="qty-btn"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'color 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p className="results-title" style={{ fontSize: '1.5rem' }}>
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* ── COUPONS & OFFERS SECTION ── */}
            <div className="white-card" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #e23744, #fc8019)', padding: '0.75rem', borderRadius: '1rem', color: 'white' }}>
                  <Ticket size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '900', color: '#0f172a', fontSize: '1rem' }}>Coupons & Offers</h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Save more on your order</p>
                </div>
              </div>

              {/* Applied Coupon Banner */}
              <AnimatePresence>
                {appliedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="coupon-applied-banner"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Tag size={18} style={{ color: '#16a34a' }} />
                      <div>
                        <p style={{ fontWeight: '800', color: '#166534', fontSize: '0.875rem' }}>{appliedCoupon.code}</p>
                        <p style={{ fontSize: '0.75rem', color: '#15803d' }}>You save ₹{discount.toFixed(0)} on this order!</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0.25rem' }}>
                      <X size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Coupon Input */}
              {!appliedCoupon && (
                <div>
                  <div className="coupon-input-row">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                      className="input-field-premium"
                      style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700' }}
                    />
                    <button
                      onClick={() => applyCoupon(couponInput)}
                      disabled={!couponInput}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontWeight: '800', borderRadius: '0.75rem', opacity: couponInput ? 1 : 0.5 }}
                    >
                      APPLY
                    </button>
                  </div>
                  {couponError && <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '600', marginTop: '0.5rem' }}>{couponError}</p>}

                  {/* Browse Coupons Button */}
                  <button
                    onClick={() => setShowCouponSheet(true)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '1rem', padding: '1rem', background: '#fef2f2', border: '1px dashed #fca5a5', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#e23744' }}>
                      <Ticket size={16} /> View all coupons
                    </span>
                    <ChevronRight size={16} style={{ color: '#e23744' }} />
                  </button>
                </div>
              )}
            </div>

            {/* Delivery Info Mock */}
            <div className="white-card" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '1rem', color: '#2563eb' }}>
                  <MapPin size={28} />
               </div>
               <div className="flex-grow">
                  <h3 style={{ fontWeight: '900', color: '#0f172a' }}>Delivery Address</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Please select a delivery address to proceed.</p>
               </div>
               <button className="btn btn-outline" style={{ borderColor: '#2563eb', color: '#2563eb', padding: '0.5rem 1.5rem' }}>Set Address</button>
            </div>
          </div>

          {/* Sticky Summary */}
          <div className="cart-summary-area">
            <div className="white-card" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
               <h2 style={{ fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bill Details</h2>
               
               <div style={{ marginBottom: '2rem' }}>
                 <div className="bill-row">
                   <span>Item Total</span>
                   <span style={{ color: '#0f172a' }}>₹{subtotal.toFixed(0)}</span>
                 </div>
                 <div className="bill-row">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Delivery Fee <InfoIcon size={12} /></div>
                   {appliedCoupon?.type === 'delivery' ? (
                     <span style={{ color: '#16a34a' }}><s style={{color:'#94a3b8', marginRight:'0.35rem'}}>₹{deliveryFee}</s> FREE</span>
                   ) : (
                     <span style={{ color: '#0f172a' }}>₹{deliveryFee}</span>
                   )}
                 </div>
                 <div className="bill-row" style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '1.25rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Platform Fee <InfoIcon size={12} /></div>
                   <span style={{ color: '#0f172a' }}>₹{platformFee}</span>
                 </div>
                 <div className="bill-row" style={{ paddingTop: '0.5rem' }}>
                   <span>GST & Restaurant Charges</span>
                   <span style={{ color: '#0f172a' }}>₹{gst.toFixed(0)}</span>
                 </div>
                 {appliedCoupon && appliedCoupon.type !== 'delivery' && (
                   <div className="bill-row" style={{ paddingTop: '0.5rem', color: '#16a34a' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Tag size={14} /> Coupon ({appliedCoupon.code})</span>
                     <span>-₹{discount.toFixed(0)}</span>
                   </div>
                 )}
               </div>
               
               <div className="bill-row-total">
                 <span style={{ fontSize: '1.125rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' }}>To Pay</span>
                 <span className="results-title" style={{ fontSize: '1.875rem' }}>
                   ₹{total.toFixed(0)}
                 </span>
               </div>

               {appliedCoupon && (
                 <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                   <Tag size={14} style={{ color: '#16a34a' }} />
                   <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534' }}>
                     You're saving ₹{discount.toFixed(0)} with {appliedCoupon.code}!
                   </span>
                 </div>
               )}

               <div style={{ backgroundColor: '#f0fdf4', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '2rem', marginTop: '1.5rem' }}>
                  <ShieldCheck style={{ color: '#16a34a', flexShrink: 0 }} size={20} />
                  <p style={{ fontSize: '11px', color: '#166534', fontWeight: '700', lineHeight: '1.5' }}>Safety first! We follow all protocols to ensure your food is handled with care.</p>
               </div>
               
               <Link to="/checkout" className="btn btn-primary checkout-btn">
                  CHECKOUT <ArrowRight size={22} style={{ strokeWidth: 3 }} />
               </Link>

               <p style={{ fontSize: '10px', textAlign: 'center', color: '#94a3b8', fontWeight: '700', marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Payments • No Hidden Charges</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── COUPON BOTTOM SHEET / MODAL ── */}
      <AnimatePresence>
        {showCouponSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCouponSheet(false)}
              className="coupon-sheet-overlay"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="coupon-bottom-sheet"
            >
              <div className="coupon-sheet-header">
                <h2 style={{ fontWeight: '900', fontSize: '1.25rem', color: '#0f172a' }}>Available Coupons</h2>
                <button onClick={() => setShowCouponSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} style={{ color: '#64748b' }} />
                </button>
              </div>

              <div className="coupon-list">
                {AVAILABLE_COUPONS.map(c => {
                  const meetsMin = subtotal >= c.minOrder;
                  return (
                    <div key={c.code} className={`coupon-card ${!meetsMin ? 'disabled' : ''}`}>
                      <div className="coupon-card-left">
                        <div className="coupon-code-tag">
                          <Ticket size={14} />
                          <span>{c.code}</span>
                        </div>
                        <p className="coupon-desc">{c.desc}</p>
                        <p className="coupon-min">Min order: ₹{c.minOrder}</p>
                      </div>
                      <button
                        disabled={!meetsMin}
                        onClick={() => applyCoupon(c.code)}
                        className="coupon-apply-btn"
                      >
                        {meetsMin ? 'APPLY' : `Add ₹${(c.minOrder - subtotal).toFixed(0)} more`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

export default Cart;
