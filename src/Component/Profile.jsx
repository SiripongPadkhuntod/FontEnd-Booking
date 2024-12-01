import React, { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom'; // ใช้ useNavigate เพื่อเปลี่ยนหน้า
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ErrorDisplay from './ErrorDisplay';
import { TbPencilCancel } from "react-icons/tb";
import Skeleton from 'react-loading-skeleton'; // นำเข้า Skeleton

import { FaEdit } from "react-icons/fa";
import { RiImageEditFill } from "react-icons/ri";
import { Save } from 'lucide-react';
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้

function ProfilePage({ nightMode, useremail }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(true); // Default to show Details section
  const [showCalendar, setShowCalendar] = useState(false); // Default to hide Calendar section
  const [showTable, setShowTable] = useState(false); // Default to hide Calendar section
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [role, setRole] = useState('user');
  const [image, setImage] = useState(userData?.photo || "/api/placeholder/80/80");
  const [imageBG, setImageBG] = useState(userData?.photo || "/api/placeholder/80/80");
  const [userData2, setUserData2] = useState({});
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับเปลี่ยนเส้นทาง

  useEffect(() => {

    fetchUserData()
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // อัปเดตภาพที่เลือก
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น URL
    }
  };






  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData2({ ...userData2, [name]: value });
  };


 


  const handleLogout = () => {
    localStorage.removeItem('authToken'); // ลบ Token จาก LocalStorage
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Login
  };

  // const toggleEdit = () => {
  //   setIsEditing(!isEditing);
  // };

  const handleCloseModal = () => {
    console.log('Close modal clicked'); // Debug log
    setShowLogoutModal(false);
  };

  const handleCanselEdit = () => {
    setIsEditing(false);
    setUserData2(null);
    setUserData2(userData);
  };



  const fetchUserData = async () => {
    try {
      const response = await API.get(`/users/email/${useremail}`);

      if (response.status === 200) {
        setUserData(response.data);
        setUserData2(response.data);
        setRole(response.data.role);
      } else {
        throw new Error('Failed to fetch user data');
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };


  const editUserData = async () => {
    const jsonData = {
      email: userData2.email,
      first_name: userData2.first_name,
      last_name: userData2.last_name,
      phonenumber: userData2.phonenumber,
      student_id: userData2.student_id,
      department: userData2.department,
    };

    console.log('Edit user data:', jsonData);

    try {
      const response = await API.put('/editprofile', jsonData);

      if (response.status === 200) {
        console.log('Edit user data:', response.data);
        setUserData2(jsonData);
        fetchUserData();
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (err) {
      setError(err.message);
    }

    console.log('Updated user data:', userData2);
  };


  const handleSave = async () => {
    editUserData();
    setIsEditing(false);
  };



  

  if (loading) {
    return (
      // <div className="flex items-center justify-center min-h-screen">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      //   <span className="ml-3">กำลังโหลดข้อมูล...</span>
      // </div>

      <div className="flex items-center justify-center ">
        {/* ใช้ Skeleton สำหรับ loading */}
        <Skeleton count={5} height={30} width="80%" />
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
      className={`flex flex-col md:flex-row w-full h-full transition-all duration-300 gap-5 ${nightMode ? 'bg-gray-900' : 'bg-gray-100'
        } rounded-lg shadow-md`}
    >
      {/* Profile Section */}
      <CSSTransition key="profile-section" timeout={500} classNames="fade">
        <div
          className={`w-full md:w-1/3 p-10 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}
                    transition-all duration-500 shadow-lg rounded-lg flex flex-col`}
        >
          <h1 className="cursor-pointer text-blue-500 hover:underline text-2xl font-bold mb-5 text-left  drop-shadow-lg">
            My Profile
          </h1>

          {/* Profile Picture */}
          <div
            className={`relative rounded-xl p-4 h-40`}
            style={{ backgroundImage: 'url("https://i.pinimg.com/736x/3c/36/9a/3c369a99eb52dfc6cf0db66bfc3fa909.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Edit Button */}
            <botton
              className={`absolute bottom-0 right-0 mb-2 mr-2 w-10 h-10 bg-blue-500 text-white rounded-full flex justify-center items-center hover:bg-blue-700 transition-all ${isEditing ? '' : 'hidden'}`}
              type="file"
              onClick={() => document.getElementById('fileInputBG').click()}
            >
              <RiImageEditFill className="w-6 h-6" />
              {/* ซ่อน input file */}
              <input
                  id="fileInputBG"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange} // ตรวจจับการเลือกไฟล์
                />
            </botton>

            <div className="absolute -bottom-10 left-4">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                <img
                  src={image}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* edit button */}
              <button
                className={`absolute bottom-0 right-0 mb-2 mr-2 w-8 h-8 bg-blue-500 text-white rounded-full flex justify-center items-center hover:bg-blue-700 transition-all
                  ${isEditing ? '' : 'hidden'}`}
                onClick={() => document.getElementById('fileInput').click()} // เปิด input file เมื่อคลิกที่ปุ่ม
                disabled={!isEditing} // ปิดปุ่มเมื่อไม่ได้อยู่ในโหมดแก้ไข
         
              >
                <RiImageEditFill className="w-4 h-4" />

                {/* ซ่อน input file */}
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange} // ตรวจจับการเลือกไฟล์
                />
              </button>
            </div>
          </div>

          {/* User Details */}
          <div className="mt-12 mb-5 ">
            <h2 className="text-xl font-semibold">
              {userData?.first_name} {userData?.last_name || 'Firstname Lastname'}
            </h2>
            <div className="flex justify-start gap-1 mt-3">
              <div className="badge badge-primary">{userData.role}</div>
              <div className="badge badge-secondary">{userData.status}</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-4">


            <button
              className={`flex items-center gap-2 hover:text-blue-600 hover:bg-orange-200 h-20 w-full drop-shadow-lg rounded-lg text-xl justify-start p-5
                          ${showDetails ? 'bg-blue-500 text-black' : 'bg-white text-gray-800'}
          
                        `}
              onClick={() => {
                setShowDetails(true);
                setShowCalendar(false); // Hide calendar section
                setShowTable(false); // Hide calendar section
              }} // Show details section
            >
              <span className="w-8 h-8">📝</span>
              <div className="flex flex-col ml-2">
                <div className="text-left">Personal Details</div>
                <div className="text-left text-sm">Manage your user-account settings</div>
              </div>
            </button>

            <button
              className={`flex items-center gap-2 hover:text-blue-600 hover:bg-orange-200 h-20 w-full drop-shadow-lg rounded-lg text-xl justify-start p-5
                          ${showCalendar ? 'bg-blue-500 text-black' : 'bg-white text-gray-800'} 
                          ${role === 'admin' ? '' : 'hidden'}
                        `}
              onClick={() => {
                setShowDetails(false); // Hide details section
                setShowCalendar(true); // Show calendar section
                setShowTable(false); // Hide calendar section
                setIsEditing(false);
              }} // Show calendar section
            >

              <span className="w-8 h-8">⚙️</span>
              <div className="flex flex-col ml-2">
                <div className="text-left">Admin Setting</div>
                <div className="text-left text-sm">Manage your personal calendar</div>
              </div>
            </button>

            <button
              className={`flex items-center gap-2 hover:text-blue-600 hover:bg-orange-200 h-20 w-full drop-shadow-lg rounded-lg text-xl justify-start p-5
                          ${showTable ? 'bg-blue-500 text-black' : 'bg-white text-gray-800'} 
                          ${role === 'admin' ? '' : 'hidden'}
                        `}
              onClick={() => {
                setShowDetails(false); // Hide details section
                setShowCalendar(false); // Show calendar section
                setShowTable(true); // Hide calendar section
                setIsEditing(false);
              }} // Show calendar section
            >

              <span className="w-8 h-8">⚙️</span>
              <div className="flex flex-col ml-2">
                <div className="text-left">Table Setting</div>
                <div className="text-left text-sm">Manage your personal calendar</div>
              </div>
            </button>
          </div>

          {/* Logout Button - Centered on desktop */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="hidden lg:flex mt-auto w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors max-w-xs mx-auto justify-center"
          >
            Logout
          </button>
        </div>
      </CSSTransition>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`bg-white rounded-lg p-6 shadow-xl ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleCloseModal()}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Details Section */}
      <CSSTransition key="details-section" timeout={500} classNames="fade">
        <div
          className={`flex-1 p-10 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} transition-all duration-500 shadow-lg rounded-lg ${showDetails ? '' : 'hidden'}`}
        >
          <form>
            {/* ปุ่ม Edit */}
            <div className="flex justify-end mb-4 mr-4 mt-4">
              {/* Swap input checkbox */}
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  checked={isEditing}
                  onChange={() => {
                    if (isEditing) {
                      handleCanselEdit(); // หากแก้ไขแล้วกดปุ่ม จะเรียกฟังก์ชันยกเลิก
                    }
                    setIsEditing(!isEditing); // Toggle edit mode
                  }}
                />

                {/* Swap-on display when checked */}
                <div className="swap-on text-3xl text-red-500 rounded-full  h-10 w-10 place-items-center content-center">  {/* เพิ่มขนาดไอคอน */}
                  {isEditing ? <TbPencilCancel /> : <FaEdit />}
                </div>
                {/* Swap-off display when unchecked */}
                <div className="swap-off text-2xl text-yellow-500 rounded-full  h-10 w-10 place-items-center content-center"> {/* เพิ่มขนาดไอคอน */}
                  {isEditing ? <TbPencilCancel /> : <FaEdit />}
                </div>
              </label>
            </div>


            {/* Login Section */}

            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Login Information
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
              <div className="tooltip tooltip-top tooltip-info" data-tip="หากต้องการแก้ไข Email โปรดติดต่อผู้ดูแลระบบ">
                <label className="input input-bordered flex items-center gap-2 bg-white text-gray-500 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70  ">
                    <path
                      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path
                      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={userData2.email || ''}
                    onChange={handleInputChange}
                    className={` w-full p-3  `}
                    readOnly
                    onClick={() => { }}
                  />
                </label>
              </div>
              {/* add reset password */}
              <button
                className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 w-full sm:w-fit max-w-md p-3 mb-4"
                type="button"
              >
                Reset Password
              </button>
            </div>

            {/* Contact Section */}
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact</h3>
            {/* <div className="grid grid-cols-2 gap-2"> */}
            <div className="flex flex-col md:flex-row justify-start gap-5 mt-3">
              <input
                type="text"
                name="first_name"
                placeholder="Firstname"
                value={userData2.first_name || ''}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border border-gray-300  max-w-xs  ${isEditing ? 'text-red-600' : 'text-gray-500'}
                  ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
                readOnly={!isEditing}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Lastname"
                value={userData2.last_name || ''}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border border-gray-300  max-w-xs  ${isEditing ? 'text-red-600' : 'text-gray-500'}
                  ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
                readOnly={!isEditing}
              />
            </div>

            {/* Telephone Section */}
            <h3 className="text-lg font-semibold mt-6 mb-4 border-b pb-2">
              Telephone
            </h3>
            <input
              type="text"
              name="phonenumber"
              placeholder="(TH) e.g. 081 234 5678"
              value={userData2.phonenumber || ''}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg border border-gray-300  max-w-xs  ${isEditing ? 'text-red-600' : 'text-gray-500'}
                  ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
              readOnly={!isEditing}
            />

            {/* Organization Section */}
            <h3 className="text-lg font-semibold mt-6 mb-4 border-b pb-2">
              Organization
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="student_id"
                placeholder="Student ID"
                value={userData2.student_id || ''}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border border-gray-300  max-w-xs  ${isEditing ? 'text-red-600' : 'text-gray-500'}
                  ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
                readOnly={!isEditing}
              />
              <input
                type="text"
                name="department"
                placeholder="Major"
                value={userData2.department || ''}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border border-gray-300  max-w-xs  ${isEditing ? 'text-red-600' : 'text-gray-500'}
                ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
                readOnly={!isEditing}
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                className="py-2 px-4 mt-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
                type="button"
                onClick={handleSave}
              >
                Save all Changes
              </button>
            )}
          </form>
        </div>
      </CSSTransition>

      {/* Calendar Section */}
      <CSSTransition key="calendar-section" timeout={500} classNames="fade">
        <div
          className={`flex-1 p-10 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} transition-all duration-500 shadow-lg rounded-lg ${showCalendar ? '' : 'hidden'}`}
        >
          <h3 className="text-xl font-semibold mb-4">Admin Setting</h3>
          <div className="text-center text-gray-500">
            {/* เพิ่มที่นี่เพื่อแสดงข้อมูล Personal Calendar */}
            <p>กำลังพัฒนา ^_^</p>
            <p>Coming soon...</p>
          </div>
        </div>
      </CSSTransition>

      {/* Modal */}

      {/* <dialog
        className="modal modal-open"
      >
        <div style={{ animation: "popup 0.4s ease-in-out" }} className="modal-box bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-xl rounded-lg">
          <h3 className="font-bold text-2xl mb-4">{"message"}</h3>
          <p className="py-4">{"submessage"}</p>
          <div className="flex justify-end space-x-4">

            <button className="btn btn-sm btn-success text-white shadow-md" >
              Save
            </button>
            <button className="btn btn-sm btn-neutral text-white shadow-md" >
              Cancel
            </button>

          </div>
        </div>
        <div
          className="modal-backdrop backdrop-blur-sm bg-opacity-30"
        ></div>
      </dialog> */}


    </TransitionGroup>


  );
}


export default ProfilePage;