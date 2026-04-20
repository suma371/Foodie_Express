import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import { Plus, Store, Utensils, ClipboardList, Settings, TrendingUp, Trash2, Edit3, Loader2, IndianRupee, Package, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddRestaurantModal from '../../components/admin/AddRestaurantModal';
import AddFoodItemModal from '../../components/admin/AddFoodItemModal';
import EditRestaurantModal from '../../components/admin/EditRestaurantModal';
import EditFoodItemModal from '../../components/admin/EditFoodItemModal';

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isEditRestModalOpen, setIsEditRestModalOpen] = useState(false);
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);
  
  // Selected Objects for Editing
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurants with owner filter on backend
      const resResponse = await api.get('/restaurants', {
        params: user.role === 'restaurant_owner' ? { ownerId: user._id } : {}
      });
      const fetchedRestaurants = resResponse.data.restaurants || resResponse.data;
      setRestaurants(fetchedRestaurants);

      // Fetch food items for these restaurants
      if (fetchedRestaurants.length > 0) {
        const foodPromises = fetchedRestaurants.map(r => api.get(`/fooditems/restaurant/${r._id}`));
        const foodResults = await Promise.all(foodPromises);
        setFoodItems(foodResults.flatMap(r => r.data));
      }

      // Fetch orders (now secured on backend)
      const ordersRes = await api.get('/orders');
      setOrders(ordersRes.data);
      
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to update dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure? This will delete the restaurant and all its items.')) return;
    try {
      await api.delete(`/restaurants/${id}`);
      toast.success('Store removed successfully');
      fetchAdminData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Delete this item from the menu?')) return;
    try {
      await api.delete(`/fooditems/${id}`);
      toast.success('Item deleted');
      setFoodItems(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="text-sm font-bold text-muted uppercase tracking-widest">Loading business data...</p>
    </div>
  );

  const revenue = orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + o.totalPrice, 0);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₹${revenue.toLocaleString()}`, 
      icon: <IndianRupee size={22} />, 
      color: 'bg-accent/10 text-accent',
      trend: '+12.5%'
    },
    { 
      label: 'Active Orders', 
      value: orders.filter(o => o.status !== 'Delivered').length, 
      icon: <Package size={22} />, 
      color: 'bg-primary/10 text-primary',
      trend: 'Fresh'
    },
    { 
      label: 'Store Rating', 
      value: Math.max(...restaurants.map(r => r.rating || 0), 0).toFixed(1), 
      icon: <TrendingUp size={22} />, 
      color: 'bg-rating/10 text-rating',
      trend: 'Top'
    },
  ];

  const tabs = [
    { id: 'restaurants', label: 'Stores', icon: <Store size={18} /> },
    { id: 'foods', label: 'Menu', icon: <Utensils size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList size={18} /> },
  ];

  return (
    <div className="bg-background min-h-screen py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* ── Header Area ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight mb-2">
              Management <span className="text-primary italic">Center</span>
            </h1>
            <p className="text-muted font-bold text-sm uppercase tracking-widest">
              {user.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : `OWNER: ${user.name}`}
            </p>
          </div>
          
          <div className="flex gap-3">
             {activeTab === 'restaurants' && (user.role === 'admin' || user.role === 'restaurant_owner') && (
               <button 
                 onClick={() => setIsRestModalOpen(true)}
                 className="bg-secondary text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-hover border-b-4 border-secondaryDark active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
               >
                 <Plus size={20} /> Add Store
               </button>
             )}
             {activeTab === 'foods' && (
               <button 
                 onClick={() => setIsFoodModalOpen(true)}
                 className="bg-primary text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-hover border-b-4 border-primaryDark active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
               >
                 <Plus size={20} /> Add Item
               </button>
             )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-[2rem] shadow-card flex items-start justify-between group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} shadow-inner`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-secondary">{stat.value}</p>
                </div>
              </div>
              <div className="bg-background px-2 py-1 rounded-lg text-[10px] font-black text-primary flex items-center gap-0.5 shadow-sm">
                {stat.trend} <ArrowUpRight size={10} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs & Content ── */}
        <div className="bg-card border border-border rounded-[2.5rem] shadow-card p-6 md:p-8 overflow-hidden">
          <div className="flex items-center gap-2 md:gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-secondary text-white shadow-lg' 
                    : 'text-muted hover:bg-background hover:text-secondary'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'restaurants' && (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                      <tr className="text-[10px] font-black text-muted uppercase tracking-widest px-4">
                        <th className="pb-2 pl-4">Store Profile</th>
                        <th className="pb-2">Location</th>
                        <th className="pb-2 text-center">Rating</th>
                        <th className="pb-2 text-right pr-4">Management</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-4">
                      {restaurants.map((res) => (
                        <tr key={res._id} className="group transition-all">
                          <td className="bg-background rounded-l-3xl p-4 border-l border-t border-b border-border shadow-sm group-hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4">
                              <img src={res.image} alt={res.name} className="w-12 h-12 rounded-xl object-cover shadow-card" />
                              <div>
                                <p className="font-bold text-secondary">{res.name}</p>
                                <p className="text-[10px] font-bold text-primary uppercase">{res.cuisines?.slice(0,2).join(', ')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="bg-background p-4 border-t border-b border-border shadow-sm group-hover:border-primary/20 transition-all">
                            <p className="text-xs font-bold text-muted truncate max-w-[200px]">{res.address}</p>
                          </td>
                          <td className="bg-background p-4 border-t border-b border-border shadow-sm text-center group-hover:border-primary/20 transition-all">
                             <div className="inline-flex items-center gap-1 bg-rating/10 text-rating font-black text-xs px-3 py-1 rounded-full">
                               {res.rating?.toFixed(1) || '0.0'} <Star size={12} fill="currentColor" />
                             </div>
                          </td>
                          <td className="bg-background rounded-r-3xl p-4 border-r border-t border-b border-border shadow-sm group-hover:border-primary/20 transition-all text-right">
                             <div className="flex gap-2 justify-end pr-2">
                               <button 
                                 className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm"
                                 onClick={() => { setSelectedRestaurant(res); setIsEditRestModalOpen(true); }}
                               >
                                 <Edit3 size={18} />
                               </button>
                               <button 
                                 className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:text-danger hover:border-danger transition-all shadow-sm"
                                 onClick={() => handleDeleteRestaurant(res._id)}
                               >
                                 <Trash2 size={18} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'foods' && (
                <div className="overflow-x-auto no-scrollbar">
                   <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-[10px] font-black text-muted uppercase tracking-widest">
                        <th className="pb-2 pl-4">Item Details</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2">Price</th>
                        <th className="pb-2 text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodItems.map((food) => (
                        <tr key={food._id} className="group">
                          <td className="bg-background rounded-l-2xl p-3 border-l border-t border-b border-border group-hover:border-primary/20 transition-all">
                             <div className="flex items-center gap-3">
                               <img src={food.image} className="w-10 h-10 rounded-lg object-cover" />
                               <span className="font-bold text-secondary text-sm">{food.name}</span>
                             </div>
                          </td>
                          <td className="bg-background p-3 border-t border-b border-border group-hover:border-primary/20 transition-all">
                             <span className="text-xs font-bold text-muted bg-card px-2 py-1 rounded-md">{food.category}</span>
                          </td>
                          <td className="bg-background p-3 border-t border-b border-border group-hover:border-primary/20 transition-all font-black text-secondary">
                             ₹{food.price}
                          </td>
                          <td className="bg-background rounded-r-2xl p-3 border-r border-t border-b border-border group-hover:border-primary/20 text-right pr-4 transition-all">
                             <div className="flex gap-2 justify-end">
                               <button 
                                 className="p-2 text-muted hover:text-blue-500 transition-colors"
                                 onClick={() => { setSelectedFoodItem(food); setIsEditFoodModalOpen(true); }}
                               >
                                 <Edit3 size={18} />
                               </button>
                               <button 
                                 className="p-2 text-muted hover:text-danger transition-colors"
                                 onClick={() => handleDeleteFood(food._id)}
                               >
                                 <Trash2 size={18} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="py-20 text-center text-muted font-bold">No orders found matching your profile.</div>
                  ) : (
                    orders.map(order => (
                      <div key={order._id} className="bg-background border border-border rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
                         <div className="flex flex-col md:flex-row justify-between gap-4">
                           <div className="flex items-start gap-4">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary border border-border shadow-inner">
                               <ClipboardList size={22} />
                             </div>
                             <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-black text-secondary">#{order._id.slice(-6).toUpperCase()}</span>
                                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                   order.status === 'Delivered' ? 'bg-accent/10 text-accent' : 
                                   order.status === 'Preparing' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'
                                 }`}>
                                   {order.status}
                                 </div>
                               </div>
                               <p className="text-[10px] font-bold text-muted uppercase mb-2">VIA: {order.restaurant?.name}</p>
                               <div className="flex flex-wrap gap-2">
                                 {order.orderItems.map((item, idx) => (
                                   <span key={idx} className="text-[10px] font-bold bg-card border border-border px-2 py-0.5 rounded-md text-secondary">
                                     {item.quantity}x {item.name}
                                   </span>
                                 ))}
                               </div>
                             </div>
                           </div>

                           <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                             <div className="text-right">
                               <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Earnings</p>
                               <p className="text-xl font-black text-secondary">₹{order.totalPrice}</p>
                             </div>
                             
                             <select 
                               className="bg-card border border-border text-[11px] font-bold text-secondary px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer transition-all active:scale-95"
                               value={order.status}
                               onChange={async (e) => {
                                 const newStatus = e.target.value;
                                 try {
                                   await api.put(`/orders/${order._id}/status`, { status: newStatus });
                                   toast.success(`Status: ${newStatus}`);
                                   fetchAdminData();
                                 } catch (err) {
                                   toast.error("Failed to update status");
                                 }
                               }}
                             >
                                <option value="Pending">Pending</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                             </select>
                           </div>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Modals ── */}
      <AddRestaurantModal isOpen={isRestModalOpen} onClose={() => setIsRestModalOpen(false)} onSuccess={fetchAdminData} />
      <AddFoodItemModal isOpen={isFoodModalOpen} onClose={() => setIsFoodModalOpen(false)} onSuccess={fetchAdminData} restaurants={restaurants} />
      <EditRestaurantModal isOpen={isEditRestModalOpen} onClose={() => setIsEditRestModalOpen(false)} onSuccess={fetchAdminData} restaurant={selectedRestaurant} />
      <EditFoodItemModal isOpen={isEditFoodModalOpen} onClose={() => setIsEditFoodModalOpen(false)} onSuccess={fetchAdminData} foodItem={selectedFoodItem} />
    </div>
  );
};

// ... Star component for ease ...
const Star = ({ size, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

export default AdminDashboard;
