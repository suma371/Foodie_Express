import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import api from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data);
      toast.success('LoggedIn successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-container"
      >
        <div className="auth-header">
           <h1>Login</h1>
           <p style={{ color: '#64748b', fontWeight: '500' }}>Welcome back! Please enter your details.</p>
        </div>

        <form className="auth-form-card" onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={20} />
              <input
                type="email"
                required
                className="input-field-premium input-field-with-icon"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
               <label className="input-label" style={{ margin: '0' }}>Password</label>
               <Link to="#" style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-brand)', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>Forgot?</Link>
            </div>
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}
          >
            CONTINUE <ArrowRight size={20} style={{ strokeWidth: 3 }} />
          </button>
        </form>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8' }}>
            New to Foodie Express?{' '}
            <Link to="/register" style={{ color: 'var(--primary-brand)', textDecoration: 'none', marginLeft: '0.25rem' }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
              Create an account
            </Link>
          </p>
        </div>

        <div className="auth-divider">
           <p style={{ fontSize: '10px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.3em' }}>Or connect with</p>
           <div className="social-login-grid">
              <button className="social-btn">
                 <img src="https://www.google.com/favicon.ico" alt="G" /> Google
              </button>
              <button className="social-btn">
                 <img src="https://www.facebook.com/favicon.ico" alt="F" /> Facebook
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
