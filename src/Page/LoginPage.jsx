import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [textalert , setTextalert] = useState("");
    const [showAlert, setShowAlert] = useState(false); // state สำหรับการแสดง alert
    const navigate = useNavigate();

    const handleLoginGoogle = (response) => {
        console.log('Google token:', response.credential); // ตรวจสอบ token
    
        // ส่ง token ไปยัง backend
        fetch('http://localhost:8080/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: response.credential }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.message === 'Login successful') {
              console.log('Login successful');
            //   localStorage.setItem("authKey", key);
              navigate("/home");
            }

    
            else if (data.message === 'Invalid email domain') {
                console.log('Invalid email domain');
                setTextalert("Invalid email domain");
                setShowAlert(true);
                setTimeout(() => {
                  setShowAlert(false);
                }, 5000);
            }
             else {
              console.log('Login failed with message:', data.message);
            }
          })
          .catch(err => {
            console.log('Error:', err);
          });
      };
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch("https://backend-6ug4.onrender.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          const { key } = await response.json();
          localStorage.setItem("authKey", key);
          navigate("/home");
        } else {
          const errorMessage = await response.text();
          let message = response.status + " " + errorMessage;
          testModal(message);
        }
      } catch (error) {
        console.error("Error:", error);
        setTextalert("Error! มีข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
    };
  
    return (
      <div className="container mx-auto flex flex-col md:flex-row items-center min-h-screen p-4 w-screen bg-gray-50">
        <div className="w-full md:w-1/2 flex flex-col items-center p-6 bg-white shadow-lg rounded-lg h-screen justify-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Hi Sir, Have a Nice Day!</h1>
          
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <input
              type="email"
              placeholder="RSU Mail"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
            />
  
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Login Now
            </button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          

          <GoogleLogin onSuccess={handleLoginGoogle} onError={() => console.log('Login Failed')} className="p-4"/>
        </div>
            
  
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center relative">
          <img src="https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="login" className="object-cover h-full w-full rounded-lg shadow-lg" />
          <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
        </div>
  
        {showAlert && (
          <div role="alert" className="alert alert-error fixed bottom-4 left-4 p-4 rounded-md bg-red-600 text-white flex items-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{textalert}</span>
          </div>
        )}
  
        <dialog id="my_modal_2" className="modal bg-white rounded-lg shadow-lg p-6">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className="text-blue-600 hover:underline">Close</button>
          </form>
        </dialog>
      </div>
    );
  }
  
  function testModal(message) {
    const modal = document.getElementById("my_modal_2");
    modal.showModal();
    modal.querySelector("p").textContent = message;
    setTimeout(() => { modal.close(); }, 5000);
  }

export default Login