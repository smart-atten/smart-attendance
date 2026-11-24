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
React 화면 → Spring Boot REST API → MySQL
                          ↑
          강좌 목록 + 가상 학생·수강 데이터
```

강좌 목록 엑셀의 원본 2,903건은 `course_catalog_import`에 보관하고, 학생과 수강 정보는 별도로 만든 가상 데이터를 사용합니다. 학기·교시 시각이 확정되기 전까지 원본 목록을 실제 시간표로 자동 변환하지 않습니다.

## 📁 폴더 구조

```text
smart-attendance/
├── src/                          React 애플리케이션
│   ├── api/                      공통 API 요청 함수
│   ├── components/               공통 메뉴 등 UI
│   ├── domain/                   출결·강좌·게시글·사용자 공통 정의
│   ├── pages/                    담당 영역별 화면
│   ├── App.jsx                   공통 레이아웃과 라우팅
│   └── main.jsx                  프런트엔드 진입점
├── public/                       정적 파일
├── backend/                      Spring Boot 서버
│   ├── pom.xml                   서버 빌드와 의존성
│   └── src/main/
│       ├── java/kr/ac/bu/attendance/  API와 서버 진입점
│       └── resources/            DB 설정, 스키마, 가상 데이터
├── docs/                         개발 환경 및 API 안내
├── compose.yaml                  로컬 MySQL 설정
├── .env.example                  로컬 DB 환경 변수 예시
└── package.json                  프런트엔드 스크립트와 의존성
```

세부 실행 방법과 개발용 API는 [개발 환경 안내](docs/DEVELOPMENT.md)를 확인하세요.

| 영역 | 프런트엔드 | 백엔드 |
|---|---|---|
| 공통 · 홈 | `src/components/Navbar.jsx`, `src/pages/Home.jsx`, `src/domain/` | `ApiContracts.java`, `ApiErrors.java`, `EndpointSkeleton.java` |
| 시간표 · 출결 | `src/pages/Timetable.jsx`, `src/pages/TimetablePage.jsx`, `src/domain/timetable*.js` | `DevelopmentTimetableController.java`, `EndpointSkeleton.java`의 시간표·출결 경로 |
| Q&A · FAQ | `src/pages/QnA.jsx` | `EndpointSkeleton.java`의 게시글 경로 |
| 공지 · 설정 · 더보기 | `src/pages/Notice.jsx`, `Settings.jsx`, `More.jsx` | `EndpointSkeleton.java`의 게시글·설정·알림 경로 |
| 로그인 | `src/api/apiClient.js` | `backend/src/main/java/kr/ac/bu/attendance/auth/` |

백엔드의 기능별 엔드포인트는 현재 `EndpointSkeleton.java`에 모인 미구현 뼈대입니다. 담당 기능을 구현할 때 기능별 컨트롤러와 서비스·저장소로 분리합니다.

## 🧰 개발 환경 준비

| 도구 | 설치 기준 | 확인 명령 |
|---|---|---|
| Node.js · npm | Node.js 24, npm 11 | `node -v`, `npm -v` |
| Java | JDK 21 | `java -version` |
| Maven | 3.9 계열 (확인 환경 3.9.16) | `mvn -v` |
| Docker Desktop · Compose | Docker Desktop 실행, Docker Compose v2 | `docker --version`, `docker compose version` |
| MySQL | Docker 이미지 `mysql:8.0` 사용 | `docker compose ps` |

명령은 Windows PowerShell 기준입니다. 각 팀원의 PC에서 저장소를 받은 뒤 저장소 폴더를 열고 실행합니다. Node.js는 React 개발 서버와 빌드에 필요하며, JDK와 Maven은 Spring Boot 서버에 필요합니다.

## 🐳 로컬 DB 실행

Docker Desktop을 실행하고 저장소 루트에서 최초 한 번 환경 파일을 만든 뒤 DB를 시작합니다.

```powershell
Copy-Item .env.example .env
docker compose up -d
```

`.env` 값은 **로컬 개발 전용**이며 Git에 올리지 않습니다. DB는 `localhost:3307`, DB 이름과 계정은 `attendance`입니다. 3307 포트가 이미 사용 중이면 `compose.yaml`과 백엔드의 DB 주소를 함께 조정해야 합니다.

처음 생성한 빈 DB에는 스키마, 가상 데이터, 강좌 원본 목록이 순서대로 자동 적용됩니다. 기존 볼륨에는 자동으로 다시 실행되지 않으며, 각 PC의 DB는 서로 동기화되지 않습니다. `docker compose stop`은 DB를 정지하고 데이터 볼륨은 유지합니다. 볼륨을 삭제하면 저장된 데이터도 삭제됩니다.

## ▶ 실행 방법

**백엔드:** DB를 실행한 뒤 별도 PowerShell 창에서 아래 환경 변수를 설정합니다. `DB_PASSWORD`는 `.env`의 값과 일치해야 합니다. Compose의 `.env`는 서버 프로세스에 자동 전달되지 않습니다.

```powershell
$env:DB_URL='jdbc:mysql://localhost:3307/attendance?serverTimezone=Asia/Seoul&characterEncoding=UTF-8'
$env:DB_USERNAME='attendance'
$env:DB_PASSWORD='change-this-local-password'
$env:SPRING_PROFILES_ACTIVE='dev'
cd backend
mvn spring-boot:run
```

**프런트엔드:** Node.js 설치 후 저장소 루트에서 실행합니다.

```powershell
npm ci
npm run dev
```

브라우저에서 Vite가 안내하는 주소(기본 `http://localhost:5173`)를 엽니다. 개발 환경의 `/api` 요청은 `127.0.0.1:8080`으로 전달됩니다. 서버와 DB를 함께 실행하면 시간표에서 가상 학생의 수강 강좌를 확인할 수 있습니다. 상세 API는 [개발 환경 안내](docs/DEVELOPMENT.md)를 확인하세요.

### Git Bash 실행

저장소 루트에서 DB를 준비합니다. `.env`가 이미 있으면 복사하지 않습니다.

```bash
cp -n .env.example .env
docker compose up -d
```

별도 Git Bash 창에서 백엔드를 실행합니다. DB 비밀번호를 변경했다면 `.env`와 같은 값으로 설정합니다.

```bash
export DB_URL='jdbc:mysql://localhost:3307/attendance?serverTimezone=Asia/Seoul&characterEncoding=UTF-8'
export DB_USERNAME='attendance'
export DB_PASSWORD='change-this-local-password'
export SPRING_PROFILES_ACTIVE='dev'
cd backend
mvn spring-boot:run
```

또 다른 창에서 저장소 루트로 이동해 `npm ci` 후 `npm run dev`를 실행합니다.

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
