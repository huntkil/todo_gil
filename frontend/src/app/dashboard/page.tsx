'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { TaskStats, Task, Category } from '@/types/task';
import { taskApi, categoryApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, tasksData, categoriesData] = await Promise.all([
        taskApi.getStats(),
        taskApi.getAll(),
        categoryApi.getAll(),
      ]);
      setStats(statsData);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 상태별 차트 데이터
  const statusData = [
    { name: '대기 중', value: stats?.pending || 0, color: '#6B7280' },
    { name: '진행 중', value: stats?.inProgress || 0, color: '#3B82F6' },
    { name: '완료', value: stats?.completed || 0, color: '#10B981' },
    { name: '지연', value: stats?.overdue || 0, color: '#EF4444' },
  ];

  // 카테고리별 업무 수
  const categoryData = categories.map(category => ({
    name: category.name,
    value: tasks.filter(task => task.category === category._id).length,
    color: category.color,
  }));

  // 우선순위별 업무 수
  const priorityData = [
    { name: '높음', value: tasks.filter(task => task.priority === 'high').length, color: '#EF4444' },
    { name: '보통', value: tasks.filter(task => task.priority === 'medium').length, color: '#F59E0B' },
    { name: '낮음', value: tasks.filter(task => task.priority === 'low').length, color: '#10B981' },
  ];

  // 최근 7일간 업무 생성 추이
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dailyTaskData = getLast7Days().map(date => ({
    date: new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    생성: tasks.filter(task => 
      new Date(task.createdAt).toISOString().split('T')[0] === date
    ).length,
    완료: tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.updatedAt).toISOString().split('T')[0] === date
    ).length,
  }));

  // 진행률이 높은 업무 (상위 5개)
  const highProgressTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  // 마감일이 임박한 업무 (3일 이내)
  const upcomingDeadlines = tasks
    .filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <Button onClick={loadDashboardData} variant="outline">
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 업무</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              총 업무 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행 중</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
            <p className="text-xs text-muted-foreground">
              진행 중인 업무
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
              완료된 업무
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">지연</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overdue || 0}</div>
            <p className="text-xs text-muted-foreground">
              지연된 업무
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 상태별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>상태별 업무 분포</CardTitle>
            <CardDescription>업무 상태별 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 우선순위별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>우선순위별 업무 분포</CardTitle>
            <CardDescription>우선순위별 업무 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 일별 추이 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>최근 7일 업무 추이</CardTitle>
          <CardDescription>일별 업무 생성 및 완료 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTaskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="생성" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="완료" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 상세 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 진행률 높은 업무 */}
        <Card>
          <CardHeader>
            <CardTitle>진행률 높은 업무</CardTitle>
            <CardDescription>상위 5개 업무</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highProgressTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">진행 중인 업무가 없습니다.</p>
              ) : (
                highProgressTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {categories.find(c => c._id === task.category)?.name || '미분류'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{task.progress}%</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* 임박한 마감일 */}
        <Card>
          <CardHeader>
            <CardTitle>임박한 마감일</CardTitle>
            <CardDescription>3일 이내 마감</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">임박한 마감일이 없습니다.</p>
              ) : (
                upcomingDeadlines.map((task) => {
                  const dueDate = new Date(task.dueDate!);
                  const today = new Date();
                  const diffTime = dueDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={task._id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {categories.find(c => c._id === task.category)?.name || '미분류'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          diffDays === 0 ? 'text-red-600' : 
                          diffDays === 1 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {diffDays === 0 ? '오늘' : 
                           diffDays === 1 ? '내일' : `${diffDays}일 후`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dueDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 