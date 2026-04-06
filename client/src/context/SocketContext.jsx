import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from './AuthContext';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    let newSocket;
    if (user) {
      // Initialize connection
      newSocket = io('http://localhost:5000', {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        // Upon successful connection, join specific room for targeted alerts
        newSocket.emit('joinRoom', user._id);
      });

      // Listen for our new status updates globally
      newSocket.on('orderStatusUpdated', (data) => {
        toast.success(`Your order status is now: ${data.status}`, {
          duration: 6000,
          position: 'top-right',
          icon: '📦',
        });
      });

      setSocket(newSocket);
    }
    
    // Cleanup on unmount or user change
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
