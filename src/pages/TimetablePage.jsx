import { useEffect, useState } from "react";
import { getDemoStudent, getDemoTimetable } from "../api/apiClient.js";
import { groupTimetableRows } from "../domain/timetableMapper.js";
import Timetable from "./Timetable.jsx";

export default function TimetablePage() {
  const [result, setResult] = useState({ state: "loading", courses: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let active = true;
    Promise.all([getDemoStudent("DEMO001"), getDemoTimetable("DEMO001", 2026, "2")])
      .then(([student, rows]) => {
        if (active) setResult({ state: "ready", student, courses: groupTimetableRows(rows) });
      })
      .catch(() => {
        if (active) setResult({ state: "error", courses: [] });
      });
    return () => { active = false; };
  }, [attempt]);

  if (!import.meta.env.DEV) {
    return <p className="p-6">시간표 조회 기능을 준비 중입니다.</p>;
  }
  if (result.state === "loading") {
    return <p className="p-6" role="status">시간표를 불러오는 중입니다.</p>;
  }
  if (result.state === "error") {
    return (
      <div className="p-6" role="alert">
        <p>시간표를 불러오지 못했습니다. 개발 서버와 데이터베이스를 확인해 주세요.</p>
        <button className="mt-3 rounded bg-blue-700 px-4 py-2 text-white" onClick={() => {
          setResult({ state: "loading", courses: [] });
          setAttempt((value) => value + 1);
        }}>다시 시도</button>
      </div>
    );
  }
  return <Timetable courses={result.courses} student={result.student} />;
}
