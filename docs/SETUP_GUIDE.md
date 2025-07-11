# 🚀 설치 및 실행 가이드

## 📋 사전 요구사항

### 필수 소프트웨어
- **Node.js** 16.0.0 이상
- **MongoDB** 4.4.0 이상
- **Git** 2.0.0 이상

### 권장 개발 도구
- **VS Code** (확장 프로그램: ESLint, Prettier)
- **MongoDB Compass** (데이터베이스 관리)
- **Postman** (API 테스트)

## 🔧 설치 과정

### 1. 저장소 클론
```bash
git clone https://github.com/huntkil/todo_gil.git
cd todo_gil
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
# .env 파일 생성
cp env.example .env
```

`.env` 파일을 편집하여 필요한 설정을 입력:
```env
# 서버 설정
PORT=3000
NODE_ENV=development

# 데이터베이스
MONGODB_URI=mongodb://localhost:27017/todo_gil

# JWT 인증
JWT_SECRET=your-super-secret-jwt-key

# 이메일 알림 (선택사항)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Slack 알림 (선택사항)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Google Calendar 연동 (선택사항)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/auth/google/callback
```

### 4. MongoDB 설정
```bash
# MongoDB 서비스 시작 (macOS)
brew services start mongodb-community

# 또는 MongoDB 수동 시작
mongod --dbpath /usr/local/var/mongodb
```

### 5. 데이터베이스 초기화
```bash
# 기본 카테고리 생성
npm run init-db
```

## 🚀 실행 방법

### 개발 모드 실행
```bash
npm run dev
```
- 서버: http://localhost:3000
- 자동 재시작 (nodemon)

### 프로덕션 모드 실행
```bash
npm start
```

### 테스트 실행
```bash
# 전체 테스트
npm test

# 테스트 커버리지
npm run test:coverage

# 특정 테스트 파일
npm test -- tests/utils/textSimilarity.test.js
```

### 린팅 및 포맷팅
```bash
# ESLint 검사
npm run lint

# 코드 포맷팅
npm run format
```

## 🔍 기능 테스트

### 1. 기본 기능 테스트
1. 브라우저에서 http://localhost:3000 접속
2. "새 업무 추가" 버튼 클릭
3. 업무 정보 입력 및 저장
4. 대시보드에서 업무 확인

### 2. 중복 감지 테스트
1. 유사한 제목의 업무 생성
2. 중복 감지 모달 확인
3. 새 업무로 등록 또는 기존 업무 수정 선택

### 3. 알림 시스템 테스트
1. 헤더의 "알림" 버튼 클릭
2. 알림 설정 모달에서 이메일 설정
3. 테스트 알림 전송

### 4. 캘린더 연동 테스트
1. 헤더의 "캘린더" 버튼 클릭
2. Google Calendar 연결
3. 업무 생성 후 캘린더 동기화 확인

## 🐛 문제 해결

### 일반적인 문제들

#### 1. MongoDB 연결 실패
```bash
# MongoDB 상태 확인
brew services list | grep mongodb

# MongoDB 재시작
brew services restart mongodb-community
```

#### 2. 포트 충돌
```bash
# 포트 사용 확인
lsof -i :3000

# 다른 포트 사용
PORT=3001 npm run dev
```

#### 3. 의존성 문제
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 4. 환경 변수 문제
```bash
# .env 파일 확인
cat .env

# 환경 변수 로드 확인
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

### 로그 확인
```bash
# 애플리케이션 로그
tail -f logs/app.log

# 에러 로그
tail -f logs/error.log
```

## 📱 개발 도구 설정

### VS Code 설정
`.vscode/settings.json` 파일 생성:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"],
  "files.exclude": {
    "**/node_modules": true,
    "**/coverage": true
  }
}
```

### Git Hooks 설정
```bash
# pre-commit hook 설치
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

## 🔒 보안 설정

### 프로덕션 환경
1. **환경 변수 보안**
   - `.env` 파일을 `.gitignore`에 추가
   - 프로덕션 환경에서 별도 설정

2. **HTTPS 설정**
   - SSL 인증서 설정
   - 리버스 프록시 (Nginx) 설정

3. **데이터베이스 보안**
   - MongoDB 인증 설정
   - 방화벽 설정

## 📊 모니터링

### 로그 모니터링
```bash
# 실시간 로그 확인
tail -f logs/app.log | grep ERROR

# 로그 분석
grep "ERROR" logs/app.log | wc -l
```

### 성능 모니터링
```bash
# 메모리 사용량 확인
ps aux | grep node

# CPU 사용량 확인
top -p $(pgrep node)
```

## 🚀 배포 가이드

### PM2를 사용한 배포
```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start app.js --name "todo-gil"

# 상태 확인
pm2 status

# 로그 확인
pm2 logs todo-gil
```

### Docker를 사용한 배포
```dockerfile
# Dockerfile 생성
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Docker 이미지 빌드
docker build -t todo-gil .

# 컨테이너 실행
docker run -p 3000:3000 --env-file .env todo-gil
``` 