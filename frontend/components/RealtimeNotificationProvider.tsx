'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket } from '@/lib/socket';
import { RealtimeNotification } from '@/types/notification';
import { Toaster } from 'sonner';

interface RealtimeNotificationContextType {
  isConnected: boolean;
  notifications: RealtimeNotification[];
  clearNotifications: () => void;
  removeNotification: (timestamp: string) => void;
}

const RealtimeNotificationContext = createContext<RealtimeNotificationContextType | undefined>(undefined);

export const useRealtimeNotifications = () => {
  const context = useContext(RealtimeNotificationContext);
  if (context === undefined) {
    throw new Error('useRealtimeNotifications must be used within a RealtimeNotificationProvider');
  }
  return context;
};

interface RealtimeNotificationProviderProps {
  children: ReactNode;
}

export const RealtimeNotificationProvider: React.FC<RealtimeNotificationProviderProps> = ({ children }) => {
  const { isConnected, notifications, clearNotifications, removeNotification } = useSocket();

  const value: RealtimeNotificationContextType = {
    isConnected,
    notifications,
    clearNotifications,
    removeNotification,
  };

  return (
    <RealtimeNotificationContext.Provider value={value}>
      {children}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={5000}
        expand={true}
      />
    </RealtimeNotificationContext.Provider>
  );
}; 