# 개발 환경 및 API 안내

## DB 준비

저장소 루트에서 `.env.example`을 `.env`로 복사한 후 `DB_PASSWORD`와 `MYSQL_ROOT_PASSWORD`를 각자 설정하고 `docker compose up -d`를 실행합니다. `.env`는 Git에 올리지 않습니다. 두 값은 다르게 설정하고 영문자·숫자로만 구성합니다. 변경한 비밀번호는 기존 MySQL 볼륨에 자동 적용되지 않습니다.

처음 생성한 빈 MySQL 볼륨에는 `schema.sql`, `demo-data.sql`, `course_catalog.sql`이 자동으로 순서대로 적용됩니다. 기존 볼륨에는 적용되지 않으며 자동 마이그레이션은 지원하지 않습니다. 데이터가 있는 볼륨을 삭제하지 마세요. 기존 개발 DB에 강좌 목록을 추가하려면:

```bash
docker compose exec -T mysql sh -c 'mysql --default-character-set=utf8mb4 -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' < backend/src/main/resources/course_catalog.sql
```

가상 학생은 `DEMO001`~`DEMO004`입니다. 한 강좌의 학기, 시간과 수강 관계는 임의의 예시이며 로그인 계정이 아닙니다. `course_catalog_import`는 엑셀 원본 목록이며 수강 관계와 실제 시간표에 자동 반영되지 않습니다. 교시별 시각과 학사 일정은 별도로 정해야 합니다.

## 서버 실행

백엔드에서 저장소 루트의 `.env`를 읽습니다.

```powershell
cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

## API

| 경로 | 상태 |
|---|---|
| `POST /api/auth/login` | 501 미구현. 요청 `{ "studentNo": "...", "password": "..." }`, 성공 응답 예정 `{ "accessToken": "...", "tokenType": "Bearer", "expiresIn": 3600 }` (`expiresIn`은 초). |
| `GET /api/dev/students/DEMO001/timetable?year=2026&term=2` | 개발용 DB 조회 예시. 인증이 없으므로 로컬 더미 데이터에만 사용합니다. 하나의 강좌에 시간 슬롯이 여럿이면 행도 여러 개입니다. |
| `GET /api/me`, `/api/me/timetable`, `/api/me/attendance` | 501 미구현 |
| `POST /api/attendance/{sessionId}/check-in` | 501 미구현 |
| `GET /api/posts`, `GET /api/posts/{postId}`, `POST /api/posts` | 501 미구현 |
| `GET /api/notifications`, `PATCH /api/me/settings` | 501 미구현 |

`src/api/apiClient.js`는 공통 요청 함수입니다. 개발 모드의 시간표 화면은 가상 학생 `DEMO001`의 2026년 2학기 데이터를 조회해 강좌별 슬롯으로 변환합니다. 이 연결은 로그인 기능이 아닌 개발용 예시이며 프로덕션 빌드에서는 비활성화됩니다. 로그인, 권한, 출석 판정·저장, 게시글과 알림은 아직 구현하지 않았습니다.

`PasswordService.hashPassword`, `matchesPassword`는 BCrypt로 학생 비밀번호를 해시하고 검증합니다. `users.password_hash`에 해시를 저장하며 가상 계정의 `UNUSABLE` 값은 로그인할 수 없는 자리 표시자입니다. MySQL 접속 비밀번호는 서버가 DB에 접속할 때 원본이 필요하므로 해시로 대체할 수 없으며 `.env`와 환경 변수로 관리합니다. 로그인 토큰 발급과 검증을 구현하기 전에는 `/api/me/timetable`이 501을 반환합니다. 인증 구현 시 `Authorization: Bearer <accessToken>`을 검증한 뒤 토큰의 사용자 ID로 본인 수강 정보만 조회해야 합니다.

실제 서비스 API의 요청·응답 필드는 `ApiContracts.java`의 camelCase를 따릅니다. 예를 들어 시간표는 `offeringId`, `courseCode`, `sectionCode`, `slots`를 반환하며 각 `slots`에 `weekday`, `startTime`, `endTime`, `room`을 담습니다. 게시글 작성은 `{ "postType": "QUESTION", "title": "...", "body": "...", "anonymous": false }`를 사용합니다. 설정 변경은 `{ "pushEnabled": true }`를 사용합니다. 개발용 시간표 API의 snake_case 응답은 별도이며 정식 API 계약과 다릅니다. 정식 경로는 모두 구현 전으로 501을 반환하고 인증 보호가 아직 적용되지 않았습니다.

스키마는 설계서 1.2 기반의 초안입니다. 학부·학과와 학점·시수는 현재 설계에 직접 대응하는 필드가 없으며, 팀 합의 후 반영해야 합니다. 과목코드와 분반은 앞자리 0을 보존하는 문자열입니다. 학년도·학기, 수업 날짜, 교시별 시각, 휴강·보강과 `사` 등 원본 시간표 표기의 의미도 확인이 필요합니다.
