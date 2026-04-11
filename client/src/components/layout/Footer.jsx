import { Link } from 'react-router-dom';
import { UtensilsCrossed, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About Us', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Team', to: '#' },
    { label: 'Swiggy One', to: '#' },
    { label: 'Swiggy Instamart', to: '#' },
    { label: 'Swiggy Genie', to: '#' },
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
    { label: 'Phishing & Fraud', to: '#' },
  ],
};

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida'
];

const Footer = () => {
  return (
    <footer className="bg-[#02060c] text-white pt-16 pb-20 mt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-4 group">
               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <UtensilsCrossed size={24} className="text-white" />
               </div>
               <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">FOODIE<br/>EXPRESS</span>
            </Link>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">© 2026 TECHNOLOGY PVT. LTD</p>
          </div>

          {/* Map Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white/90">{title}</h4>
              <ul className="space-y-4">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm font-bold text-white/50 hover:text-primary transition-colors uppercase tracking-tight italic">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Deliver To Cities */}
        <div className="border-t border-white/5 pt-16 mb-20">
           <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white/90 mb-10">We deliver to:</h4>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-6 gap-x-12">
              {cities.map(city => (
                <Link key={city} to="#" className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-tight italic">
                   {city}
                </Link>
              ))}
              <Link to="#" className="text-sm font-black text-primary hover:text-primary-dark transition-colors uppercase tracking-[0.1em] flex items-center gap-2">
                 650+ CITIES <ArrowRight size={14} />
              </Link>
           </div>
        </div>

        {/* App Links & Social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-t border-white/5 pt-16">
           <div className="flex flex-wrap items-center justify-center gap-6">
              <button className="h-10 px-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-full py-2" alt="AppStore" />
              </button>
              <button className="h-10 px-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-full py-2" alt="GooglePlay" />
              </button>
           </div>

           <div className="flex items-center gap-8">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white/5 hover:bg-primary rounded-2xl text-white transition-all transform hover:scale-110 active:scale-90">
                  <Icon size={20} />
                </a>
              ))}
           </div>
        </div>

        {/* Global Tagline */}
        <div className="mt-24 text-center">
           <h5 className="text-[100px] md:text-[180px] font-black text-white/[0.02] leading-none select-none pointer-events-none uppercase italic tracking-tighter">SWIGGY INSPIRED</h5>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
