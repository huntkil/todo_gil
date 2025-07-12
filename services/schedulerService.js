import cron from 'node-cron';
import notificationService from './notificationService.js';
import calendarService from './calendarService.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

class SchedulerService {
  constructor() {
    this.jobs = new Map();
  }

  // 스케줄러 시작
  start() {
    console.log('스케줄러 서비스 시작...');

    // 매분마다 대기 중인 알림 처리
    this.scheduleNotificationProcessing();

    // 매일 오전 9시에 마감 임박 업무 체크
    this.scheduleDeadlineReminders();

    // 매일 오전 8시에 일일 요약 생성
    this.scheduleDailyDigest();

    // 매시간 캘린더 동기화 체크
    this.scheduleCalendarSync();
  }

  // 알림 처리 스케줄링 (매분)
  scheduleNotificationProcessing() {
    const job = cron.schedule('* * * * *', async () => {
      try {
        await notificationService.processPendingNotifications();
      } catch (error) {
        console.error('알림 처리 스케줄러 오류:', error);
      }
    });

    this.jobs.set('notificationProcessing', job);
    console.log('알림 처리 스케줄러 등록됨 (매분)');
  }

  // 마감 임박 알림 스케줄링 (매일 오전 9시)
  scheduleDeadlineReminders() {
    const job = cron.schedule('0 9 * * *', async () => {
      try {
        await this.checkDeadlineReminders();
      } catch (error) {
        console.error('마감 임박 알림 스케줄러 오류:', error);
      }
    });

    this.jobs.set('deadlineReminders', job);
    console.log('마감 임박 알림 스케줄러 등록됨 (매일 오전 9시)');
  }

  // 일일 요약 스케줄링 (매일 오전 8시)
  scheduleDailyDigest() {
    const job = cron.schedule('0 8 * * *', async () => {
      try {
        await this.generateDailyDigest();
      } catch (error) {
        console.error('일일 요약 스케줄러 오류:', error);
      }
    });

    this.jobs.set('dailyDigest', job);
    console.log('일일 요약 스케줄러 등록됨 (매일 오전 8시)');
  }

  // 캘린더 동기화 스케줄링 (매시간)
  scheduleCalendarSync() {
    const job = cron.schedule('0 * * * *', async () => {
      try {
        await this.syncCalendarEvents();
      } catch (error) {
        console.error('캘린더 동기화 스케줄러 오류:', error);
      }
    });

    this.jobs.set('calendarSync', job);
    console.log('캘린더 동기화 스케줄러 등록됨 (매시간)');
  }

  // 마감 임박 업무 체크
  async checkDeadlineReminders() {
    try {
      const users = await User.find({
        'notificationSettings.email.deadlineReminder': true,
      });

      for (const user of users) {
        const reminderDays = user.reminderSettings.deadlineReminderDays;
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + reminderDays);

        // 마감 임박 업무 찾기
        const tasks = await Task.find({
          userId: user._id,
          endDate: {
            $gte: new Date(),
            $lte: reminderDate,
          },
          status: { $nin: ['completed', 'cancelled'] },
        });

        for (const task of tasks) {
          // 이미 알림이 생성되었는지 확인
          const existingNotification = await Notification.findOne({
            userId: user._id,
            taskId: task._id,
            type: 'deadline_reminder',
            status: { $in: ['pending', 'sent'] },
          });

          if (!existingNotification) {
            await notificationService.createDeadlineReminder(
              task._id,
              user._id
            );
          }
        }
      }
    } catch (error) {
      console.error('마감 임박 업무 체크 실패:', error);
    }
  }

  // 일일 요약 생성
  async generateDailyDigest() {
    try {
      const users = await User.find({
        'notificationSettings.email.dailyDigest': true,
      });

      for (const user of users) {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // 오늘의 업무 통계
        const todayTasks = await Task.find({
          userId: user._id,
          startDate: { $gte: startOfDay, $lte: endOfDay },
        });

        const completedTasks = todayTasks.filter(
          (task) => task.status === 'completed'
        );
        const pendingTasks = todayTasks.filter(
          (task) => task.status === 'pending'
        );
        const inProgressTasks = todayTasks.filter(
          (task) => task.status === 'in_progress'
        );

        // 마감 임박 업무
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const overdueTasks = await Task.find({
          userId: user._id,
          endDate: { $lt: today },
          status: { $nin: ['completed', 'cancelled'] },
        });

        const upcomingDeadlines = await Task.find({
          userId: user._id,
          endDate: { $gte: today, $lte: tomorrow },
          status: { $nin: ['completed', 'cancelled'] },
        });

        // 일일 요약 알림 생성
        const title = `일일 업무 요약 - ${today.toLocaleDateString()}`;
        const message = `
                    📊 오늘의 업무 현황:
                    • 완료된 업무: ${completedTasks.length}개
                    • 진행 중인 업무: ${inProgressTasks.length}개
                    • 대기 중인 업무: ${pendingTasks.length}개
                    
                    ⚠️ 마감 임박 업무: ${upcomingDeadlines.length}개
                    ${upcomingDeadlines.length > 0 ? upcomingDeadlines.map((task) => `  - ${task.title}`).join('\n') : ''}
                    
                    🔴 지연된 업무: ${overdueTasks.length}개
                    ${overdueTasks.length > 0 ? overdueTasks.map((task) => `  - ${task.title}`).join('\n') : ''}
                `;

        await notificationService.createNotification(
          user._id,
          null,
          'daily_digest',
          title,
          message,
          ['email'],
          new Date()
        );
      }
    } catch (error) {
      console.error('일일 요약 생성 실패:', error);
    }
  }

  // 캘린더 이벤트 동기화
  async syncCalendarEvents() {
    try {
      const users = await User.find({
        'integrations.googleCalendar.enabled': true,
        'integrations.googleCalendar.syncEnabled': true,
      });

      for (const user of users) {
        try {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 7); // 1주일 후까지

          await calendarService.importTasksFromCalendar(
            user._id,
            startDate,
            endDate
          );
        } catch (error) {
          console.error(`사용자 ${user._id} 캘린더 동기화 실패:`, error);
        }
      }
    } catch (error) {
      console.error('캘린더 동기화 실패:', error);
    }
  }

  // 특정 시간에 알림 스케줄링
  scheduleNotification(notificationId, scheduledTime) {
    const delay = scheduledTime.getTime() - Date.now();

    if (delay <= 0) {
      // 이미 시간이 지났으면 즉시 처리
      notificationService.processNotification({ _id: notificationId });
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const notification = await Notification.findById(notificationId);
        if (notification && notification.status === 'pending') {
          await notificationService.processNotification(notification);
        }
      } catch (error) {
        console.error('스케줄된 알림 처리 실패:', error);
      }
    }, delay);

    this.jobs.set(`notification_${notificationId}`, timeoutId);
  }

  // 스케줄러 중지
  stop() {
    console.log('스케줄러 서비스 중지...');

    // 모든 cron 작업 중지
    for (const [, job] of this.jobs) {
      if (typeof job.stop === 'function') {
        job.stop();
      } else if (typeof job === 'number') {
        clearTimeout(job);
      }
    }

    this.jobs.clear();
    console.log('스케줄러 서비스가 중지되었습니다.');
  }

  // 특정 작업 중지
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      if (typeof job.stop === 'function') {
        job.stop();
      } else if (typeof job === 'number') {
        clearTimeout(job);
      }
      this.jobs.delete(jobName);
      console.log(`작업 "${jobName}"이 중지되었습니다.`);
    }
  }
}

const schedulerService = new SchedulerService();
export default schedulerService;
