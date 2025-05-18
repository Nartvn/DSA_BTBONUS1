import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Diary from "./pages/Diary";
import ChartPage from "./pages/Chart";
import History from "./pages/History";

/**
 * Component `App`
 * 
 * Đây là component gốc của ứng dụng, định nghĩa hệ thống định tuyến bằng `react-router-dom`.
 * Ứng dụng sử dụng `<BrowserRouter>` để quản lý các route và điều hướng giữa các trang.
 * 
 * Các route được định nghĩa:
 * - `/`          : Trang đăng nhập/đăng ký (component `Login`)
 * - `/diary`     : Trang viết nhật ký (component `Diary`)
 * - `/chart`     : Trang thống kê biểu đồ (component `ChartPage`)
 * - `/history`   : Trang lịch sử các bản ghi nhật ký (component `History`)
 * 
 * Mỗi đường dẫn được gắn với một component tương ứng.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
