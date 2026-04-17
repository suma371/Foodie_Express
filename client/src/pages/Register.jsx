import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import api from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
      toast.success('Registration successful! Welcome to FoodieExpress!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gray-50 py-12">
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
        className="relative z-10 w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 backdrop-blur-sm"
      >
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF7043] to-[#F4511E] text-white rounded-2xl shadow-[0_10px_25px_rgba(255,112,67,0.4)] mb-6 transform -rotate-6">
              <UtensilsCrossed size={32} />
           </div>
           <h1 className="text-3xl font-heading font-black text-gray-900 tracking-tight">Create Account</h1>
           <p className="text-gray-500 font-medium text-sm mt-3">Join the FoodieExpress family today</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-xs font-bold text-gray-700 ml-1">Full Name</label>
               <div className="relative group">
                 <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7043] transition-colors" />
                 <input
                   type="text"
                   required
                   className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/30 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-medium text-gray-900 outline-none transition-all shadow-sm"
                   placeholder="John Doe"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-xs font-bold text-gray-700 ml-1">Email Address</label>
               <div className="relative group">
                 <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7043] transition-colors" />
                 <input
                   type="email"
                   required
                   className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/30 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-medium text-gray-900 outline-none transition-all shadow-sm"
                   placeholder="you@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-xs font-bold text-gray-700 ml-1">Password</label>
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

             <div className="space-y-2">
               <label className="text-xs font-bold text-gray-700 ml-1">Confirm Password</label>
               <div className="relative group">
                 <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7043] transition-colors" />
                 <input
                   type="password"
                   required
                   className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF7043]/30 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-medium text-gray-900 outline-none transition-all shadow-sm"
                   placeholder="••••••••"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                 />
               </div>
             </div>
          </div>

          {/* Role Picker */}
          <div className="space-y-4 pt-4">
             <p className="text-xs font-bold text-gray-500 text-center uppercase tracking-widest">Select Account Type</p>
             <div className="grid grid-cols-2 gap-4">
                <button 
                   type="button" 
                   onClick={() => setRole('user')}
                   className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${role === 'user' ? 'bg-[#FF7043]/5 border-[#FF7043] text-[#FF7043] shadow-[0_8px_20px_rgba(255,112,67,0.15)] ring-2 ring-[#FF7043]/20' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                   <span className="text-3xl">🍕</span>
                   <span className="text-sm font-bold uppercase tracking-wider">Food Lover</span>
                </button>
                <button 
                   type="button" 
                   onClick={() => setRole('restaurant_owner')}
                   className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${role === 'restaurant_owner' ? 'bg-[#FF7043]/5 border-[#FF7043] text-[#FF7043] shadow-[0_8px_20px_rgba(255,112,67,0.15)] ring-2 ring-[#FF7043]/20' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                   <span className="text-3xl">👨‍🍳</span>
                   <span className="text-sm font-bold uppercase tracking-wider">Restaurant Owner</span>
                </button>
             </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF7043] hover:bg-[#F4511E] text-white py-4 rounded-2xl font-bold shadow-[0_10px_25px_rgba(255,112,67,0.3)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-[15px] group mt-8"
          >
            CREATE ACCOUNT <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1.5 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[#10B981] pt-4">
             <ShieldCheck size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">Secure 256-bit SSL Data Encryption</span>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF7043] font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
