'use client';

import React from 'react';
import { Bell, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRealtimeNotifications } from './RealtimeNotificationProvider';

interface NotificationStatusProps {
  className?: string;
}

export const NotificationStatus: React.FC<NotificationStatusProps> = ({ className = '' }) => {
  const { isConnected, notifications } = useRealtimeNotifications();

  const unreadCount = notifications.length;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 연결 상태 표시 */}
      <div className="flex items-center gap-1">
        {isConnected ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span className="text-xs text-muted-foreground">
          {isConnected ? '실시간' : '오프라인'}
        </span>
      </div>

      {/* 알림 개수 표시 */}
      <div className="flex items-center gap-1">
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
    </div>
  );
}; 