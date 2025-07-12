'use client';

import { useState } from 'react';
import { Bell, Wifi, WifiOff, X, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimeNotifications } from '@/lib/hooks/useRealtimeNotifications';
import { RealtimeNotification } from '@/types/notification';

interface RealtimeNotificationStatusProps {
  userId?: string;
}

export default function RealtimeNotificationStatus({ userId }: RealtimeNotificationStatusProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    isConnected,
    recentNotifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    removeNotification,
    sendTestNotification,
  } = useRealtimeNotifications(userId);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (unreadCount > 0) {
      markAsRead();
    }
  };

  const getNotificationIcon = (type: RealtimeNotification['type']) => {
    switch (type) {
      case 'task_reminder':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'duplicate_detected':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'system':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* 연결 상태 및 알림 버튼 */}
      <div className="flex items-center gap-2">
        {/* 연결 상태 표시 */}
        <div className="flex items-center gap-1">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {isConnected ? '실시간 연결됨' : '연결 끊김'}
          </span>
        </div>

        {/* 알림 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBellClick}
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* 테스트 버튼 (개발용) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => sendTestNotification('task_reminder')}
          className="text-xs"
        >
          테스트
        </Button>
      </div>

      {/* 알림 목록 드롭다운 */}
      {showNotifications && (
        <Card className="absolute right-0 top-10 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">최근 알림</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="h-6 px-2 text-xs"
                >
                  모두 지우기
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                새로운 알림이 없습니다
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentNotifications.map((notification, index) => (
                  <div
                    key={`${notification.timestamp}-${index}`}
                    className="flex items-start gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.metadata?.taskTitle && (
                            <p className="text-xs text-blue-600 mt-1">
                              업무: {notification.metadata.taskTitle}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.timestamp)}
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 