import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function ChartPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "entries"), where("uid", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      const d = snap.docs.map(doc => doc.data());
      setData(d);
    }
    fetchData();
  }, []);

  const chartData = {
    labels: data.map(d => new Date(d.createdAt.seconds * 1000).toLocaleDateString()),
    datasets: [
      {
        label: "Mức độ tích cực",
        data: data.map(d => d.mood),
        borderColor: "blue",
        tension: 0.3
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
