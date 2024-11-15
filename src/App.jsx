import React from "react";
import { Route, Routes } from "react-router-dom";

import LoginPage from "./Page/LoginPage";
import HomePage from "./Page/HomePage";
import TestLogin from "./Component/testLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} /> {/* หน้าหลักหลังล็อกอิน */}
      <Route path="/test" element={<TestLogin />} />
    </Routes>
  );
}

export default App;
