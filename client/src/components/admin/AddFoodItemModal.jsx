import { useState } from 'react';
import { X, Upload, DollarSign, Utensils, Tag } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AddFoodItemModal = ({ isOpen, onClose, onSuccess, restaurants }) => {
  const [formData, setFormData] = useState({
    restaurantId: '',
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Main Course',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.restaurantId) {
      toast.error('Please select a restaurant');
      return;
    }
    setLoading(true);
    try {
      await api.post('/fooditems', {
        ...formData,
        price: parseFloat(formData.price)
      });
      toast.success('Food item added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add food item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Pizza', 'Burgers', 'Sushi'];

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '32rem' }}>
        <div className="modal-header">
          <h2>Add Menu Item</h2>
          <button onClick={onClose} className="icon-btn" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="input-group">
            <label className="input-label">Select Restaurant</label>
            <select 
              required
              className="input-field-premium"
              value={formData.restaurantId}
              onChange={(e) => setFormData({...formData, restaurantId: e.target.value})}
            >
              <option value="">Choose a restaurant...</option>
              {restaurants.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Item Name</label>
            <div className="input-icon-wrapper">
              <Utensils size={18} />
              <input 
                type="text" 
                required 
                className="input-field-premium input-field-with-icon"
                placeholder="e.g. Double Truffle Burger"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Price</label>
              <div className="input-icon-wrapper">
                <DollarSign size={18} />
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  className="input-field-premium input-field-with-icon"
                  placeholder="14.99"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <div className="input-icon-wrapper">
                <Tag size={18} />
                <select 
                  className="input-field-premium input-field-with-icon"
                  style={{ appearance: 'none' }}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea 
              required 
              rows="2"
              className="input-field-premium"
              placeholder="What makes this dish special?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
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

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '18px' }}
          >
            {loading ? 'Adding Item...' : 'Add to Menu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodItemModal;
