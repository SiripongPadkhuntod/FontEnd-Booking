import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import HomePage from "./HomePage";

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
    <div className="container mx-auto flex flex-col md:flex-row items-center min-h-screen p-4">
      <div className="w-full md:w-1/2 flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">Hi Sir Have a Nice Day.</h1>
        <FcGoogle className="text-4xl mb-4" />
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <input
            type="email"
            placeholder="RSU Mail"
            className="w-full p-3 border rounded mb-4 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">Login Now</button>
        </form>
        {error && <div className="mt-4 text-red-500">{error}</div>} {/* ข้อความข้อผิดพลาด */}
      </div>

      <div className="w-full md:w-1/2 hidden md:flex items-center justify-center relative">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="login" className="object-cover h-full w-full" />
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
    </div>
  );
}

export default App;
