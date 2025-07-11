import nodemailer from 'nodemailer';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { sendNotificationToAllClients } from '../server.js';

class NotificationService {
  constructor() {
    this.emailTransporter = this.createEmailTransporter();
  }

  // 이메일 전송기 생성
  createEmailTransporter() {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // 알림 생성
  async createNotification(
    userId,
    taskId,
    type,
    title,
    message,
    channels = ['email'],
    scheduledAt = null
  ) {
    try {
      const notification = new Notification({
        userId,
        taskId,
        type,
        title,
        message,
        channels,
        scheduledAt: scheduledAt || new Date(),
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('알림 생성 실패:', error);
      throw error;
    }
  }

  async createAndSendNotification(notificationData) {
    // 알림 생성
    const notification = new Notification(notificationData);
    await notification.save();

    // 실시간 알림 전송 (WebSocket)
    sendNotificationToAllClients({
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      category: notification.category || 'task',
      isRead: false,
      createdAt: notification.createdAt,
      relatedTaskId: notification.taskId,
      priority: notification.priority || 'medium',
    });

    // 기존 채널(이메일, 푸시 등)도 필요시 전송
    // ...

    return notification;
  }

  // 마감 임박 알림 생성
  async createDeadlineReminder(taskId, userId) {
    const task = await Task.findById(taskId).populate('category');
    const user = await User.findById(userId);

    if (!task || !user) return;

    const reminderDays = user.reminderSettings.deadlineReminderDays;
    const reminderDate = new Date(task.endDate);
    reminderDate.setDate(reminderDate.getDate() - reminderDays);

    const title = `마감 임박 알림: ${task.title}`;
    const message = `${task.title} 업무가 ${reminderDays}일 후 마감됩니다. (마감일: ${task.endDate.toLocaleDateString()})`;

    await this.createNotification(
      userId,
      taskId,
      'deadline_reminder',
      title,
      message,
      this.getUserNotificationChannels(user, 'deadlineReminder'),
      reminderDate
    );
  }

  // 업무 배정 알림 생성
  async createTaskAssignedNotification(taskId, userId) {
    const task = await Task.findById(taskId).populate('category');
    const user = await User.findById(userId);

    if (!task || !user) return;

    const title = `새 업무 배정: ${task.title}`;
    const message = `새로운 업무가 배정되었습니다: ${task.title}`;

    await this.createNotification(
      userId,
      taskId,
      'task_assigned',
      title,
      message,
      this.getUserNotificationChannels(user, 'taskAssigned'),
      new Date()
    );
  }

  // 상태 변경 알림 생성
  async createStatusChangedNotification(taskId, userId, oldStatus, newStatus) {
    const task = await Task.findById(taskId).populate('category');
    const user = await User.findById(userId);

    if (!task || !user) return;

    const title = `업무 상태 변경: ${task.title}`;
    const message = `${task.title} 업무의 상태가 ${oldStatus}에서 ${newStatus}로 변경되었습니다.`;

    await this.createNotification(
      userId,
      taskId,
      'status_changed',
      title,
      message,
      this.getUserNotificationChannels(user, 'statusChanged'),
      new Date()
    );
  }

  // 사용자 알림 채널 가져오기
  getUserNotificationChannels(user, notificationType) {
    const channels = [];

    if (
      user.notificationSettings.email.enabled &&
      user.notificationSettings.email[notificationType]
    ) {
      channels.push('email');
    }

    if (
      user.notificationSettings.slack.enabled &&
      user.notificationSettings.slack[notificationType]
    ) {
      channels.push('slack');
    }

    if (
      user.notificationSettings.push.enabled &&
      user.notificationSettings.push[notificationType]
    ) {
      channels.push('push');
    }

    return channels;
  }

  // 이메일 알림 전송
  async sendEmailNotification(notification) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: notification.userEmail,
        subject: notification.title,
        html: `
                    <h2>${notification.title}</h2>
                    <p>${notification.message}</p>
                    <p>시간: ${notification.scheduledAt.toLocaleString()}</p>
                    <hr>
                    <p><small>이 알림은 Todo Gil 시스템에서 자동으로 발송되었습니다.</small></p>
                `,
      };

      await this.emailTransporter.sendMail(mailOptions);

      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();

      console.log(`이메일 알림 전송 완료: ${notification.userEmail}`);
    } catch (error) {
      console.error('이메일 알림 전송 실패:', error);
      notification.status = 'failed';
      await notification.save();
    }
  }

  // 슬랙 알림 전송
  async sendSlackNotification(notification) {
    try {
      // 실제 구현에서는 Webhook URL 등에서 사용자 정보를 가져와야 함
      // ...
      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();
    } catch (error) {
      console.error('Slack 알림 전송 실패:', error);
      notification.status = 'failed';
      await notification.save();
    }
  }

  // 푸시 알림 전송 (웹 푸시)
  async sendPushNotification(notification) {
    try {
      // 웹 푸시 알림 구현 (Service Worker와 연동)
      // 실제 구현에서는 Web Push API 사용
      console.log(`푸시 알림 전송: ${notification.title}`);

      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();
    } catch (error) {
      console.error('푸시 알림 전송 실패:', error);
      notification.status = 'failed';
      await notification.save();
    }
  }

  // 알림 전송 처리
  async processNotification(notification) {
    try {
      const user = await User.findById(notification.userId);
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      for (const channel of notification.channels) {
        switch (channel) {
          case 'email':
            await this.sendEmailNotification(notification);
            break;
          case 'slack':
            await this.sendSlackNotification(notification);
            break;
          case 'push':
            await this.sendPushNotification(notification);
            break;
        }
      }
    } catch (error) {
      console.error('알림 처리 실패:', error);
      notification.status = 'failed';
      await notification.save();
    }
  }

  // 대기 중인 알림 처리
  async processPendingNotifications() {
    try {
      const pendingNotifications = await Notification.find({
        status: 'pending',
        scheduledAt: { $lte: new Date() },
      }).populate('userId');

      for (const notification of pendingNotifications) {
        await this.processNotification(notification);
      }
    } catch (error) {
      console.error('대기 중인 알림 처리 실패:', error);
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
