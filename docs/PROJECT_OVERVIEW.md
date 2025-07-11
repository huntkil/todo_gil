# 📋 업무 관리 도구 (Todo Gil) - 프로젝트 개요

## 🎯 프로젝트 소개

**Todo Gil**은 자연어 입력, 실시간 중복 감지, 캘린더 연동, 알림 시스템을 갖춘 개인 업무 관리 도구입니다.

### 주요 특징
- 🤖 **자연어 업무 입력**: "내일 오후 3시에 회의 준비" 같은 자연스러운 입력
- 🔍 **실시간 중복 감지**: 유사한 업무 자동 감지 및 알림
- 📅 **캘린더 연동**: Google Calendar와 양방향 동기화
- 🔔 **알림 시스템**: 이메일, Slack, 푸시 알림 지원
- 📊 **대시보드**: 업무 현황 및 통계 시각화
- 📈 **간트 차트**: 프로젝트 일정 관리
- 🏷️ **카테고리 관리**: 체계적인 업무 분류
- 🔍 **검색 및 필터링**: 효율적인 업무 검색

## 🏗️ 시스템 아키텍처

### 백엔드 스택
```
Node.js + Express.js
├── MongoDB (Mongoose ODM)
├── JWT Authentication
├── Nodemailer (이메일 알림)
├── Slack Webhook (Slack 알림)
├── Google Calendar API (캘린더 연동)
├── node-cron (스케줄러)
└── Jest (테스트)
```

### 프론트엔드 스택
```
HTML5 + CSS3 + JavaScript
├── Bootstrap 5 (UI 프레임워크)
├── Chart.js (차트 시각화)
├── Font Awesome (아이콘)
└── Vanilla JS (상태 관리)
```

### 데이터베이스 스키마
```
Task (업무)
├── title, description
├── category, priority, status
├── startDate, endDate
├── progress, estimatedTime
└── tags, history

Category (카테고리)
├── name, color
└── description

Notification (알림)
├── title, message, type
├── channel, read
├── taskId, userId
└── scheduledAt

User (사용자)
├── email, name
├── notificationSettings
└── calendarSettings
```

## 🚀 주요 기능 모듈

### 1. 업무 관리 모듈
- **CRUD 작업**: 업무 생성, 조회, 수정, 삭제
- **상태 관리**: 대기중, 진행중, 완료, 보류, 취소
- **진행률 추적**: 0-100% 진행률 관리
- **우선순위**: 5단계 우선순위 시스템

### 2. 중복 감지 모듈
- **텍스트 정규화**: 한국어 특화 처리
- **유사도 계산**: Jaccard, Cosine 유사도
- **실시간 감지**: 입력 중 실시간 체크
- **스마트 제안**: 유사 업무 추천

### 3. 알림 시스템 모듈
- **다중 채널**: 이메일, Slack, 푸시
- **스마트 스케줄링**: 마감일, 상태 변경 알림
- **설정 관리**: 채널별 개별 설정
- **실시간 업데이트**: 30초 폴링

### 4. 캘린더 연동 모듈
- **OAuth2 인증**: Google Calendar 연동
- **양방향 동기화**: 업무 ↔ 캘린더
- **자동 동기화**: 생성/수정/삭제 시 자동 반영
- **가져오기 기능**: 기존 일정을 업무로 변환

### 5. 대시보드 모듈
- **통계 카드**: 전체, 완료, 진행중, 대기 업무 수
- **진행률 차트**: 완료율 시각화
- **간트 차트**: 프로젝트 일정 관리
- **실시간 업데이트**: 자동 새로고침

## 📁 프로젝트 구조

```
todo_gil/
├── 📁 config/           # 설정 파일
├── 📁 models/           # 데이터베이스 모델
├── 📁 routes/           # API 라우트
├── 📁 services/         # 비즈니스 로직
├── 📁 utils/            # 유틸리티 함수
├── 📁 public/           # 프론트엔드 파일
│   ├── 📁 css/         # 스타일시트
│   ├── 📁 js/          # JavaScript
│   └── 📁 images/      # 이미지
├── 📁 tests/            # 테스트 파일
│   ├── 📁 integration/ # 통합 테스트
│   ├── 📁 mocks/       # 모킹 파일
│   └── 📁 utils/       # 유틸리티 테스트
├── 📁 docs/             # 문서
└── 📁 logs/             # 로그 파일
```

## 🔧 개발 환경

### 필수 요구사항
- Node.js 16+ 
- MongoDB 4.4+
- Git

### 권장 개발 도구
- VS Code
- MongoDB Compass
- Postman (API 테스트)

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
- [x] 테스트 커버리지

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