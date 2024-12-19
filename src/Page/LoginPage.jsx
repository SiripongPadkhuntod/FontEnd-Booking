import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // import ไอคอน
import API from '../api';

function Modal({ isOpen, message, submessage, onClose, isDarkMode }) {
  if (!isOpen) return null;

  const isError = message?.toLowerCase().includes('error'); // ตรวจสอบ Error ทั่วไป
  const isLoginFailed = message?.toLowerCase().includes('login failed'); // ตรวจสอบกรณี Login Failed

  return (
    <dialog className={`modal modal-open ${isDarkMode ? 'dark' : ''}`}>
      <div className={`modal-box rounded-lg w-full max-w-md p-6 ${isDarkMode
        ? (isError || isLoginFailed ? 'bg-red-800 text-white' : 'bg-gray-800 text-white')
        : (isError || isLoginFailed ? 'bg-red-600 text-white' : 'bg-green-600 text-white')} shadow-2xl`}>
        <div className="text-center">
          {isError || isLoginFailed ? (
            <FaExclamationCircle className="mx-auto text-6xl mb-4 text-white" />
          ) : (
            <FaCheckCircle className="mx-auto text-6xl mb-4 text-white" />
          )}
          <h3 className="text-2xl font-bold mb-2">
            {message || (isDarkMode ? 'Login Successful!' : 'Welcome Back!')}
          </h3>
          <p className={`py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-100'}`}>
            {submessage || (isLoginFailed
              ? 'Your login attempt was unsuccessful. Please check your credentials and try again.'
              : isError
                ? 'Something went wrong. Please try again.'
                : (isDarkMode
                  ? 'You have successfully logged in.'
                  : 'Enjoy your session!'))}
          </p>

          <button
            className={`btn btn-white mt-4 w-full ${isDarkMode
              ? (isError || isLoginFailed
                ? 'bg-red-700 text-white hover:bg-red-600'
                : 'bg-gray-700 text-white hover:bg-gray-600')
              : (isError || isLoginFailed
                ? 'hover:bg-red-500 hover:text-white'
                : 'hover:bg-green-500 hover:text-white')}`}
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, message: "", submessage: "" });
  const navigate = useNavigate();

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    //Delete authToken from localStorage
    localStorage.removeItem('authToken');
    
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // ตรวจสอบว่า email และ password ไม่ว่าง

  const handleLoginGoogle = async (response) => {
    try {
      const res = await API.post('/api/auth/google', { token: response.credential });
      // console.log("API Response:", res);

      if (res.status === 403) {
        console.log("403 Forbidden: Non-RSU email used.");
        setModalState({
          isOpen: true,
          message: "Login Failed",
          submessage: "Please use your RSU email to login.",
        });
      } else if (res.status === 200) {
        // console.log("Login successful:", res.data);
        localStorage.setItem('authToken', res.data.token);
        navigate("/home");
      } else {
        console.log("Unhandled response:", res.status);
        setModalState({
          isOpen: true,
          message: res.data.message || "Login Failed",
          submessage: "Please check your email domain.",
        });
      }
    } catch (error) {
      console.error("Error in API request:", error);
      if (error.response && error.response.status === 403) {
        console.log("403 Forbidden Error handled in catch.");
        setModalState({
          isOpen: true,
          message: "Login Failed",
          submessage: "Please use your RSU email to login.",
        });
      } else {
        console.log("Other error in catch block.");
        setModalState({
          isOpen: true,
          message: "Error",
          submessage: "Unable to connect to the server. Please try again.",
        });
      }
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
  
    // ฟังก์ชันตรวจสอบว่าเป็น email หรือไม่
    const isEmail = (email) => /\S+@\S+\.\S+/.test(email);
  
    let loginData = {};
  
    if (isEmail(email)) {
      // หากเป็น email, ใช้ email และ password
      loginData = { email: email.toLowerCase(), password };
    } else {
      // หากไม่ใช่ email, ให้ถือว่าเป็น username
      loginData = { username: email, password };
    }
  
    console.log("Login data:", loginData); // สำหรับดีบัก
  
    try {
      // เรียก API สำหรับล็อกอิน
      const res = await API.post("/login", loginData);
  
      if (res.status === 200) {
        localStorage.setItem('authToken', res.data.token);
        navigate("/home");
      } else if (res.status === 403) {
        setModalState({
          isOpen: true,
          message: "Login Failed",
          submessage: "Please use your RSU email to login.",
        });
      } else if (res.status === 401) {
        setModalState({
          isOpen: true,
          message: "Login Failed",
          submessage: "Invalid email/username or password.",
        });
      } else {
        setModalState({
          isOpen: true,
          message: "Login Failed",
          submessage: res.data || "Unknown error",
        });
      }
    } catch (error) {
      console.error("Error in API request:", error);
      if (error.response) {
        if (error.response.status === 403) {
          setModalState({
            isOpen: true,
            message: "Login Failed",
            submessage: "Please use your RSU email to login.",
          });
        } else if (error.response.status === 401 || error.response.status === 400) {
          setModalState({
            isOpen: true,
            message: "Login Failed",
            submessage: "Invalid email/username or password.",
          });
        } else if (error.response.status === 500) {
          setModalState({
            isOpen: true,
            message: "Login Failed",
            submessage: "Internal server error. Please try again later.",
          });
        }
      } else {
        setModalState({
          isOpen: true,
          message: "Error",
          submessage: "Unable to connect to the server. Please try again.",
        });
      }
    }
  };
  

  
  


  return (

    <div className={`min-h-screen ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-800'
      : 'bg-gradient-to-br from-gray-200 via-gray-100 to-red-200'} 
      flex items-center justify-center p-4`}>
      <div className={`w-full max-w-6xl ${isDarkMode
        ? 'bg-gray-800 text-white'
        : 'bg-white'} 
        shadow-2xl rounded-3xl overflow-hidden flex`}>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full ${isDarkMode
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            : 'bg-red-100 text-red-600 hover:bg-red-200'} 
            transition-colors duration-300`}>
          {isDarkMode ? <MdLightMode className="text-2xl" /> : <MdDarkMode className="text-2xl" />}
        </button>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${isDarkMode
              ? 'text-white'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800'} 
              mb-4`}>
              Welcome Back
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiMail className={`text-xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text" // ใช้ 'text' เพื่อรองรับทั้ง email และ username
                placeholder={email ? "RSU Mail" : "Username"} // เปลี่ยน placeholder ตามค่า email
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                    ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)} // ใช้ 'email' สำหรับจัดเก็บค่าผู้ใช้
              />
            </div>


            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockPasswordLine className={`text-xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 
                  ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-red-600'} 
                  transition duration-300`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <GrFormViewHide className="text-xl" /> : <GrFormView className="text-xl" />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <label className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <input
                  type="checkbox"
                  className={`mr-2 rounded ${isDarkMode
                    ? 'focus:ring-red-500 bg-gray-700 border-gray-600'
                    : 'focus:ring-red-500'}`}
                />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                className={`${isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-red-600 hover:underline'}`}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-white rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-[1.02] shadow-lg 
                ${isDarkMode
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900'
                  : 'bg-gradient-to-r from-red-600 to-red-800'}`}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className={`h-px w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>or</span>
              <div className={`h-px w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>

            <div className="mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginGoogle}
                onError={() => console.log('Login Failed')}
                className={`w-full md:w-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
              />
            </div>

            <div className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account? <a
                href="/register"
                className={`${isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-red-600 hover:underline'}`}>
                Sign Up
              </a>
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
          <div className={`absolute inset-0 ${isDarkMode
            ? 'bg-gradient-to-r from-gray-900 to-black opacity-70'
            : 'bg-gradient-to-r from-red-600 to-red-800 opacity-60'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
            <div>

              {/* <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2> */}
              {/* <p className="text-lg">Enter your personal details and start your journey with us</p> */}
              <img
                src="src\assets\login.jpg"
                className="absolute inset-0 w-full h-full object-cover"
              />

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
        isDarkMode={isDarkMode}
      />
    </div>

  );
}

export default Login;