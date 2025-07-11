# 업무 관리 도구 (Work Manager)

Node.js 기반의 개인 업무 관리 도구입니다. 일일 업무를 효율적으로 관리하고 시각화할 수 있는 기능을 제공합니다.

## 🚀 최신 개발 현황 (2024-07)

- **기본 구조 및 핵심 기능 구현 완료**
- **중복 감지, 자연어 입력, 간트 차트, 대시보드, 카테고리 관리, 검색/필터링, 진행률 관리** 등 주요 기능 탑재
- **ESLint 적용 및 코드 품질 관리**
- **MongoDB 최신 드라이버 호환**
- **모든 lint 오류/경고 해결**
- **최초 커밋 및 GitHub 원격 저장소 연동 완료**

## 📝 주요 구현 사항

- 업무 CRUD 및 중복 감지(한국어 특화)
- 자연어 날짜 파싱, 자동 카테고리 추천
- 간트 차트/대시보드/카테고리별 통계
- 실시간 검색, 필터, 자동완성 제안
- 반응형 UI, Bootstrap 5, Chart.js
- ESLint 기반 코드 품질 관리

## 🛠 기술 스택
- Node.js, Express.js, MongoDB, Mongoose
- HTML5, CSS3, JavaScript(ES6+), Bootstrap 5
- Chart.js, string-similarity, natural, hangul-js, Joi
- ESLint, dotenv, morgan, helmet 등

## 📦 설치 및 실행

```bash
git clone https://github.com/huntkil/todo_gil.git
cd todo_gil
npm install
cp .env.example .env # 또는 직접 .env 생성
npm run dev
```

- 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속
- MongoDB가 로컬 또는 Atlas에서 실행 중이어야 함

## 🧑‍💻 협업 및 커밋 규칙
- main 브랜치: 배포/운영 코드
- feature/bugfix 브랜치에서 작업 후 PR
- 커밋 메시지: "기능/버그/문서/리팩토링: 내용"
- ESLint/lint 통과 필수

## 📁 프로젝트 구조

```
todo_gil/
├── config/           # DB 연결
├── controllers/      # 비즈니스 로직
├── models/           # Mongoose 스키마
├── routes/           # API 라우터
├── utils/            # 유틸리티 함수
├── public/           # 정적 파일(HTML/CSS/JS)
├── server.js         # 메인 서버
├── .env              # 환경 변수
├── .gitignore        # Git 제외 파일
├── README.md         # 개발 문서
└── ...
```

## 🔧 API 엔드포인트
- `/api/tasks` 업무 CRUD, 중복 감지, 통계, 자동완성
- `/api/categories` 카테고리 관리 및 통계

## 🧪 Lint 및 코드 품질
- ESLint 적용: `npx eslint .`
- 모든 오류/경고 해결 상태 유지
- 코드 스타일/포맷팅은 협의 후 적용

## 🏗️ 향후 개발 계획
- 팀 협업/알림/모바일/AI 기능 확장 예정
- 테스트 코드 및 CI/CD 추가 예정

## 📄 라이선스
MIT

---

**업무 관리 도구**로 더욱 효율적인 업무 관리 경험을 시작해보세요! 🚀 