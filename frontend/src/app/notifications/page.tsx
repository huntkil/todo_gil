'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Check, 
  Trash2, 
  Settings, 
  Mail, 
  Smartphone,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Notification, NotificationSettings } from '@/types/notification';
import { notificationApi } from '@/lib/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { NotificationStatus } from '@/components/NotificationStatus';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notificationsData, settingsData] = await Promise.all([
        notificationApi.getAll(),
        notificationApi.getSettings(),
      ]);
      setNotifications(notificationsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    if (!settings) return;
    
    try {
      const updatedSettings = await notificationApi.updateSettings({ [key]: value });
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'duplicate_detected':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'task_reminder':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <Info className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'task_completed':
        return 'border-green-200 bg-green-50';
      case 'duplicate_detected':
        return 'border-yellow-200 bg-yellow-50';
      case 'task_reminder':
        return 'border-blue-200 bg-blue-50';
      case 'system':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'task_reminder':
        return '업무 리마인더';
      case 'duplicate_detected':
        return '중복 감지';
      case 'task_completed':
        return '업무 완료';
      case 'system':
        return '시스템';
      default:
        return type;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">알림</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount}개 읽지 않음
            </Badge>
          )}
          <NotificationStatus />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              모두 읽음 처리
            </Button>
          )}
        </div>
      </div>

      {/* 알림 설정 */}
      {showSettings && settings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">알림 채널</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="email">이메일 알림</Label>
                    </div>
                    <Switch
                      id="email"
                      checked={settings.email}
                      onCheckedChange={(checked) => handleSettingChange('email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="push">푸시 알림</Label>
                    </div>
                    <Switch
                      id="push"
                      checked={settings.push}
                      onCheckedChange={(checked) => handleSettingChange('push', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="inApp">앱 내 알림</Label>
                    </div>
                    <Switch
                      id="inApp"
                      checked={settings.inApp}
                      onCheckedChange={(checked) => handleSettingChange('inApp', checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">알림 유형</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="taskReminders">업무 리마인더</Label>
                    <Switch
                      id="taskReminders"
                      checked={settings.taskReminders}
                      onCheckedChange={(checked) => handleSettingChange('taskReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duplicateDetection">중복 감지</Label>
                    <Switch
                      id="duplicateDetection"
                      checked={settings.duplicateDetection}
                      onCheckedChange={(checked) => handleSettingChange('duplicateDetection', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="systemUpdates">시스템 업데이트</Label>
                    <Switch
                      id="systemUpdates"
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => handleSettingChange('systemUpdates', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 알림 목록 */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">알림이 없습니다</p>
              <p className="text-sm text-muted-foreground">새로운 알림이 오면 여기에 표시됩니다</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification._id} 
              className={`transition-colors ${
                notification.isRead ? 'opacity-75' : ''
              } ${getNotificationColor(notification.type)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                        {notification.metadata?.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            높음
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), 'yyyy년 M월 d일 HH:mm', { locale: ko })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 