# 👨‍💻 개발 가이드

## 🏗️ 코드 구조 이해

### 백엔드 아키텍처

```
todo_gil/
├── 📁 config/           # 설정 파일
│   └── database.js     # MongoDB 연결 설정
├── 📁 models/          # Mongoose 모델 (ES 모듈)
│   ├── Task.js         # 업무 모델
│   ├── Category.js     # 카테고리 모델
│   ├── Notification.js # 알림 모델
│   ├── TaskHistory.js  # 업무 히스토리 모델
│   └── User.js         # 사용자 모델
├── 📁 routes/          # Express 라우터 (ES 모듈)
│   ├── tasks.js        # 업무 API
│   ├── categories.js   # 카테고리 API
│   ├── notifications.js # 알림 API
│   └── calendar.js     # 캘린더 API
├── 📁 services/        # 비즈니스 로직 (ES 모듈)
│   ├── notificationService.js # 알림 서비스
│   ├── calendarService.js     # 캘린더 서비스
│   └── schedulerService.js    # 스케줄러 서비스
├── 📁 utils/           # 유틸리티 함수 (ES 모듈)
│   └── textSimilarity.js # 텍스트 유사도 계산
├── 📁 tests/           # 테스트 파일
│   ├── 📁 integration/ # 통합 테스트
│   ├── 📁 mocks/       # 모킹 파일
│   └── setup.js        # 테스트 설정
├── 📁 frontend/        # Next.js 프론트엔드
│   ├── 📁 components/  # React 컴포넌트
│   ├── 📁 src/app/     # Next.js 13+ App Router
│   └── 📁 types/       # TypeScript 타입 정의
├── server.js           # Express 앱 설정 (ES 모듈)
├── app.js              # 앱 초기화
├── jest.config.js      # Jest 설정
└── eslint.config.mjs   # ESLint 설정
```

### 프론트엔드 구조 (Next.js 13+)

```
frontend/
├── 📁 components/      # React 컴포넌트
│   ├── 📁 ui/         # ShadCN UI 컴포넌트
│   ├── NotificationStatus.tsx
│   ├── RealtimeNotificationProvider.tsx
│   └── RealtimeNotificationStatus.tsx
├── 📁 src/app/        # Next.js App Router
│   ├── 📁 calendar/   # 캘린더 페이지
│   ├── 📁 dashboard/  # 대시보드 페이지
│   ├── 📁 notifications/ # 알림 페이지
│   ├── 📁 tasks/      # 업무 관리 페이지
│   ├── layout.tsx     # 루트 레이아웃
│   └── page.tsx       # 홈페이지
├── 📁 lib/            # 유틸리티 및 설정
│   ├── api.ts         # API 클라이언트
│   ├── calendar.ts    # 캘린더 유틸리티
│   ├── socket.ts      # WebSocket 설정
│   └── utils.ts       # 공통 유틸리티
├── 📁 types/          # TypeScript 타입 정의
│   ├── notification.ts
│   └── task.ts
└── components.json    # ShadCN 설정
```

## 🔧 개발 환경 설정

### 1. ES 모듈 설정
```json
// package.json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "node --experimental-vm-modules node_modules/.bin/jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### 2. ESLint 설정 (ES 모듈)
```javascript
// eslint.config.mjs
export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    env: {
      node: true,
      es2022: true
    },
    rules: {
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    files: ['**/*.test.js', '**/*.test.mjs'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly'
      }
    },
    env: {
      jest: true
    }
  }
];
```

### 3. Jest 설정 (ES 모듈 지원)
```javascript
// jest.config.js
export default {
  preset: 'default',
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'models/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 4. VS Code 확장 프로그램
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-mssql.mssql",
    "ms-vscode.vscode-json"
  ]
}
```

## 📝 코딩 컨벤션

### 1. ES 모듈 import/export
```javascript
// ✅ 올바른 ES 모듈 사용
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { calculateSimilarity } from '../utils/textSimilarity.js';

export const createTask = async (taskData) => {
  // 구현
};

// ❌ CommonJS 사용 금지
const mongoose = require('mongoose');
const Task = require('../models/Task');
module.exports = { createTask };
```

### 2. 파일 명명 규칙
- **파일명**: camelCase (예: `textSimilarity.js`)
- **클래스명**: PascalCase (예: `NotificationService`)
- **함수명**: camelCase (예: `calculateSimilarity`)
- **상수명**: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)
- **테스트 파일**: `.test.js` 확장자 사용

### 3. 코드 스타일
```javascript
// ✅ 좋은 예시
const calculateTaskSimilarity = (task1, task2) => {
  const normalizedTitle1 = normalizeText(task1.title);
  const normalizedTitle2 = normalizeText(task2.title);
  
  return computeSimilarity(normalizedTitle1, normalizedTitle2);
};

// ❌ 나쁜 예시
const calcSim = (t1, t2) => {
  const n1 = norm(t1.title);
  const n2 = norm(t2.title);
  return sim(n1, n2);
};
```

### 4. 주석 작성 규칙
```javascript
/**
 * 텍스트 유사도를 계산합니다.
 * @param {string} text1 - 첫 번째 텍스트
 * @param {string} text2 - 두 번째 텍스트
 * @returns {number} 유사도 점수 (0-1)
 */
function calculateSimilarity(text1, text2) {
  // 텍스트 정규화
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  // Jaccard 유사도 계산
  return computeJaccardSimilarity(normalized1, normalized2);
}
```

## 🔍 주요 모듈 설명

### 1. 중복 감지 시스템

#### 텍스트 정규화
```javascript
// utils/textSimilarity.js
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거
    .replace(/\s+/g, ' ')        // 연속 공백 제거
    .trim();
}
```

#### 유사도 계산
```javascript
export function calculateSimilarity(text1, text2) {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  
  // Jaccard 유사도
  const intersection = tokens1.filter(token => tokens2.includes(token));
  const union = [...new Set([...tokens1, ...tokens2])];
  
  return intersection.length / union.length;
}
```

### 2. 알림 시스템

#### 알림 서비스 구조
```javascript
// services/notificationService.js
export class NotificationService {
  constructor() {
    this.emailTransporter = this.createEmailTransporter();
    this.slackWebhook = process.env.SLACK_WEBHOOK_URL;
  }
  
  async sendNotification(notification) {
    const { channel, title, message } = notification;
    
    switch (channel) {
      case 'email':
        return await this.sendEmail(notification);
      case 'slack':
        return await this.sendSlackNotification(notification);
      case 'push':
        return await this.sendPushNotification(notification);
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }
}
```

#### 스케줄러 서비스
```javascript
// services/schedulerService.js
import cron from 'node-cron';
import { NotificationService } from './notificationService.js';

export class SchedulerService {
  constructor() {
    this.notificationService = new NotificationService();
    this.calendarService = new GoogleCalendarService();
  }
  
  start() {
    // 매일 오전 9시 마감일 알림
    cron.schedule('0 9 * * *', () => {
      this.sendDeadlineReminders();
    });
    
    // 매시간 알림 처리
    cron.schedule('0 * * * *', () => {
      this.processScheduledNotifications();
    });
  }
}
```

### 3. 캘린더 연동

#### Google Calendar 서비스
```javascript
// services/calendarService.js
import { google } from 'googleapis';

export class GoogleCalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }
  
  async syncTaskToCalendar(task) {
    const event = {
      summary: task.title,
      description: task.description,
      start: { dateTime: task.startDate },
      end: { dateTime: task.endDate }
    };
    
    return await this.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
  }
}
```

## 🧪 테스트 작성 가이드

### 1. 단위 테스트
```javascript
// tests/utils/textSimilarity.test.js
import { calculateSimilarity } from '../../utils/textSimilarity.js';

describe('Text Similarity', () => {
  test('동일한 텍스트는 100% 유사도', () => {
    const similarity = calculateSimilarity('회의 준비', '회의 준비');
    expect(similarity).toBe(1.0);
  });
  
  test('유사한 텍스트는 높은 유사도', () => {
    const similarity = calculateSimilarity('회의 준비', '회의 자료 준비');
    expect(similarity).toBeGreaterThan(0.7);
  });
});
```

### 2. 통합 테스트
```javascript
// tests/integration/tasks.test.js
import request from 'supertest';
import { app } from '../../app.js';
import { Task } from '../../models/Task.js';

describe('Task API', () => {
  beforeEach(async () => {
    await Task.deleteMany({});
  });
  
  test('업무 생성 시 중복 감지', async () => {
    // 첫 번째 업무 생성
    await request(app)
      .post('/api/tasks')
      .send(testTask);
    
    // 유사한 업무 생성 시도
    const response = await request(app)
      .post('/api/tasks')
      .send(similarTask);
    
    expect(response.body.duplicates).toBeDefined();
    expect(response.body.duplicates.similarTasks.length).toBeGreaterThan(0);
  });
});
```

### 3. 모킹 전략
```javascript
// tests/mocks/notificationService.js
export class MockNotificationService {
  async sendEmail(to, subject, message) {
    console.log(`[MOCK] 이메일 전송: ${to} - ${subject}`);
    return { success: true };
  }
}

// 테스트에서 사용
import { MockNotificationService } from './mocks/notificationService.js';

jest.mock('../services/notificationService.js', () => {
  return { NotificationService: MockNotificationService };
});
```

## 🔄 데이터베이스 스키마

### Task 모델
```javascript
// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  priority: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  estimatedTime: {
    type: Number,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  history: [{
    action: String,
    timestamp: Date,
    details: String
  }]
}, {
  timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);
```

### Notification 모델
```javascript
// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['deadline_reminder', 'task_assigned', 'status_changed'],
    required: true
  },
  channel: {
    type: String,
    enum: ['email', 'slack', 'push'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledAt: {
    type: Date
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
```

## 🚀 성능 최적화

### 1. 데이터베이스 인덱스
```javascript
// models/Task.js
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ category: 1, status: 1 });
taskSchema.index({ startDate: 1, endDate: 1 });
taskSchema.index({ createdAt: -1 });

// models/Notification.js
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ scheduledAt: 1 });
```

### 2. 캐싱 전략
```javascript
// Redis 캐싱 예시
import redis from 'redis';
const client = redis.createClient();

async function getCachedTasks(userId) {
  const cached = await client.get(`tasks:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const tasks = await Task.find({ userId });
  await client.setex(`tasks:${userId}`, 300, JSON.stringify(tasks));
  return tasks;
}
```

### 3. 비동기 처리
```javascript
// 알림 전송을 비동기로 처리
async function createTask(taskData) {
  const task = await Task.create(taskData);
  
  // 알림 전송을 백그라운드에서 처리
  setImmediate(async () => {
    try {
      await notificationService.sendTaskCreatedNotification(task);
    } catch (error) {
      console.error('알림 전송 실패:', error);
    }
  });
  
  return task;
}
```

## 🔒 보안 고려사항

### 1. 입력 검증
```javascript
// Joi를 사용한 스키마 검증
import Joi from 'joi';

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000),
  category: Joi.string().hex().length(24).required(),
  priority: Joi.number().integer().min(1).max(5),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'on_hold', 'cancelled'),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required()
});
```

### 2. 환경 변수 보안
```javascript
// .env 파일은 절대 Git에 커밋하지 않음
// 프로덕션에서는 별도 관리
import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## 📊 모니터링 및 로깅

### 1. 로깅 설정
```javascript
// winston 로거 설정
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 2. 성능 모니터링
```javascript
// 응답 시간 측정 미들웨어
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});
```

## 🔄 배포 프로세스

### 1. CI/CD 파이프라인
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci --production
      - run: pm2 restart todo-gil
```

### 2. 환경별 설정
```javascript
// config/environment.js
const config = {
  development: {
    mongodb: 'mongodb://localhost:27017/todo_gil_dev',
    logLevel: 'debug',
    cors: { origin: 'http://localhost:3000' }
  },
  production: {
    mongodb: process.env.MONGODB_URI,
    logLevel: 'info',
    cors: { origin: process.env.ALLOWED_ORIGINS }
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

## 🚀 최근 업데이트 사항

### ES 모듈 변환 완료
- 모든 백엔드 파일을 CommonJS에서 ES 모듈로 변환
- `require()` → `import` 구문 변경
- `module.exports` → `export` 구문 변경
- Jest 설정 업데이트로 ES 모듈 테스트 지원

### 코드 품질 개선
- ESLint 설정 최적화
- Prettier 포맷팅 적용
- 사용하지 않는 변수 제거
- 테스트 파일 확장자 통일 (`.test.js`)

### 프론트엔드 현대화
- Next.js 13+ App Router 구조
- TypeScript 지원
- ShadCN UI 컴포넌트 시스템
- 실시간 알림 시스템 구현

### 테스트 커버리지 향상
- 34개 테스트 통과
- 통합 테스트 및 단위 테스트 완비
- 모킹 전략 개선 