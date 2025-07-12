'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Filter, Calendar, Tag, Trash2, Edit } from 'lucide-react';
import { Task, Category, CreateTaskRequest } from '@/types/task';
import { taskApi, categoryApi } from '@/lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  });

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskApi.getAll(),
        categoryApi.getAll(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 새 업무 생성
  const handleCreateTask = async () => {
    try {
      const createdTask = await taskApi.create(newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // 업무 삭제
  const handleDeleteTask = async (id: string) => {
    try {
      await taskApi.delete(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // 업무 상태 변경
  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      const updatedTask = await taskApi.update(id, { status });
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  // 필터링된 업무 목록
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // 우선순위 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 상태 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">업무 관리</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              새 업무 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 업무 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="업무 제목을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="업무 설명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">우선순위</Label>
                <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">마감일</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateTask} className="w-full">
                업무 추가
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 필터 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="업무 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="pending">대기 중</SelectItem>
            <SelectItem value="in-progress">진행 중</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 카테고리</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 업무 목록 */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            업무가 없습니다.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={(checked) => 
                        handleStatusChange(task._id, checked ? 'completed' : 'pending')
                      }
                    />
                    <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                      {task.status === 'pending' ? '대기 중' : task.status === 'in-progress' ? '진행 중' : '완료'}
                    </span>
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {categories.find(c => c._id === task.category)?.name || '미분류'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 