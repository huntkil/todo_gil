const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');
const User = require('../models/User');

// Google Calendar 인증 URL 생성
router.get('/auth/google', (req, res) => {
    try {
        const authUrl = calendarService.generateAuthUrl();
        res.json({ authUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Google Calendar 인증 콜백
router.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const userId = req.user.id;

        if (!code) {
            return res.status(400).json({ message: '인증 코드가 필요합니다.' });
        }

        const tokens = await calendarService.exchangeCodeForTokens(code);
        
        // 사용자 정보 업데이트
        await User.findByIdAndUpdate(userId, {
            'integrations.googleCalendar.enabled': true,
            'integrations.googleCalendar.accessToken': tokens.access_token,
            'integrations.googleCalendar.refreshToken': tokens.refresh_token
        });

        res.json({ message: 'Google Calendar 연동이 완료되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 캘린더 연동 해제
router.delete('/auth/google', async (req, res) => {
    try {
        const userId = req.user.id;
        
        await User.findByIdAndUpdate(userId, {
            'integrations.googleCalendar.enabled': false,
            'integrations.googleCalendar.accessToken': null,
            'integrations.googleCalendar.refreshToken': null
        });

        res.json({ message: 'Google Calendar 연동이 해제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 사용자 캘린더 목록 조회
router.get('/calendars', async (req, res) => {
    try {
        const userId = req.user.id;
        const calendars = await calendarService.getUserCalendars(userId);
        res.json(calendars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 캘린더 동기화 설정 업데이트
router.put('/sync-settings', async (req, res) => {
    try {
        const { calendarId, syncEnabled } = req.body;
        const userId = req.user.id;

        const updateData = {};
        if (calendarId !== undefined) {
            updateData['integrations.googleCalendar.calendarId'] = calendarId;
        }
        if (syncEnabled !== undefined) {
            updateData['integrations.googleCalendar.syncEnabled'] = syncEnabled;
        }

        await User.findByIdAndUpdate(userId, updateData);
        res.json({ message: '캘린더 동기화 설정이 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 업무를 캘린더에 동기화
router.post('/sync-task/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const result = await calendarService.syncTaskToCalendar(taskId, userId);
        res.json({ message: '업무가 캘린더에 동기화되었습니다.', event: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 캘린더에서 업무 가져오기
router.post('/import', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const userId = req.user.id;

        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date();
        end.setDate(end.getDate() + 7); // 기본값: 1주일

        const importedTasks = await calendarService.importTasksFromCalendar(userId, start, end);
        res.json({ 
            message: `${importedTasks.length}개의 업무가 가져와졌습니다.`,
            tasks: importedTasks 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 캘린더에서 업무 삭제
router.delete('/sync-task/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        await calendarService.deleteTaskFromCalendar(taskId, userId);
        res.json({ message: '업무가 캘린더에서 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 캘린더 연동 상태 조회
router.get('/status', async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.json({
            googleCalendar: {
                enabled: user.integrations.googleCalendar.enabled,
                syncEnabled: user.integrations.googleCalendar.syncEnabled,
                calendarId: user.integrations.googleCalendar.calendarId
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 