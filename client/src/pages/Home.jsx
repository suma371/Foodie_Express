import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, MapPin, ChevronDown, Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const categories = [
  { name: 'Pizza', icon: '🍕', gradient: 'linear-gradient(to bottom, #ffedd5, #fff7ed)' },
  { name: 'Burgers', icon: '🍔', gradient: 'linear-gradient(to bottom, #fef9c3, #fefce8)' },
  { name: 'Sushi', icon: '🍣', gradient: 'linear-gradient(to bottom, #fee2e2, #fef2f2)' },
  { name: 'Desserts', icon: '🧁', gradient: 'linear-gradient(to bottom, #fce7f3, #fdf2f8)' },
  { name: 'Salads', icon: '🥗', gradient: 'linear-gradient(to bottom, #dcfce7, #f0fdf4)' },
  { name: 'Biryani', icon: '🍛', gradient: 'linear-gradient(to bottom, #fef3c7, #fffbeb)' },
  { name: 'Chinese', icon: '🥡', gradient: 'linear-gradient(to bottom, #fee2e2, #fff7ed)' },
  { name: 'Drinks', icon: '🥤', gradient: 'linear-gradient(to bottom, #dbeafe, #eff6ff)' },
];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data.slice(0, 8));
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="home-page-root">

      {/* ── HERO SECTION ── */}
      <section className="hero-section">
        {/* Background */}
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070"
            alt="Food background"
          />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <h1 className="hero-title">
              FOODIE<span>EXPRESS</span>
            </h1>
            <p className="hero-subtitle">
              Discover the best food & drinks <br className="lg-only" />
              delivered to your door 🚀
            </p>
          </motion.div>

          {/* Zomato-style Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="search-pill"
          >
            <div className="search-pill-location">
              <MapPin className="pin-icon" size={20} />
              <input
                className="location-input"
                placeholder="Your location..."
              />
              <ChevronDown size={16} className="chevron-icon" />
              <div className="vertical-divider lg-only" />
            </div>
            <div className="search-pill-main">
              <Search className="search-icon-dim" size={20} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="main-search-input"
                placeholder="Search for restaurant, cuisine or a dish"
              />
            </div>
            <Link
              to={`/restaurants${searchQuery ? `?q=${searchQuery}` : ''}`}
              className="btn btn-primary lg-only search-submit-btn"
            >
              Search
            </Link>
          </motion.div>

          {/* Popular tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hero-popular-tags"
          >
            <span className="popular-label">Popular:</span>
            {['Pizza', 'Biryani', 'Burgers', 'Sushi'].map(tag => (
              <Link key={tag} to="/restaurants" className="tag-pill">
                {tag}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES (Swiggy Style horizontal scroll) ── */}
      <section className="category-section">
        <div className="page-container">
          <h2 className="section-heading-small">
            What's on your mind?
          </h2>
          <div className="category-scroll-container no-scrollbar">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link to="/restaurants" className="category-item group">
                  <div className="category-circle" style={{ background: cat.gradient }}>
                    {cat.icon}
                  </div>
                  <span className="category-label">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED RESTAURANTS ── */}
      <section className="featured-section">
        <div className="page-container">
          <div className="section-header">
            <div className="header-text-group">
              <div className="label-row">
                <Flame size={18} />
                <span className="section-label">Top Picks</span>
              </div>
              <h2 className="section-title-large">
                Order from top brands
              </h2>
              <p className="section-description">
                Curated selection of best-rated eateries near you
              </p>
            </div>
            <Link
              to="/restaurants"
              className="md-only see-all-link"
            >
              See all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="restaurant-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-card-container">
                  <div className="skeleton restaurant-skeleton-img" />
                  <div className="skeleton restaurant-skeleton-name" />
                  <div className="skeleton restaurant-skeleton-meta" />
                </div>
              ))}
            </div>
          ) : restaurants.length > 0 ? (
            <div className="restaurant-grid">
              {restaurants.map((rest, i) => (
                <motion.div
                  key={rest._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                >
                  <RestaurantCard restaurant={rest} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-restaurants-placeholder">
              <p className="placeholder-icon">🍽️</p>
              <p className="placeholder-title">No restaurants yet.</p>
              <p className="placeholder-subtitle">Be the first to list your restaurant!</p>
              <Link to="/register" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Get Started</Link>
            </div>
          )}

          <div className="md-hidden mobile-see-all">
            <Link to="/restaurants" className="btn btn-outline" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
              See all restaurants <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── OFFER BANNER ── */}
      <section className="offer-banner">
        <div className="banner-glow-effects">
          <div className="glow-point glow-top" />
          <div className="glow-point glow-bottom" />
        </div>
        <div className="page-container banner-inner-content">
          <div className="banner-text-side">
            <div className="banner-main-area">
              <span className="banner-tagline">Why FoodieExpress?</span>
              <h2 className="banner-heading">
                Feeding your cravings, <br />
                <span>one click</span> at a time.
              </h2>
              <p className="banner-description">
                Join thousands of foodies who trust FoodieExpress for their daily meals.
              </p>
              <Link to="/register" className="btn btn-primary banner-cta">
                Join For Free <ArrowRight size={18} />
              </Link>
            </div>
            <div className="stat-grid">
              {[
                { num: '500+', label: 'Restaurants' },
                { num: '10k+', label: 'Daily Orders' },
                { num: '4.8★', label: 'Avg. Rating' },
                { num: '30min', label: 'Avg. Delivery' },
              ].map(({ num, label }) => (
                <div key={label} className="stat-card">
                  <div className="stat-number">{num}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
