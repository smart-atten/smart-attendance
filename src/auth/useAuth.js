import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

/**
 * @returns {{
 *   status: 'loading' | 'authenticated' | 'anonymous',
 *   user: import('../domain/user.js').User | null,
 *   session: { accessToken: string | null, expiresAt: number, mode?: 'dev', studentNo?: string } | null,
 *   isDevSession: boolean,
 *   login: (studentNo: string, password: string, remember: boolean) => Promise<void>,
 *   logout: () => void,
 *   handleApiError: (error: Error & { status?: number }) => void,
 * }}
 */
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  return value;
}
