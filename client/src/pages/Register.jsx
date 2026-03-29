import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Store, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await api.post('/users', { name, email, password, role });
      login(data);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-container"
        style={{ maxWidth: '36rem' }}
      >
        <div className="auth-header">
           <h1>Create Account</h1>
           <p style={{ color: '#64748b', fontWeight: '500', fontSize: '18px' }}>Join the Foodie Express family today!</p>
        </div>

        <form className="auth-form-card" onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="profile-form-grid">
             <div className="input-group">
               <label className="input-label">Full Name</label>
               <div className="input-icon-wrapper">
                 <User size={20} />
                 <input
                   type="text"
                   required
                   className="input-field-premium input-field-with-icon"
                   placeholder="John Doe"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                 />
               </div>
             </div>

             <div className="input-group">
               <label className="input-label">Email</label>
               <div className="input-icon-wrapper">
                 <Mail size={20} />
                 <input
                   type="email"
                   required
                   className="input-field-premium input-field-with-icon"
                   placeholder="you@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
             </div>
          </div>

          <div className="profile-form-grid">
             <div className="input-group">
               <label className="input-label">Password</label>
               <div className="input-icon-wrapper">
                 <Lock size={20} />
                 <input
                   type="password"
                   required
                   className="input-field-premium input-field-with-icon"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
               </div>
             </div>

             <div className="input-group">
               <label className="input-label">Confirm</label>
               <div className="input-icon-wrapper">
                 <Lock size={20} />
                 <input
                   type="password"
                   required
                   className="input-field-premium input-field-with-icon"
                   placeholder="••••••••"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                 />
               </div>
             </div>
          </div>

          {/* Role Picker (Premium Style) */}
          <div className="role-picker-container">
             <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1rem' }}>I want to...</p>
             <div className="role-picker-grid">
                <button 
                   type="button" 
                   onClick={() => setRole('user')}
                   className={`role-btn user ${role === 'user' ? 'active' : ''}`}
                >
                   Eat Food
                </button>
                <button 
                   type="button" 
                   onClick={() => setRole('restaurant_owner')}
                   className={`role-btn owner ${role === 'restaurant_owner' ? 'active' : ''}`}
                >
                   Sell Food
                </button>
             </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
          >
            CREATE ACCOUNT <ArrowRight size={22} style={{ strokeWidth: 3 }} />
          </button>

          <div className="secure-badge">
             <ShieldCheck size={16} /> 256-bit Secure Encryption
          </div>
        </form>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-brand)', textDecoration: 'none', marginLeft: '0.25rem' }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
