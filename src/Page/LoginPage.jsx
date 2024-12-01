import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import API from '../api';

function Modal({ isOpen, message, submessage, onClose }) {
  if (!isOpen) return null;
  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-2xl rounded-2xl transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <h3 className="font-bold text-3xl mb-4 text-center text-white drop-shadow-lg">{message}</h3>
        <p className="py-4 text-center text-gray-100">{submessage}</p>
        <div className="flex justify-center mt-6">
          <button
            className="btn btn-outline btn-ghost text-white border-white hover:bg-white hover:text-purple-600 transition-colors duration-300 px-8"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop backdrop-blur-sm bg-black bg-opacity-40"
        onClick={onClose}
      ></div>
    </dialog>
  );
}

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
      const res = await API.post('/api/auth/google', { token: response.credential });
      if (res.data.message === 'Login successful') {
        localStorage.setItem('authToken', res.data.token);
        navigate("/home");
      } else {
        setModalState({
          isOpen: true,
          message: res.data.message || "Login Failed",
          submessage: "Please check your email domain.",
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        message: "Error",
        submessage: "Unable to connect to the server. Please try again.",
      });
      console.error("Error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login/email", { email, password });

      if (res.status === 200) {
        localStorage.setItem('authToken', res.data.token);
        navigate("/home");
      } else {
        setModalState({
          isOpen: true,
          message: "Login Failed",
          submessage: res.data || "Unknown error",
        });
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex">
        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Welcome Back
            </h1>
            <p className="text-gray-500">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiMail className="text-xl text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="RSU Mail"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockPasswordLine className="text-xl text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-purple-600 transition duration-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <GrFormViewHide className="text-xl" /> : <GrFormView className="text-xl" />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded focus:ring-purple-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-purple-600 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center  ">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gray-300 w-full"></div>
              <span className="text-gray-500">or</span>
              <div className="h-px bg-gray-300 w-full"></div>
            </div>

            <div className="mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginGoogle}
                onError={() => console.log('Login Failed')}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=750&q=80"
            alt="login background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
              <p className="text-lg">Enter your personal details and start your journey with us</p>
            </div>
          </div>
        </div>
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