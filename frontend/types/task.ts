export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  tags?: string[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  tags?: string[];
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  description?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
} 