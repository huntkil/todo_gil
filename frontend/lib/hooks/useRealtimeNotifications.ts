'use client';

import { useState, useEffect, useCallback } from 'react';
import socketManager from '@/lib/socket';
import { RealtimeNotification } from '@/types/notification';

export function useRealtimeNotifications(userId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 연결 상태 변경 처리
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  // 실시간 알림 수신 처리
  const handleNotification = useCallback((notification: RealtimeNotification) => {
    setRecentNotifications(prev => {
      const newNotifications = [notification, ...prev.slice(0, 9)]; // 최근 10개만 유지
      return newNotifications;
    });
    
    setUnreadCount(prev => prev + 1);
  }, []);

  // 알림 읽음 처리
  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // 알림 목록 초기화
  const clearNotifications = useCallback(() => {
    setRecentNotifications([]);
    setUnreadCount(0);
  }, []);

  // 특정 알림 제거
  const removeNotification = useCallback((timestamp: string) => {
    setRecentNotifications(prev => 
      prev.filter(notification => notification.timestamp !== timestamp)
    );
  }, []);

  useEffect(() => {
    // Socket 연결
    socketManager.connect(userId);

    // 이벤트 리스너 등록
    socketManager.onConnectionChange(handleConnectionChange);
    socketManager.onNotification(handleNotification);

    // 컴포넌트 언마운트 시 정리
    return () => {
      socketManager.offConnectionChange(handleConnectionChange);
      socketManager.offNotification(handleNotification);
    };
  }, [userId, handleConnectionChange, handleNotification]);

  // 수동으로 테스트 알림 전송
  const sendTestNotification = useCallback((type: RealtimeNotification['type'] = 'system') => {
    const testNotification: RealtimeNotification = {
      type,
      title: '테스트 알림',
      message: '이것은 테스트 알림입니다.',
      timestamp: new Date().toISOString(),
      metadata: {
        taskId: 'test-task-id',
        taskTitle: '테스트 업무',
        priority: 'medium',
      },
    };

    socketManager.emitNotification(testNotification);
  }, []);

  return {
    isConnected,
    recentNotifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    removeNotification,
    sendTestNotification,
  };
} 