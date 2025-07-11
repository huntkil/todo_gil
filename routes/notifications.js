const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const calendarService = require('../services/calendarService');
const User = require('../models/User');
const Notification = require('../models/Notification');

// 사용자 알림 목록 조회
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const userId = req.user.id; // JWT에서 추출

        const filter = { userId };
        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;
        
        const notifications = await Notification.find(filter)
            .populate('taskId', 'title status')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Notification.countDocuments(filter);

        res.json({
            notifications,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 알림 읽음 처리
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: '알림을 찾을 수 없습니다.' });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 모든 알림 읽음 처리
router.patch('/read-all', async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, read: false },
            { read: true }
        );

        res.json({ message: '모든 알림이 읽음 처리되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 알림 설정 조회
router.get('/settings', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.json(user.notificationSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 알림 설정 업데이트
router.put('/settings', async (req, res) => {
    try {
        const { email, slack, push } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        if (email) user.notificationSettings.email = { ...user.notificationSettings.email, ...email };
        if (slack) user.notificationSettings.slack = { ...user.notificationSettings.slack, ...slack };
        if (push) user.notificationSettings.push = { ...user.notificationSettings.push, ...push };

        await user.save();
        res.json(user.notificationSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 알림 통계
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user.id;
        
        const stats = await Notification.aggregate([
            { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Notification.countDocuments({ userId });
        const unread = await Notification.countDocuments({ userId, read: false });

        res.json({
            total,
            unread,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {})
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 