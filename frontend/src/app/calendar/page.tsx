'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { Task, Category, CreateTaskRequest } from '@/types/task';
import { taskApi, categoryApi } from '@/lib/api';
import { 
  generateMonthCalendar, 
  formatMonth, 
  getPreviousMonth, 
  getNextMonth,
  getPriorityColor,
  getStatusColor,
  weekDays,
  CalendarMonth
} from '@/lib/calendar';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<CalendarMonth | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const calendarData = generateMonthCalendar(currentDate, tasks);
      setCalendar(calendarData);
    }
  }, [currentDate, tasks]);

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

  const handlePreviousMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewTask(prev => ({
      ...prev,
      dueDate: date.toISOString().split('T')[0],
    }));
    setIsCreateDialogOpen(true);
  };

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

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate).toDateString() === date.toDateString();
    });
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
        <h1 className="text-3xl font-bold">캘린더</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[120px] text-center">
              {formatMonth(currentDate)}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
      </div>

      {/* 캘린더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            월간 일정
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calendar && (
            <div className="space-y-2">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 그리드 */}
              {calendar.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.days.map((day, dayIndex) => {
                    const dayTasks = getTasksForDate(day.date);
                    const isOverdue = dayTasks.some(task => {
                      if (!task.dueDate || task.status === 'completed') return false;
                      return new Date(task.dueDate) < new Date() && day.date < new Date();
                    });

                    return (
                      <div
                        key={dayIndex}
                        className={`
                          min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors
                          ${day.isCurrentMonth ? 'bg-background' : 'bg-muted/50'}
                          ${day.isToday ? 'ring-2 ring-primary' : ''}
                          ${isOverdue ? 'border-red-300 bg-red-50' : 'border-border'}
                          hover:bg-accent hover:border-primary
                        `}
                        onClick={() => handleDateClick(day.date)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`
                            text-sm font-medium
                            ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                            ${day.isToday ? 'text-primary font-bold' : ''}
                          `}>
                            {day.dayOfMonth}
                          </span>
                          {isOverdue && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                        </div>

                        {/* 업무 목록 */}
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map((task) => (
                            <div
                              key={task._id}
                              className={`
                                text-xs p-1 rounded truncate
                                ${getPriorityColor(task.priority)}
                                text-white font-medium
                              `}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{dayTasks.length - 3}개 더
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 범례 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>범례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">높은 우선순위</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">보통 우선순위</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">낮은 우선순위</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-300 rounded"></div>
              <span className="text-sm">지연된 업무</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 