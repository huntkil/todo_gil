import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Task } from '@/types/task';

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  weeks: CalendarWeek[];
  month: Date;
}

// 월간 캘린더 데이터 생성
export function generateMonthCalendar(date: Date, tasks: Task[]): CalendarMonth {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];

  days.forEach((day) => {
    const dayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(parseISO(task.dueDate), day);
    });

    const calendarDay: CalendarDay = {
      date: day,
      dayOfMonth: day.getDate(),
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
      tasks: dayTasks,
    };

    currentWeek.push(calendarDay);

    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }
  });

  return { weeks, month: date };
}

// 날짜 포맷팅
export function formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
  return format(date, formatStr, { locale: ko });
}

export function formatMonth(date: Date): string {
  return format(date, 'yyyy년 M월', { locale: ko });
}

export function formatDay(date: Date): string {
  return format(date, 'M월 d일', { locale: ko });
}

// 월 이동
export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

// 우선순위별 색상
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

// 상태별 색상
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-blue-500';
    case 'pending': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
}

// 요일 헤더
export const weekDays = ['일', '월', '화', '수', '목', '금', '토']; 