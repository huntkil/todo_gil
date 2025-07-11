// 테스트 환경 설정
process.env.NODE_ENV = 'test';

// MongoDB 연결을 위한 환경 변수 설정
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_gil_test_' + Date.now();

// JWT 시크릿 키 설정
process.env.JWT_SECRET = 'test-secret-key';

// 알림 서비스 관련 환경 변수 설정 (테스트용)
process.env.EMAIL_SERVICE = 'gmail';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';
process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/test';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

// 알림 서비스 모킹
jest.mock('../services/notificationService', () => {
    return require('./mocks/notificationService');
});

// 캘린더 서비스 모킹
jest.mock('../services/calendarService', () => {
    return {
        GoogleCalendarService: jest.fn().mockImplementation(() => ({
            authenticate: jest.fn().mockResolvedValue(true),
            getCalendars: jest.fn().mockResolvedValue([]),
            createEvent: jest.fn().mockResolvedValue({ id: 'test-event-id' }),
            updateEvent: jest.fn().mockResolvedValue(true),
            deleteEvent: jest.fn().mockResolvedValue(true)
        }))
    };
});

// 스케줄러 서비스 모킹
jest.mock('../services/schedulerService', () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        stop: jest.fn()
    }));
});

// 글로벌 테스트 타임아웃 설정
jest.setTimeout(10000); 