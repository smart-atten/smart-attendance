# 프런트엔드 구조

React 애플리케이션은 저장소 루트의 `src/`에 있습니다. 별도의 `frontend/` 폴더는 현재 없습니다. 실행 방법은 [프로젝트 README](../README.md#-실행-방법)를 확인하세요.

## 담당 화면

| 파트 | 담당 | 경로 | 화면 파일 |
|---|---|---|---|
| 공통 레이아웃·홈·도메인 | 유다연 | `/` | `components/Navbar.jsx`, `pages/Home.jsx`, `domain/` |
| 시간표·출결조회 | 이은아 | `/timetable` | `pages/TimetablePage.jsx`, `pages/Timetable.jsx` |
| Q&A·FAQ | 김건우 | `/qna` | `pages/QnA.jsx` |
| 공지·환경설정·더보기 | 박지연 | `/notice`, `/settings`, `/more` | `pages/Notice.jsx`, `pages/Settings.jsx`, `pages/More.jsx` |
| 로그인 | 유다연 | 경로 미정 | `api/apiClient.js`의 로그인 요청 함수만 존재 |

## 현재 파일 트리

```text
📁 src/
├── 📁 api/
│   └── 📄 apiClient.js — 공통 API 요청
├── 📁 assets/
│   ├── 📄 hero.png
│   ├── 📄 react.svg
│   └── 📄 vite.svg
├── 📁 components/
│   └── 📄 Navbar.jsx — 공통 메뉴 · 유다연
├── 📁 domain/
│   ├── 📄 attendance.js
│   ├── 📄 post.js
│   ├── 📄 timetable.js
│   ├── 📄 timetableMapper.js — 시간표 데이터 변환 · 이은아
│   ├── 📄 timetableScale.js — 시간표 시간축 · 이은아
│   └── 📄 user.js
├── 📁 pages/
│   ├── 📄 Home.jsx — 홈 · 유다연
│   ├── 📄 More.jsx — 더보기 · 박지연
│   ├── 📄 Notice.jsx — 공지 · 박지연
│   ├── 📄 QnA.jsx — Q&A·FAQ · 김건우
│   ├── 📄 Settings.jsx — 설정 · 박지연
│   ├── 📄 Timetable.jsx — 시간표 화면 · 이은아
│   └── 📄 TimetablePage.jsx — 시간표 데이터 조회 · 이은아
├── 📄 App.css
├── 📄 App.jsx — 공통 화면 연결 · 유다연
├── 📄 index.css
├── 📄 main.jsx
└── 📄 README.md — 프런트엔드 구조
```

## 연결 구조

화면 경로는 `App.jsx`, 메뉴는 `components/Navbar.jsx`에서 확인합니다. 서버 호출은 `api/apiClient.js`에 모여 있습니다. 각 담당자는 위 표의 화면 파일과 다음 공통 경로를 함께 확인합니다.

| 담당 | 화면 | 확인할 연결 파일 |
|---|---|---|
| 유다연 | `pages/Home.jsx` | `components/Navbar.jsx`, `domain/`, `api/apiClient.js` |
| 이은아 | `pages/TimetablePage.jsx`, `pages/Timetable.jsx` | `domain/timetableMapper.js`, `domain/timetableScale.js`, `api/apiClient.js` |
| 김건우 | `pages/QnA.jsx` | `domain/post.js`, `api/apiClient.js` |
| 박지연 | `pages/Notice.jsx`, `pages/Settings.jsx`, `pages/More.jsx` | `domain/post.js`, `domain/user.js`, `api/apiClient.js` |

```text
App.jsx → TimetablePage.jsx → apiClient.js → 개발용 학생·시간표 API → MySQL
                             ↓
                     timetableMapper.js → Timetable.jsx
```

현재 시간표는 개발 모드에서 기본 학번 `20232656`을 사용하며 `.env.local`의 `VITE_DEV_STUDENT_NO`로 변경할 수 있습니다. 로그인 사용자 정보와 정식 시간표 API는 미연결입니다. 나머지 페이지도 경로와 기본 화면 위주이며 세부 기능 구현이 필요합니다.

로그인 구현 후에는 공통 API 함수에 토큰을 전달하고, 서버가 검증한 학생의 수강 강좌와 출결만 반환하도록 연결합니다. 개발용 API는 snake_case 행을, 정식 API 계약은 `ApiContracts.java`의 camelCase 구조를 사용하므로 연결 시 형식에 맞춰야 합니다.
