import { Link } from 'react-router-dom';
import { UtensilsCrossed, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '#' },
    { label: 'Team', to: '#' },
    { label: 'Blog', to: '#' },
  ],
  'For Restaurants': [
    { label: 'Partner with us', to: '/register' },
    { label: 'Apps for you', to: '#' },
  ],
  Legal: [
    { label: 'Terms & Conditions', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Refund Policy', to: '#' },
    { label: 'Cookie Policy', to: '#' },
  ],
  Support: [
    { label: 'Help Center', to: '#' },
    { label: 'Contact Us', to: '#' },
    { label: 'FAQs', to: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className="footer-main">
      {/* Main Grid */}
      <div className="page-container" style={{ padding: '4rem 1rem' }}>
        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-nav-brand">
              <div className="footer-logo-box">
                <UtensilsCrossed size={22} style={{ strokeWidth: 2.5 }} />
              </div>
              <span className="font-black text-lg tracking-tighter">
                FOODIE<span style={{ color: 'var(--primary-brand)' }}>EXPRESS</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Better food for more people.
            </p>
            <div className="footer-social-links">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="footer-social-link">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="footer-heading">{title}</h4>
              <ul className="footer-link-list">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="page-container flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
            &copy; {new Date().getFullYear()} FoodieExpress Ltd. All rights reserved.
          </p>
          <div className="payment-badge-group">
            {['VISA', 'MC', 'UPI', 'GPay'].map(m => (
              <div key={m} className="payment-badge">
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
