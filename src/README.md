# 프런트엔드 구조

React 애플리케이션은 저장소 루트의 `src/`에 있습니다. 별도의 `frontend/` 폴더는 현재 없습니다. 실행 방법은 [프로젝트 README](../README.md#-실행-방법)를 확인하세요.

## 담당 화면

| 파트 | 담당 | 경로 | 화면 파일 |
|---|---|---|---|
| 공통 레이아웃·홈·도메인 | 유다연 | `/` | `components/Navbar.jsx`, `pages/Home.jsx`, `domain/` |
| 시간표·출결조회 | 이은아 | `/timetable` | `pages/TimetablePage.jsx`, `pages/Timetable.jsx` |
| Q&A·FAQ | 김건우 | `/qna` | `pages/QnA.jsx` |
| 공지·환경설정·더보기 | 박지연 | `/notice`, `/settings`, `/more` | `pages/Notice.jsx`, `pages/Settings.jsx`, `pages/More.jsx` |
| 로그인 | 담당 확인 필요 | 경로 미정 | `api/apiClient.js`의 로그인 요청 함수만 존재 |

## 현재 파일 트리

```text
src/
├── README.md
├── main.jsx                      React 진입점
├── App.jsx                       공통 레이아웃과 화면 경로
├── index.css                     전역 스타일
├── App.css                       기존 예제 스타일
├── api/
│   └── apiClient.js              공통 요청·기능별 API 호출 함수
├── components/
│   └── Navbar.jsx                공통 헤더와 메뉴
├── domain/
│   ├── attendance.js             출결 코드·화면 데이터 형식
│   ├── post.js                   게시글 코드·데이터 형식
│   ├── user.js                   사용자 권한·데이터 형식
│   ├── timetable.js              시간표 코드·데이터 형식
│   ├── timetableMapper.js        개발용 조회 응답을 강좌별로 묶기
│   └── timetableScale.js         시간축 범위·겹치는 수업 배치
├── pages/
│   ├── Home.jsx                  출석체크 홈
│   ├── TimetablePage.jsx         개발용 시간표 데이터 조회
│   ├── Timetable.jsx             강좌 목록·시간표 UI
│   ├── QnA.jsx                   질문·FAQ 화면
│   ├── Notice.jsx                공지 화면
│   ├── Settings.jsx              환경설정 화면
│   └── More.jsx                  더보기 화면
└── assets/                       이미지와 기본 리소스
```

## 연결 구조

```text
App.jsx → TimetablePage.jsx → apiClient.js → 개발용 학생·시간표 API → MySQL
                             ↓
                     timetableMapper.js → Timetable.jsx
```

현재 시간표는 개발 모드에서 기본 가상 학번 `DEMO001`을 사용하며 `.env.local`의 `VITE_DEV_STUDENT_NO`로 변경할 수 있습니다. 로그인 사용자 정보와 정식 시간표 API는 미연결입니다. 나머지 페이지도 경로와 기본 화면 위주이며 세부 기능 구현이 필요합니다.

로그인 구현 후에는 공통 API 함수에 토큰을 전달하고, 서버가 검증한 학생의 수강 강좌와 출결만 반환하도록 연결합니다. 개발용 API는 snake_case 행을, 정식 API 계약은 `ApiContracts.java`의 camelCase 구조를 사용하므로 연결 시 형식에 맞춰야 합니다.
