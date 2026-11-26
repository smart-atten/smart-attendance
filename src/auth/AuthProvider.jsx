import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentStudent, getDemoStudent, login as requestLogin } from '../api/apiClient.js';
import { toUser } from '../domain/apiMappers.js';
import { AuthContext } from './useAuth.js';
import {
  clearAuthSession,
  createAuthSession,
  isSessionValid,
  loadAuthSession,
  saveAuthSession,
} from './token.js';

const DEV_SESSION_MS = 8 * 60 * 60 * 1000;

async function fetchUser(session) {
  if (session.mode === 'dev') return toUser(await getDemoStudent(session.studentNo));
  return toUser(await getCurrentStudent(session.accessToken));
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = loadAuthSession();
    if (isSessionValid(saved)) return saved;
    clearAuthSession();
    return null;
  });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(session ? 'loading' : 'anonymous');

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  // 저장된 토큰이 있으면 /api/me로 서버 검증 후 사용자 정보를 복원합니다.
  useEffect(() => {
    if (!session || user) return;
    let active = true;
    fetchUser(session)
      .then((loaded) => {
        if (!active) return;
        setUser(loaded);
        setStatus('authenticated');
      })
      .catch(() => {
        if (active) logout();
      });
    return () => {
      active = false;
    };
  }, [session, user, logout]);

  // 토큰 만료 시각이 되면 자동 로그아웃합니다.
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(logout, Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [session, logout]);

  const login = useCallback(async (studentNo, password, remember) => {
    let nextSession;
    try {
      nextSession = createAuthSession(await requestLogin(studentNo, password));
    } catch (error) {
      // 백엔드 로그인(JWT 발급)이 아직 501이면 개발 서버에서만 학번으로 임시 로그인합니다.
      if (!(import.meta.env.DEV && error.status === 501)) throw error;
      nextSession = { accessToken: null, mode: 'dev', studentNo, expiresAt: Date.now() + DEV_SESSION_MS };
    }
    const loaded = await fetchUser(nextSession);
    saveAuthSession(nextSession, remember);
    setSession(nextSession);
    setUser(loaded);
    setStatus('authenticated');
  }, []);

  const handleApiError = useCallback(
    (error) => {
      if (error?.status === 401) logout();
    },
    [logout],
  );

  const value = useMemo(
    () => ({ status, user, session, isDevSession: session?.mode === 'dev', login, logout, handleApiError }),
    [status, user, session, login, logout, handleApiError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
