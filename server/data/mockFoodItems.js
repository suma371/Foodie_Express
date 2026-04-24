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
  },
  {
    _id: 'item6',
    restaurantId: 'mock7',
    name: 'Idli Sambar',
    price: 149,
    description: 'Soft steamed rice cakes served with hot lentil-based vegetable stew.',
    category: 'Breakfast',
    isVeg: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item7',
    restaurantId: 'mock8',
    name: 'Chicken Souvlaki Pita',
    price: 499,
    description: 'Marinated grilled chicken wrapped in warm pita with tzatziki, tomatoes, and fries.',
    category: 'Greek',
    isVeg: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1596796593510-dc3283204969?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item8',
    restaurantId: 'mock8',
    name: 'Greek Salad',
    price: 349,
    description: 'Crisp cucumbers, tomatoes, kalamata olives, and a large slice of feta cheese.',
    category: 'Salad',
    isVeg: true,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item9',
    restaurantId: 'mock9',
    name: 'Coq au Vin',
    price: 899,
    description: 'Classic French chicken braised with wine, mushrooms, and pearl onions.',
    category: 'French',
    isVeg: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item10',
    restaurantId: 'mock9',
    name: 'Crème Brûlée',
    price: 449,
    description: 'Rich vanilla custard base topped with a contrasting layer of hard caramel.',
    category: 'Dessert',
    isVeg: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1470355415712-421715694206?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item11',
    restaurantId: 'mock10',
    name: 'Pav Bhaji',
    price: 199,
    description: 'Spicy mixed vegetable mash served with butter-toasted bread rolls.',
    category: 'Street Food',
    isVeg: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1606491956391-70868b5d0f47?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item12',
    restaurantId: 'mock10',
    name: 'Vada Pav',
    price: 99,
    description: 'Deep fried potato dumpling placed inside a bread bun with dry garlic chutney.',
    category: 'Street Food',
    isVeg: true,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea8869920cc?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item13',
    restaurantId: 'mock11',
    name: 'Beef Bulgogi',
    price: 749,
    description: 'Thinly sliced, marinated ribeye cooked on a sizzling griddle.',
    category: 'Korean',
    isVeg: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item14',
    restaurantId: 'mock11',
    name: 'Tteokbokki',
    price: 499,
    description: 'Chewy rice cakes cooked in a sweet and spicy gochujang sauce.',
    category: 'Korean',
    isVeg: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item15',
    restaurantId: 'mock12',
    name: 'Beyond Meat Burger',
    price: 549,
    description: '100% plant-based burger that looks, cooks, and satisfies like beef.',
    category: 'Vegan',
    isVeg: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item16',
    restaurantId: 'mock12',
    name: 'Avocado Toast',
    price: 299,
    description: 'Mashed avocado on artisan sourdough with microgreens and chili flakes.',
    category: 'Breakfast',
    isVeg: true,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=2072&auto=format&fit=crop'
  },
  {
    _id: 'item17',
    restaurantId: 'mock13',
    name: 'Smoked Beef Brisket',
    price: 999,
    description: 'Slow-smoked for 14 hours over oak, served with coleslaw and baked beans.',
    category: 'BBQ',
    isVeg: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1527415053424-6fd659e98e4c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item18',
    restaurantId: 'mock13',
    name: 'BBQ Pork Ribs',
    price: 899,
    description: 'Half rack of fall-off-the-bone ribs smothered in tangy BBQ sauce.',
    category: 'BBQ',
    isVeg: false,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop'
  },
  {
    _id: 'item19',
    restaurantId: 'mock14',
    name: 'Dan Dan Noodles',
    price: 449,
    description: 'Spicy Sichuan noodles topped with minced pork and scallions.',
    category: 'Noodles',
    isVeg: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item20',
    restaurantId: 'mock14',
    name: 'Pork Gyoza',
    price: 349,
    description: 'Pan-fried Japanese dumplings with a juicy pork and cabbage filling.',
    category: 'Starter',
    isVeg: false,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item21',
    restaurantId: 'mock15',
    name: 'Blueberry Buttermilk Pancakes',
    price: 399,
    description: 'Stack of three fluffy pancakes bursting with fresh blueberries and maple syrup.',
    category: 'Breakfast',
    isVeg: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item22',
    restaurantId: 'mock15',
    name: 'Belgian Waffle',
    price: 449,
    description: 'Crispy golden waffle served with whipped cream and fresh strawberries.',
    category: 'Breakfast',
    isVeg: true,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f1f64?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item23',
    restaurantId: 'mock16',
    name: 'Pistachio Gelato',
    price: 249,
    description: 'Creamy artisanal gelato made with imported Sicilian pistachios.',
    category: 'Dessert',
    isVeg: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item24',
    restaurantId: 'mock16',
    name: 'Stracciatella Gelato',
    price: 249,
    description: 'Classic Italian milk-based ice cream filled with fine chocolate shavings.',
    category: 'Dessert',
    isVeg: true,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1570197781417-0a82375c9371?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item25',
    restaurantId: 'mock16',
    name: 'Chicken Shawarma Wrap',
    price: 399,
    description: 'Thinly sliced roasted chicken with garlic sauce and pickles in toasted pita.',
    category: 'Middle Eastern',
    isVeg: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2070&auto=format&fit=crop'
  },
  {
    _id: 'item26',
    restaurantId: 'mock16',
    name: 'Hummus with Fresh Pita',
    price: 299,
    description: 'Creamy chickpea dip drizzled with olive oil, served with warm oven-baked bread.',
    category: 'Starter',
    isVeg: true,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1529928520614-7c76e2d99740?q=80&w=2070&auto=format&fit=crop'
  }
];

module.exports = { mockFoodItems };
