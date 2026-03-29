import { useState } from 'react';
import { X, Upload, MapPin, Store, Type, User } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';

const AddRestaurantModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    image: '',
    ownerId: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/restaurants', formData);
      toast.success('Restaurant added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '32rem' }}>
        <div className="modal-header">
          <h2>Add New Restaurant</h2>
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
                placeholder="e.g. Gourmet Burger Lab"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <div className="input-icon-wrapper">
              <Type size={18} />
              <textarea 
                required 
                rows="3"
                className="input-field-premium input-field-with-icon"
                placeholder="Tell us about your restaurant..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ minHeight: '100px', resize: 'vertical' }}
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
                placeholder="123 Food Street, City"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Image URL</label>
            <div className="input-icon-wrapper">
              <Upload size={18} />
              <input 
                type="url" 
                required 
                className="input-field-premium input-field-with-icon"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="input-group">
              <label className="input-label">Owner ID (Optional)</label>
              <div className="input-icon-wrapper">
                <User size={18} />
                <input 
                  type="text" 
                  className="input-field-premium input-field-with-icon"
                  placeholder="Leave blank for self"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '18px' }}
          >
            {loading ? 'Creating...' : 'Create Restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
