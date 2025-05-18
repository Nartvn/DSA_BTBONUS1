import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

/**
 * Component `History` hiển thị danh sách các nhật ký đã lưu của người dùng hiện tại.
 * Cho phép người dùng:
 * - Xem lại các mục nhật ký đã ghi.
 * - Xóa từng mục riêng lẻ.
 * - Xóa toàn bộ nhật ký cùng lúc.
 */
export default function History() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  // Tải dữ liệu nhật ký khi component được render
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Hàm fetchData:
   * - Truy vấn Firestore để lấy tất cả nhật ký của người dùng hiện tại.
   * - Sắp xếp theo thời gian giảm dần.
   * - Cập nhật state `entries`.
   */
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

  /**
   * Hàm handleDelete:
   * - Xóa một nhật ký cụ thể theo ID.
   * - Hiển thị xác nhận từ người dùng trước khi xóa.
   * 
   * @param {string} id - ID của tài liệu nhật ký cần xóa.
   */
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

  /**
   * Hàm handleDeleteAll:
   * - Xóa toàn bộ nhật ký của người dùng hiện tại.
   * - Hiển thị xác nhận từ người dùng trước khi thực hiện.
   */
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

/**
 * Hàm formatDateTime:
 * - Định dạng ngày và giờ thành chuỗi dễ đọc: DD/MM/YYYY ⏰ HH:mm:ss
 * 
 * @param {string} dateStr - Chuỗi ngày (định dạng dd/mm/yyyy hoặc yyyy-mm-dd).
 * @param {string} timeStr - Chuỗi thời gian (tuỳ chọn).
 * @returns {string} - Chuỗi định dạng thời gian hoàn chỉnh.
 */
function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-').reverse();
  const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  return timeStr ? `${formattedDate} ⏰ ${timeStr}` : formattedDate;
}
