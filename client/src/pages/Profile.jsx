import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Shield, Save, Loader2, ArrowLeft, Plus, Trash2, Home, Briefcase, Map, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      case 'Home': return <Home size={20} />;
      case 'Work': return <Briefcase size={20} />;
      default: return <MapPin size={20} />;
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
    <div className="bg-background min-h-screen py-10 sm:py-16">
      <div className="max-w-[850px] mx-auto px-6">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-col gap-10"
         >
            {/* ── Header Section ── */}
            <div className="bg-card rounded-[2rem] p-8 sm:p-10 shadow-card border border-border flex flex-col sm:flex-row items-center sm:items-start gap-8">
               <div className="relative group shrink-0">
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-lg border-4 border-card">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user?.name}&background=FC8019&color=fff&size=256&bold=true`} 
                      alt={user?.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
               </div>

               <div className="text-center sm:text-left flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                     <span className="px-3 py-1 bg-background text-muted rounded-lg text-[10px] font-bold uppercase tracking-widest border border-border">Verified Account</span>
                     {user?.role === 'restaurant_owner' && (
                        <span className="px-3 py-1 bg-amber-50 text-rating border border-amber-200 rounded-lg text-[10px] font-bold uppercase tracking-widest">Restaurant Partner</span>
                     )}
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight capitalize mb-2">{user?.name}</h1>
                    <p className="text-muted font-bold flex items-center gap-2 justify-center sm:justify-start">
                       <Mail size={16} className="text-muted" /> {user?.email}
                    </p>
                  </div>
               </div>
            </div>

            {/* ── Profile Form ── */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
               
               {/* Contact Details */}
               <div className="bg-card rounded-[2rem] p-8 sm:p-10 shadow-card border border-border space-y-6">
                  <h3 className="text-sm font-bold text-muted uppercase tracking-widest pb-4 border-b border-border">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary ml-1">Full Name</label>
                        <div className="relative group">
                           <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                           <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-border focus:border-primary/30 focus:bg-card rounded-2xl py-4 pl-12 pr-6 font-medium text-secondary outline-none transition-all shadow-sm" placeholder="John Doe" required />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary ml-1">Phone Number</label>
                        <div className="relative group">
                           <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                           <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-border focus:border-primary/30 focus:bg-card rounded-2xl py-4 pl-12 pr-6 font-medium text-secondary outline-none transition-all shadow-sm" placeholder="+91 98765 43210" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Address Management */}
               <div className="bg-card rounded-[2rem] p-8 sm:p-10 shadow-card border border-border space-y-8">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                     <h3 className="text-sm font-bold text-muted uppercase tracking-widest">Saved Addresses</h3>
                     {!showAddAddress && (
                        <button type="button" onClick={() => setShowAddAddress(true)} className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors uppercase tracking-widest">
                           <Plus size={16} /> Add New
                        </button>
                     )}
                  </div>

                  <AnimatePresence>
                    {showAddAddress && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                         <div className="bg-background p-6 sm:p-8 rounded-[1.5rem] border border-border space-y-6 mb-8">
                            <h4 className="text-sm font-bold text-secondary">Add New Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <label className="text-xs font-bold text-secondary ml-1">Address Type</label>
                                  <select name="type" value={newAddress.type} onChange={handleAddressChange} className="w-full bg-card border border-border focus:border-primary/30 focus:bg-card rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm">
                                     <option value="Home">Home</option>
                                     <option value="Work">Work</option>
                                     <option value="Other">Other</option>
                                  </select>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-bold text-secondary ml-1">Phone (Optional)</label>
                                  <input type="text" name="phone" value={newAddress.phone} onChange={handleAddressChange} className="w-full bg-card border border-border focus:border-primary/30 focus:bg-card rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm" placeholder="Receiver's Phone" />
                               </div>
                               <div className="md:col-span-2 space-y-2">
                                  <label className="text-xs font-bold text-secondary ml-1">Street Address</label>
                                  <textarea name="street" value={newAddress.street} onChange={handleAddressChange} rows="2" className="w-full bg-card border border-border focus:border-primary/30 focus:bg-card rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm resize-none" placeholder="Door number, street name, landmarks..."></textarea>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-bold text-secondary ml-1">City</label>
                                  <input type="text" name="city" value={newAddress.city} onChange={handleAddressChange} className="w-full bg-card border border-border focus:border-primary/40 focus:bg-card rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm" placeholder="City" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-bold text-secondary ml-1">Postal Code</label>
                                  <input type="text" name="postalCode" value={newAddress.postalCode} onChange={handleAddressChange} className="w-full bg-card border border-border focus:border-primary/40 focus:bg-card rounded-2xl py-4 px-5 font-medium text-secondary outline-none transition-all shadow-sm" placeholder="ZIP/Postal Code" />
                               </div>
                               <div className="md:col-span-2 flex items-center gap-3 pt-2">
                                  <input type="checkbox" id="isDefault" name="isDefault" checked={newAddress.isDefault} onChange={handleAddressChange} className="w-5 h-5 rounded accent-primary" />
                                  <label htmlFor="isDefault" className="text-sm font-bold text-muted cursor-pointer">Make this my default address</label>
                               </div>
                            </div>
                            <div className="flex gap-4 justify-end mt-4 pt-4 border-t border-border">
                               <button type="button" onClick={() => setShowAddAddress(false)} className="px-6 py-3 bg-card border border-border text-muted font-bold text-sm rounded-xl hover:bg-background transition-colors">CANCEL</button>
                               <button type="button" onClick={addAddress} className="bg-primary hover:bg-primaryDark text-white font-medium px-6 py-3 rounded-lg transition text-sm shadow-lg">SAVE ADDRESS</button>
                            </div>
                         </div>
                       </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {addresses.length > 0 ? addresses.map((addr, idx) => (
                        <div key={idx} className={`p-6 rounded-[1.5rem] border-2 relative bg-card transition-all ${addr.isDefault ? 'border-primary shadow-md shadow-primary/10' : 'border-border'}`}>
                           {addr.isDefault && (
                              <span className="absolute -top-3 right-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Default</span>
                           )}
                           <div className="flex items-center gap-4 mb-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${addr.isDefault ? 'bg-primary' : 'bg-secondary'}`}>
                                 {getAddressIcon(addr.type)}
                              </div>
                              <h4 className="text-sm font-bold text-secondary uppercase tracking-widest">{addr.type}</h4>
                           </div>
                           <p className="text-secondary font-bold text-base leading-tight mb-2 pr-4">{addr.street}</p>
                           <p className="text-muted text-sm font-medium">{addr.city}, {addr.postalCode}</p>
                           {addr.phone && <p className="text-muted text-sm font-medium mt-1 flex items-center gap-1.5"><Phone size={14}/>{addr.phone}</p>}
                           
                           <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                              {!addr.isDefault ? (
                                 <button type="button" onClick={() => setAsDefault(idx)} className="text-xs font-bold text-blue-500 hover:text-blue-600 uppercase tracking-widest">Set Default</button>
                              ) : <div></div>}
                              <button type="button" onClick={() => removeAddress(idx)} className="flex items-center gap-1.5 text-xs font-bold text-danger hover:text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg"><Trash2 size={16} /> Remove</button>
                           </div>
                        </div>
                     )) : (
                        <div className="sm:col-span-2 text-center p-12 bg-background rounded-[2rem] border-2 border-dashed border-border">
                           <MapPin size={40} className="mx-auto text-gray-300 mb-4" />
                           <p className="text-muted font-bold text-sm">No addresses saved yet. Add one to checkout faster!</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Security */}
               <div className="bg-card rounded-[2rem] p-8 sm:p-10 shadow-card border border-border space-y-6">
                  <h3 className="text-sm font-bold text-muted uppercase tracking-widest pb-4 border-b border-border">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary ml-1">New Password</label>
                        <div className="relative group">
                           <Shield size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                           <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-background border border-border focus:border-primary/30 focus:bg-card rounded-2xl py-4 pl-12 pr-6 font-medium text-secondary outline-none transition-all shadow-sm" placeholder="Leave blank to keep current" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary ml-1">Confirm New Password</label>
                        <div className="relative group">
                           <Shield size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                           <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-background border border-border focus:border-primary/30 focus:bg-card rounded-2xl py-4 pl-12 pr-6 font-medium text-secondary outline-none transition-all shadow-sm" placeholder="••••••••" />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end pt-4">
                  <button
                     type="submit"
                     disabled={loading}
                     className="bg-primary hover:bg-primaryDark text-white font-medium px-8 py-4 rounded-lg transition shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 text-sm uppercase tracking-widest"
                  >
                     {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                     SAVE ALL CHANGES
                  </button>
               </div>
            </form>

            <div className="flex justify-center -mt-2 pb-6">
               <Link to="/" className="flex items-center gap-2 text-muted hover:text-secondary transition-colors text-xs font-bold uppercase tracking-widest">
                  <ArrowLeft size={16} /> Back to Homepage
               </Link>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default Profile;
