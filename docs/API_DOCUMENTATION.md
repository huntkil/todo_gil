# 📚 API 문서

## 🔗 기본 정보

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **인증**: JWT 토큰 (선택사항)

## 📋 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "message": "성공적으로 처리되었습니다."
}
```

### 에러 응답
```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE"
}
```

## 🎯 업무 관리 API

### 1. 업무 목록 조회
```http
GET /tasks
```

**쿼리 파라미터:**
- `page` (number): 페이지 번호 (기본값: 1)
- `limit` (number): 페이지당 항목 수 (기본값: 10)
- `status` (string): 상태 필터 (pending, in_progress, completed, on_hold, cancelled)
- `category` (string): 카테고리 ID
- `priority` (number): 우선순위 (1-5)
- `search` (string): 검색어

**응답 예시:**
```json
{
  "tasks": [
    {
      "_id": "60cd4de1234567890abcdef",
      "title": "회의 준비",
      "description": "내일 회의 자료 준비",
      "category": {
        "_id": "60cd4de1234567890abcde1",
        "name": "업무",
        "color": "#ff0000"
      },
      "priority": 3,
      "status": "pending",
      "startDate": "2024-01-15T09:00:00.000Z",
      "endDate": "2024-01-15T17:00:00.000Z",
      "progress": 0,
      "estimatedTime": 120,
      "tags": ["회의", "준비"],
      "createdAt": "2024-01-14T10:30:00.000Z",
      "updatedAt": "2024-01-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 2. 업무 생성
```http
POST /tasks
```

**요청 본문:**
```json
{
  "title": "새로운 업무",
  "description": "업무 설명",
  "category": "60cd4de1234567890abcde1",
  "priority": 3,
  "status": "pending",
  "startDate": "2024-01-15T09:00:00.000Z",
  "endDate": "2024-01-15T17:00:00.000Z",
  "estimatedTime": 120,
  "tags": ["태그1", "태그2"]
}
```

**응답 예시:**
```json
{
  "task": {
    "_id": "60cd4de1234567890abcdef",
    "title": "새로운 업무",
    "description": "업무 설명",
    "category": "60cd4de1234567890abcde1",
    "priority": 3,
    "status": "pending",
    "startDate": "2024-01-15T09:00:00.000Z",
    "endDate": "2024-01-15T17:00:00.000Z",
    "progress": 0,
    "estimatedTime": 120,
    "tags": ["태그1", "태그2"],
    "createdAt": "2024-01-14T10:30:00.000Z"
  },
  "duplicates": {
    "exactDuplicates": [],
    "similarTasks": [
      {
        "task": { ... },
        "similarity": 0.85
      }
    ]
  }
}
```

### 3. 업무 상세 조회
```http
GET /tasks/:id
```

**응답 예시:**
```json
{
  "_id": "60cd4de1234567890abcdef",
  "title": "회의 준비",
  "description": "내일 회의 자료 준비",
  "category": {
    "_id": "60cd4de1234567890abcde1",
    "name": "업무",
    "color": "#ff0000"
  },
  "priority": 3,
  "status": "pending",
  "startDate": "2024-01-15T09:00:00.000Z",
  "endDate": "2024-01-15T17:00:00.000Z",
  "progress": 0,
  "estimatedTime": 120,
  "tags": ["회의", "준비"],
  "history": [
    {
      "action": "created",
      "timestamp": "2024-01-14T10:30:00.000Z",
      "details": "업무가 생성되었습니다."
    }
  ],
  "createdAt": "2024-01-14T10:30:00.000Z",
  "updatedAt": "2024-01-14T10:30:00.000Z"
}
```

### 4. 업무 수정
```http
PUT /tasks/:id
```

**요청 본문:**
```json
{
  "title": "수정된 업무 제목",
  "description": "수정된 설명",
  "priority": 2,
  "status": "in_progress",
  "progress": 50
}
```

### 5. 업무 삭제
```http
DELETE /tasks/:id
```

### 6. 업무 진행률 업데이트
```http
PATCH /tasks/:id/progress
```

**요청 본문:**
```json
{
  "progress": 75
}
```

### 7. 업무 중복 감지
```http
POST /tasks/check-duplicates
```

**요청 본문:**
```json
{
  "title": "업무 제목",
  "category": "60cd4de1234567890abcde1"
}
```

### 8. 업무 통계
```http
GET /tasks/stats
```

**응답 예시:**
```json
{
  "stats": {
    "totalTasks": [{ "count": 25 }],
    "completedTasks": [{ "count": 15 }],
    "pendingTasks": [{ "count": 5 }],
    "inProgressTasks": [{ "count": 3 }],
    "overdueTasks": [{ "count": 2 }],
    "todayTasks": [{ "count": 8 }]
  }
}
```

## 🏷️ 카테고리 관리 API

### 1. 카테고리 목록 조회
```http
GET /categories
```

### 2. 카테고리 생성
```http
POST /categories
```

**요청 본문:**
```json
{
  "name": "새로운 카테고리",
  "color": "#ff0000",
  "description": "카테고리 설명"
}
```

### 3. 카테고리 상세 조회
```http
GET /categories/:id
```

### 4. 카테고리 수정
```http
PUT /categories/:id
```

### 5. 카테고리 삭제
```http
DELETE /categories/:id
```

## 🔔 알림 시스템 API

### 1. 알림 목록 조회
```http
GET /notifications
```

**쿼리 파라미터:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `read` (boolean): 읽음 상태 필터
- `type` (string): 알림 타입 필터

### 2. 알림 생성
```http
POST /notifications
```

**요청 본문:**
```json
{
  "title": "알림 제목",
  "message": "알림 메시지",
  "type": "deadline_reminder",
  "channel": "email",
  "taskId": "60cd4de1234567890abcdef",
  "scheduledAt": "2024-01-15T09:00:00.000Z"
}
```

### 3. 알림 읽음 처리
```http
PATCH /notifications/:id/read
```

### 4. 모든 알림 읽음 처리
```http
PATCH /notifications/read-all
```

### 5. 알림 삭제
```http
DELETE /notifications/:id
```

### 6. 알림 설정 조회
```http
GET /notifications/settings
```

### 7. 알림 설정 업데이트
```http
PUT /notifications/settings
```

**요청 본문:**
```json
{
  "email": {
    "enabled": true,
    "deadlineReminder": true,
    "taskAssigned": true,
    "statusChanged": true
  },
  "slack": {
    "enabled": false,
    "webhookUrl": "https://hooks.slack.com/services/...",
    "channel": "#general",
    "deadlineReminder": true,
    "taskAssigned": false,
    "statusChanged": true
  },
  "push": {
    "enabled": true,
    "deadlineReminder": true,
    "taskAssigned": true,
    "statusChanged": false
  }
}
```

### 8. 알림 통계
```http
GET /notifications/stats
```

**응답 예시:**
```json
{
  "total": 15,
  "unread": 5,
  "read": 10,
  "byType": {
    "deadline_reminder": 8,
    "task_assigned": 4,
    "status_changed": 3
  }
}
```

## 📅 캘린더 연동 API

### 1. 캘린더 상태 조회
```http
GET /calendar/status
```

### 2. Google Calendar 인증
```http
GET /calendar/auth/google
```

### 3. Google Calendar 연결 해제
```http
DELETE /calendar/auth/google
```

### 4. 캘린더 목록 조회
```http
GET /calendar/calendars
```

### 5. 동기화 설정 업데이트
```http
PUT /calendar/sync-settings
```

**요청 본문:**
```json
{
  "calendarId": "primary",
  "syncEnabled": true
}
```

### 6. 업무를 캘린더에 동기화
```http
POST /calendar/sync-task/:taskId
```

### 7. 캘린더에서 업무 삭제
```http
DELETE /calendar/sync-task/:taskId
```

### 8. 캘린더에서 업무 가져오기
```http
POST /calendar/import
```

**요청 본문:**
```json
{
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z"
}
```

## 🔍 검색 및 필터링

### 고급 검색
```http
GET /tasks/search
```

**쿼리 파라미터:**
- `q` (string): 검색어
- `category` (string): 카테고리 ID
- `status` (string): 상태
- `priority` (number): 우선순위
- `startDate` (string): 시작일
- `endDate` (string): 종료일
- `tags` (string): 태그 (쉼표로 구분)

### 태그 기반 검색
```http
GET /tasks/tags/:tag
```

## 📊 대시보드 API

### 대시보드 통계
```http
GET /dashboard/stats
```

**응답 예시:**
```json
{
  "overview": {
    "totalTasks": 25,
    "completedTasks": 15,
    "pendingTasks": 5,
    "inProgressTasks": 3,
    "overdueTasks": 2
  },
  "completionRate": 60,
  "recentActivity": [
    {
      "type": "task_created",
      "task": { ... },
      "timestamp": "2024-01-14T10:30:00.000Z"
    }
  ],
  "upcomingDeadlines": [
    {
      "task": { ... },
      "daysUntilDeadline": 2
    }
  ]
}
```

## 🚨 에러 코드

| 코드 | 설명 |
|------|------|
| `VALIDATION_ERROR` | 입력 데이터 검증 실패 |
| `NOT_FOUND` | 리소스를 찾을 수 없음 |
| `DUPLICATE_ERROR` | 중복 데이터 |
| `AUTHENTICATION_ERROR` | 인증 실패 |
| `AUTHORIZATION_ERROR` | 권한 없음 |
| `INTERNAL_ERROR` | 서버 내부 오류 |

## 📝 사용 예시

### cURL 예시
```bash
# 업무 목록 조회
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10"

# 새 업무 생성
curl -X POST "http://localhost:3000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "새로운 업무",
    "description": "업무 설명",
    "category": "60cd4de1234567890abcde1",
    "priority": 3,
    "status": "pending",
    "startDate": "2024-01-15T09:00:00.000Z",
    "endDate": "2024-01-15T17:00:00.000Z"
  }'

# 업무 수정
curl -X PUT "http://localhost:3000/api/tasks/60cd4de1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "수정된 제목",
    "status": "in_progress"
  }'
```

### JavaScript 예시
```javascript
// 업무 목록 조회
const response = await fetch('/api/tasks?page=1&limit=10');
const data = await response.json();

// 새 업무 생성
const newTask = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '새로운 업무',
    description: '업무 설명',
    category: '60cd4de1234567890abcde1',
    priority: 3,
    status: 'pending',
    startDate: '2024-01-15T09:00:00.000Z',
    endDate: '2024-01-15T17:00:00.000Z'
  })
});
``` 