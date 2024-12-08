import React from "react";
import { Route, Routes } from "react-router-dom";

import LoginPage from "./Page/LoginPage";
import HomePage from "./Page/HomePage";
import RegisterPage from "./Page/Register";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} /> {/* หน้าหลักหลังล็อกอิน */}
      <Route path="/register" element={<RegisterPage />} />

    </Routes>
  );
}

export default App;
