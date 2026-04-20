import { motion } from 'framer-motion';

const Skeleton = ({ className, width, height, variant = 'rectangular' }) => {
  const baseClass = "relative overflow-hidden bg-gray-200 animate-shimmer";
  
  const variants = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded h-4 w-full mb-2",
  };

  return (
    <div 
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={{ width, height }}
    >
      {/* The shimmer effect is handled by the .animate-shimmer class in index.css */}
    </div>
  );
};

export const RestaurantSkeleton = () => (
  <div className="bg-card rounded-[2rem] border border-border p-4 shadow-card">
    <Skeleton height="180px" className="rounded-2xl mb-4" />
    <div className="px-2">
      <Skeleton width="70%" height="24px" className="mb-2" />
      <Skeleton width="40%" height="16px" className="mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton width="50px" height="20px" variant="circular" />
        <Skeleton width="80px" height="20px" />
      </div>
    </div>
  </div>
);

export const MenuItemSkeleton = () => (
  <div className="flex justify-between items-start py-8 border-b border-border">
    <div className="flex-1 pr-6">
      <Skeleton width="30px" height="15px" className="mb-2" />
      <Skeleton width="60%" height="20px" className="mb-2" />
      <Skeleton width="40px" height="18px" className="mb-2" />
      <Skeleton width="90%" height="40px" className="mt-4" />
    </div>
    <div className="relative w-32 h-32">
      <Skeleton width="100%" height="100%" className="rounded-2xl" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <Skeleton width="80px" height="36px" className="rounded-xl shadow-lg" />
      </div>
    </div>
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-card border border-border p-6 rounded-[2rem] shadow-card flex items-center gap-4">
    <Skeleton width="3.5rem" height="3.5rem" className="rounded-2xl" />
    <div className="flex-1">
      <Skeleton width="60px" height="12px" className="mb-2" />
      <Skeleton width="100px" height="24px" />
    </div>
  </div>
);

export default Skeleton;
