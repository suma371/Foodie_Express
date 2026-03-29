import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const FILTERS = ['All', 'Rating 4.0+', 'Fast Delivery', 'Pure Veg', 'New'];
const SORTS = ['relevance', 'rating', 'delivery_time'];

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === 'Rating 4.0+') return matchSearch && r.rating >= 4;
    return matchSearch;
  });

  return (
    <div className="restaurant-list-page">
      {/* Top Search Bar */}
      <div className="sticky-filter-bar">
        <div className="page-container">
          <div className="search-section">
            {/* Search */}
            <div className="search-input-wrapper">
              <Search className="search-icon-left" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for restaurants and food..."
                className="search-input-fancy"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')} 
                  className="search-clear-btn"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {/* Filter icon */}
            <button className="btn btn-outline md-only items-center gap-standard" style={{ whiteSpace: 'nowrap' }}>
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="page-container restaurant-content-area">
        {/* Filter Chips */}
        <div className="filter-chip-scroll no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="results-header-box">
          <h1 className="results-title">
            {loading ? 'Loading...' : `${filtered.length} Restaurants`}
          </h1>
          {search && (
            <p className="results-subtitle">
              Showing results for "<span className="highlight-text">{search}</span>"
            </p>
          )}
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="restaurant-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-card-container">
                <div className="skeleton restaurant-skeleton-img" />
                <div className="skeleton restaurant-skeleton-name" />
                <div className="skeleton restaurant-skeleton-meta" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="restaurant-grid"
            >
              {filtered.map(r => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="results-empty-state flex-center">
            <div className="empty-state-icon">🍽️</div>
            <h3 className="empty-state-title">No restaurants found</h3>
            <p className="empty-state-subtitle">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setActiveFilter('All'); }}
              className="btn btn-primary clear-filters-btn">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
