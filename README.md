# 📋 업무 관리 도구 (Todo Gil)

Node.js 기반의 개인 업무 관리 도구입니다. 자연어 입력, 실시간 중복 감지, 알림 시스템, 캘린더 연동 등의 고급 기능을 제공합니다.

## 🚀 주요 기능

- 🤖 **자연어 업무 입력**: "내일 오후 3시에 회의 준비" 같은 자연스러운 입력
- 🔍 **실시간 중복 감지**: 유사한 업무 자동 감지 및 알림
- 📅 **캘린더 연동**: Google Calendar와 양방향 동기화
- 🔔 **알림 시스템**: 이메일, Slack, 푸시 알림 지원
- 📊 **대시보드**: 업무 현황 및 통계 시각화
- 📈 **간트 차트**: 프로젝트 일정 관리
- 🏷️ **카테고리 관리**: 체계적인 업무 분류
- 🔍 **검색 및 필터링**: 효율적인 업무 검색
- ⏰ **스케줄러**: 자동 마감일 리마인더 및 일일 요약

## 🛠️ 기술 스택

### 백엔드
- **Node.js** + **Express.js**
- **MongoDB** (Mongoose ODM)
- **JWT Authentication**
- **Nodemailer** (이메일 알림)
- **Slack Webhook** (Slack 알림)
- **Google Calendar API** (캘린더 연동)
- **node-cron** (스케줄러)
- **Jest** (테스트)

### 프론트엔드
- **HTML5** + **CSS3** + **JavaScript**
- **Bootstrap 5** (UI 프레임워크)
- **Chart.js** (차트 시각화)
- **Font Awesome** (아이콘)
- **Vanilla JS** (상태 관리)

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 16.0.0 이상
- MongoDB 4.4.0 이상

### 설치 과정
```bash
# 저장소 클론
git clone https://github.com/huntkil/todo_gil.git
cd todo_gil

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 설정을 입력

# MongoDB 시작
brew services start mongodb-community

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정
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

## 🎯 사용 방법

### 기본 기능
1. **업무 추가**: "새 업무 추가" 버튼을 클릭하여 업무 정보 입력
2. **중복 감지**: 유사한 업무가 있으면 자동으로 감지하여 알림
3. **대시보드**: 전체 업무 현황 및 통계 확인
4. **간트 차트**: 프로젝트 일정을 시각적으로 관리
5. **검색/필터**: 카테고리, 상태, 우선순위별 필터링

### 알림 시스템
1. **알림 설정**: 헤더의 "알림" 버튼 클릭
2. **채널 설정**: 이메일, Slack, 푸시 알림 각각 설정
3. **알림 확인**: 벨 아이콘 클릭하여 알림 목록 확인
4. **실시간 알림**: 30초마다 새 알림 자동 체크

### 캘린더 연동
1. **Google Calendar 연결**: 헤더의 "캘린더" 버튼 클릭
2. **OAuth2 인증**: Google 계정으로 인증
3. **동기화 설정**: 자동 동기화 활성화
4. **업무 동기화**: 생성/수정/삭제 시 자동 반영

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# 특정 테스트 파일 실행
npm test -- tests/utils/textSimilarity.test.js
```

## 📚 API 문서

### 업무 관리
- `GET /api/tasks` - 업무 목록 조회
- `POST /api/tasks` - 새 업무 생성
- `GET /api/tasks/:id` - 특정 업무 조회
- `PUT /api/tasks/:id` - 업무 수정
- `DELETE /api/tasks/:id` - 업무 삭제
- `PATCH /api/tasks/:id/progress` - 진행률 업데이트
- `POST /api/tasks/check-duplicates` - 중복 감지

### 카테고리 관리
- `GET /api/categories` - 카테고리 목록 조회
- `POST /api/categories` - 새 카테고리 생성
- `PUT /api/categories/:id` - 카테고리 수정
- `DELETE /api/categories/:id` - 카테고리 삭제

### 알림 시스템
- `GET /api/notifications` - 알림 목록 조회
- `POST /api/notifications` - 알림 생성
- `PATCH /api/notifications/:id/read` - 알림 읽음 처리
- `PUT /api/notifications/settings` - 알림 설정 업데이트

### 캘린더 연동
- `GET /api/calendar/status` - 캘린더 상태 조회
- `GET /api/calendar/auth/google` - Google Calendar 인증
- `GET /api/calendar/calendars` - 캘린더 목록 조회
- `POST /api/calendar/sync-task/:taskId` - 업무 동기화

### 통계
- `GET /api/tasks/stats` - 업무 통계 조회

## 📖 개발 문서

자세한 개발 가이드는 `docs/` 폴더를 참조하세요:

- [📋 프로젝트 개요](docs/PROJECT_OVERVIEW.md)
- [🚀 설치 및 실행 가이드](docs/SETUP_GUIDE.md)
- [📚 API 문서](docs/API_DOCUMENTATION.md)
- [👨‍💻 개발 가이드](docs/DEVELOPMENT_GUIDE.md)

## 🔧 개발

### 코드 품질
```bash
# ESLint 검사
npm run lint

# 코드 포맷팅
npm run format
```

### 데이터베이스 초기화
```bash
# 기본 카테고리 생성
npm run init-db
```

## 📈 프로젝트 상태

### ✅ 완료된 기능
- [x] 기본 업무 CRUD
- [x] 카테고리 관리
- [x] 중복 감지 시스템
- [x] 대시보드 및 통계
- [x] 간트 차트 뷰
- [x] 검색 및 필터링
- [x] 알림 시스템 (이메일, Slack, 푸시)
- [x] Google Calendar 연동
- [x] 스케줄러 서비스
- [x] 프론트엔드 UI
- [x] 테스트 커버리지 (34개 테스트 통과)

### 🚧 진행 중인 기능
- [ ] 실시간 알림 (WebSocket)
- [ ] 브라우저 푸시 알림
- [ ] Outlook Calendar 연동

### 📋 향후 계획
- [ ] 다중 사용자 지원
- [ ] 모바일 앱 (React Native)
- [ ] AI 기반 업무 추천
- [ ] 고급 보고서 기능
- [ ] 외부 서비스 연동 (Trello, Asana)

## 🎯 성과 지표

- **테스트 커버리지**: 34개 테스트 통과
- **API 엔드포인트**: 20+ 개
- **지원 언어**: 한국어 최적화
- **반응형 디자인**: 모바일/데스크톱 지원
- **실시간 기능**: 알림, 동기화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/huntkil/todo_gil](https://github.com/huntkil/todo_gil) 