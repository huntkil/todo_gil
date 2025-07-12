import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { RealtimeNotification, SocketNotificationEvent } from '@/types/notification';
import { toast } from 'sonner';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Socket 연결 초기화
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    // 연결 이벤트 리스너
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // 실시간 알림 수신
    socket.on('notification', (data: SocketNotificationEvent) => {
      console.log('Received notification:', data);
      
      const newNotification: RealtimeNotification = {
        ...data.notification,
        timestamp: new Date().toISOString(),
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Sonner로 토스트 알림 표시
      const getNotificationIcon = (type: string) => {
        switch (type) {
          case 'task_reminder':
            return '⏰';
          case 'duplicate_detected':
            return '⚠️';
          case 'task_completed':
            return '✅';
          case 'system':
            return '🔔';
          default:
            return '📢';
        }
      };

      const getNotificationColor = (type: string) => {
        switch (type) {
          case 'task_reminder':
            return 'blue';
          case 'duplicate_detected':
            return 'orange';
          case 'task_completed':
            return 'green';
          case 'system':
            return 'purple';
          default:
            return 'default';
        }
      };

      toast(data.notification.title, {
        description: data.notification.message,
        icon: getNotificationIcon(data.notification.type),
        action: {
          label: '확인',
          onClick: () => {
            // 알림 클릭 시 처리 (예: 해당 페이지로 이동)
            if (data.notification.metadata?.taskId) {
              // 업무 상세 페이지로 이동
              window.location.href = `/tasks/${data.notification.metadata.taskId}`;
            }
          },
        },
        duration: 5000,
        className: `bg-${getNotificationColor(data.notification.type)}-50 border-${getNotificationColor(data.notification.type)}-200`,
      });
    });

    // 에러 처리
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // 알림 목록 초기화
  const clearNotifications = () => {
    setNotifications([]);
  };

  // 특정 알림 제거
  const removeNotification = (timestamp: string) => {
    setNotifications(prev => prev.filter(n => n.timestamp !== timestamp));
  };

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    clearNotifications,
    removeNotification,
  };
};

// 전역 socket 인스턴스 (필요시 사용)
let globalSocket: Socket | null = null;

export const getGlobalSocket = () => {
  if (!globalSocket) {
    globalSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return globalSocket;
};

export const disconnectGlobalSocket = () => {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }
}; 