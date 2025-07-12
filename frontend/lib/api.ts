import { Task, CreateTaskRequest, UpdateTaskRequest, Category, TaskStats } from '@/types/task';
import { Notification, NotificationSettings, CreateNotificationRequest } from '@/types/notification';

const API_BASE_URL = 'http://localhost:3000/api';

// Task API
export const taskApi = {
  // 모든 업무 조회
  getAll: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  // 특정 업무 조회
  getById: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  },

  // 새 업무 생성
  create: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  },

  // 업무 수정
  update: async (id: string, task: UpdateTaskRequest): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  },

  // 업무 삭제
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  },

  // 진행률 업데이트
  updateProgress: async (id: string, progress: number): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
    return response.json();
  },

  // 통계 조회
  getStats: async (): Promise<TaskStats> => {
    const response = await fetch(`${API_BASE_URL}/tasks/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },
};

// Category API
export const categoryApi = {
  // 모든 카테고리 조회
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  // 카테고리 생성
  create: async (category: { name: string; color: string; description?: string }): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  },
};

// Notification API
export const notificationApi = {
  // 모든 알림 조회
  getAll: async (): Promise<Notification[]> => {
    const response = await fetch(`${API_BASE_URL}/notifications`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return response.json();
  },

  // 읽지 않은 알림만 조회
  getUnread: async (): Promise<Notification[]> => {
    const response = await fetch(`${API_BASE_URL}/notifications?unread=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch unread notifications');
    }
    return response.json();
  },

  // 알림 생성
  create: async (notification: CreateNotificationRequest): Promise<Notification> => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    return response.json();
  },

  // 알림 읽음 처리
  markAsRead: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  // 알림 설정 조회
  getSettings: async (): Promise<NotificationSettings> => {
    const response = await fetch(`${API_BASE_URL}/notifications/settings`);
    if (!response.ok) {
      throw new Error('Failed to fetch notification settings');
    }
    return response.json();
  },

  // 알림 설정 업데이트
  updateSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update notification settings');
    }
    return response.json();
  },
}; 