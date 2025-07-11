// 테스트 환경 설정
process.env.NODE_ENV = 'test';

// MongoDB 연결을 위한 환경 변수 설정
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_gil_test_' + Date.now();

// JWT 시크릿 키 설정
process.env.JWT_SECRET = 'test-secret-key';

// 글로벌 테스트 타임아웃 설정
jest.setTimeout(10000); 