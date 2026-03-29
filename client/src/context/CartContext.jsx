import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthContext } from './AuthContext';

const CartContext = createContext();

export const useCartContext = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuthContext();

  // Fetch cart from backend on login or mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const { data } = await api.get('/cart');
          // Map backend items (foodItemId) to frontend items (_id) for compatibility
          const mappedItems = data.items.map(item => ({
            ...item,
            _id: item.foodItemId,
          }));
          setCartItems(mappedItems);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (item, quantity = 1) => {
    try {
      if (user) {
        const { data } = await api.post('/cart/add', {
          foodItemId: item._id,
          name: item.name,
          quantity,
          price: item.price,
          image: item.image
        });
        const mappedItems = data.items.map(i => ({
          ...i,
          _id: i.foodItemId,
        }));
        setCartItems(mappedItems);
      } else {
        // Fallback for guests (optional, keeping it simple for now as per user request)
        setCartItems((prevItems) => {
          const existItem = prevItems.find((x) => x._id === item._id);
          if (existItem) {
            return prevItems.map((x) =>
              x._id === existItem._id ? { ...existItem, quantity: existItem.quantity + quantity } : x
            );
          } else {
            return [...prevItems, { ...item, quantity }];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQty = async (id, quantity) => {
    try {
      if (user) {
        const { data } = await api.put('/cart/update', {
          foodItemId: id,
          quantity
        });
        const mappedItems = data.items.map(i => ({
          ...i,
          _id: i.foodItemId,
        }));
        setCartItems(mappedItems);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((x) => (x._id === id ? { ...x, quantity } : x))
        );
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      if (user) {
        const { data } = await api.delete(`/cart/remove/${id}`);
        const mappedItems = data.items.map(i => ({
          ...i,
          _id: i.foodItemId,
        }));
        setCartItems(mappedItems);
      } else {
        setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await api.delete('/cart/clear');
      }
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);
  };

  const value = {
    cartItems,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
