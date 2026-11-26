import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { ROLE_LABELS } from '../domain/user.js';

// 슬라이드 메뉴 5개 + 하단 톱니바퀴(환경설정)
// COR-001: Pop Quiz, Clicker, TTS, 특강출결조회, 위젯은 포함하지 않음
const MENUS = [
  { path: '/', label: '출석체크 (HOME)' },
  { path: '/timetable', label: '출결조회/시간표' },
  { path: '/qna', label: 'Q&A' },
  { path: '/notice', label: '공지사항' },
  { path: '/more', label: '더보기' },
];

const TITLES = {
  '/': '출석체크(HOME)',
  '/timetable': '출결조회/시간표',
  '/qna': 'Q&A',
  '/notice': '공지사항',
  '/settings': '환경설정',
  '/more': '더보기',
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isDevSession, logout } = useAuth();
  const close = () => setIsOpen(false);

  const handleLogout = () => {
    close();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="bg-[#0b338f] text-white h-14 px-4 flex items-center sticky top-0 z-30 shadow-md">
        <button onClick={() => setIsOpen(true)} className="p-1 -ml-1" aria-label="메뉴 열기">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-base font-bold tracking-tight pr-7">{TITLES[pathname] ?? '스마트출결'}</h1>
      </header>

      {isDevSession && (
        <p className="bg-amber-100 text-amber-800 text-[11px] font-medium text-center py-1">
          개발 모드 로그인 (백엔드 JWT 미구현) · 출석 인증은 서버 구현 후 동작합니다
        </p>
      )}

      {isOpen && <div className="absolute inset-0 bg-black/50 z-40" onClick={close} />}

      <aside
        className={`absolute top-0 left-0 w-[80%] max-w-[300px] h-full bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="bg-[#0b338f] text-white p-6 pb-5 h-32 flex flex-col justify-end">
          <h2 className="text-2xl font-bold tracking-tight">백석대학교</h2>
          <p className="text-xs text-blue-200 mt-1 uppercase">BAEKSEOK UNIVERSITY</p>
          {user && (
            <p className="text-xs text-white/90 mt-2">
              {user.display_name} · {ROLE_LABELS[user.role] ?? user.role}
            </p>
          )}
        </div>

        <nav className="flex-1 flex flex-col bg-white">
          {MENUS.map((m) => (
            <Link
              key={m.path}
              to={m.path}
              tabIndex={isOpen ? 0 : -1}
              onClick={close}
              className={`px-6 py-4 text-[15px] font-bold border-b border-gray-200 ${
                pathname === m.path ? 'text-[#0b338f] bg-blue-50/50' : 'text-gray-900'
              }`}
            >
              {m.label}
            </Link>
          ))}
        </nav>

        <div className="bg-[#56595e] text-white p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-200">문의하기 :</p>
            <p className="text-[11px] text-gray-400 mt-1">Version : 1.0.4 (5)</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleLogout} tabIndex={isOpen ? 0 : -1} className="text-[11px] text-gray-200 underline px-2 py-1">
              로그아웃
            </button>
            <Link to="/settings" onClick={close} tabIndex={isOpen ? 0 : -1} className="p-2" aria-label="환경설정">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
