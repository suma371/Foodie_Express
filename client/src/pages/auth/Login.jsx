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
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gray-50">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
          <img 
             src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover scale-110 blur-xl opacity-20 grayscale" 
             alt="bg" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF7043]/30 via-transparent to-[#F4511E]/10 mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 backdrop-blur-sm"
      >
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF7043] to-[#F4511E] text-white rounded-2xl shadow-[0_10px_25px_rgba(255,112,67,0.4)] mb-6 transform -rotate-6">
              <UtensilsCrossed size={32} />
           </div>
           <h1 className="text-3xl font-heading font-black text-gray-900 tracking-tight">Welcome Back</h1>
           <p className="text-gray-500 font-medium text-sm mt-3">Log in to your FoodieExpress account</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7043] transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/30 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-medium text-gray-900 outline-none transition-all shadow-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
               <label className="text-xs font-bold text-gray-700">Password</label>
               <button type="button" className="text-xs font-bold text-[#FF7043] hover:underline">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7043] transition-colors" />
              <input
                type="password"
                required
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/30 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-medium text-gray-900 outline-none transition-all shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF7043] hover:bg-[#F4511E] text-white py-4 rounded-2xl font-bold shadow-[0_10px_25px_rgba(255,112,67,0.3)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-[15px] group mt-8"
          >
            CONTINUE <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
           <p className="text-xs font-medium text-gray-500 mb-6">Or connect with</p>
           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all font-bold text-sm text-gray-700 shadow-sm border border-gray-100">
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all font-bold text-sm text-gray-700 shadow-sm border border-gray-100">
                 <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="F" /> Facebook
              </button>
           </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-medium text-gray-500">
            New to FoodieExpress?{' '}
            <Link to="/register" className="text-[#FF7043] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
