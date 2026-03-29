import { Star, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const rating = restaurant.rating?.toFixed(1) || '4.2';
  const isHighRating = parseFloat(rating) >= 4.0;

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      {/* Image Container */}
      <div className="card-img-wrapper">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'}
          alt={restaurant.name}
        />
        {/* Promo ribbon */}
        <div className="card-badge-top">
          <span className="swiggy-badge" style={{ fontSize: '10px' }}>Promoted</span>
        </div>
        {/* Delivery info bar */}
        <div className="card-overlay-bottom">
          <span className="card-overlay-text">
            <Clock size={11} style={{ strokeWidth: 2.5 }} /> 25–30 mins
          </span>
          <span className="card-overlay-text">₹250 for one</span>
        </div>
      </div>

      {/* Info Block */}
      <div className="card-info">
        <div className="card-title-row">
          <h3 className="card-title">
            {restaurant.name}
          </h3>
          <div className={`rating-badge ${isHighRating ? 'rating-high' : 'rating-mid'}`}>
            {rating} <Star size={9} style={{ fill: 'currentColor' }} />
          </div>
        </div>

        <p className="card-subtitle">
          North Indian • Chinese • Mughlai
        </p>

        <div className="card-footer-safety">
          <Zap size={12} style={{ color: '#16a34a', flexShrink: 0 }} />
          <span className="safety-text">Follows all safety standards</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
