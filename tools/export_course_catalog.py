import argparse
from pathlib import Path
import openpyxl


def sql_text(value):
    if value is None:
        return 'NULL'
    return "CONVERT(0x" + str(value).encode('utf-8').hex() + " USING utf8mb4)"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('workbook')
    parser.add_argument('output')
    args = parser.parse_args()
    workbook = openpyxl.load_workbook(args.workbook, read_only=True, data_only=True)
    sheet = workbook.active
    sheet.reset_dimensions()
    rows = sheet.iter_rows(values_only=True)
    headers = next(rows)
    expected = ('No', '구분', '학부', '전공(학과)', '교과목코드', '분반', '교과목명', '학점', '시수', '교수명', '시간표')
    if tuple(headers[:11]) != expected:
        raise ValueError('Unexpected spreadsheet columns')
    output = Path(args.output)
    with output.open('w', encoding='utf-8', newline='\n') as file:
        file.write('CREATE TABLE IF NOT EXISTS course_catalog_import (source_row INT PRIMARY KEY, category VARCHAR(255), faculty VARCHAR(255), major VARCHAR(255), course_code VARCHAR(30) NOT NULL, section_code VARCHAR(20) NOT NULL, course_name VARCHAR(255) NOT NULL, credits VARCHAR(30), hours VARCHAR(30), instructor_name VARCHAR(255), schedule_raw TEXT) CHARACTER SET utf8mb4;\n')
        file.write('START TRANSACTION;\n')
        count = 0
        for row in rows:
            if not row[0]:
                continue
            number = int(row[0])
            fields = ','.join(sql_text(value) for value in row[1:11])
            file.write(f'INSERT INTO course_catalog_import VALUES ({number},{fields}) ON DUPLICATE KEY UPDATE category=VALUES(category),faculty=VALUES(faculty),major=VALUES(major),course_code=VALUES(course_code),section_code=VALUES(section_code),course_name=VALUES(course_name),credits=VALUES(credits),hours=VALUES(hours),instructor_name=VALUES(instructor_name),schedule_raw=VALUES(schedule_raw);\n')
            count += 1
        file.write('COMMIT;\n')
    print(f'{count} rows written to {output}')


if __name__ == '__main__':
    main()
