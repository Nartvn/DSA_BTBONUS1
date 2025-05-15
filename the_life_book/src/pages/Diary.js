import { useState, useRef, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import "../App.css";

export default function Diary() {
  // State chính
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("Bình thường");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State cho AI Nart
  const [nartState, setNartState] = useState({
    isTyping: false,
    message: "Xin chào! Nart ở đây để lắng nghe bạn hôm nay ❤️",
    showSuggestions: false
  });

  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const diaryFormRef = useRef(null);

  // Tự động điều chỉnh chiều cao textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Tương tác với AI Nart
  const consultNart = async (userText) => {
    if (!userText.trim() || userText.length < 10) return;
    
    setNartState(prev => ({
      ...prev,
      isTyping: true,
      showSuggestions: false
    }));

    try {
      // Giả lập delay call API (thực tế sẽ thay bằng API call thật)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const responses = {
        "Buồn": [
          "Nart thấy hôm nay bạn có chút buồn. Muốn chia sẻ thêm không?",
          "Những ngày buồn cũng là cơ hội để yêu thương bản thân hơn 💖",
          `Từ "${extractMainTopic(userText)}" làm bạn buồn à? Nart luôn sẵn sàng lắng nghe.`
        ],
        "Vui": [
          "Wow! Nghe vui quá! Bạn muốn kể thêm chi tiết không?",
          `Nart thấy bạn nhắc đến "${extractMainTopic(userText)}". Chắc là trải nghiệm tuyệt vời!`,
          "Niềm vui của bạn cũng làm Nart hạnh phúc theo 😊"
        ],
        "default": [
          "Bạn muốn phân tích sâu hơn về cảm xúc hôm nay không?",
          `Nart nhận thấy bạn đề cập đến "${extractMainTopic(userText)}". Điều đó có ý nghĩa gì với bạn?`,
          "Mỗi ngày đều là một trang nhật ký đặc biệt. Bạn đang viết nên câu chuyện của chính mình ✨"
        ]
      };

      const moodResponses = responses[mood] || responses.default;
      const randomResponse = moodResponses[Math.floor(Math.random() * moodResponses.length)];
      
      setNartState(prev => ({
        ...prev,
        message: randomResponse,
        showSuggestions: true
      }));

    } catch (error) {
      setNartState(prev => ({
        ...prev,
        message: "Nart gặp chút trục trặc, nhưng vẫn đang lắng nghe bạn ❤️"
      }));
    } finally {
      setNartState(prev => ({ ...prev, isTyping: false }));
    }
  };

  // Hàm trích xuất chủ đề chính
  const extractMainTopic = (text) => {
    const words = text.toLowerCase().match(/\b(\w{4,})\b/g) || [];
    const stopWords = ["hôm", "nay", "cảm", "thấy"];
    const filtered = words.filter(word => !stopWords.includes(word));
    return filtered.slice(0, 2).join(", ") || "nhiều điều thú vị";
  };

  // Gợi ý nhanh từ Nart
  const quickSuggestions = [
    { emoji: "💡", text: "Điều đáng nhớ nhất hôm nay?" },
    { emoji: "🌻", text: "Viết về khoảnh khắc làm bạn mỉm cười" },
    { emoji: "🤔", text: "Điều gì khiến bạn trăn trở?" }
  ];

  // Xử lý submit nhật ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !content.trim()) return;

    setIsSubmitting(true);

    try {
      const now = new Date();
      await addDoc(collection(db, "diaries"), {
        userId: user.uid,
        date: now.toLocaleDateString("vi-VN"),
        time: now.toLocaleTimeString("vi-VN", { hour12: false }),
        timestamp: now,
        content,
        mood,
        hasAIResponse: nartState.message !== "Xin chào! Nart ở đây để lắng nghe bạn hôm nay ❤️"
      });

      setContent("");
      setMood("Bình thường");
      setNartState({
        isTyping: false,
        message: "Cảm ơn bạn đã chia sẻ! Nart đã lưu nhật ký thành công 🌟",
        showSuggestions: false
      });

    } catch (error) {
      alert(`Lỗi khi lưu: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert(`Lỗi đăng xuất: ${error.message}`);
    }
  };

  return (
    <div className="diary-page">
      <div className="diary-box">
        <form onSubmit={handleSubmit} ref={diaryFormRef}>
          <div className="diary-header">
            <h2>Nhật ký hôm nay</h2>
            <div className="mood-selector">
              <label>😊 Tâm trạng:</label>
              <select 
                value={mood} 
                onChange={(e) => setMood(e.target.value)}
                disabled={isSubmitting}
              >
                <option>Phấn khởi</option>
                <option>Vui</option>
                <option>Bình thường</option>
                <option>Buồn</option>
                <option>Lo lắng</option>
              </select>
            </div>
          </div>

          {/* Khung chat với Nart */}
          <div className={`nart-container ${nartState.isTyping ? "typing" : ""}`}>
            <div className="nart-avatar">✨</div>
            <div className="nart-content">
              <div className="nart-message">
                {nartState.message}
                {nartState.isTyping && <span className="typing-indicator">...</span>}
              </div>
              
              {nartState.showSuggestions && (
                <div className="nart-suggestions">
                  {quickSuggestions.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => setContent(prev => `${prev} ${item.text}`)}
                    >
                      {item.emoji} {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            placeholder="Hôm nay của bạn thế nào? Viết ra cảm nhận của bạn nhé..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value.length % 30 === 0) consultNart(e.target.value);
            }}
            disabled={isSubmitting}
            rows={5}
          />

          <div className="action-buttons">
            <button 
              type="submit" 
              className="save-btn"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu nhật ký"}
            </button>
            
            <button 
              type="button"
              className="history-btn"
              onClick={() => navigate("/history")}
            >
              Xem lịch sử
            </button>
            
            <button 
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}