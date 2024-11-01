import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage"; // หน้าหลังจากล็อกอินสำเร็จ

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} /> {/* หน้าหลักหลังล็อกอิน */}
      </Routes>
    </Router>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // ล็อกอินสำเร็จ เปลี่ยนหน้าไปที่ /home
        navigate("/home");
      } else {
        // ล็อกอินไม่สำเร็จ แสดงข้อความข้อผิดพลาด
        setError("ชื่อหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("มีข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      navigate("/home");
    }
  };

  return (
    <div className="container">
      <div className="login-section">
        <h1>Hi Sir Have a Nice In This Today.</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="RSU Mail"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">Login Now</button>
        </form>
        {error && <div className="modal">{error}</div>} {/* Modal ข้อความข้อผิดพลาด */}
      </div>
    </div>
  );
}

export default App;
