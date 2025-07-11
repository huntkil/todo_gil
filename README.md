# 업무 관리 도구 (Work Manager)

Node.js 기반의 개인 업무 관리 도구입니다. 일일 업무를 효율적으로 관리하고 시각화할 수 있는 기능을 제공합니다.

## 🚀 주요 기능

### 1. 스마트 업무 입력 및 중복 감지
- **자연어 업무 입력**: "이메일 마케팅 캠페인 기획서 작성" 형태로 입력
- **실시간 중복 검사**: 유사한 업무가 있는지 자동으로 감지
- **자동완성 제안**: 기존 업무를 기반으로 한 제안
- **날짜 자동 파싱**: "내일까지", "이번 주 금요일까지" 등의 자연어 처리

### 2. 간트 차트 시각화
- 업무들을 간트 차트 형태로 시각적으로 표시
- 날짜별 업무 진행 상황을 한눈에 파악
- 오늘 날짜 강조 표시
- 마우스 오버 시 업무 상세 정보 툴팁

### 3. 카테고리별 분류 및 관리
- 업무를 카테고리별로 분류 (개발, 회의, 기획, 문서작업 등)
- 카테고리별 필터링 기능
- 카테고리별 통계 (완료율, 소요 시간 등)
- 사용자 정의 카테고리 추가/수정/삭제

### 4. 검색 및 필터링
- 업무명, 카테고리, 날짜 범위로 검색
- 상태별 필터링 (진행 중, 완료, 보류 등)
- 우선순위별 정렬
- 키워드 기반 빠른 검색

### 5. 대시보드
- 오늘의 업무 요약
- 진행 중인 업무 현황
- 완료율 통계
- 다가오는 마감일 알림
- 월별/주별 업무 완료 트렌드

## 🛠 기술 스택

### 백엔드
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **MongoDB**: 데이터베이스
- **Mongoose**: ODM (Object Document Mapper)
- **JWT**: 인증 (선택사항)

### 프론트엔드
- **HTML5/CSS3**: 마크업 및 스타일링
- **JavaScript (ES6+)**: 클라이언트 사이드 로직
- **Bootstrap 5**: UI 프레임워크
- **Chart.js**: 차트 라이브러리
- **Font Awesome**: 아이콘

### 추가 라이브러리
- **string-similarity**: 텍스트 유사도 검사
- **natural**: 자연어 처리
- **fuzzball**: 퍼지 문자열 매칭
- **hangul-js**: 한국어 처리
- **Joi**: 데이터 검증

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd work-manager
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가합니다:
```env
MONGODB_URI=mongodb://localhost:27017/work-manager
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

### 4. MongoDB 실행
MongoDB가 로컬에서 실행 중인지 확인하거나, MongoDB Atlas 등의 클라우드 서비스를 사용합니다.

### 5. 애플리케이션 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

### 6. 브라우저에서 접속
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
work-manager/
├── config/
│   └── database.js          # 데이터베이스 연결 설정
├── controllers/
│   ├── taskController.js    # 업무 관리 컨트롤러
│   └── categoryController.js # 카테고리 관리 컨트롤러
├── models/
│   ├── Task.js             # 업무 모델
│   ├── Category.js         # 카테고리 모델
│   └── TaskHistory.js      # 업무 이력 모델
├── routes/
│   ├── tasks.js            # 업무 관련 라우터
│   └── categories.js       # 카테고리 관련 라우터
├── utils/
│   └── textSimilarity.js   # 텍스트 유사도 및 중복 감지
├── public/
│   ├── css/
│   │   └── style.css       # 스타일시트
│   ├── js/
│   │   └── app.js          # 클라이언트 사이드 JavaScript
│   └── index.html          # 메인 HTML 파일
├── server.js               # 메인 서버 파일
├── package.json            # 프로젝트 설정
└── README.md               # 프로젝트 문서
```

## 🔧 API 엔드포인트

### 업무 관리
- `GET /api/tasks` - 모든 업무 조회
- `GET /api/tasks/:id` - 특정 업무 조회
- `POST /api/tasks` - 새 업무 생성
- `PUT /api/tasks/:id` - 업무 수정
- `DELETE /api/tasks/:id` - 업무 삭제
- `PATCH /api/tasks/:id/progress` - 진행률 업데이트
- `GET /api/tasks/stats` - 대시보드 통계
- `POST /api/tasks/check-duplicates` - 중복 감지
- `GET /api/tasks/suggestions` - 자동완성 제안

### 카테고리 관리
- `GET /api/categories` - 모든 카테고리 조회
- `GET /api/categories/:id` - 특정 카테고리 조회
- `POST /api/categories` - 새 카테고리 생성
- `PUT /api/categories/:id` - 카테고리 수정
- `DELETE /api/categories/:id` - 카테고리 삭제
- `GET /api/categories/:id/stats` - 카테고리별 통계

## 🎯 사용법

### 1. 업무 추가
1. "새 업무 추가" 버튼 클릭
2. 업무 제목, 설명, 카테고리, 날짜 등 입력
3. 저장 시 중복 감지 결과 확인
4. 중복이 발견되면 적절한 처리 선택

### 2. 업무 관리
- **목록 뷰**: 모든 업무를 카드 형태로 표시
- **간트 차트 뷰**: 시간별 업무 진행 상황 시각화
- **필터링**: 카테고리, 상태, 우선순위별 필터링
- **검색**: 키워드 기반 업무 검색

### 3. 진행률 관리
- 각 업무 카드에서 진행률 업데이트
- 100% 완료 시 자동으로 상태 변경
- 진행률 히스토리 추적

### 4. 대시보드 활용
- 전체 업무 현황 파악
- 카테고리별 완료율 확인
- 오늘의 업무 및 지연 업무 확인

## 🔍 중복 감지 시스템

### 감지 알고리즘
1. **텍스트 정규화**: 공백, 특수문자 제거, 소문자 변환
2. **한글 처리**: 한글 자모 분해를 통한 음성학적 유사도 계산
3. **키워드 추출**: 자연어 처리를 통한 핵심 키워드 추출
4. **유사도 계산**: 문자열, 키워드, 음성학적 유사도의 가중 평균

### 처리 방식
- **완전 중복 (90% 이상)**: 기존 업무 수정 또는 반복 업무 설정
- **부분 중복 (70-89%)**: 연관 업무로 연결 또는 독립 생성
- **유사 업무 (40-69%)**: 자동완성 제안 및 템플릿 활용

## 🎨 UI/UX 특징

### 반응형 디자인
- 모바일, 태블릿, 데스크톱 모든 기기 지원
- 터치 친화적인 인터페이스

### 시각적 피드백
- 호버 효과 및 애니메이션
- 상태별 색상 구분
- 진행률 시각화

### 사용자 경험
- 직관적인 네비게이션
- 실시간 검색 및 필터링
- 드래그 앤 드롭 지원 (향후 구현 예정)

## 🔮 향후 개발 계획

### Phase 2: 고급 기능
- [ ] 팀 협업 기능
- [ ] 파일 첨부 기능
- [ ] 댓글 및 피드백 시스템
- [ ] 알림 시스템

### Phase 3: 모바일 앱
- [ ] React Native 모바일 앱
- [ ] 푸시 알림
- [ ] 오프라인 동기화

### Phase 4: AI 기능
- [ ] 업무 자동 분류
- [ ] 예상 소요시간 AI 추정
- [ ] 업무 패턴 분석

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 이슈를 통해 제출해주세요.

---

**업무 관리 도구**로 더욱 효율적인 업무 관리 경험을 시작해보세요! 🚀 