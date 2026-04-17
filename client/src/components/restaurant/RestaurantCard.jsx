import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const ratingColor = restaurant.rating >= 4 ? 'bg-[#10B981]' : 'bg-[#F59E0B]';

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="group block focus:outline-none focus:ring-2 focus:ring-[#FF7043] rounded-[1.5rem]">
      <div className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient + Offer */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300">
            <p className="text-white font-heading font-bold text-base leading-tight truncate drop-shadow-md">
              {restaurant.offers?.[0] || '₹125 OFF ABOVE ₹249'}
            </p>
            <p className="text-white/80 text-[10px] font-bold tracking-wider uppercase mt-1">Special Edition</p>
          </div>
          
          {/* Promoted Badge */}
          {restaurant.isPromoted && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-sm text-gray-900 text-[10px] font-bold px-2.5 py-1.5 rounded-full uppercase tracking-widest">
              Promoted
            </div>
          )}
          
          {/* Floating Rating */}
          <div className={`absolute top-3 right-3 flex items-center gap-1 ${ratingColor} text-white px-2 py-1.5 rounded-lg font-bold text-xs shadow-lg`}>
             <Star size={12} fill="currentColor" />
             {restaurant.rating || '4.2'}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-1.5">
             <h3 className="text-[17px] font-heading font-bold text-gray-900 truncate group-hover:text-[#FF7043] transition-colors leading-tight">
               {restaurant.name}
             </h3>
          </div>

          <p className="text-sm text-gray-500 font-medium truncate mb-3">
            {restaurant.cuisines?.slice(0, 3).join(', ') || 'North Indian, Chinese'}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100/80">
             <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
               <Clock size={14} className="text-[#FF7043]" />
               <span>{restaurant.deliveryTime || '25-30'} min</span>
             </div>
             <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
               {restaurant.address?.city || 'Downtown'}
             </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
