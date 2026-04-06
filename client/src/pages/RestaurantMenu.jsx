import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { ShoppingBag, Star, Plus, MapPin, Clock, Search, ChevronRight, Info } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { mockRestaurants, mockFoodItems } from '../data/mockData';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addToCart } = useCartContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, foodRes, reviewRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/fooditems/restaurant/${id}`),
          api.get(`/restaurants/${id}/reviews`)
        ]).catch(err => {
          console.warn('API failed, attempting mock fallback...');
          throw err;
        });
        setRestaurant(restaurantRes.data);
        setFoodItems(foodRes.data);
        setReviews(reviewRes.data || []);
      } catch (err) {
        console.error('Error fetching restaurant menu, using mock data:', err);
        // Fallback to mock data
        const mockRest = mockRestaurants.find(r => r._id === id);
        if (mockRest) {
          setRestaurant(mockRest);
          
          // Provide generic food items if none exist for this specific mock restaurant ID
          const fallbackItems = mockFoodItems[id] && mockFoodItems[id].length > 0 ? mockFoodItems[id] : [
            { "_id": id + "f1", "name": "Chef's Special " + mockRest.name.split(' ')[0], "price": 399, "description": "Our signature dish prepared with the finest seasonal ingredients.", "category": "Special", "image": mockRest.image },
            { "_id": id + "f2", "name": "Classic Side Portion", "price": 149, "description": "A perfect accompaniment to round off your main course.", "category": "Veg", "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600" },
            { "_id": id + "f3", "name": "Signature Dessert", "price": 199, "description": "Sweet conclusion to your meal.", "category": "Dessert", "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600" }
          ];
          
          setFoodItems(fallbackItems);
          setReviews([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = (food) => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/restaurants/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      
      // Refresh reviews and restaurant data (for new average rating)
      const [reviewRes, restaurantRes] = await Promise.all([
        api.get(`/restaurants/${id}/reviews`),
        api.get(`/restaurants/${id}`)
      ]);
      setReviews(reviewRes.data);
      setRestaurant(restaurantRes.data);
      
      setRating(0);
      setComment('');
      setSubmittingReview(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="page-container" style={{ padding: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
         <span style={{ cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-brand)'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>Home</span>
         <ChevronRight size={12} />
         <span style={{ cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-brand)'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>Mumbai</span>
         <ChevronRight size={12} />
         <span style={{ color: '#0f172a' }}>{restaurant.name}</span>
      </div>

      <div className="page-container">
        
        {/* Premium Restaurant Header */}
        <header className="menu-header-premium">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start' }} className="md-flex-row">
              <div>
                 <h1 className="results-title" style={{ fontSize: '36px', marginBottom: '0.5rem' }}>{restaurant.name}</h1>
                 <p style={{ color: '#64748b', fontWeight: '500', marginBottom: '1rem' }}>North Indian, Chinese, Continental</p>
                 <p style={{ color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} /> {restaurant.address}
                 </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                 <div className="white-card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#15803d', fontWeight: '900', fontSize: '18px' }}>
                       {restaurant.rating?.toFixed(1) || '0.0'} <Star size={16} style={{ fill: 'currentColor' }} />
                    </div>
                    <div style={{ height: '1px', width: '100%', backgroundColor: '#f1f5f9', margin: '0.5rem 0' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '-0.025em' }}>
                       {reviews.length}+ <br/> Ratings
                    </div>
                 </div>
                 <div className="white-card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '1rem' }}>
                    <div style={{ color: '#0f172a', fontWeight: '900', fontSize: '18px', textAlign: 'center' }}>
                       35
                    </div>
                    <div style={{ height: '1px', width: '100%', backgroundColor: '#f1f5f9', margin: '0.5rem 0' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '-0.025em' }}>
                       Mins <br/> Delivery
                    </div>
                 </div>
              </div>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem', padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontWeight: '700', fontSize: '14px' }}>
                 <Clock size={18} style={{ color: '#94a3b8' }} />
                 <span>Delivery in 25-30 mins</span>
              </div>
              <div style={{ height: '1rem', width: '1px', backgroundColor: '#cbd5e1' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontWeight: '700', fontSize: '14px' }}>
                 <Info size={18} style={{ color: '#94a3b8' }} />
                 <span>Free delivery on orders above ₹500</span>
              </div>
           </div>
        </header>

        {/* Menu Section with Sidebar Mockup */}
        <div style={{ display: 'flex', gap: '3rem', paddingBottom: '8rem' }} className="flex-col lg-flex-row">
           
           {/* Sidebar Categories */}
           <aside className="menu-aside-nav hidden lg-block">
              <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Explore Menu</h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {['Recommended', 'Main Course', 'Appetizers', 'Beverages', 'Desserts'].map((cat, i) => (
                    <button 
                       key={i}
                       className={`menu-nav-btn ${i === 0 ? 'active' : ''}`}
                    >
                       {cat}
                    </button>
                 ))}
              </nav>
           </aside>

           {/* Menu Items */}
           <main style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                 <h2 className="results-title" style={{ fontSize: '24px' }}>Recommended Items ({foodItems.length})</h2>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '0.75rem', color: '#475569', cursor: 'pointer' }}>
                    <Search size={18} />
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>Search in menu</span>
                 </div>
              </div>

               <div>
                  {foodItems.length > 0 ? (
                     foodItems.map((food) => (
                        <motion.div 
                           key={food._id} 
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           className="menu-item-row-large group"
                        >
                           <div className="menu-item-content">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                 <div className="veg-indicator-box" style={{ borderColor: food.category === 'Veg' ? '#16a34a' : '#dc2626' }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: food.category === 'Veg' ? '#16a34a' : '#dc2626' }}></div>
                                 </div>
                                 <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: food.category === 'Veg' ? '#16a34a' : '#dc2626' }}>{food.category}</span>
                              </div>
                              <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{food.name}</h3>
                              <p className="results-title" style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>₹{food.price}</p>
                              <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500', lineHeight: '1.6', maxWidth: '32rem' }}>{food.description}</p>
                           </div>

                           <div className="menu-item-img-wrapper">
                              <img 
                                 src={food.image} 
                                 alt={food.name} 
                                 className="menu-item-img"
                              />
                              <button 
                                 onClick={() => handleAddToCart(food)}
                                 className="add-btn-floating"
                              >
                                 ADD
                              </button>
                              <p style={{ fontSize: '10px', textAlign: 'center', color: '#94a3b8', fontWeight: '900', marginTop: '1.5rem', textTransform: 'uppercase' }}>Customizable</p>
                           </div>
                        </motion.div>
                     ))
                  ) : (
                     <div style={{ padding: '5rem 0', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '2px dashed #e2e8f0' }}>
                        <p style={{ color: '#64748b', fontWeight: '500', fontStyle: 'italic' }}>No items available in the menu yet.</p>
                     </div>
                  )}
               </div>

               {/* Reviews Section */}
               <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                     <div>
                        <h2 className="results-title" style={{ fontSize: '28px' }}>Customer Reviews</h2>
                        <p style={{ color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>See what others are saying about {restaurant.name}</p>
                     </div>
                     <div style={{ padding: '1rem 2rem', backgroundColor: '#f0fdf4', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #dcfce7' }}>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: '#15803d' }}>{restaurant.rating?.toFixed(1) || '0.0'}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <div style={{ display: 'flex', gap: '2px', color: '#15803d' }}>
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={12} style={{ fill: i < Math.round(restaurant.rating || 0) ? 'currentColor' : 'none' }} />
                              ))}
                           </div>
                           <span style={{ fontSize: '10px', fontWeight: '900', color: '#15803d', textTransform: 'uppercase' }}>{reviews.length} Verified Reviews</span>
                        </div>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }} className="lg-grid-cols-2">
                     {/* Review Form */}
                     <div>
                        <div className="white-card" style={{ padding: '2.5rem', borderRadius: '2rem' }}>
                           <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '1.5rem' }}>Write a Review</h3>
                           <form onSubmit={submitReviewHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                              <div>
                                 <label className="input-label" style={{ marginBottom: '0.75rem' }}>How was your experience?</label>
                                 <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                       <button
                                          key={star}
                                          type="button"
                                          onClick={() => setRating(star)}
                                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0', color: star <= rating ? '#eab308' : '#e2e8f0', transition: 'transform 0.2s' }}
                                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                       >
                                          <Star size={32} style={{ fill: star <= rating ? 'currentColor' : 'none', strokeWidth: 2 }} />
                                       </button>
                                    ))}
                                 </div>
                              </div>
                              <div className="input-group">
                                 <label className="input-label">Share your thoughts</label>
                                 <textarea 
                                    className="input-field-premium" 
                                    style={{ minHeight: '120px', padding: '1.25rem', resize: 'none' }} 
                                    placeholder="Tell us about the food quality, delivery speed, etc."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                 ></textarea>
                              </div>
                              <button 
                                 type="submit" 
                                 className="btn btn-primary" 
                                 style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem' }}
                                 disabled={submittingReview}
                              >
                                 {submittingReview ? 'Submitting...' : 'POST REVIEW'}
                              </button>
                           </form>
                        </div>
                     </div>

                     {/* Review List */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {reviews.length > 0 ? (
                           reviews.map((review) => (
                              <motion.div 
                                 key={review._id} 
                                 initial={{ opacity: 0, x: 20 }}
                                 whileInView={{ opacity: 1, x: 0 }}
                                 viewport={{ once: true }}
                                 style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '2rem' }}
                              >
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                       <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900', color: '#64748b' }}>
                                          {review.name.charAt(0)}
                                       </div>
                                       <div>
                                          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{review.name}</h4>
                                          <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                       </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                                       {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={14} style={{ fill: i < review.rating ? 'currentColor' : 'none' }} />
                                       ))}
                                    </div>
                                 </div>
                                 <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>{review.comment}</p>
                              </motion.div>
                           ))
                        ) : (
                           <div style={{ padding: '4rem 0', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '2rem', border: '2px dashed #e2e8f0' }}>
                              <p style={{ color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>No reviews yet</p>
                              <p style={{ color: '#64748b', fontSize: '14px', marginTop: '0.5rem' }}>Be the first to share your experience!</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
           </main>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
