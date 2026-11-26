import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  checkIn,
  getDemoAttendance,
  getDemoTimetable,
  getMyAttendance,
  getMyTimetable,
} from '../api/apiClient.js';
import { useAuth } from '../auth/useAuth.js';
import { toCourseSchedule, toSessionAttendance } from '../domain/apiMappers.js';
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_UI } from '../domain/attendance.js';
import { DELIVERY_TYPE } from '../domain/timetable.js';
import { groupTimetableRows } from '../domain/timetableMapper.js';

const WEEKDAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

// 이름 가운데 글자 마스킹 (예: 유다연 -> 유 * 연)
function maskDisplayName(name) {
  if (!name) return '';
  if (name.length === 2) return `${name[0]} *`;
  if (name.length >= 3) return `${name[0]} * ${name[name.length - 1]}`;
  return name;
}

const pad = (n) => String(n).padStart(2, '0');
const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toHHMM = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const timeOf = (iso) => (iso ? toHHMM(new Date(iso)) : '');
const isoWeekday = (d) => (d.getDay() === 0 ? 7 : d.getDay());

// 3~8월은 1학기, 9~2월은 2학기 (1·2월은 전년도 2학기)
function currentTerm(d) {
  const month = d.getMonth() + 1;
  if (month >= 3 && month <= 8) return { year: d.getFullYear(), term: '1' };
  return { year: month <= 2 ? d.getFullYear() - 1 : d.getFullYear(), term: '2' };
}

async function loadDashboard(session, today) {
  const { year, term } = currentTerm(today);
  const isDev = session.mode === 'dev';
  const [attendance, timetable] = await Promise.allSettled(
    isDev
      ? [getDemoAttendance(session.studentNo), getDemoTimetable(session.studentNo, year, term)]
      : [getMyAttendance(session.accessToken), getMyTimetable(session.accessToken, year, term)],
  );
  if (attendance.status === 'rejected') throw attendance.reason;
  const courses =
    timetable.status === 'fulfilled'
      ? isDev
        ? groupTimetableRows(timetable.value)
        : timetable.value.map(toCourseSchedule)
      : [];
  return { sessions: attendance.value.map(toSessionAttendance), courses };
}

/**
 * 오늘의 강의 목록: 출결 회차(class_sessions) + 회차 미등록 시간표 슬롯을 합쳐 시작 시각순으로 정렬합니다.
 */
function buildTodayItems(sessions, courses, today) {
  const todayKey = toDateKey(today);
  const weekday = isoWeekday(today);
  const courseById = new Map(courses.map((c) => [c.offering_id, c]));
  const items = [];

  for (const s of sessions.filter((s) => s.session_date === todayKey)) {
    const course = courseById.get(s.offering_id);
    if (course?.delivery_type === DELIVERY_TYPE.CYBER) continue; // 사이버 강의는 홈에서 제외
    const start = timeOf(s.starts_at);
    const slot =
      course?.slots.find((sl) => sl.weekday === weekday && sl.start_time?.slice(0, 5) === start) ??
      course?.slots.find((sl) => sl.weekday === weekday);
    items.push({ key: `s-${s.session_id}`, session: s, course, course_name: s.course_name, room: slot?.room, start, end: timeOf(s.ends_at) });
  }

  const withSession = new Set(items.map((i) => i.session.offering_id));
  for (const course of courses) {
    if (course.delivery_type === DELIVERY_TYPE.CYBER || withSession.has(course.offering_id)) continue;
    for (const slot of course.slots.filter((sl) => sl.weekday === weekday)) {
      items.push({
        key: `c-${course.offering_id}-${slot.slot_id}`,
        session: null,
        course,
        course_name: course.course_name,
        room: slot.room,
        start: slot.start_time?.slice(0, 5) ?? '',
        end: slot.end_time?.slice(0, 5) ?? '',
      });
    }
  }
  return items.sort((a, b) => a.start.localeCompare(b.start));
}

const TOTAL_WEEKS = 15;

function inCheckinWindow(session, now) {
  return new Date(session.checkin_open_at) <= now && now <= new Date(session.checkin_close_at);
}

// 목록 오른쪽 상태 아이콘: 출석전 회색 ✅ / 출석 초록 ✅ / 지각 노란 ✅ / 결석 빨간 ❌
const STATUS_ICON = {
  [ATTENDANCE_STATUS.PENDING]: { mark: 'check', box: 'bg-gray-300' },
  [ATTENDANCE_STATUS.PRESENT]: { mark: 'check', box: 'bg-[#16a34a]' },
  [ATTENDANCE_STATUS.LATE]: { mark: 'check', box: 'bg-[#eab308]' },
  [ATTENDANCE_STATUS.ABSENT]: { mark: 'cross', box: 'bg-[#dc2626]' },
};

function StatusIcon({ status }) {
  const icon = STATUS_ICON[status ?? ATTENDANCE_STATUS.PENDING];
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded ${icon.box} text-white`}
      title={ATTENDANCE_STATUS_UI[status ?? ATTENDANCE_STATUS.PENDING].label}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
        <path d={icon.mark === 'check' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} />
      </svg>
    </span>
  );
}

// 펼침 패널 버튼: 기본 회색, 출석체크·인증출석 성공 시 초록, 중간·퇴실체크 시 빨강
const CHECK_BUTTONS = [
  { key: 'attend', label: '출석체크', color: 'green' },
  { key: 'mid', label: '중간체크', color: 'red' },
  { key: 'exit', label: '퇴실체크', color: 'red' },
  { key: 'auth', label: '인증출석', color: 'green' },
];

const CHECK_STYLE = {
  gray: { box: 'bg-white border-gray-300 text-gray-300', label: 'text-white' },
  green: { box: 'bg-[#16a34a] border-[#16a34a] text-white', label: 'text-[#166534]' },
  red: { box: 'bg-[#dc2626] border-[#dc2626] text-white', label: 'text-[#991b1b]' },
};

function CheckPanel({ item, marks, checking, onCheck }) {
  const { session } = item;
  return (
    <div className="border-t border-gray-300">
      <div className="bg-[#555555] text-white px-4 py-1.5 text-[12px] font-bold flex items-center gap-6">
        <span>출석 : {session ? `${timeOf(session.checkin_open_at)} ~ ${timeOf(session.checkin_close_at)}` : '-'}</span>
        <span>지각 : {session ? `${timeOf(session.checkin_close_at)} ~ ${timeOf(session.ends_at)}` : '-'}</span>
      </div>
      <div className="bg-[#cccccc] px-3 py-4 grid grid-cols-4 gap-2 text-center">
        {CHECK_BUTTONS.map((btn) => {
          const style = CHECK_STYLE[marks[btn.key] ? btn.color : 'gray'];
          return (
            <button
              key={btn.key}
              type="button"
              disabled={checking}
              onClick={() => onCheck(item, btn)}
              className="flex flex-col items-center justify-center gap-1.5 py-1 group disabled:opacity-60"
            >
              <span className={`w-8 h-8 rounded border-2 flex items-center justify-center shadow-sm transition-transform group-active:scale-95 ${style.box}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className={`text-[13px] font-bold tracking-tight ${style.label}`}>{btn.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const { user, session: auth, isDevSession, handleApiError } = useAuth();

  // 현재 날짜/시간 (1초 단위 갱신)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayKey = toDateKey(now);
  const [data, setData] = useState({ state: 'loading', sessions: [], courses: [] });
  const [expandedKey, setExpandedKey] = useState(null);
  const [checking, setChecking] = useState(false);
  const [localMarks, setLocalMarks] = useState({}); // 중간·퇴실·인증 버튼 표시 (화면에서만 유지)
  const [message, setMessage] = useState(null);

  // 진입 즉시(팝업·과목 선택 없이) 오늘 강의와 출결 상태를 불러옵니다. 날짜가 바뀌면 다시 조회합니다.
  useEffect(() => {
    let active = true;
    loadDashboard(auth, new Date(`${todayKey}T00:00:00`))
      .then((loaded) => active && setData({ state: 'ready', ...loaded }))
      .catch((error) => {
        if (!active) return;
        handleApiError(error);
        setData({ state: 'error', sessions: [], courses: [] });
      });
    return () => {
      active = false;
    };
  }, [auth, todayKey, handleApiError]);

  const items = useMemo(
    () => buildTodayItems(data.sessions, data.courses, new Date(`${todayKey}T00:00:00`)),
    [data.sessions, data.courses, todayKey],
  );

  // 주차는 날짜 계산이 아닌 DB의 week_no 사용 (오늘까지의 가장 최근 회차)
  const weekNo = useMemo(() => {
    const past = data.sessions.filter((s) => s.session_date <= todayKey);
    return past.length ? past[past.length - 1].week_no : null;
  }, [data.sessions, todayKey]);

  const marksOf = (item) => {
    const status = item.session?.status;
    const attended = status === ATTENDANCE_STATUS.PRESENT || status === ATTENDANCE_STATUS.LATE;
    const local = localMarks[item.key] ?? {};
    return { ...local, attend: local.attend || (attended && !local.auth) };
  };

  const handleCheck = useCallback(
    async (item, btn) => {
      setMessage(null);
      // 중간·퇴실체크: 서버 저장 기능이 없어 화면 표시만 토글
      if (btn.color === 'red') {
        setLocalMarks((prev) => ({ ...prev, [item.key]: { ...prev[item.key], [btn.key]: !prev[item.key]?.[btn.key] } }));
        return;
      }
      const { session } = item;
      if (!session) return setMessage({ key: item.key, text: '출석 회차가 등록되지 않은 강의입니다.' });
      const status = session.status ?? ATTENDANCE_STATUS.PENDING;
      if (status !== ATTENDANCE_STATUS.PENDING) return setMessage({ key: item.key, text: '이미 출결 처리된 강의입니다.' });
      if (!inCheckinWindow(session, new Date())) return setMessage({ key: item.key, text: '출석 가능 시간이 아닙니다.' });
      if (isDevSession) return setMessage({ key: item.key, text: '개발 모드 로그인에서는 출석 인증을 할 수 없습니다.' });

      setChecking(true);
      try {
        const result = await checkIn(auth.accessToken, session.session_id);
        setData((prev) => ({
          ...prev,
          sessions: prev.sessions.map((s) => (s.session_id === session.session_id ? { ...s, status: result.status } : s)),
        }));
        setLocalMarks((prev) => ({ ...prev, [item.key]: { ...prev[item.key], [btn.key]: true } }));
      } catch (error) {
        handleApiError(error);
        setMessage({ key: item.key, text: error.message || '출석 인증에 실패했습니다.' });
      } finally {
        setChecking(false);
      }
    },
    [auth, isDevSession, handleApiError],
  );

  return (
    <div className="min-h-full bg-[#e9ecef] flex flex-col font-sans select-none">
      {/* 1. 사용자 정보 & 실시간 날짜/주차 */}
      <section className="bg-white py-5 px-4 text-center border-b border-gray-200">
        <h2 className="text-[19px] font-extrabold text-gray-900 tracking-tight">
          {maskDisplayName(user?.display_name)} [{user?.student_no}] {WEEKDAY_NAMES[now.getDay()]}
        </h2>
        <p className="text-[14px] text-gray-600 font-medium mt-1.5">
          {todayKey} ({toHHMM(now)}:{pad(now.getSeconds())}) {weekNo ? `${weekNo}주차/${TOTAL_WEEKS}주` : ''}
        </p>
      </section>

      {/* 2. 강의시간표 구분 바 */}
      <div className="bg-[#0b338f] text-white text-center py-2.5 text-[14px] font-bold tracking-tight shadow-sm">
        강의시간표 ({todayKey})
      </div>

      {/* 3. 오늘의 강의 목록 (불러오는 중·오류·강의 없음은 공백) */}
      <div className="flex-1 divide-y divide-gray-200">
        {data.state === 'ready' &&
          items.map((item) => {
            const isExpanded = expandedKey === item.key;
            return (
              <div key={item.key} className="bg-white">
                <button
                  type="button"
                  onClick={() => setExpandedKey((prev) => (prev === item.key ? null : item.key))}
                  aria-expanded={isExpanded}
                  className="w-full text-left px-4 py-4 flex justify-between items-start active:bg-gray-50 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-[17px] font-extrabold text-gray-900 leading-snug">{item.course_name}</h3>
                    <p className="text-[13px] text-gray-600 font-medium">{item.course?.instructor_name ?? ''}</p>
                    <p className="text-[13px] text-gray-600">
                      {item.room ?? ''}
                      {item.course?.course_code && ` (${item.course.course_code})`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5 shrink-0">
                    <span className="text-[13px] font-bold text-[#b91c1c]">일반강의</span>
                    <div className="h-5 flex items-center">{item.session && <StatusIcon status={item.session.status} />}</div>
                    <span className="text-[14px] font-bold text-gray-900 tracking-tight">
                      {item.start}~{item.end}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <>
                    <CheckPanel item={item} marks={marksOf(item)} checking={checking} onCheck={handleCheck} />
                    {message?.key === item.key && (
                      <p role="alert" className="bg-[#cccccc] text-[#991b1b] text-[12px] font-bold text-center pb-3 -mt-1">
                        {message.text}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
