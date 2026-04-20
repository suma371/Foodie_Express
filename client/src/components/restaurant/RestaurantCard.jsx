import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { scaleHover } from '../../utils/motion';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="block">
      <motion.div
        whileHover={scaleHover.whileHover}
        whileTap={scaleHover.whileTap}
        className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition duration-200 cursor-pointer flex flex-col h-full border border-transparent hover:border-border"
      >
        {/* Image */}
        <div className="relative overflow-hidden h-40 w-full">
          <img 
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'} 
            className="h-full w-full object-cover transition-transform duration-500" 
            alt={restaurant.name}
          />
          {/* Time Overlay */}
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
             {restaurant.deliveryTime || '25-30'} MINS
          </div>
          {restaurant.isPromoted && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
              Promoted
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-secondary truncate">
            {restaurant.name}
          </h3>
          
          <p className="text-sm text-muted truncate">
            {restaurant.cuisines?.slice(0, 3).join(', ') || 'Various Cuisines'}
          </p>

          <div className="flex justify-between items-center mt-auto pt-3 text-sm">
            <span className="bg-rating text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              ⭐ {restaurant.rating || '4.2'}
            </span>
            <span className="text-muted font-medium">
              ₹250 for two
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default RestaurantCard;
