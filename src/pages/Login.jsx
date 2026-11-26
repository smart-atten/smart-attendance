import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, login } = useAuth();
  const [studentNo, setStudentNo] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from ?? '/';

  if (status === 'authenticated') return <Navigate to={redirectTo} replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!studentNo.trim() || !password.trim()) {
      setErrorMsg('학번(교번)과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await login(studentNo.trim(), password, autoLogin);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMsg(
        error.status === 401
          ? '학번(교번) 또는 비밀번호가 올바르지 않습니다.'
          : error.message || '로그인에 실패했습니다.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between px-7 py-12 font-sans">
      <div className="mt-10">
        <div className="inline-block bg-[#0b338f] text-white text-[11px] font-bold px-2.5 py-1 rounded mb-3 tracking-wider">
          BAEKSEOK UNIVERSITY
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          백석대학교
          <br />
          <span className="text-[#0b338f]">스마트 출결 시스템</span>
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          종합정보시스템 학번(교번) 및 비밀번호로 로그인하세요.
        </p>
      </div>

      <form onSubmit={handleLogin} className="my-auto space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            학번 / 교번
          </label>
          <input
            type="text"
            value={studentNo}
            onChange={(e) => setStudentNo(e.target.value)}
            placeholder="예: 20232656"
            inputMode="numeric"
            autoComplete="username"
            className="w-full px-4 py-3.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b338f] bg-gray-50 focus:bg-white transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            className="w-full px-4 py-3.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b338f] bg-gray-50 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
              className="w-4 h-4 accent-[#0b338f] rounded"
            />
            자동 로그인
          </label>
          <span className="text-[11px] text-gray-400">
            기기 변경은 환경설정에서 신청
          </span>
        </div>

        {errorMsg && (
          <p role="alert" className="text-xs text-red-600 font-medium bg-red-50 px-3 py-2 rounded">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#0b338f] hover:bg-[#08266d] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-lg shadow-md transition mt-2"
        >
          {submitting ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="text-center border-t border-gray-100 pt-5">
        <p className="text-[11px] text-gray-400">
          학번/비밀번호 분실 시 백석대학교 종합정보시스템을 이용해 주세요.
        </p>
        <p className="text-[10px] text-gray-300 mt-1">Version : 1.0.4 (5)</p>
      </div>
    </div>
  );
}