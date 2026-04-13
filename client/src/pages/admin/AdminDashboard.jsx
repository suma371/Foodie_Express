import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import { Plus, Store, Utensils, ClipboardList, Settings, TrendingUp, Trash2, Edit3 } from 'lucide-react';
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
      const resResponse = await api.get('/restaurants');
      let filteredRestaurants = resResponse.data;
      if (user.role === 'restaurant_owner') {
        filteredRestaurants = resResponse.data.filter(r => r.ownerId === user._id);
      }
      setRestaurants(filteredRestaurants);

      if (filteredRestaurants.length > 0) {
        const foodPromises = filteredRestaurants.map(r => api.get(`/fooditems/restaurant/${r._id}`));
        const foodResults = await Promise.all(foodPromises);
        setFoodItems(foodResults.flatMap(r => r.data));
      }

      const ordersRes = await api.get('/orders');
      setOrders(ordersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to fetch dashboard data');
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
      toast.success('Restaurant deleted');
      setRestaurants(prev => prev.filter(r => r._id !== id));
      setFoodItems(prev => prev.filter(f => f.restaurantId !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/fooditems/${id}`);
      toast.success('Item removed');
      setFoodItems(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Stats calculation
  const stats = [
    { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.totalPrice, 0).toFixed(0)}`, icon: <TrendingUp style={{ color: '#16a34a' }} /> },
    { label: 'Total Orders', value: orders.length, icon: <ClipboardList style={{ color: '#2563eb' }} /> },
    { label: 'Active Items', value: foodItems.length, icon: <Utensils style={{ color: '#ea580c' }} /> },
  ];

  const tabs = [
    { id: 'restaurants', label: 'Restaurants', icon: <Store size={20} /> },
    { id: 'foods', label: 'Menu Items', icon: <Utensils size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="results-page" style={{ padding: '3rem 0' }}>
      <div className="page-container" style={{ maxWidth: '1200px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }} className="md-flex-row md-items-center">
          <div>
            <h1 className="results-title" style={{ fontSize: '30px' }}>Dashboard</h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage your business operations and monitor performance.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {activeTab === 'restaurants' && (user.role === 'admin' || user.role === 'restaurant_owner') && (
              <button 
                onClick={() => setIsRestModalOpen(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                <Plus size={20} /> Add Restaurant
              </button>
            )}
            {activeTab === 'foods' && (
              <button 
                onClick={() => setIsFoodModalOpen(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                <Plus size={20} /> Add Food Item
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card-premium">
              <div className="stat-icon-bg">{stat.icon}</div>
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-tabs-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="admin-table-wrapper" style={{ overflow: 'hidden' }}>
          
          {activeTab === 'restaurants' && (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Address</th>
                    <th>Rating</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((res) => (
                    <tr key={res._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={res.image} alt={res.name} style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{res.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '14px' }}>{res.address}</td>
                      <td>
                        <span style={{ backgroundColor: '#f0fdf4', color: '#15803d', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '12px', fontWeight: '700' }}>★ {res.rating}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                            onClick={() => {
                              setSelectedRestaurant(res);
                              setIsEditRestModalOpen(true);
                            }}
                          >
                            <Edit3 size={18} />
                          </button>
                          <button className="icon-btn-danger" style={{ padding: '0.5rem', borderRadius: '0.5rem' }} onClick={() => handleDeleteRestaurant(res._id)}>
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
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foodItems.map((food) => (
                    <tr key={food._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={food.image} alt={food.name} style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{food.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '14px' }}>{food.category}</td>
                      <td style={{ fontWeight: '700', color: '#0f172a' }}>₹{food.price.toFixed(0)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                            onClick={() => {
                              setSelectedFoodItem(food);
                              setIsEditFoodModalOpen(true);
                            }}
                          >
                            <Edit3 size={18} />
                          </button>
                          <button className="icon-btn-danger" style={{ padding: '0.5rem', borderRadius: '0.5rem' }} onClick={() => handleDeleteFood(food._id)}>
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
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <select 
                          className="status-select-premium"
                          style={{
                            backgroundColor: order.status === 'Delivered' ? '#f0fdf4' : order.status === 'Preparing' ? '#fff7ed' : order.status === 'Out for Delivery' ? '#eff6ff' : '#f8fafc',
                            color: order.status === 'Delivered' ? '#16a34a' : order.status === 'Preparing' ? '#ea580c' : order.status === 'Out for Delivery' ? '#2563eb' : '#64748b',
                            borderColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Preparing' ? '#ffedd5' : order.status === 'Out for Delivery' ? '#dbeafe' : '#f1f5f9',
                          }}
                          value={order.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              await api.put(`/orders/${order._id}/status`, { status: newStatus });
                              toast.success(`Order set to ${newStatus}`);
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
                      </td>
                      <td style={{ fontWeight: '700', color: '#0f172a' }}>₹{order.totalPrice.toFixed(0)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Auto-saved</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              Account settings and preferences coming soon.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddRestaurantModal 
        isOpen={isRestModalOpen} 
        onClose={() => setIsRestModalOpen(false)} 
        onSuccess={fetchAdminData} 
      />
      <AddFoodItemModal 
        isOpen={isFoodModalOpen} 
        onClose={() => setIsFoodModalOpen(false)} 
        onSuccess={fetchAdminData}
        restaurants={restaurants}
      />
      <EditRestaurantModal 
        isOpen={isEditRestModalOpen}
        onClose={() => {
          setIsEditRestModalOpen(false);
          setSelectedRestaurant(null);
        }}
        onSuccess={fetchAdminData}
        restaurant={selectedRestaurant}
      />
      <EditFoodItemModal 
        isOpen={isEditFoodModalOpen}
        onClose={() => {
          setIsEditFoodModalOpen(false);
          setSelectedFoodItem(null);
        }}
        onSuccess={fetchAdminData}
        foodItem={selectedFoodItem}
      />
    </div>
  );
};

export default AdminDashboard;
