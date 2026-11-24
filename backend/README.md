# 백엔드 구조

Spring Boot 서버와 MySQL을 사용합니다. 정식 API는 로그인·토큰 인증과 서비스 연결을 구현하기 전까지 501을 반환합니다.

| 담당 | 기능 | 주요 코드 |
|---|---|---|
| 유다연 | 공통·홈 | `StudentController`, `StudentService`, `ApiContracts` |
| 이은아 | 시간표·출결 | `TimetableController`, `TimetableService`, `StudentDataRepository`, `DevelopmentTimetableController` |
| 김건우 | Q&A·FAQ | `PostController`, `PostService`, `PostRepository` |
| 박지연 | 공지·설정·더보기 | `PostController`, `StudentController`, `NotificationController` 및 각 서비스·저장소 |
| 미정 | 로그인 | `auth/` |

## 서버 파일 트리

```text
📁 backend/
├── 📁 src/
│   ├── 📁 main/
│   │   ├── 📁 java/
│   │   │   └── 📁 kr/
│   │   │       └── 📁 ac/
│   │   │           └── 📁 bu/
│   │   │               └── 📁 attendance/
│   │   │                   ├── 📁 auth/ — 로그인 · 담당 미정
│   │   │                   │   ├── 📄 AuthController.java
│   │   │                   │   ├── 📄 AuthService.java
│   │   │                   │   ├── 📄 PasswordConfig.java
│   │   │                   │   ├── 📄 PasswordService.java
│   │   │                   │   └── 📄 UserCredentialsRepository.java
│   │   │                   ├── 📄 ApiContracts.java
│   │   │                   ├── 📄 ApiErrors.java
│   │   │                   ├── 📄 AttendanceApplication.java
│   │   │                   ├── 📄 DevelopmentTimetableController.java — 개발용 조회 · 이은아
│   │   │                   ├── 📄 NotificationController.java — 알림 API · 박지연
│   │   │                   ├── 📄 NotificationRepository.java — 알림 DB 접근 · 박지연
│   │   │                   ├── 📄 NotificationService.java — 알림 서비스 · 박지연
│   │   │                   ├── 📄 PendingFeature.java
│   │   │                   ├── 📄 PostController.java — 게시판 API · 김건우/박지연
│   │   │                   ├── 📄 PostRepository.java — 게시판 DB 접근 · 김건우/박지연
│   │   │                   ├── 📄 PostService.java — 게시판 서비스 · 김건우/박지연
│   │   │                   ├── 📄 StudentController.java — 학생·설정 API · 공통/박지연
│   │   │                   ├── 📄 StudentDataRepository.java — 학생·수강·출결 DB 조회 · 공통/이은아
│   │   │                   ├── 📄 StudentService.java — 학생·설정 서비스 · 공통/박지연
│   │   │                   ├── 📄 TimetableController.java — 시간표·출결 API · 이은아
│   │   │                   └── 📄 TimetableService.java — 시간표·출결 서비스 · 이은아
│   │   └── 📁 resources/
│   │       ├── 📄 application-dev.properties
│   │       ├── 📄 application.properties
│   │       ├── 📄 course_catalog.sql — 강좌 원본
│   │       ├── 📄 demo-data.sql — 테스트 데이터
│   │       └── 📄 schema.sql — DB 테이블 구조
│   └── 📁 test/
│       └── 📁 java/
│           └── 📁 kr/
│               └── 📁 ac/
│                   └── 📁 bu/
│                       └── 📁 attendance/
│                           ├── 📁 auth/ — 로그인 · 담당 미정
│                           │   └── 📄 PasswordServiceTest.java
│                           └── 📄 DatabaseReadIntegrationTest.java
├── 📄 pom.xml
└── 📄 README.md — 전체 소개·설치·구조
```

## DB와 연결 상태

정식 기능은 `Controller`가 요청을 받고, 같은 기능의 `Service`가 처리한 뒤 `Repository`가 DB에 접근하는 구조로 완성합니다. 현재 대부분의 서비스는 501을 반환하므로 화살표는 개발 시 연결할 경로입니다.

| 담당 | 연결할 서버 파일 | 관련 DB |
|---|---|---|
| 유다연 · 공통·홈 | `StudentController.java` → `StudentService.java` → `StudentDataRepository.java` | `users` |
| 이은아 · 시간표·출결 | `TimetableController.java` → `TimetableService.java` → `StudentDataRepository.java` | `enrollments`, `course_offerings`, `courses`, `schedule_slots`, `class_sessions`, `attendance_records` |
| 김건우 · Q&A·FAQ | `PostController.java` → `PostService.java` → `PostRepository.java` | `posts`, `post_attachments` |
| 박지연 · 공지·설정·더보기 | `PostController.java`, `StudentController.java`, `NotificationController.java` → 각 서비스와 저장소 | `posts`, `users`, `notifications`, `notification_recipients` |
| 담당 미정 · 로그인 | `auth/AuthController.java` → `auth/AuthService.java` → `auth/UserCredentialsRepository.java`, `auth/PasswordService.java` | `users` |

개발용 시간표 조회는 `DevelopmentTimetableController.java`가 DB를 직접 조회합니다. 개발용 출결 조회는 `TimetableService.java`와 `StudentDataRepository.java`를 사용합니다. 로그인 사용자 인증과 정식 서비스 연결은 아직 구현해야 합니다.

`schema.sql`은 테이블 구조, `demo-data.sql`은 가상 계정과 수강, `course_catalog.sql`은 강좌 원본을 담습니다. Docker가 빈 볼륨을 최초 생성할 때 적용하며 기존 DB에는 다시 적용되지 않습니다.

개발 프로필의 학생·시간표·출결 조회만 동작합니다. 개발용 출결 조회는 `GET /api/dev/students/{studentNo}/attendance`이며 인증 없이 로컬 테스트 용도로만 사용합니다. 정식 API, 로그인과 토큰, 출결 저장 및 게시판 권한은 미구현입니다. 저장소 함수는 존재하지만 인증된 사용자와 서비스에 아직 연결되지 않았습니다. API 계약과 실행법은 [프로젝트 README](../README.md)를 참고하세요.
