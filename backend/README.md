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
backend/
  pom.xml
  src/main/java/kr/ac/bu/attendance/
    ApiContracts.java
    ApiErrors.java
    AttendanceApplication.java
    auth/AuthController.java
    auth/AuthService.java
    auth/PasswordConfig.java
    auth/PasswordService.java
    auth/UserCredentialsRepository.java
    DevelopmentTimetableController.java
    NotificationController.java
    NotificationRepository.java
    NotificationService.java
    PendingFeature.java
    PostController.java
    PostRepository.java
    PostService.java
    StudentController.java
    StudentDataRepository.java
    StudentService.java
    TimetableController.java
    TimetableService.java
  src/main/resources/
    application.properties
    application-dev.properties
    schema.sql
    demo-data.sql
    course_catalog.sql
  src/test/java/kr/ac/bu/attendance/
    DatabaseReadIntegrationTest.java
    auth/PasswordServiceTest.java
```

## DB와 연결 상태

`schema.sql`은 테이블 구조, `demo-data.sql`은 가상 계정과 수강, `course_catalog.sql`은 강좌 원본을 담습니다. Docker가 빈 볼륨을 최초 생성할 때 적용하며 기존 DB에는 다시 적용되지 않습니다.

개발 프로필의 학생·시간표·출결 조회만 동작합니다. 개발용 출결 조회는 `GET /api/dev/students/{studentNo}/attendance`이며 인증 없이 로컬 테스트 용도로만 사용합니다. 정식 API, 로그인과 토큰, 출결 저장 및 게시판 권한은 미구현입니다. 저장소 함수는 존재하지만 인증된 사용자와 서비스에 아직 연결되지 않았습니다. API 계약과 실행법은 [프로젝트 README](../README.md)를 참고하세요.
