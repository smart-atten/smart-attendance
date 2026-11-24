#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

mysql_exec() {
  docker compose exec -T mysql sh -c 'exec mysql --default-character-set=utf8mb4 -h 127.0.0.1 -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" "$@"' sh "$@"
}

if ! mysql_exec -N -s -e 'SELECT 1' >/dev/null; then
  printf '%s\n' 'MySQL이 실행 중이고 준비 상태인지 확인하세요: docker compose up -d'
  exit 1
fi

if [ "$(mysql_exec -N -s -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name IN ('users','courses','course_offerings','schedule_slots','enrollments')")" != 5 ]; then
  printf '%s\n' '기본 테이블이 없습니다. 최초 DB 초기화 상태를 확인하세요.'
  exit 1
fi

mysql_exec -e 'CREATE TABLE IF NOT EXISTS db_migrations (version VARCHAR(190) PRIMARY KEY, checksum CHAR(64) NOT NULL, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)'

apply_file() {
  local version="$1" file="$2" checksum existing
  checksum=$(tr -d '\r' < "$file" | sha256sum | cut -d ' ' -f 1)
  existing=$(mysql_exec -N -s -e "SELECT checksum FROM db_migrations WHERE version = '$version'")
  if [ -n "$existing" ]; then
    if [ "$existing" != "$checksum" ]; then
      printf '이미 적용한 파일이 변경되었습니다: %s\n' "$file" >&2
      exit 1
    fi
    printf '이미 적용됨: %s\n' "$version"
    return
  fi
  printf '적용 중: %s\n' "$version"
  mysql_exec < "$file"
  mysql_exec -e "INSERT INTO db_migrations (version, checksum) VALUES ('$version', '$checksum')"
}

for i in 01 02 03 04; do
  apply_file "catalog_$i" "backend/src/main/resources/catalog/course_catalog_$i.sql"
done
apply_file 'demo_timetable_01' 'backend/src/main/resources/demo-timetable.sql'

shopt -s nullglob
for file in backend/src/main/resources/db-updates/[0-9]*.sql; do
  version=$(basename "$file" .sql)
  if [[ ! "$version" =~ ^[0-9][0-9][0-9]_[a-z0-9_]+$ ]]; then
    printf 'DB 변경 파일 이름 오류: %s\n' "$file" >&2
    exit 1
  fi
  apply_file "$version" "$file"
done
printf '%s\n' '공통 DB 변경 적용 완료'

