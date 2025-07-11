const { google } = require('googleapis');
const User = require('../models/User');
const Task = require('../models/Task');

class CalendarService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    // Google Calendar 인증 URL 생성
    generateAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
    }

    // 인증 코드로 토큰 교환
    async exchangeCodeForTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            return tokens;
        } catch (error) {
            console.error('토큰 교환 실패:', error);
            throw error;
        }
    }

    // 사용자 캘린더 클라이언트 설정
    async setupUserCalendarClient(userId) {
        const user = await User.findById(userId);
        if (!user || !user.integrations.googleCalendar.enabled) {
            throw new Error('Google Calendar 연동이 활성화되지 않았습니다.');
        }

        this.oauth2Client.setCredentials({
            access_token: user.integrations.googleCalendar.accessToken,
            refresh_token: user.integrations.googleCalendar.refreshToken
        });

        return google.calendar({ version: 'v3', auth: this.oauth2Client });
    }

    // 업무를 캘린더 이벤트로 변환
    taskToCalendarEvent(task) {
        const event = {
            summary: task.title,
            description: task.description || '',
            start: {
                dateTime: task.startDate.toISOString(),
                timeZone: 'Asia/Seoul'
            },
            end: {
                dateTime: task.endDate.toISOString(),
                timeZone: 'Asia/Seoul'
            },
            colorId: this.getColorIdByPriority(task.priority),
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 1일 전
                    { method: 'popup', minutes: 60 } // 1시간 전
                ]
            },
            extendedProperties: {
                private: {
                    taskId: task._id.toString(),
                    category: task.category ? task.category.toString() : '',
                    priority: task.priority.toString(),
                    status: task.status
                }
            }
        };

        return event;
    }

    // 우선순위에 따른 색상 ID 매핑
    getColorIdByPriority(priority) {
        const colorMap = {
            1: '11', // 빨간색 (매우 높음)
            2: '6',  // 주황색 (높음)
            3: '5',  // 노란색 (보통)
            4: '2',  // 초록색 (낮음)
            5: '1'   // 회색 (매우 낮음)
        };
        return colorMap[priority] || '5';
    }

    // 업무를 Google Calendar에 동기화
    async syncTaskToCalendar(taskId, userId) {
        try {
            const task = await Task.findById(taskId).populate('category');
            const user = await User.findById(userId);
            
            if (!task || !user || !user.integrations.googleCalendar.enabled) {
                return null;
            }

            const calendar = await this.setupUserCalendarClient(userId);
            const event = this.taskToCalendarEvent(task);

            // 기존 이벤트가 있는지 확인
            const existingEvent = await this.findExistingEvent(calendar, task._id.toString(), user.integrations.googleCalendar.calendarId);

            let result;
            if (existingEvent) {
                // 기존 이벤트 업데이트
                result = await calendar.events.update({
                    calendarId: user.integrations.googleCalendar.calendarId,
                    eventId: existingEvent.id,
                    resource: event
                });
            } else {
                // 새 이벤트 생성
                result = await calendar.events.insert({
                    calendarId: user.integrations.googleCalendar.calendarId,
                    resource: event
                });
            }

            // Task에 캘린더 이벤트 ID 저장
            task.calendarEventId = result.data.id;
            await task.save();

            return result.data;
        } catch (error) {
            console.error('캘린더 동기화 실패:', error);
            throw error;
        }
    }

    // 기존 캘린더 이벤트 찾기
    async findExistingEvent(calendar, taskId, calendarId) {
        try {
            const response = await calendar.events.list({
                calendarId: calendarId,
                privateExtendedProperty: `taskId=${taskId}`,
                maxResults: 1
            });

            return response.data.items[0] || null;
        } catch (error) {
            console.error('기존 이벤트 검색 실패:', error);
            return null;
        }
    }

    // 캘린더에서 업무 삭제
    async deleteTaskFromCalendar(taskId, userId) {
        try {
            const task = await Task.findById(taskId);
            const user = await User.findById(userId);
            
            if (!task || !user || !user.integrations.googleCalendar.enabled || !task.calendarEventId) {
                return;
            }

            const calendar = await this.setupUserCalendarClient(userId);
            
            await calendar.events.delete({
                calendarId: user.integrations.googleCalendar.calendarId,
                eventId: task.calendarEventId
            });

            // Task에서 캘린더 이벤트 ID 제거
            task.calendarEventId = undefined;
            await task.save();
        } catch (error) {
            console.error('캘린더에서 업무 삭제 실패:', error);
        }
    }

    // 캘린더 이벤트를 업무로 변환
    calendarEventToTask(event, userId) {
        const task = {
            title: event.summary,
            description: event.description || '',
            startDate: new Date(event.start.dateTime || event.start.date),
            endDate: new Date(event.end.dateTime || event.end.date),
            priority: 3, // 기본값
            status: 'pending',
            userId: userId
        };

        // 확장 속성에서 추가 정보 가져오기
        if (event.extendedProperties && event.extendedProperties.private) {
            const props = event.extendedProperties.private;
            if (props.priority) task.priority = parseInt(props.priority);
            if (props.status) task.status = props.status;
            if (props.category) task.category = props.category;
        }

        return task;
    }

    // 캘린더에서 업무 가져오기 (양방향 동기화)
    async importTasksFromCalendar(userId, startDate, endDate) {
        try {
            const user = await User.findById(userId);
            if (!user || !user.integrations.googleCalendar.enabled) {
                throw new Error('Google Calendar 연동이 활성화되지 않았습니다.');
            }

            const calendar = await this.setupUserCalendarClient(userId);
            
            const response = await calendar.events.list({
                calendarId: user.integrations.googleCalendar.calendarId,
                timeMin: startDate.toISOString(),
                timeMax: endDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            const importedTasks = [];
            for (const event of response.data.items) {
                // 이미 동기화된 업무는 건너뛰기
                if (event.extendedProperties && event.extendedProperties.private && event.extendedProperties.private.taskId) {
                    continue;
                }

                const taskData = this.calendarEventToTask(event, userId);
                const task = new Task(taskData);
                task.calendarEventId = event.id;
                await task.save();
                
                importedTasks.push(task);
            }

            return importedTasks;
        } catch (error) {
            console.error('캘린더에서 업무 가져오기 실패:', error);
            throw error;
        }
    }

    // 사용자 캘린더 목록 가져오기
    async getUserCalendars(userId) {
        try {
            const calendar = await this.setupUserCalendarClient(userId);
            const response = await calendar.calendarList.list();
            return response.data.items;
        } catch (error) {
            console.error('캘린더 목록 가져오기 실패:', error);
            throw error;
        }
    }
}

module.exports = new CalendarService(); 