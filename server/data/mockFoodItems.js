const mockFoodItems = [
  {
    _id: 'item1',
    name: 'Paneer Butter Masala',
    price: 320,
    category: 'Main Course',
    isVeg: true,
    isBestSeller: true,
    description: 'Creamy paneer cubes cooked in a rich tomato-based gravy with butter and spices.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300'
  },
  {
    _id: 'item2',
    name: 'Cheese Corn Nuggets',
    price: 180,
    category: 'Starters',
    isVeg: true,
    isBestSeller: false,
    description: 'Crispy golden nuggets filled with melting cheese and sweet corn.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=300'
  },
  {
    _id: 'item3',
    name: 'Chicken Dum Biryani',
    price: 450,
    category: 'Rice & Biryani',
    isVeg: false,
    isBestSeller: true,
    description: 'Fragrant basmati rice layered with juicy chicken and secret spices, dum-cooked to perfection.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b11adbc5d9?auto=format&fit=crop&q=80&w=300'
  },
  {
    _id: 'item4',
    name: 'Chocolate Lava Cake',
    price: 150,
    category: 'Desserts',
    isVeg: true,
    isBestSeller: true,
    description: 'Warm, gooey chocolate center inside a moist chocolate cake. A perfect finish.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=300'
  },
  {
    _id: 'item5',
    name: 'Classic Margherita Pizza',
    price: 280,
    category: 'Pizzas',
    isVeg: true,
    isBestSeller: true,
    description: 'Single cheese topping with a dash of herbs and fresh tomato sauce.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=300'
  }
];

module.exports = { mockFoodItems };
