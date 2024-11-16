import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ใช้ useNavigate เพื่อเปลี่ยนหน้า
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ErrorDisplay from './ErrorDisplay';

function ProfilePage({ nightMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับเปลี่ยนเส้นทาง
  
  // const { id } = useParams();  // ใช้เพื่อดึง :id จาก URL
  const id = 'siripong.p64@rsu.ac.th'

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // ลบ Token จาก LocalStorage
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Login
  };
  
  // const toggleEdit = () => {
  //   setIsEditing(!isEditing);
  // };

 
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
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-3">กำลังโหลดข้อมูล...</span>
      </div>
  );
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <TransitionGroup
  component="div"
  className={`flex flex-col md:flex-row w-full h-full p-5 transition-all duration-300 ${nightMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg shadow-md`}
>
  {/* Profile Section */}
  <CSSTransition key="profile-section" timeout={500} classNames="fade">
    <div
      className={`w-full md:w-1/3 p-5 text-center ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} transition-all duration-500 shadow-lg rounded-lg`}
    >
      {/* Profile Picture */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-5 overflow-hidden">
          {userData?.photo ? (
            <img src={userData.photo} alt="User Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex justify-center items-center w-full h-full text-gray-500">No Photo</div>
          )}
        </div>
        <button className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.5 17.5L17.5 2.5" />
          </svg>
        </button>
      </div>
      {/* User Details */}
      <h2 className="text-lg font-semibold mt-2">{userData?.first_name} {userData?.last_name || 'Firstname Lastname'}</h2>
      <div className="mt-4 space-y-3">
        <p className="cursor-pointer text-blue-500 hover:underline">Personal Details</p>
        <p className="cursor-pointer text-blue-500 hover:underline">Personal Calendar Feed</p>
      </div>
      {/* <button
        className="py-2 px-4 mt-5 w-full rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-300"
        onClick={toggleEdit}
      >
        Edit
      </button> */}
      <button
        className="py-2 px-4 mt-3 w-full rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </CSSTransition>

  {/* Details Section */}
  <CSSTransition key="details-section" timeout={500} classNames="fade">
    <div
      className={`flex-1 p-5 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} transition-all duration-500 shadow-lg rounded-lg`}
    >
      <h3 className="text-lg font-semibold mb-4">Login</h3>
      <input
        type="email"
        value={userData?.email || ''}
        className="w-full max-w-lg p-2 mb-4 rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
        readOnly={!isEditing}
      />
      <div className="flex space-x-3 mb-6">
        <button className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Change</button>
        <button className="py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600">Reset Password</button>
      </div>

      <h3 className="text-lg font-semibold mb-4">Contact</h3>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Firstname"
          value={userData?.first_name || ''}
          className="w-full p-2 rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
          readOnly={!isEditing}
        />
        <input
          type="text"
          placeholder="Lastname"
          value={userData?.last_name || ''}
          className="w-full p-2 rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
          readOnly={!isEditing}
        />
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-4">Telephone</h3>
      <input
        type="text"
        placeholder="(TH) e.g. 081 234 5678"
        value={userData?.phonenumber || ''}
        className="w-full p-2 rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
        readOnly={!isEditing}
      />

      <h3 className="text-lg font-semibold mt-6 mb-4">Organization</h3>
      <input
        type="text"
        placeholder="Optional"
        value={userData?.role || ''}
        className="w-full p-2 rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
        readOnly={!isEditing}
      />

      <button
        className="py-2 px-4 mt-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
      >
        Save all Changes
      </button>
    </div>
  </CSSTransition>
</TransitionGroup>
  );
}

export default ProfilePage;
