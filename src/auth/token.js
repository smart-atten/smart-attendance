// JWT 토큰 저장·검증 유틸리티.
// 서명 검증은 서버(Spring Security)가 담당하고, 클라이언트는 형식과 만료 시각만 확인합니다.

const STORAGE_KEY = 'smart-attendance.auth';
const EXPIRY_MARGIN_MS = 30 * 1000;

function decodeJwtPayload(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      [...atob(padded)].map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * 로그인 응답으로 저장할 세션 객체를 만듭니다.
 * 만료 시각은 JWT의 exp를 우선하고, 없으면 expiresIn(초)으로 계산합니다.
 */
export function createAuthSession({ accessToken, tokenType = 'Bearer', expiresIn }) {
  const payload = decodeJwtPayload(accessToken);
  const expiresAt = payload?.exp ? payload.exp * 1000 : Date.now() + Number(expiresIn ?? 0) * 1000;
  return { accessToken, tokenType, expiresAt };
}

export function isSessionValid(session) {
  return Boolean(session?.accessToken) && Date.now() + EXPIRY_MARGIN_MS < session.expiresAt;
}

/** 자동 로그인이면 localStorage, 아니면 탭을 닫을 때 사라지는 sessionStorage에 저장합니다. */
export function saveAuthSession(session, remember) {
  clearAuthSession();
  (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadAuthSession() {
  for (const storage of [sessionStorage, localStorage]) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // 손상된 값은 무시
    }
  }
  return null;
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}
