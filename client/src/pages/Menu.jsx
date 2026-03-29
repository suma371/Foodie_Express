import { useState, useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { ShoppingBag, Star, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCartContext();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await api.get('/food');
        setFoods(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '70vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center" style={{ minHeight: '70vh', color: '#ef4444', fontWeight: '600' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="page-container menu-page">
      <div className="menu-header">
        <h1 className="menu-title">Explore Our Menu</h1>
        <p className="menu-subtitle">
          Discover a wide variety of delicious meals, from hearty burgers to fresh salads, all prepared with the finest ingredients.
        </p>
      </div>

      <div className="food-grid">
        {foods.map((food) => (
          <div key={food._id} className="food-item-card premium-card group">
            <div className="food-image-container">
              <img 
                src={food.image} 
                alt={food.name} 
                className="food-image-zoom"
              />
              <div className="category-badge">
                {food.category}
              </div>
            </div>
            
            <div className="food-info-section">
              <div className="food-name-row">
                <h3 className="food-item-title">{food.name}</h3>
              </div>
              
              <div className="food-rating-row">
                <Star size={14} className="star-icon-filled" />
                <span className="rating-value">4.8</span>
                <span className="rating-count">(124)</span>
              </div>
              
              <p className="food-item-description">
                {food.description}
              </p>
              
              <div className="food-action-row">
                <span className="food-item-price">${food.price.toFixed(2)}</span>
                <button 
                  onClick={() => handleAddToCart(food)}
                  className="btn btn-primary add-to-cart-btn"
                  aria-label="Add to cart"
                >
                  <Plus size={18} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
