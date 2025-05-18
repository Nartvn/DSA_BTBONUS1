import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";  /// css màu của giao diện

/**
 * Component `Login`
 * 
 * Cho phép người dùng đăng nhập hoặc đăng ký tài khoản thông qua email và mật khẩu.
 * Sử dụng Firebase Authentication để xử lý đăng nhập và đăng ký.
 * 
 * Chức năng:
 * - Chuyển đổi giữa giao diện Đăng nhập và Đăng ký.
 * - Gửi yêu cầu đăng nhập/đăng ký đến Firebase.
 * - Hiển thị thông báo thành công hoặc lỗi.
 * - Điều hướng đến trang "/diary" sau khi thành công.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true: đăng nhập, false: đăng ký
  const navigate = useNavigate();

  /**
   * Hàm xử lý khi người dùng nhấn nút Đăng nhập hoặc Đăng ký.
   * - Nếu đang ở chế độ đăng nhập, gọi hàm `signInWithEmailAndPassword`.
   * - Nếu đang ở chế độ đăng ký, gọi `createUserWithEmailAndPassword`.
   * - Sau khi thành công, điều hướng đến trang "/diary".
   * - Hiển thị thông báo lỗi nếu có lỗi xảy ra.
   */
  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, pw);
        alert("Đăng nhập thành công!");
      } else {
        await createUserWithEmailAndPassword(auth, email, pw);
        alert("Đăng ký thành công!");
      }
      navigate("/diary");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="form-box">
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </p>
      </div>
    </div>
  );
}
