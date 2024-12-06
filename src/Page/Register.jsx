import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine, RiUserLine } from "react-icons/ri";
import API from '../api';

function Modal({ isOpen, message, submessage, onClose, onOkClick }) {
  if (!isOpen) return null;
  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-2xl rounded-2xl transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <h3 className="font-bold text-3xl mb-4 text-center text-white drop-shadow-lg">{message}</h3>
        <p className="py-4 text-center text-gray-100">{submessage}</p>
        <div className="flex justify-center mt-6">
          <button
            className="btn btn-outline btn-ghost text-white border-white hover:bg-white hover:text-purple-600 transition-colors duration-300 px-8"
            onClick={onOkClick || onClose}
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

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    rsuMail: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    studentId: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, message: "", submessage: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setModalState({
        isOpen: true,
        message: "Password Mismatch",
        submessage: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (!validatePassword(formData.password)) {
      setModalState({
        isOpen: true,
        message: "Invalid Password",
        submessage: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.",
      });
      return;
    }

    const DataJson = {
      username: formData.username,
      email: formData.rsuMail,
      password: formData.password,
      firstname: formData.firstname,
      lastname: formData.lastname,
      studentId: formData.studentId
    };

    try {
      const res = await API.post("/register", DataJson);

      if (res.status === 200) {
        setModalState({
          isOpen: true,
          message: "Registration Successful",
          submessage: "Your account has been created successfully!",
        });
      } else {
        setModalState({
          isOpen: true,
          message: "Registration Failed",
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

  const handleSuccessModalClose = () => {
    setModalState({ isOpen: false, message: "", submessage: "" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex">
        {/* Registration Form Section */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Create Account
            </h1>
            <p className="text-gray-500">Sign up to get started</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiUserLine className="text-xl text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiMail className="text-xl text-gray-400" />
              </div>
              <input
                type="email"
                name="rsuMail"
                placeholder="RSU Mail"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                value={formData.rsuMail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                value={formData.studentId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockPasswordLine className="text-xl text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-purple-600 transition duration-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <GrFormViewHide className="text-xl" /> : <GrFormView className="text-xl" />}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockPasswordLine className="text-xl text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-purple-600 transition duration-300"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <GrFormViewHide className="text-xl" /> : <GrFormView className="text-xl" />}
              </button>
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="mr-2 rounded focus:ring-purple-500" required />
              <span className="text-gray-600">I agree to the Terms and Conditions</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gray-300 w-full"></div>
              <span className="text-gray-500">or</span>
              <div className="h-px bg-gray-300 w-full"></div>
            </div>

            <div className="mt-4 text-gray-600">
              Already have an account? <a href="/login" className="text-purple-600 hover:underline">Sign In</a>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=750&q=80"
            alt="register background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
              <p className="text-lg">Create an account and discover a world of opportunities</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalState.isOpen}
          message={modalState.message}
          submessage={modalState.submessage}
          onClose={() => setModalState({ isOpen: false, message: "", submessage: "" })}
          onOkClick={
            modalState.message === "Registration Successful" 
              ? handleSuccessModalClose 
              : undefined
          }
        />
      </div>
    </div>
  );
}

export default Register;