import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const rating = restaurant.rating?.toFixed(1) || '4.2';
  const isHighRating = parseFloat(rating) >= 4.0;
  // Use provided delivery info or fallback to mock defaults
  const deliveryTime = restaurant.deliveryTime || '25-30 mins';
  const priceForTwo = restaurant.priceForTwo || '₹400 for two';

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      <div className="card-img-wrapper">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'}
          alt={restaurant.name}
        />
        <div className="card-overlay-bottom">
          <span className="card-overlay-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {deliveryTime}
          </span>
          <span className="card-overlay-text">{priceForTwo}</span>
        </div>
      </div>

      <div className="card-info">
        <div className="card-title-row">
          <h3 className="card-title">
            {restaurant.name}
          </h3>
          <div className={`rating-badge ${isHighRating ? '' : 'rating-mid'}`}>
            {rating} <Star size={10} style={{ fill: 'white' }} />
          </div>
        </div>

        <p className="card-subtitle">
          {restaurant.description || 'Delicious food delivered to your doorstep.'}
        </p>

        <div className="card-footer-safety">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {restaurant.tagline && (
              <span style={{ 
                background: '#fef2f2', 
                color: '#e23744', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.65rem', 
                fontWeight: '800', 
                letterSpacing: '0.05em', 
                textTransform: 'uppercase' 
              }}>
                {restaurant.tagline}
              </span>
            )}
            <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.75rem' }}>FREE DELIVERY</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
