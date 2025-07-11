const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    type: {
        type: String,
        enum: ['deadline_reminder', 'task_assigned', 'status_changed', 'calendar_sync'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    channels: [{
        type: String,
        enum: ['email', 'slack', 'push', 'calendar'],
        default: ['email']
    }],
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    sentAt: {
        type: Date
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// 인덱스 설정
notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ scheduledAt: 1, status: 'pending' });
notificationSchema.index({ taskId: 1 });

module.exports = mongoose.model('Notification', notificationSchema); 