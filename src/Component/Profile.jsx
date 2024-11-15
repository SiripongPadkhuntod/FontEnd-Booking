import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function ProfilePage({ nightMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // const { id } = useParams();  // ใช้เพื่อดึง :id จาก URL
  const id = 'siripong.p64@rsu.ac.th'

  // id ถอดค่าจาก authToken ที่เก็บไว้ใน localStorage หลังจากล็อกอิน
  // const id = localStorage.getItem('authToken');

  

 


  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

 
useEffect(() => {
  const fetchUserData = async () => {
    try {
      // ระบุ URL ที่สมบูรณ์
      const response = await fetch(`http://localhost:8080/users/email/${id}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const contentType = response.headers.get('Content-Type');
      // ตรวจสอบว่า Content-Type เป็น application/json หรือไม่
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setUserData(data);
      } else {
        const errorText = await response.text();
        throw new Error('Response is not JSON: ' + errorText);
      }
  
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchUserData();
}, [id]);

  if (loading) {
    return <div>Loading...</div>;  // หากข้อมูลยังไม่ได้มา ให้แสดงข้อความ Loading
  }

  if (error) {
    // return <div>Error: {error}</div>;  // หากเกิดข้อผิดพลาด ให้แสดงข้อความ Error
    return 
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                        เกิดข้อผิดพลาดในการโหลดข้อมูล
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{message}</p>
                        <p className="mt-2">
                            กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    โหลดข้อมูลใหม่
                </button>
            </div>
        </div>
  }

  return (
    <TransitionGroup component="div" className={`flex flex-col md:flex-row w-full h-full p-5 transition-all duration-300 ${nightMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg shadow-md`}>
      {/* Profile Section */}
      <CSSTransition key="profile-section" timeout={500} classNames="fade">
        <div className={`w-full md:w-1/3 p-5 text-center ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-black'} transition-all duration-500`}>
          <div className="w-24 h-24 rounded-full bg-purple-600 mx-auto mb-5 transition-all duration-300">
            {/* ตรวจสอบหากไม่มีรูปให้แสดงข้อความ placeholder */}
            {userData?.photo ? (
              <img src={userData.photo} alt="User Profile" className="w-full h-full rounded-full" />
            ) : (
              <div className="flex justify-center items-center w-full h-full text-white">No Photo</div>
            )}
          </div>
          <h2 className={`text-xl mb-5 ${nightMode ? 'text-gray-200' : 'text-black'}`}>
            {/* ใช้ first_name และ last_name หากมี */}
            {userData?.first_name && userData?.last_name 
              ? `${userData.first_name} ${userData.last_name}` 
              : 'Firstname Lastname'}
          </h2>
          <div>
            <p className={`cursor-pointer mb-2 ${nightMode ? 'text-gray-200 hover:underline' : 'text-black hover:underline'}`}>Personal Details</p>
            <p className={`cursor-pointer mb-2 ${nightMode ? 'text-gray-200 hover:underline' : 'text-black hover:underline'}`}>Personal Calendar Feed</p>
          </div>
          <div className="flex flex-col items-center">
            <button className={`py-2 px-4 mt-5 rounded-lg bg-yellow-500 text-white hover:bg-red-600 transition-all duration-300`} onClick={toggleEdit}>Edit</button>
            <button className={`py-2 px-4 mt-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300`}>Logout</button>
          </div>
        </div>
      </CSSTransition>
      
      {/* Main Content Section */}
      <CSSTransition key="main-content-section" timeout={500} classNames="fade">
        <div className={`flex-1 p-5 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'} transition-all duration-500 ${isEditing ? 'block' : 'hidden md:block'}`}>
          <h3 className={`text-lg mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Login</h3>
          <input 
            type="email" 
            value={userData ? userData.email : ''} 
            className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            readOnly={!isEditing}  // แก้ไขได้เมื่ออยู่ในโหมด Edit เท่านั้น
          />
          <button className={`py-2 px-4 mt-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300`}>Change</button>
          <button className={`py-2 px-4 mt-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300`}>Reset Password</button>

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Service Logins</h3>

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Contact</h3>
          <input 
            type="text" 
            placeholder="Firstname" 
            value={userData ? userData.first_name : ''} 
            className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            readOnly={!isEditing}
          />
          <input 
            type="text" 
            placeholder="Lastname" 
            value={userData ? userData.last_name : ''} 
            className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            readOnly={!isEditing}
          />

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Telephone</h3>
          <input 
            type="text" 
            placeholder="(TH) e.g. 081 234 5678" 
            value={userData ? userData.student_id : ''}  // แสดง student_id หากมี
            className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            readOnly={!isEditing}
          />

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Organization</h3>
          <input 
            type="text" 
            placeholder="Optional" 
            value={userData ? userData.role : ''}  // แสดง role หากมี
            className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            readOnly={!isEditing}
          />

          <button className={`py-2 px-4 mt-5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300`}>Save all Changes</button>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default ProfilePage;
