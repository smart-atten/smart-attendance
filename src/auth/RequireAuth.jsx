import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth.js';

export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <p className="p-6 text-sm text-gray-500" role="status">
        로그인 정보를 확인하는 중입니다.
      </p>
    );
  }
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
