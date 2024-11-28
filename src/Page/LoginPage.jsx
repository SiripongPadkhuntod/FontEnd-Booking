import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";

function Modal({ isOpen, message, submessage, onClose }) {
  if (!isOpen) return null;
  return (
    <dialog
      className="modal modal-open"
    >
      <div style={{ animation: "popup 0.4s ease-in-out" }} className="modal-box bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-xl rounded-lg">
        <h3 className="font-bold text-2xl mb-4">{message}</h3>
        <p className="py-4">{submessage}</p>
        <div className="flex justify-end space-x-4">
      
          <button className="btn btn-sm btn-success text-white shadow-md" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop backdrop-blur-sm bg-opacity-30"
        onClick={onClose}
      ></div>
    </dialog>
  );
}

// CSS สำหรับเอฟเฟกต์ popup
const styles = `
@keyframes popup {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.modal-box {
  animation: popup 0.4s ease-in-out;
}
`;

// เพิ่ม CSS ลงในหน้า
function injectStyles() {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

injectStyles();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({ isOpen: false, message: "", submessage: "" });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginGoogle = async (response) => {
    try {
      const res = await fetch('https://backend-6ug4.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();

      if (data.message === 'Login successful') {
        localStorage.setItem('authToken', data.token);
        navigate("/home");
      } else {
        setModalState({
          isOpen: true,
          message: data.message || "Login Failed",
          submessage: "Please check your email domain.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setModalState({
        isOpen: true,
        message: "Error",
        submessage: "Unable to connect to the server. Please try again.",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-6ug4.onrender.com/login/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('authToken', data.token);
        navigate("/home");
      } else {
        const errorMessage = await res.text();
        setModalState({ isOpen: true, message: "Login Failed", submessage: errorMessage });
      }
    } catch (error) {
      console.error("Error:", error);
      setModalState({
        isOpen: true,
        message: "Connection Error",
        submessage: "Unable to connect to the server.",
      });
    }
  };

  return (
    <div className="mx-auto flex flex-col md:flex-row items-center h-screen p-4 w-screen bg-gray-50">
      {/* Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center p-6 bg-white shadow-lg rounded-lg h-screen justify-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Hi Sir, Have a Nice Day!</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 mb-5">
          <label className="input input-bordered flex items-center gap-2">
            <CiMail className="text-xl" />
            <input
              type="email"
              placeholder="RSU Mail"
              className="grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <RiLockPasswordLine className="text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="grow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="btn btn-ghost btn-square" onClick={togglePasswordVisibility}>
              {showPassword ? <GrFormViewHide className="text-xl" /> : <GrFormView className="text-xl" />}
            </button>
          </label>
          <label className="label">
            <a className="label-text-alt link link-hover">Forgot password?</a>
          </label>
          <button type="submit" className="btn glass w-full p-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800">
            Login Now
          </button>
        </form>
        {error && <div className="mt-4 text-red-500">{error}</div>}
        <div className="divider divider-neutral min-w-fit">or login with</div>
        <GoogleLogin onSuccess={handleLoginGoogle} onError={() => console.log('Login Failed')} className="p-4" />
      </div>

      {/* Image Section */}
      <div className="w-screen h-screen md:w-1/2 hidden md:flex items-center justify-center relative">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=750&q=80" alt="login" className="object-cover h-screen w-screen" />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        message={modalState.message}
        submessage={modalState.submessage}
        onClose={() => setModalState({ isOpen: false, message: "", submessage: "" })}
      />
    </div>
  );
}

export default Login;
