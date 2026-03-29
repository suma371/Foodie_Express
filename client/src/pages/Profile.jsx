import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Shield, Camera, Save, Loader2, ArrowLeft, Plus, Trash2, Home, Briefcase, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });
  
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', street: '', city: '', postalCode: '', phone: '', isDefault: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  };

  const addAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.postalCode) {
      return toast.error('Street, City, and Postal Code are required');
    }
    const updatedAddresses = [...addresses];
    if (newAddress.isDefault || updatedAddresses.length === 0) {
      updatedAddresses.forEach(a => a.isDefault = false);
      newAddress.isDefault = true;
    }
    setAddresses([...updatedAddresses, newAddress]);
    setNewAddress({ type: 'Home', street: '', city: '', postalCode: '', phone: '', isDefault: false });
    setShowAddAddress(false);
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    if (updated.length > 0 && addresses[index].isDefault) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
  };

  const setAsDefault = (index) => {
    const updated = addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    setAddresses(updated);
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home': return <Home size={20} className="text-white" />;
      case 'Work': return <Briefcase size={20} className="text-white" />;
      default: return <Map size={20} className="text-white" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      const payload = { ...formData, addresses };
      const { data } = await api.put('/users/profile', payload);
      
      login(data);
      toast.success('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="page-container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
         >
            {/* Header Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }} className="md-flex-row">
               <div style={{ position: 'relative' }} className="group">
                  <div className="profile-avatar-container">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user?.name}&background=e03546&color=fff&size=256&bold=true`} 
                      alt={user?.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
               </div>

               <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="md-text-left">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }} className="md-justify-start">
                     <span style={{ px: '1rem', py: '0.375rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '9999px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Verified Account</span>
                     {user?.role === 'restaurant_owner' && (
                        <span style={{ px: '1rem', py: '0.375rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '9999px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Restaurateur</span>
                     )}
                  </div>
                  <h1 className="results-title" style={{ fontSize: '48px', textTransform: 'capitalize' }}>{user?.name}</h1>
                  <p style={{ color: '#94a3b8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }} className="md-justify-start">
                     <Mail size={16} /> {user?.email}
                  </p>
               </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
               <div className="profile-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  
                  {/* Basic Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                     <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.3em', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>Contact Details</h3>
                     <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }} className="md-grid-cols-2">
                        <div className="input-group">
                           <label className="input-label">Full Name</label>
                           <div className="input-icon-wrapper">
                              <User size={20} />
                              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field-premium input-field-with-icon" placeholder="John Doe" required />
                           </div>
                        </div>
                        <div className="input-group">
                           <label className="input-label">Phone Number</label>
                           <div className="input-icon-wrapper">
                              <Phone size={20} />
                              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field-premium input-field-with-icon" placeholder="+91 98765 43210" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Multiple Address Management */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.3em' }}>Saved Addresses</h3>
                        {!showAddAddress && (
                           <button type="button" onClick={() => setShowAddAddress(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: '900', color: '#e03546', cursor: 'pointer', background: 'none', border: 'none', textTransform: 'uppercase' }}>
                              <Plus size={16} /> Add New
                           </button>
                        )}
                     </div>

                     {showAddAddress && (
                        <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '1.5rem', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                           <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#334155' }}>Add New Address</h4>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="md-grid-cols-2">
                              <div>
                                 <label className="input-label">Address Type</label>
                                 <select name="type" value={newAddress.type} onChange={handleAddressChange} className="input-field-premium">
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="input-label">Phone (Optional)</label>
                                 <input type="text" name="phone" value={newAddress.phone} onChange={handleAddressChange} className="input-field-premium" placeholder="Receiver's Phone" />
                              </div>
                              <div style={{ gridColumn: '1 / -1' }}>
                                 <label className="input-label">Street Address</label>
                                 <textarea name="street" value={newAddress.street} onChange={handleAddressChange} rows="2" className="input-field-premium" style={{ resize: 'none' }} placeholder="Door number, street name, landmarks..."></textarea>
                              </div>
                              <div>
                                 <label className="input-label">City</label>
                                 <input type="text" name="city" value={newAddress.city} onChange={handleAddressChange} className="input-field-premium" placeholder="City" />
                              </div>
                              <div>
                                 <label className="input-label">Postal Code</label>
                                 <input type="text" name="postalCode" value={newAddress.postalCode} onChange={handleAddressChange} className="input-field-premium" placeholder="ZIP/Postal Code" />
                              </div>
                              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                 <input type="checkbox" id="isDefault" name="isDefault" checked={newAddress.isDefault} onChange={handleAddressChange} style={{ width: '1rem', height: '1rem', accentColor: '#e03546' }} />
                                 <label htmlFor="isDefault" style={{ fontSize: '14px', fontWeight: '500', color: '#475569', cursor: 'pointer' }}>Make this my default address</label>
                              </div>
                           </div>
                           <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                              <button type="button" onClick={() => setShowAddAddress(false)} className="btn" style={{ backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '1rem', padding: '0.75rem 1.5rem', fontWeight: '900' }}>CANCEL</button>
                              <button type="button" onClick={addAddress} className="btn btn-primary" style={{ borderRadius: '1rem', padding: '0.75rem 1.5rem', border: 'none' }}>SAVE ADDRESS</button>
                           </div>
                        </div>
                     )}

                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {addresses.length > 0 ? addresses.map((addr, idx) => (
                           <div key={idx} style={{ border: addr.isDefault ? '2px solid #e03546' : '1px solid #e2e8f0', borderRadius: '1.5rem', padding: '1.5rem', position: 'relative', backgroundColor: '#fff', boxShadow: addr.isDefault ? '0 10px 15px -3px rgba(224, 53, 70, 0.1)' : 'none' }}>
                              {addr.isDefault && (
                                 <span style={{ position: 'absolute', top: '-10px', right: '1.5rem', backgroundColor: '#e03546', color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '9999px', letterSpacing: '0.1em' }}>Default</span>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                 <div style={{ backgroundColor: '#0f172a', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {getAddressIcon(addr.type)}
                                 </div>
                                 <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{addr.type}</h4>
                              </div>
                              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '0.5rem' }}>{addr.street}</p>
                              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700' }}>{addr.city}, {addr.postalCode}</p>
                              {addr.phone && <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', marginTop: '0.25rem' }}><Phone size={12} style={{ display: 'inline', marginRight: '4px' }}/>{addr.phone}</p>}
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                 {!addr.isDefault ? (
                                    <button type="button" onClick={() => setAsDefault(idx)} style={{ fontSize: '12px', fontWeight: '900', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>Set Default</button>
                                 ) : <span style={{ width: '10px' }}></span>}
                                 <button type="button" onClick={() => removeAddress(idx)} style={{ fontSize: '12px', fontWeight: '900', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Trash2 size={14} /> Remove</button>
                              </div>
                           </div>
                        )) : (
                           <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '2px dashed #cbd5e1' }}>
                              <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>No addresses saved yet. Add one to checkout faster!</p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Security */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                     <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.3em', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>Security</h3>
                     <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }} className="md-grid-cols-2">
                        <div className="input-group">
                           <label className="input-label">New Password</label>
                           <div className="input-icon-wrapper">
                              <Shield size={20} />
                              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field-premium input-field-with-icon" placeholder="Leave blank to keep current" />
                           </div>
                        </div>
                        <div className="input-group">
                           <label className="input-label">Confirm New Password</label>
                           <div className="input-icon-wrapper">
                              <Shield size={20} />
                              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field-premium input-field-with-icon" placeholder="••••••••" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                     <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ padding: '1.25rem 3rem', borderRadius: '9999px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', border: 'none' }}
                     >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} style={{ strokeWidth: 2.5 }} />}
                        SAVE ALL CHANGES
                     </button>
                  </div>
               </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
               <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                  <ArrowLeft size={16} /> Back to Homepage
               </Link>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default Profile;

