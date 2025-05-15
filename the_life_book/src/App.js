import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Diary from "./pages/Diary";
import ChartPage from "./pages/Chart";
import History from "./pages/History";

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

