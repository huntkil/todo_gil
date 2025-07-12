import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 데이터베이스 연결
connectDB();

// 스케줄러 서비스 시작 (테스트 환경에서는 비활성화)
if (process.env.NODE_ENV !== 'test') {
  const { default: schedulerService } = await import(
    './services/schedulerService.js'
  );
  schedulerService.start();
}

// 미들웨어
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우터
import tasksRouter from './routes/tasks.js';
import categoriesRouter from './routes/categories.js';
import notificationsRouter from './routes/notifications.js';
import calendarRouter from './routes/calendar.js';

app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/calendar', calendarRouter);

// 기본 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API 상태 확인
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

// 에러 핸들러
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

export default app;
