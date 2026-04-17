import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';

const footerLinks = {
  FoodieExpress: [
    { label: 'About Us', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Team', to: '#' },
  ],
  'Contact us': [
    { label: 'Help & Support', to: '#' },
    { label: 'Partner with us', to: '#' },
    { label: 'Ride with us', to: '#' },
  ],
  Legal: [
    { label: 'Terms & Conditions', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Refund Policy', to: '#' },
  ],
};

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-24 lg:pb-12 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
             <Link to="/" className="flex items-center gap-2">
               <div className="w-10 h-10 bg-gradient-to-br from-[#FF7043] to-[#F4511E] rounded-xl flex items-center justify-center text-white font-black shadow-sm">
                  F
               </div>
               <span className="font-heading font-bold text-2xl text-gray-900 tracking-tight">FoodieExpress</span>
             </Link>
             <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
               Discover the best food & drinks in your city. Delivered fresh, hot, and fast to your doorstep.
             </p>
             <div className="flex gap-3">
               <a href="#" className="h-10 flex items-center px-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-5" alt="App Store" />
               </a>
               <a href="#" className="h-10 flex items-center px-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-5" alt="Google Play" />
               </a>
             </div>
          </div>
          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-5">
               <h4 className="font-heading font-bold text-gray-900 text-base">{title}</h4>
               <ul className="space-y-3.5">
                 {links.map(link => (
                   <li key={link.label}>
                     <Link to={link.to} className="text-sm font-medium text-gray-500 hover:text-[#FF7043] transition-colors">
                        {link.label}
                     </Link>
                   </li>
                 ))}
               </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-gray-400 text-sm font-medium">© 2026 FoodieExpress Technologies Inc. All rights reserved.</p>
           <div className="flex items-center gap-4">
               {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#FF7043] hover:text-white transition-all hover:scale-110 active:scale-95">
                     <Icon size={18} />
                  </a>
               ))}
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
