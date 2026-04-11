import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Store, ShieldCheck, UtensilsCrossed } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
          <img 
             src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover scale-110 blur-xl grayscale opacity-50" 
             alt="bg" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-dark/95" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl"
      >
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 mb-6">
              <UtensilsCrossed size={32} />
           </div>
           <h1 className="text-3xl font-black text-dark tracking-tighter uppercase italic">Create Account</h1>
           <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">Join the Foodie Express family today</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
               <div className="relative group">
                 <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                 <input
                   type="text"
                   required
                   className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-black text-dark outline-none transition-all shadow-inner"
                   placeholder="John Doe"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
               <div className="relative group">
                 <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                 <input
                   type="email"
                   required
                   className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-black text-dark outline-none transition-all shadow-inner"
                   placeholder="you@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Password</label>
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

             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Identity</label>
               <div className="relative group">
                 <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                 <input
                   type="password"
                   required
                   className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-black text-dark outline-none transition-all shadow-inner"
                   placeholder="••••••••"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                 />
               </div>
             </div>
          </div>

          {/* Role Picker */}
          <div className="space-y-4 pt-4">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">In our ecosystem, I am a...</p>
             <div className="grid grid-cols-2 gap-4">
                <button 
                   type="button" 
                   onClick={() => setRole('user')}
                   className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${role === 'user' ? 'bg-primary/5 border-primary text-primary shadow-xl shadow-primary/10' : 'bg-white border-gray-100 text-dark-muted hover:border-gray-200'}`}
                >
                   <span className="text-2xl">🍔</span>
                   <span className="text-xs font-black uppercase tracking-widest">HUNGRY EATER</span>
                </button>
                <button 
                   type="button" 
                   onClick={() => setRole('restaurant_owner')}
                   className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${role === 'restaurant_owner' ? 'bg-primary/5 border-primary text-primary shadow-xl shadow-primary/10' : 'bg-white border-gray-100 text-dark-muted hover:border-gray-200'}`}
                >
                   <span className="text-2xl">👨‍🍳</span>
                   <span className="text-xs font-black uppercase tracking-widest">CHEF / OWNER</span>
                </button>
             </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-lg group uppercase italic tracking-tighter"
          >
            CREATE ACCOUNT <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-2 text-green-600">
             <ShieldCheck size={16} />
             <span className="text-[9px] font-black uppercase tracking-widest">Secure 256-bit SSL encrypted registration</span>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Welcome back? <br/>
            <Link to="/login" className="text-primary hover:underline text-xs">
              GO TO LOGIN PAGE
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
