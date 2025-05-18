import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

// Đăng ký các thành phần cần thiết của biểu đồ Line với ChartJS
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

/**
 * Component hiển thị biểu đồ đường thể hiện mức độ cảm xúc (mood)
 * theo thời gian của người dùng hiện tại, được lấy từ cơ sở dữ liệu Firebase.
 *
 * Dữ liệu được truy vấn từ collection "entries", nơi mỗi entry chứa các thuộc tính:
 * - uid: ID của người dùng
 * - createdAt: thời điểm tạo entry (kiểu Timestamp)
 * - mood: điểm số thể hiện cảm xúc
 *
 * Biểu đồ hiển thị ngày tạo entry trên trục hoành và mức độ cảm xúc trên trục tung.
 */
export default function ChartPage() {
  // Trạng thái lưu trữ dữ liệu lấy từ Firebase
  const [data, setData] = useState([]);

  useEffect(() => {
    /**
     * Hàm bất đồng bộ dùng để lấy dữ liệu từ Firebase Firestore.
     * Chỉ lấy những entry có `uid` khớp với người dùng hiện tại.
     */
    async function fetchData() {
      const q = query(collection(db, "entries"), where("uid", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      const d = snap.docs.map(doc => doc.data());
      setData(d);
    }

    fetchData();
  }, []);

  // Dữ liệu cấu hình cho biểu đồ đường
  const chartData = {
    labels: data.map(d => new Date(d.createdAt.seconds * 1000).toLocaleDateString()), // Gán nhãn trục x theo ngày
    datasets: [
      {
        label: "Mức độ tích cực", // Nhãn dữ liệu
        data: data.map(d => d.mood), // Dữ liệu trục y là chỉ số mood
        borderColor: "blue", // Màu đường biểu đồ
        tension: 0.3 // Độ cong của đường biểu diễn
      }
    ]
  };

  return (
    <div>
      <h2>Biểu đồ cảm xúc</h2>
      <Line data={chartData} />
    </div>
  );
}
