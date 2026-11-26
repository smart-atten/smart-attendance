import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import RequireAuth from './auth/RequireAuth';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import TimetablePage from './pages/TimetablePage';
import QnA from './pages/QnA';
import Notice from './pages/Notice';
import Settings from './pages/Settings';
import More from './pages/More';

// 로그인 이후 화면 공통 레이아웃: 상단 헤더(햄버거 슬라이드 메뉴) + 본문
function AppLayout() {
  return (
    <RequireAuth>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* PC에서도 스마트폰 앱 크기로 가운데 고정 */}
        <div className="min-h-screen bg-gray-200 flex justify-center">
          <div className="w-full md:max-w-[440px] min-h-screen bg-white shadow-2xl flex flex-col relative overflow-x-hidden">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/timetable" element={<TimetablePage />} />
                <Route path="/qna" element={<QnA />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/more" element={<More />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
