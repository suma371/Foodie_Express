import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, MapPin, ChevronDown, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { mockRestaurants } from '../data/mockData';

const categories = [
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200', gradient: '#ffedd5' },
  { name: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=200', gradient: '#fef9c3' },
  { name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200', gradient: '#fee2e2' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=200', gradient: '#fce7f3' },
  { name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200', gradient: '#dcfce7' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=200', gradient: '#fef3c7' },
  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=200', gradient: '#fee2e2' },
  { name: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=200', gradient: '#e0f2fe' },
];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        if (data && data.length > 0) {
          setRestaurants(data.slice(0, 8));
        } else {
          // Fallback if DB is empty
          setRestaurants(mockRestaurants.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching restaurants, using mock data:', err);
        setRestaurants(mockRestaurants.slice(0, 8));
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
              delivered early to your door 🚀
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="search-pill"
          >
            <div className="search-pill-location md-only">
              <MapPin className="pin-icon" size={20} />
              <input
                className="location-input"
                placeholder="Downtown, New York"
              />
              <ChevronDown size={16} className="chevron-icon" />
              <div className="vertical-divider" />
            </div>
            <div className="search-pill-main">
              <Search className="search-icon-dim" size={20} style={{ color: '#999' }} />
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
        </div>
      </section>

      {/* ── CATEGORIES ── */}
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
                <Link to="/restaurants" className="category-item">
                  <div className="category-circle" style={{ backgroundColor: cat.gradient }}>
                    <img src={cat.image} alt={cat.name} />
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

      {/* ── RESTAURANTS GRID ── */}
      <section className="featured-section">
        <div className="page-container">
          <div className="section-header">
            <div className="header-text-group">
              <div className="label-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e23744' }}>
                <Flame size={18} />
                <span className="section-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Top Rated</span>
              </div>
              <h2 className="section-title-large">
                Restaurants near you
              </h2>
            </div>
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
          ) : (
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
