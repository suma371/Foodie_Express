import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const RestaurantCard = ({ restaurant }) => {
  // Swiggy Rating Color logic
  const ratingColor = restaurant.rating >= 4 ? 'bg-success' : 'bg-orange-400';

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="group block">
      <motion.div 
        whileHover={{ scale: 0.96 }}
        className="flex flex-col gap-3 transition-transform"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-xl transition-all border border-gray-100">
          <img
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Discount Overlay (Swiggy Style) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-3 left-4 right-4">
             <p className="text-white font-black text-lg xl:text-xl tracking-tighter uppercase italic leading-none truncate">
                {restaurant.offers?.[0] || 'Items at ₹129'}
             </p>
          </div>
        </div>

        {/* Info Content */}
        <div className="px-2">
          <h3 className="text-lg font-black text-dark tracking-tight leading-tight mb-1 truncate group-hover:text-primary transition-colors uppercase italic">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center gap-1.5 text-sm font-black text-dark tracking-tighter mb-1 uppercase">
            <div className={`flex items-center gap-1 text-white ${ratingColor} p-1 rounded-full scale-90`}>
              <Star size={12} fill="currentColor" />
            </div>
            <span>{restaurant.rating || '4.2'}</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">{restaurant.deliveryTime || '25-30'} MINS</span>
          </div>

          <div className="text-xs font-bold text-dark-muted tracking-tight truncate mb-1">
            {restaurant.cuisines?.slice(0, 3).join(', ') || 'North Indian, Chinese, Mughlai'}
          </div>

          <div className="text-xs font-bold text-dark-light tracking-wide uppercase italic">
            {restaurant.address?.city || 'Downtown Central'}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default RestaurantCard;
