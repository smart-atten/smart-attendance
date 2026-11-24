# 🎓 스마트 출결 (Smart Attendance)

**스마트 출결**은 학생이 수강 강의와 시간표를 확인하고 출결 상태를 조회할 수 있도록 만드는 모바일 중심 웹 서비스입니다. 출석 확인부터 공지사항과 문의까지 한곳에서 이용할 수 있도록 백석대학교 스마트 출결 UI를 개선하는 것을 목표로 합니다.

> Java 응용 1조 프로젝트 · 개발 중인 서비스입니다. 실제 학생 정보 대신 가상 학생과 수강 데이터를 사용합니다.

## 👥 팀 소개

| 이름 | 담당 영역 | 주요 화면 |
|---|---|---|
| 유다연 | 공통 레이아웃 · 메인 홈 · 공통 도메인 | `Navbar.jsx`, `Home.jsx` |
| 이은아 | 그리드 시간표 · 출결조회 | `Timetable.jsx` |
| 김건우 | Q&A · FAQ 통합 게시판 | `QnA.jsx` |
| 박지연 | 공지사항 · 환경설정 · 더보기 | `Notice.jsx`, `Settings.jsx`, `More.jsx` |

## 🎯 프로젝트 목표

- 학생이 오늘의 강의와 출석 가능 상태를 쉽게 확인할 수 있는 화면 제공
- 요일별 시간표와 강의별 출결 정보 연결
- 공지사항, 자주 묻는 질문과 문의 기능 통합
- 가상의 학생·수강 정보를 사용한 개인정보 없는 개발 환경 구성

## ✨ 주요 기능

다음은 설계와 와이어프레임을 바탕으로 한 **개발 목표**이며, 모두 구현된 상태는 아닙니다.

1. **출석체크 홈**: 오늘의 수업, 강의실, 교수, 출석 가능 시간과 상태 확인 및 출석 처리.
2. **시간표와 출결조회**: 수강 강의 목록, 요일별 시간표, 강의별 출결 내역 조회.
3. **Q&A · FAQ**: 자주 묻는 질문 검색과 문의 확인.
4. **공지사항 · 환경설정**: 공지 조회, 사용자 설정 및 추가 메뉴 제공.

현재 화면 이동과 시간표 UI, 가상 학생의 개발용 시간표 조회가 연결되어 있습니다. 로그인·실제 출석 처리·게시판·알림과 실제 사용자 기준 화면-DB 연동은 추가 구현이 필요합니다.

## 🛠 기술 스택

| 구분 | 기술 |
|---|---|
| 프런트엔드 | React 19, Vite, React Router, Tailwind CSS |
| 백엔드 | Java 21, Spring Boot 3.5, Maven, Spring JDBC, Lombok, Spring Security Crypto |
| 데이터베이스 | MySQL 8.0, Docker Compose |
| 디자인 · 협업 | [Figma 와이어프레임](https://www.figma.com/design/iVCLV3QNbnRWf9CjSYebCy/1%EC%A1%B0_UI?node-id=2-5593), Git, GitHub |

## 🏗 시스템 구조

```text
목표: React 화면 → API 요청 → 컨트롤러 → 서비스 → DB 접근 → MySQL
현재: 개발용 시간표만 화면과 DB 조회가 연결됨
```

SQL은 `backend/src/main/resources/` 아래에 있으며, 강좌 목록은 GitHub에서 볼 수 있도록 `catalog/`에 나누어 저장합니다.

강좌 목록 엑셀의 원본 2,903건은 `course_catalog_import`에 보관하고, 학생과 수강 정보는 별도로 만든 가상 데이터를 사용합니다. 학기·교시 시각은 임의의 테스트 값이며 실제 시간표가 아닙니다. 원본 강좌 중 일부를 가상 학생의 예시 시간표로 연결합니다.

| 담당 | 화면에서 서버까지 확인할 경로 |
|---|---|
| 유다연 · 공통·홈 | `src/App.jsx` → `src/components/Navbar.jsx`, `src/pages/Home.jsx` → `src/api/apiClient.js` → `backend/src/main/java/kr/ac/bu/attendance/StudentController.java`, `StudentService.java` |
| 이은아 · 시간표·출결 | `src/pages/TimetablePage.jsx` → `src/api/apiClient.js` → `backend/src/main/java/kr/ac/bu/attendance/DevelopmentTimetableController.java` → MySQL. 정식 API는 `TimetableController.java` → `TimetableService.java` → `StudentDataRepository.java`를 연결해야 함 |
| 김건우 · Q&A·FAQ | `src/pages/QnA.jsx` → `src/api/apiClient.js` → `backend/src/main/java/kr/ac/bu/attendance/PostController.java` → `PostService.java` → `PostRepository.java` 연결 필요 |
| 박지연 · 공지·설정·더보기 | `src/pages/Notice.jsx`, `Settings.jsx`, `More.jsx` → `src/api/apiClient.js` → 백엔드 `PostController.java`, `StudentController.java`, `NotificationController.java`와 각 서비스 연결 필요 |
| 유다연 · 로그인 | `src/api/apiClient.js` → `backend/src/main/java/kr/ac/bu/attendance/auth/AuthController.java` → `AuthService.java` → `UserCredentialsRepository.java` 연결 필요 |

위 경로는 담당자가 확인할 파일입니다. 개발용 시간표를 제외한 서비스 연결과 로그인 인증은 아직 미구현입니다.

## 📁 폴더 구조

```text
📁 smart-attendance/
├── 📁 backend/ — 백엔드
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 kr/
│   │   │   │       └── 📁 ac/
│   │   │   │           └── 📁 bu/
│   │   │   │               └── 📁 attendance/
│   │   │   │                   ├── 📁 auth/ — 로그인 · 유다연
│   │   │   │                   │   ├── 📄 AuthController.java
│   │   │   │                   │   ├── 📄 AuthService.java
│   │   │   │                   │   ├── 📄 PasswordConfig.java
│   │   │   │                   │   ├── 📄 PasswordService.java
│   │   │   │                   │   └── 📄 UserCredentialsRepository.java
│   │   │   │                   ├── 📄 ApiContracts.java
│   │   │   │                   ├── 📄 ApiErrors.java
│   │   │   │                   ├── 📄 AttendanceApplication.java
│   │   │   │                   ├── 📄 DevelopmentTimetableController.java — 개발용 조회 · 이은아
│   │   │   │                   ├── 📄 NotificationController.java — 알림 API · 박지연
│   │   │   │                   ├── 📄 NotificationRepository.java — 알림 DB 접근 · 박지연
│   │   │   │                   ├── 📄 NotificationService.java — 알림 서비스 · 박지연
│   │   │   │                   ├── 📄 PendingFeature.java
│   │   │   │                   ├── 📄 PostController.java — 게시판 API · 김건우/박지연
│   │   │   │                   ├── 📄 PostRepository.java — 게시판 DB 접근 · 김건우/박지연
│   │   │   │                   ├── 📄 PostService.java — 게시판 서비스 · 김건우/박지연
│   │   │   │                   ├── 📄 StudentController.java — 학생·설정 API · 공통/박지연
│   │   │   │                   ├── 📄 StudentDataRepository.java — 학생·수강·출결 DB 조회 · 공통/이은아
│   │   │   │                   ├── 📄 StudentService.java — 학생·설정 서비스 · 공통/박지연
│   │   │   │                   ├── 📄 TimetableController.java — 시간표·출결 API · 이은아
│   │   │   │                   └── 📄 TimetableService.java — 시간표·출결 서비스 · 이은아
│   │   │   └── 📁 resources/
│   │   │       ├── 📄 application-dev.properties
│   │   │       ├── 📄 application.properties
│   │   │       ├── 📁 catalog/
│   │   │       │   ├── 📄 course_catalog_01.sql
│   │   │       │   ├── 📄 course_catalog_02.sql
│   │   │       │   ├── 📄 course_catalog_03.sql
│   │   │       │   └── 📄 course_catalog_04.sql
│   │   │       ├── 📄 demo-timetable.sql — 예시 시간표
│   │   │       ├── 📄 demo-data.sql — 테스트 데이터
│   │   │       └── 📄 schema.sql — DB 테이블 구조
│   │   └── 📁 test/
│   │       └── 📁 java/
│   │           └── 📁 kr/
│   │               └── 📁 ac/
│   │                   └── 📁 bu/
│   │                       └── 📁 attendance/
│   │                           ├── 📁 auth/ — 로그인 · 유다연
│   │                           │   └── 📄 PasswordServiceTest.java
│   │                           └── 📄 DatabaseReadIntegrationTest.java
│   ├── 📄 pom.xml
│   └── 📄 README.md — 전체 소개·설치·구조
├── 📁 docs/ — 개발 환경 안내
│   └── 📄 DEVELOPMENT.md
├── 📁 public/
│   ├── 📄 favicon.svg
│   └── 📄 icons.svg
├── 📁 src/
│   ├── 📁 api/
│   │   └── 📄 apiClient.js — 공통 API 요청
│   ├── 📁 assets/
│   │   ├── 📄 hero.png
│   │   ├── 📄 react.svg
│   │   └── 📄 vite.svg
│   ├── 📁 components/
│   │   └── 📄 Navbar.jsx — 공통 메뉴 · 유다연
│   ├── 📁 domain/
│   │   ├── 📄 attendance.js
│   │   ├── 📄 post.js
│   │   ├── 📄 timetable.js
│   │   ├── 📄 timetableMapper.js — 시간표 데이터 변환 · 이은아
│   │   ├── 📄 timetableScale.js — 시간표 시간축 · 이은아
│   │   └── 📄 user.js
│   ├── 📁 pages/
│   │   ├── 📄 Home.jsx — 홈 · 유다연
│   │   ├── 📄 More.jsx — 더보기 · 박지연
│   │   ├── 📄 Notice.jsx — 공지 · 박지연
│   │   ├── 📄 QnA.jsx — Q&A·FAQ · 김건우
│   │   ├── 📄 Settings.jsx — 설정 · 박지연
│   │   ├── 📄 Timetable.jsx — 시간표 화면 · 이은아
│   │   └── 📄 TimetablePage.jsx — 시간표 데이터 조회 · 이은아
│   ├── 📄 App.css
│   ├── 📄 App.jsx — 공통 화면 연결 · 유다연
│   ├── 📄 index.css
│   ├── 📄 main.jsx
│   └── 📄 README.md — 전체 소개·설치·구조
├── 📁 test/
│   ├── 📄 timetableMapper.test.js
│   └── 📄 timetableScale.test.js
├── 📁 tools/
│   └── 📄 export_course_catalog.py
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 .oxlintrc.json
├── 📄 compose.yaml — MySQL 실행 설정
├── 📄 index.html
├── 📄 package-lock.json
├── 📄 package.json — 프런트 의존성·명령
├── 📄 postcss.config.js
├── 📄 README.md — 전체 소개·설치·구조
├── 📄 tailwind.config.js
└── 📄 vite.config.js
```

세부 구조는 [프런트엔드](src/README.md), [백엔드](backend/README.md), 실행 방법은 [개발 환경 안내](docs/DEVELOPMENT.md)를 확인하세요.

| 영역 | 프런트엔드 | 백엔드 |
|---|---|---|
| 공통 · 홈 | `src/components/Navbar.jsx`, `src/pages/Home.jsx`, `src/domain/` | `ApiContracts.java`, `ApiErrors.java`, `StudentController.java`, `StudentService.java` |
| 시간표 · 출결 | `src/pages/Timetable.jsx`, `src/pages/TimetablePage.jsx`, `src/domain/timetable*.js` | `DevelopmentTimetableController.java`, `TimetableController.java`, `TimetableService.java` |
| Q&A · FAQ | `src/pages/QnA.jsx` | `PostController.java`, `PostService.java` |
| 공지 · 설정 · 더보기 | `src/pages/Notice.jsx`, `Settings.jsx`, `More.jsx` | `PostController.java`, `StudentController.java`, `NotificationController.java` 및 각 서비스 |
| 로그인 | `src/api/apiClient.js` | `backend/src/main/java/kr/ac/bu/attendance/auth/` |

개발용 학생·시간표·출결 조회를 제외한 아래 API는 서비스에서 501을 반환하는 미구현 뼈대입니다. 로그인과 토큰 인증, 서비스의 DB 저장소 연결과 화면 연결은 담당 기능 구현 시 완성해야 합니다. 요청·응답 타입은 `ApiContracts.java`, 프론트 요청 함수는 `src/api/apiClient.js`에서 확인할 수 있습니다.

| 담당 | API | 요청 및 응답 |
|---|---|---|
| 공통 · 홈 | `GET /api/me` | 학생 정보 `Student` |
| 시간표 · 출결 | `GET /api/me/timetable?year=2026&term=2` | `Course` 목록 |
| 시간표 · 출결 | `GET /api/me/attendance?offeringId=1` | 선택적 강좌 ID, `Attendance` 목록 |
| 시간표 · 출결 | `POST /api/attendance/{sessionId}/check-in` | `CheckInResult` |
| Q&A · FAQ / 공지 | `GET /api/posts`, `GET /api/posts/{postId}`, `POST /api/posts` | 목록 필터 `type`, `faq`, `query`; 작성 `CreatePostRequest`; 응답 `Post` |
| 설정 · 알림 | `PATCH /api/me/settings`, `GET /api/notifications` | `SettingsRequest` → `Settings`; `Notification` 목록 |
| 로그인 | `POST /api/auth/login` | 학번 `studentNo`, 비밀번호 `password` → 토큰 응답; 담당자 유다연 |

인증이 필요한 API의 프론트 요청 함수는 Bearer 토큰을 전달하도록 준비되어 있지만, 서버의 토큰 발급·검증은 아직 구현되지 않았습니다.

## 🧰 개발 환경 준비

| 도구 | 설치 기준 | 확인 명령 |
|---|---|---|
| Node.js · npm | Node.js 24, npm 11 | `node -v`, `npm -v` |
| Java | JDK 21 | `java -version` |
| Maven | 3.9 계열 (확인 환경 3.9.16) | `mvn -v` |
| Docker Desktop · Compose | Docker Desktop 실행, Docker Compose v2 | `docker --version`, `docker compose version` |
| MySQL | Docker 이미지 `mysql:8.0` 사용 | `docker compose ps` |

명령은 Windows PowerShell 기준입니다. 각 팀원의 PC에서 저장소를 받은 뒤 저장소 폴더를 열고 실행합니다. Node.js는 React 개발 서버와 빌드에 필요하며, JDK와 Maven은 Spring Boot 서버에 필요합니다.

Node.js는 [공식 다운로드](https://nodejs.org/)에서 24 계열을 설치합니다. Git Bash에서 저장소를 받을 때는 다음을 실행합니다.

```bash
git clone --branch develop https://github.com/smart-atten/smart-attendance.git
cd smart-attendance
```

## 🐳 로컬 DB 실행

Docker Desktop을 실행하고 저장소 루트에서 최초 한 번 환경 파일을 만듭니다.

```powershell
Copy-Item .env.example .env
```

`.env`를 열어 `DB_PASSWORD`와 `MYSQL_ROOT_PASSWORD`를 각자 설정하세요. 두 값은 다르게 설정하고, 영문자·숫자로만 구성해 입력합니다. `.env`는 Git에 올리지 않습니다. DB는 `localhost:3307`, DB 이름과 계정은 `attendance`입니다. 3307 포트가 이미 사용 중이면 `compose.yaml`과 백엔드의 DB 주소를 함께 조정해야 합니다.

비밀번호를 설정한 뒤 DB를 시작합니다.

```powershell
docker compose up -d
```

처음 생성한 빈 DB에는 스키마, 가상 데이터, 강좌 원본 목록이 순서대로 자동 적용됩니다. 기존 볼륨에는 자동으로 다시 실행되지 않으며, 각 PC의 DB는 서로 동기화되지 않습니다. `docker compose stop`은 DB를 정지하고 데이터 볼륨은 유지합니다. 볼륨을 삭제하면 저장된 데이터도 삭제됩니다.

## ▶ 실행 방법

**백엔드:** DB를 실행한 뒤 별도 PowerShell 창에서 실행합니다. 서버가 저장소 루트의 `.env`를 읽습니다.

```powershell
cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

**프런트엔드:** Node.js 설치 후 저장소 루트에서 실행합니다.

```powershell
npm ci
npm run dev
```

브라우저에서 Vite가 안내하는 주소(기본 `http://localhost:5173`)를 엽니다. 개발 환경의 `/api` 요청은 `127.0.0.1:8080`으로 전달됩니다. 서버와 DB를 함께 실행하면 시간표에서 가상 학생의 수강 강좌를 확인할 수 있습니다. 상세 API는 [개발 환경 안내](docs/DEVELOPMENT.md)를 확인하세요.

### Git Bash 실행

저장소 루트에서 환경 파일을 만듭니다. `.env`가 이미 있으면 복사하지 않습니다.

```bash
cp -n .env.example .env
```

`.env`에 비밀번호 두 개를 입력한 다음 `docker compose up -d`를 실행합니다.

별도 Git Bash 창에서 백엔드를 실행합니다.

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

또 다른 창에서 저장소 루트로 이동해 `npm ci` 후 `npm run dev`를 실행합니다.

개발용 시간표는 기본적으로 `DEMO001`을 조회합니다. 별도의 로컬 학생 번호를 사용하려면 저장소 루트에 Git에 포함되지 않는 `.env.local`을 만들고 `VITE_DEV_STUDENT_NO=학생번호`를 입력한 뒤 프런트 서버를 다시 시작합니다. 이 값은 브라우저에 노출되므로 비밀번호나 비밀값을 넣지 마세요. 해당 학생과 수강 데이터는 각자의 로컬 DB에 별도로 있어야 합니다.

## 🌿 브랜치 운영

개발 작업은 `develop`에서 기능별 브랜치를 만들어 진행하고, PR로 `develop`에 합친 뒤 `main`에 반영하는 방식을 사용합니다. 저장소의 기본 브랜치 및 병합 권한은 저장소 관리자 설정이 필요합니다.

| 용도 | 이름 예시 | 포함할 작업 |
|---|---|---|
| 기능 개발 | `feature/timetable/grid` | 관련 화면, API, 서버와 필요한 DB 변경 |
| 공통 뼈대 | `feature/common/foundation` | 공통 프런트·서버·DB 설정 |
| 문서 정리 | `docs/readme-filetree` | README, 파일 트리와 개발 안내 |
| 수정 | `fix/timetable/layout` | 해당 기능의 오류 수정 |

```bash
git switch develop
git pull origin develop
git switch -c feature/timetable/grid
```

작업 후 커밋하고 원격 브랜치를 push한 다음 GitHub에서 PR을 생성합니다. `main`과 `develop`에는 현재 PR과 승인 1건이 필요한 규칙이 적용되어 있습니다. 두 사람만 병합하도록 제한하는 설정과 `develop` 기본 브랜치 전환은 관리자 확인이 필요합니다.
