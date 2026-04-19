import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="group block focus:outline-none focus:ring-2 focus:ring-primary rounded-[1.5rem]">
      <div className="bg-card shadow-card overflow-hidden rounded-[1.5rem] border-transparent transition-all duration-300 hover:shadow-hover hover:-translate-y-1 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-background">
          <img
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient + Offer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300">
            <p className="text-white font-bold text-base leading-tight truncate drop-shadow-md">
              {restaurant.offers?.[0] || '₹125 OFF ABOVE ₹249'}
            </p>
            <p className="text-white/80 text-[10px] font-bold tracking-wider uppercase mt-1">Special Edition</p>
          </div>
          
          {/* Promoted Badge */}
          {restaurant.isPromoted && (
            <div className="absolute top-3 left-3 bg-white shadow-sm text-secondary text-[10px] font-bold px-2.5 py-1.5 rounded-full uppercase tracking-widest">
              Promoted
            </div>
          )}
          
          {/* Floating Rating */}
          <div className={`absolute top-3 right-3 flex items-center gap-1 bg-rating text-white px-2 py-1.5 rounded-lg font-bold text-xs shadow-card`}>
             <Star size={12} fill="currentColor" />
             {restaurant.rating || '4.2'}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-1.5">
             <h3 className="text-[17px] font-bold text-secondary truncate group-hover:text-primary transition-colors leading-tight">
               {restaurant.name}
             </h3>
          </div>

          <p className="text-sm text-muted font-medium truncate mb-3">
            {restaurant.cuisines?.slice(0, 3).join(', ') || 'North Indian, Chinese'}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
             <div className="flex items-center gap-1.5 text-[13px] font-semibold text-muted bg-background px-2.5 py-1 rounded-lg">
               <Clock size={14} className="text-primary" />
               <span>{restaurant.deliveryTime || '25-30'} min</span>
             </div>
             <p className="text-[11px] text-muted font-bold uppercase tracking-wider">
               {restaurant.address?.city || 'Downtown'}
             </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
