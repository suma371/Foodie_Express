import { Link } from 'react-router-dom';
import { UtensilsCrossed, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';

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

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida'];

const Footer = () => {
  return (
    <footer className="bg-[#02060c] text-white pt-12 sm:pt-16 pb-10 sm:pb-16 mt-16 sm:mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top: Brand + Link Columns ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-16">

          {/* Brand (full width on mobile) */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4 mb-4 sm:mb-0">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <UtensilsCrossed size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic leading-none">
                Foodie<br />Express
              </span>
            </Link>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
              © 2026 FoodieExpress Pvt. Ltd
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm font-semibold text-white/40 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Cities ── */}
        <div className="border-t border-white/5 pt-8 sm:pt-12 mb-10 sm:mb-14">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 mb-5 sm:mb-6">We deliver to</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-3">
            {cities.map(city => (
              <Link key={city} to="#" className="text-sm font-semibold text-white/35 hover:text-white transition-colors">
                {city}
              </Link>
            ))}
            <Link to="#" className="text-sm font-black text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5">
              650+ Cities <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Bottom: App Buttons + Social ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
          {/* App Badges */}
          <div className="flex items-center gap-4">
            <a href="#" className="h-10 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-6" alt="App Store" />
            </a>
            <a href="#" className="h-10 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-6" alt="Google Play" />
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="p-2.5 bg-white/5 hover:bg-primary rounded-xl text-white/70 hover:text-white transition-all hover:scale-110 active:scale-90">
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
