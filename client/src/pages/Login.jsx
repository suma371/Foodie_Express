import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, UtensilsCrossed } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
          <img 
             src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover scale-110 blur-md grayscale" 
             alt="bg" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-dark/95" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl"
      >
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 mb-6">
              <UtensilsCrossed size={32} />
           </div>
           <h1 className="text-3xl font-black text-dark tracking-tighter uppercase italic">Welcome Back</h1>
           <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">Log in to your Foodie Express account</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Connection</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-black text-dark outline-none transition-all shadow-inner"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Key</label>
               <button type="button" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-black text-dark outline-none transition-all shadow-inner"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-lg group mt-4 uppercase italic tracking-tighter"
          >
            CONTINUE <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
            New to the family? <br/>
            <Link to="/register" className="text-primary hover:underline text-xs">
              CREATE YOUR ACCOUNT NOW
            </Link>
          </p>
        </div>

        <div className="mt-10 pt-10 border-t border-gray-50">
           <p className="text-[9px] font-black text-gray-300 text-center uppercase tracking-[0.3em] mb-6">Or connect via</p>
           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all font-black text-xs uppercase tracking-tighter text-dark-muted">
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all font-black text-xs uppercase tracking-tighter text-dark-muted">
                 <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="F" /> Facebook
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
