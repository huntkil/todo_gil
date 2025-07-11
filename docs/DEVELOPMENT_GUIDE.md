# 👨‍💻 개발 가이드

## 🏗️ 코드 구조 이해

### 백엔드 아키텍처

```
src/
├── 📁 config/           # 설정 파일
│   ├── database.js     # MongoDB 연결 설정
│   └── environment.js  # 환경 변수 관리
├── 📁 models/          # Mongoose 모델
│   ├── Task.js         # 업무 모델
│   ├── Category.js     # 카테고리 모델
│   ├── Notification.js # 알림 모델
│   └── User.js         # 사용자 모델
├── 📁 routes/          # Express 라우터
│   ├── tasks.js        # 업무 API
│   ├── categories.js   # 카테고리 API
│   ├── notifications.js # 알림 API
│   └── calendar.js     # 캘린더 API
├── 📁 services/        # 비즈니스 로직
│   ├── notificationService.js # 알림 서비스
│   ├── calendarService.js     # 캘린더 서비스
│   └── schedulerService.js    # 스케줄러 서비스
├── 📁 utils/           # 유틸리티 함수
│   ├── textSimilarity.js # 텍스트 유사도 계산
│   └── dateUtils.js     # 날짜 처리
└── app.js              # Express 앱 설정
```

### 프론트엔드 구조

```
public/
├── 📁 css/             # 스타일시트
│   ├── style.css       # 메인 스타일
│   └── notifications.css # 알림 UI 스타일
├── 📁 js/              # JavaScript
│   ├── app.js          # 메인 애플리케이션
│   ├── notifications.js # 알림 관리
│   └── calendar.js     # 캘린더 연동
└── index.html          # 메인 HTML
```

## 🔧 개발 환경 설정

### 1. VS Code 확장 프로그램
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-mssql.mssql"
  ]
}
```

### 2. ESLint 설정
```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  },
  globals: {
    bootstrap: 'readonly'
  }
};
```

### 3. Git Hooks 설정
```bash
# pre-commit hook
npm install --save-dev husky lint-staged

# package.json에 추가
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "git add"]
  }
}
```

## 📝 코딩 컨벤션

### 1. 파일 명명 규칙
- **파일명**: camelCase (예: `textSimilarity.js`)
- **클래스명**: PascalCase (예: `NotificationService`)
- **함수명**: camelCase (예: `calculateSimilarity`)
- **상수명**: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)

### 2. 코드 스타일
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

### 3. 주석 작성 규칙
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
function calculateSimilarity(text1, text2) {
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
class NotificationService {
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
class SchedulerService {
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
class GoogleCalendarService {
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
describe('Task API', () => {
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
class MockNotificationService {
  async sendEmail(to, subject, message) {
    console.log(`[MOCK] 이메일 전송: ${to} - ${subject}`);
    return { success: true };
  }
}

// 테스트에서 사용
jest.mock('../services/notificationService', () => {
  return require('./mocks/notificationService');
});
```

## 🔄 데이터베이스 스키마

### Task 모델
```javascript
// models/Task.js
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
```

### Notification 모델
```javascript
// models/Notification.js
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
const redis = require('redis');
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
const Joi = require('joi');

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

### 2. SQL 인젝션 방지
```javascript
// Mongoose는 자동으로 SQL 인젝션을 방지
// 하지만 사용자 입력은 항상 검증해야 함
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};
```

### 3. 환경 변수 보안
```javascript
// .env 파일은 절대 Git에 커밋하지 않음
// 프로덕션에서는 별도 관리
require('dotenv').config();

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
const winston = require('winston');

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

module.exports = config[process.env.NODE_ENV || 'development'];
``` 