import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function History() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "diaries"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    data.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime();
      }
      const dateTimeA = new Date(`${a.date} ${a.time || '00:00:00'}`).getTime();
      const dateTimeB = new Date(`${b.date} ${b.time || '00:00:00'}`).getTime();
      return dateTimeB - dateTimeA;
    });
    
    setEntries(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhật ký này?")) {
      try {
        await deleteDoc(doc(db, "diaries", id));
        setEntries(entries.filter(entry => entry.id !== id));
        alert("Xóa nhật ký thành công!");
      } catch (err) {
        alert("Lỗi khi xóa: " + err.message);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Bạn có chắc muốn xóa TẤT CẢ nhật ký? Hành động này không thể hoàn tác!")) {
      try {
        const user = auth.currentUser;
        const q = query(collection(db, "diaries"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        setEntries([]);
        alert("Đã xóa tất cả nhật ký!");
      } catch (err) {
        alert("Lỗi khi xóa: " + err.message);
      }
    }
  };

  return (
    <div className="history-page">
      <div className="history-box">
        <h2>Lịch sử nhật ký</h2>
        <div className="history-actions">
          <button className="back-button" onClick={() => navigate("/diary")}>
            ← Quay lại
          </button>
          {entries.length > 0 && (
            <button className="delete-all-button" onClick={handleDeleteAll}>
              Xóa tất cả
            </button>
          )}
        </div>
        
        {entries.length === 0 ? (
          <p>Chưa có nhật ký nào.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="entry">
              <div className="entry-header">
                <p><strong>📅 Thời gian:</strong> {formatDateTime(entry.date, entry.time)}</p>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(entry.id)}
                >
                  Xóa
                </button>
              </div>
              <p><strong>😄 Cảm xúc:</strong> {entry.mood}</p>
              <p><strong>📝 Nội dung:</strong> {entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Hàm formatDateTime (có thể đặt trong file utils)
function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-').reverse();
  const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  return timeStr ? `${formattedDate} ⏰ ${timeStr}` : formattedDate;
}