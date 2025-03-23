'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { socketApi } from '@repo/client';

interface WebSocketContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  socket: typeof socketApi.chat.socket;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

socketApi.chat.init({
  socket: {
    baseUrl: 'http://localhost:3040/chat',
  },
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(socketApi.chat.socket);

  const connect = () => {
    if (!isConnected) {
      socketApi.chat.socket.connect();
      console.log('Connecting to chat namespace');
      setSocket(socketApi.chat.socket);
    }
  };

  const disconnect = () => {
    if (socket && isConnected) {
      socket.disconnect();
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      connect();
    }

    const handleConnect = () => {
      console.log('Connected to chat namespace successfully');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from chat namespace');
      setIsConnected(false);
    };

    const handleConnectError = (error: any) => {
      console.error('Connection error to chat namespace:', error);
      setIsConnected(false);
    };

    const handleReconnect = (attemptNumber: number) => {
      console.log(`Reconnecting to chat namespace, attempt ${attemptNumber}`);
    };

    const handleReconnectAttempt = (attemptNumber: number) => {
      console.log(
        `Attempting to reconnect to chat namespace, attempt ${attemptNumber}`
      );
    };

    socketApi.chat.socket.on('connect', handleConnect);
    socketApi.chat.socket.on('disconnect', handleDisconnect);
    socketApi.chat.socket.on('connect_error', handleConnectError);
    socketApi.chat.socket.on('reconnect', handleReconnect);
    socketApi.chat.socket.on('reconnect_attempt', handleReconnectAttempt);

    let pingInterval: NodeJS.Timeout | null = null;
    if (socket && isConnected) {
      console.log('Connected to chat namespace successfully', isConnected);

      pingInterval = setInterval(() => {
        console.log('Sending ping to chat namespace...');
        socketApi.chat.socket.emit('client:ping', { message: 'ping' });
      }, 1000);

      const handlePong = (data: any) => {
        console.log('Received pong from chat namespace:', data);
      };

      socketApi.chat.socket.on('server:pong', handlePong);

      return () => {
        if (pingInterval) clearInterval(pingInterval);
        socketApi.chat.socket.offAny();
      };
    }
    return () => {
      if (pingInterval) clearInterval(pingInterval);

      socketApi.chat.socket.offAny();

      if (socket && isConnected) {
        disconnect();
      }
    };
  }, [socket, isConnected]);

  const value = {
    isConnected,
    connect,
    socket,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);

  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return context;
}
