import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";  /// css màu của giao diện

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

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
