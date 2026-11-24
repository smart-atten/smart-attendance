import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TimetablePage from "./pages/TimetablePage";
import QnA from "./pages/QnA";
import Notice from "./pages/Notice";
import Settings from "./pages/Settings";
import More from "./pages/More";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-200 flex justify-center">
        <div className="w-full md:max-w-[440px] min-h-screen bg-white shadow-2xl flex flex-col relative overflow-x-hidden">
          <Navbar />
          <main className="flex-1 bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/more" element={<More />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
