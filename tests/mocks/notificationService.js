// 알림 서비스 모킹
class MockNotificationService {
    constructor() {
        this.notifications = [];
    }

    async sendEmail(to, subject, message) {
        console.log(`[MOCK] 이메일 전송: ${to} - ${subject}`);
        return { success: true };
    }

    async sendSlackNotification(channel, message) {
        console.log(`[MOCK] Slack 알림: ${channel} - ${message}`);
        return { success: true };
    }

    async sendPushNotification(userId, title, message) {
        console.log(`[MOCK] 푸시 알림: ${userId} - ${title}`);
        return { success: true };
    }

    async createNotification(data) {
        const notification = {
            _id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date(),
            read: false
        };
        this.notifications.push(notification);
        return notification;
    }

    async getNotifications(userId, options = {}) {
        return {
            notifications: this.notifications,
            pagination: {
                page: 1,
                limit: 10,
                total: this.notifications.length
            }
        };
    }

    async markAsRead(notificationId) {
        const notification = this.notifications.find(n => n._id === notificationId);
        if (notification) {
            notification.read = true;
        }
        return notification;
    }

    async deleteNotification(notificationId) {
        const index = this.notifications.findIndex(n => n._id === notificationId);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
        return { success: true };
    }
}

module.exports = MockNotificationService; 