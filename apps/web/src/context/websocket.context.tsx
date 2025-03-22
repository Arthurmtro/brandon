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

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(socketApi.chat.socket);

  const connect = () => {
    if (!isConnected) {
      const chat = socketApi.chat.socket.connect();
      setSocket(chat);
      setIsConnected(true);
    }
  };

  const disconnect = () => {
    if (socket && isConnected) {
      socket.disconnect();
      // setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connect();

    if (socket) {
      socketApi.chat.socket.on('server:pong', (data) => {
        console.log('Received pong from server:', data);
      });
    }

    return () => {
      disconnect();
    };
  }, [isConnected]);

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
