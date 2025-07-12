export interface Notification {
  _id: string;
  userId: string;
  type: 'task_reminder' | 'duplicate_detected' | 'task_completed' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    taskId?: string;
    taskTitle?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface NotificationSettings {
  email: boolean;
  slack: boolean;
  push: boolean;
  inApp: boolean;
  taskReminders: boolean;
  duplicateDetection: boolean;
  systemNotifications: boolean;
  systemUpdates: boolean;
}

// Socket.io 실시간 알림 타입
export interface RealtimeNotification {
  type: 'task_reminder' | 'duplicate_detected' | 'task_completed' | 'system';
  title: string;
  message: string;
  metadata?: {
    taskId?: string;
    taskTitle?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
  };
  timestamp: string;
}

export interface SocketNotificationEvent {
  notification: RealtimeNotification;
  userId: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: Notification['type'];
  relatedTaskId?: string;
} 