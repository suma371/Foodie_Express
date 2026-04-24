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
  },
  {
    _id: 'mock7',
    name: 'South Spice',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    deliveryTime: '25-30',
    cuisines: ['South Indian', 'Breakfast'],
    address: { city: 'Southern Cross' },
    offers: ['10% OFF']
  },
  {
    _id: 'mock8',
    name: 'The Great Greek',
    image: 'https://images.unsplash.com/photo-1528650774211-f1110fc9ac96?q=80&w=2070&auto=format&fit=crop',
    rating: 4.5,
    deliveryTime: '30-40',
    cuisines: ['Greek', 'Mediterranean'],
    address: { city: 'West End' },
    offers: ['FREE DESSERT']
  },
  {
    _id: 'mock9',
    name: 'Le Petit Bistro',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop',
    rating: 4.7,
    deliveryTime: '35-45',
    cuisines: ['French', 'European'],
    address: { city: 'Park Ridge' },
    offers: []
  },
  {
    _id: 'mock10',
    name: 'Mumbai Street Bites',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop',
    rating: 4.3,
    deliveryTime: '15-20',
    cuisines: ['Street Food', 'Indian'],
    address: { city: 'Eastside' },
    offers: ['FLAT ₹20 OFF']
  },
  {
    _id: 'mock11',
    name: 'Seoul Kitchen',
    image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=2070&auto=format&fit=crop',
    rating: 4.6,
    deliveryTime: '25-35',
    cuisines: ['Korean', 'Asian'],
    address: { city: 'North Market' },
    offers: ['15% OFF']
  },
  {
    _id: 'mock12',
    name: 'Vegan Vibe Café',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=2070&auto=format&fit=crop',
    rating: 4.9,
    deliveryTime: '20-30',
    cuisines: ['Vegan', 'Healthy'],
    address: { city: 'Eco District' },
    offers: ['BUY 1 GET 1 FREE']
  },
  {
    _id: 'mock13',
    name: 'Texas Smokehouse',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=2070&auto=format&fit=crop',
    rating: 4.4,
    deliveryTime: '40-50',
    cuisines: ['BBQ', 'American'],
    address: { city: 'South Highway' },
    offers: ['FREE BEVERAGE']
  },
  {
    _id: 'mock14',
    name: 'Noodle Nirvana',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2070&auto=format&fit=crop',
    rating: 4.5,
    deliveryTime: '25-35',
    cuisines: ['Noodles', 'Asian'],
    address: { city: 'Chinatown' },
    offers: ['20% OFF ON ₹500']
  },
  {
    _id: 'mock15',
    name: 'Pancake Parlour',
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=2070&auto=format&fit=crop',
    rating: 4.2,
    deliveryTime: '20-25',
    cuisines: ['Breakfast', 'Desserts'],
    address: { city: 'Downtown' },
    offers: ['10% OFF']
  },
  {
    _id: 'mock16',
    name: 'Gelato Haven',
    image: 'https://images.unsplash.com/photo-1570197781417-0a82375c9371?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    deliveryTime: '15-20',
    cuisines: ['Desserts', 'Ice Cream'],
    address: { city: 'Bay Area' },
    offers: []
  }
];

module.exports = { mockRestaurants };
