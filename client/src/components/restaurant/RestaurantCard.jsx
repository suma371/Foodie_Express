import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const ratingColor = restaurant.rating >= 4 ? 'text-green-600' : 'text-orange-500';

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="group block">
      <div className="transition-transform duration-200 group-hover:scale-[0.97]">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-gray-100">
          <img
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient + Offer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white font-black text-sm leading-tight truncate uppercase italic">
              {restaurant.offers?.[0] || '₹125 off on first order'}
            </p>
          </div>
          {/* Promoted Badge */}
          {restaurant.isPromoted && (
            <div className="absolute top-2 left-2 bg-white/90 text-dark text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wide">
              Promoted
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-0.5">
          <h3 className="text-sm sm:text-base font-black text-dark tracking-tight leading-tight mb-1 truncate group-hover:text-primary transition-colors uppercase italic">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-bold text-dark mb-1">
            <span className={`flex items-center gap-0.5 font-black ${ratingColor}`}>
              <Star size={11} fill="currentColor" />
              {restaurant.rating || '4.2'}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-dark-muted">{restaurant.deliveryTime || '25-30'} mins</span>
          </div>

          <p className="text-xs text-dark-muted font-semibold truncate">
            {restaurant.cuisines?.slice(0, 3).join(', ') || 'North Indian, Chinese'}
          </p>
          <p className="text-xs text-gray-400 font-semibold uppercase italic mt-0.5">
            {restaurant.address?.city || 'Downtown'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
