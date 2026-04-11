const mockRestaurants = [
  {
    _id: 'mock1',
    name: 'Burger King',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
    rating: 4.3,
    deliveryTime: '25-30',
    cuisines: ['Burgers', 'American'],
    address: { city: 'Andheri East' },
    offers: ['60% OFF UPTO ₹120']
  },
  {
    _id: 'mock2',
    name: 'Pizza Hut',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    rating: 4.1,
    deliveryTime: '30-35',
    cuisines: ['Pizzas', 'Italian'],
    address: { city: 'Powai' },
    offers: ['FREE ITEM ON ₹599']
  },
  {
    _id: 'mock3',
    name: 'Wow! Momo',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    deliveryTime: '20-25',
    cuisines: ['Tibetan', 'Chinese'],
    address: { city: 'Andheri West' },
    offers: ['₹100 OFF OVER ₹400']
  },
  {
    _id: 'mock4',
    name: 'KFC',
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800',
    rating: 4.0,
    deliveryTime: '25-30',
    cuisines: ['Fast Food', 'Chicken'],
    address: { city: 'Bandra' },
    offers: ['FLAT ₹50 OFF']
  },
  {
    _id: 'mock5',
    name: 'Subway',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&q=80&w=800',
    rating: 4.2,
    deliveryTime: '35-40',
    cuisines: ['Sandwiches', 'Health Food'],
    address: { city: 'Lower Parel' },
    offers: ['BUY 1 GET 1 FREE']
  },
  {
    _id: 'mock6',
    name: 'The Good Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    rating: 4.4,
    deliveryTime: '20-25',
    cuisines: ['Healthy Box', 'Bowls'],
    address: { city: 'Vile Parle' },
    offers: ['30% OFF']
  }
];

module.exports = { mockRestaurants };
