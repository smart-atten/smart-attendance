import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DELIVERY_TYPE, WEEKDAY, WEEKDAY_LABELS } from "../domain/timetable.js";
import { layoutDay, timetableRange } from "../domain/timetableScale.js";

const weekdays = [
  WEEKDAY.MONDAY,
  WEEKDAY.TUESDAY,
  WEEKDAY.WEDNESDAY,
  WEEKDAY.THURSDAY,
  WEEKDAY.FRIDAY,
];

function formatTime(time) {
  return time.slice(0, 5);
}

function courseLabel(course) {
  return `${course.course_name}-${course.section_code}`;
}

function StudentInfo({ student }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const weekday = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', weekday: 'long' }).format(now);
  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const time = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  return (
    <div className="bg-white px-4 py-4 text-center">
      <p className="text-base font-bold text-gray-900">{student.display_name} [{student.student_no}] {weekday}</p>
      <p className="mt-1 text-sm text-gray-600">{date} ({time})</p>
    </div>
  );
}

function scheduleLabel(course) {
  if (course.slots.length === 0) {
    return course.delivery_type === DELIVERY_TYPE.CYBER
      ? "사이버 강의"
      : "등록된 시간이 없어요";
  }

  return course.slots
    .map(
      ({ weekday, start_time, end_time }) =>
        `${WEEKDAY_LABELS[weekday]} ${formatTime(start_time)}~${formatTime(end_time)}`,
    )
    .join(" / ");
}

function CourseList({ courses, onSelect }) {
  if (courses.length === 0) {
    return (
      <p className="bg-white px-4 py-10 text-center text-sm text-gray-600">
        표시할 시간표가 없어요.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[#e5e8ef] border-y border-[#e5e8ef] bg-white">
      {courses.map((course) => {
        const rooms = [
          ...new Set(course.slots.map((slot) => slot.room).filter(Boolean)),
        ];

        return (
          <li key={course.offering_id}>
            <button
              type="button"
              onClick={() => onSelect(course.offering_id)}
              className="flex w-full flex-wrap items-start justify-between gap-x-4 gap-y-1 px-4 py-3 text-left hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700"
            >
              <span className="min-w-0 flex-1 break-words">
                <span className="block text-sm font-bold">
                  {courseLabel(course)}
                </span>
                {rooms.length > 0 && (
                  <span className="mt-1 block text-xs text-gray-600">
                    {rooms.join(", ")}
                  </span>
                )}
              </span>

              <span className="max-w-full break-words text-right text-xs">
                {course.instructor_name && (
                  <span className="block text-gray-600">
                    {course.instructor_name}
                  </span>
                )}
                <span className="mt-1 block font-semibold">
                  {scheduleLabel(course)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function WeeklyTimetable({ courses }) {
  const blocks = courses.flatMap((course) =>
    course.slots.map((slot) => ({ course, slot })),
  );
  const days = [
    ...new Set([...weekdays, ...blocks.map(({ slot }) => slot.weekday)]),
  ].sort((a, b) => a - b);
  const { start, end } = timetableRange(blocks.map(({ slot }) => slot));
  const pixelsPerHour = 56;
  const height = ((end - start) / 60) * pixelsPerHour;
  const hours = Array.from({ length: (end - start) / 60 + 1 }, (_, index) => start + index * 60);
  const coursesWithoutSlots = courses.filter(
    (course) => course.slots.length === 0,
  );

  return (
    <div className="bg-[#141414] p-2 text-white">
      <div className="overflow-hidden rounded-xl border border-[#333]">
          <div className="overflow-x-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `3rem repeat(${days.length}, minmax(3rem, 1fr))`,
              }}
            >
              <div className="border-b border-r border-[#333]">
                <div className="border-b border-[#333] py-2 text-center text-xs text-gray-300">
                  시간
                </div>
                <div className="relative" style={{ height }}>
                  {hours.map((minutes) => (
                    <span key={minutes} className="absolute left-0 right-0 text-center text-[11px] text-gray-300"
                      style={{ top: ((minutes - start) / 60) * pixelsPerHour, transform: minutes === end ? 'translateY(-100%)' : 'none' }}>
                      {String(Math.floor(minutes / 60)).padStart(2, '0')}:00
                    </span>
                  ))}
                </div>
              </div>

              {days.map((day) => (
                <div
                  key={day}
                  className="min-w-0 border-r border-[#333] last:border-r-0"
                >
                  <div className="border-b border-[#333] py-2 text-center text-xs text-gray-300">
                    {WEEKDAY_LABELS[day]}
                  </div>
                  <div
                    className="relative"
                    style={{
                      height,
                      backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 55px, #333 55px, #333 56px)',
                    }}
                  >
                    {layoutDay(blocks.filter(({ slot }) => slot.weekday === day))
                      .map(({ course, slot, start: blockStart, end: blockEnd, lane, lanes }) => (
                        <div
                          key={`${course.offering_id}-${slot.slot_id}`}
                          className="absolute overflow-auto break-words border border-[#141414] bg-[#244887] p-1 text-[11px] leading-tight"
                          style={{
                            top: ((blockStart - start) / 60) * pixelsPerHour,
                            height: ((blockEnd - blockStart) / 60) * pixelsPerHour,
                            left: `${(lane / lanes) * 100}%`,
                            width: `${100 / lanes}%`,
                          }}
                        >
                          <span className="block font-bold">
                            {course.course_name}
                          </span>
                          {slot.room && (
                            <span className="mt-1 block">{slot.room}</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        {coursesWithoutSlots.length > 0 && (
          <ul className="divide-y divide-[#333]">
            {coursesWithoutSlots.map((course) => (
              <li
                key={course.offering_id}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-3 text-xs text-gray-300"
              >
                <span className="break-words">{courseLabel(course)}</span>
                <span>{scheduleLabel(course)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Timetable({ courses = [], student }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("course");
  const selectedCourse = courses.find(
    (course) => course.offering_id === selectedId,
  );

  function selectCourse(offeringId) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("course", offeringId);
    setSearchParams(nextParams);
  }

  function showList() {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("course");
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <section className="w-full min-w-0 bg-[#f3f5f9]">
      {selectedCourse ? (
        <>
          <WeeklyTimetable courses={courses} />

          {student && <StudentInfo student={student} />}

          <div className="border-y border-[#e5e8ef] bg-white px-4 py-4 text-center">
            <h1 className="break-words text-[15px] font-bold">
              {courseLabel(selectedCourse)}
            </h1>
            <p className="mt-1 text-xs text-gray-600">
              {[selectedCourse.instructor_name, scheduleLabel(selectedCourse)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <button
            type="button"
            onClick={showList}
            className="w-full bg-[#0b42a4] px-4 py-3 text-sm font-bold text-white hover:bg-[#0c318f]"
          >
            ← 요일별 강의 목록
          </button>
        </>
      ) : (
        <>
          {student && <StudentInfo student={student} />}

          <h2 className="bg-[#0b42a4] px-4 py-2.5 text-center text-sm font-bold text-white">
            요일별 강의 시간표
          </h2>
          <CourseList courses={courses} onSelect={selectCourse} />
        </>
      )}
    </section>
  );
}
