import { useState, useEffect } from 'react';
import { X, Upload, Store, MapPin, Save, Info } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EditRestaurantModal = ({ isOpen, onClose, onSuccess, restaurant }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        image: restaurant.image || '',
      });
    }
  }, [restaurant, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/restaurants/${restaurant._id}`, formData);
      toast.success('Restaurant updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !restaurant) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '32rem' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Store size={20} />
             </div>
             <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>Edit Restaurant</h2>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{restaurant.name}</p>
             </div>
          </div>
          <button onClick={onClose} className="icon-btn" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="input-group">
            <label className="input-label">Restaurant Name</label>
            <div className="input-icon-wrapper">
              <Store size={18} />
              <input 
                type="text" 
                required 
                className="input-field-premium input-field-with-icon"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Address</label>
            <div className="input-icon-wrapper">
              <MapPin size={18} />
              <input 
                type="text" 
                required 
                className="input-field-premium input-field-with-icon"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <div className="input-icon-wrapper">
              <Info size={18} style={{ marginTop: '0.65rem' }} />
              <textarea 
                required 
                rows="3"
                className="input-field-premium input-field-with-icon"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Banner Image URL</label>
            <div className="input-icon-wrapper">
              <Upload size={18} />
              <input 
                type="url" 
                required 
                className="input-field-premium input-field-with-icon"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? 'Updating...' : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantModal;
