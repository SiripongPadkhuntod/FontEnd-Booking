import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { GrFormView } from "react-icons/gr";
import { GrFormViewHide } from "react-icons/gr";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  const handleLoginGoogle = (response) => {
    console.log('Google token:', response.credential); // ตรวจสอบ token

    // ส่ง token ไปยัง backend
    fetch('https://backend-6ug4.onrender.com/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Login successful') {
          console.log('Login successful');
          localStorage.setItem('authToken', data.token);  // Store the JWT token
          navigate("/home");
        }


        else if (data.message === 'Invalid email domain') {
          console.log('Invalid email domain');
          testModal("Invalid email domain", "กรุณาใช้ RSU Mail เท่านั้น");
          // setShowAlert(true);
          // setTimeout(() => {
          //   setShowAlert(false);
          // }, 5000);
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
      const response = await fetch("https://backend-6ug4.onrender.com/login/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);  // Store the JWT token
        navigate("/home");  // Redirect to the home page
      } else {
        const errorMessage = await response.text();
        let message = response.status + " " + errorMessage;
        testModal(message);
      }
    } catch (error) {
      console.error("Error:", error);

      testModal("มีข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", "กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className=" mx-auto flex flex-col md:flex-row items-center h-screen p-4 w-screen bg-gray-50">

      <div className=" w-full md:w-1/2 flex flex-col items-center p-6 bg-white shadow-lg rounded-lg h-screen justify-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Hi Sir, Have a Nice Day!</h1>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 mb-5">
          {/* <input
            type="email"
            placeholder="RSU Mail"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}

          <label className="input input-bordered flex items-center gap-2">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg> */}
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
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd" />
            </svg> */}
            <RiLockPasswordLine className="text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="grow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* add view btn */}
            <button type="button" className="btn btn-ghost btn-square" onClick={togglePasswordVisibility}>
              {showPassword ? <GrFormViewHide className="text-xl" /> : <GrFormView className="text-xl" />}
            </button>

            

          </label>

          <label className="label">
            <a  className="label-text-alt link link-hover">Forgot password?</a>
          </label>

        
          <button type="submit" className="btn glass w-full p-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-700">
            Login Now
          </button>
        </form>
        {error && <div className="mt-4 text-red-500">{error}</div>}


        <div className="divider divider-neutral min-w-fit">or login with</div>


        <GoogleLogin onSuccess={handleLoginGoogle} onError={() => console.log('Login Failed')} className="p-4" />
      </div>


      <div className="w-screen h-screen md:w-1/2 hidden md:flex items-center justify-center relative">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="login" className="object-cover h-screen w-screen  " />
        <div className="absolute inset-0 bg-black opacity-20 "></div>
      </div>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

function testModal(message, submessage) {
  const modal = document.getElementById("my_modal_2");
  modal.showModal();
  modal.querySelector("h3").textContent = message;
  modal.querySelector("p").textContent = submessage;
}

export default Login