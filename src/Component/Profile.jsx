import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { json, useNavigate } from 'react-router-dom'; // ใช้ useNavigate เพื่อเปลี่ยนหน้า
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ErrorDisplay from './ErrorDisplay';
import { TbPencilCancel } from "react-icons/tb";
import Skeleton from 'react-loading-skeleton'; // นำเข้า Skeleton
import CoTableSetting from "../Component/TableSetting";
import CoAdmin from "../Component/AdminSetting";

import { FaEdit } from "react-icons/fa";
import { RiImageEditFill } from "react-icons/ri";
import { Save } from 'lucide-react';
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้\
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
  const [profileImage, setProfileImage] = useState(userData?.photo || "/api/placeholder/80/80");
  const [imageBG, setImageBG] = useState(userData?.photo || "/api/placeholder/80/80");
  const [formData, setFormData] = useState({});
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

    handleupload(file, userData.email);
    console.log('File:', file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setFormData({ ...userData }); // รีเซ็ต userData2 ให้เหมือน userData
    setProfileImage(userData.photo); // รีเซ็ตภาพโปรไฟล์
  };



  const handleupload = async (file, email) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email); // เพิ่ม email ลงใน formData

    try {
      const response = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Upload photo:', response.data);
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (err) {
      console.error('Error uploading file:', err.message);
    }
  };





  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(`/users/email/${useremail}`);
      
      if (response.status === 200) {
        const userData = response.data;
        setUserData(userData);
        setFormData(userData);
        setProfileImage(userData.photo || "/api/placeholder/80/80");
        setRole(userData.role);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      setError(err.message);
      console.error('User data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [useremail]);


  const editUserData = async () => {
    const jsonData = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phonenumber: formData.phonenumber,
      student_id: formData.student_id,
      department: formData.department,
    };
    // console.log('Edit user data:', jsonData);
    try {
      const response = await API.put('/editprofile', jsonData);

      if (response.status === 200) {
        console.log('Edit user data:', response.data);
        setFormData(jsonData);
        fetchUserData();
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (err) {
      setError(err.message);
    }

    console.log('Updated user data:', formData);
  };


  const handleSave = async () => {
    editUserData();
    setIsEditing(false);
  };





  if (loading) {
    return (

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

  const initials = `${userData?.first_name?.charAt(0) || ''}${userData?.last_name?.charAt(0) || ''}`;

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


            <div className="absolute -bottom-10 left-4">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-blue-500 overflow-hidden flex justify-center items-center">
                {profileImage ? (
                  <img src={profileImage} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-semibold text-white">{initials}</span>
                )}
              </div>
              {/* edit button */}
              <button
                className={`absolute bottom-0 right-0 mb-2 mr-2 w-8 h-8 bg-yellow-500 text-white rounded-full flex justify-center items-center hover:bg-blue-700 transition-all
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
              className={`flex items-center gap-2 hover:text-blue-600 hover:bg-orange-200 h-20 w-full drop-shadow-lg rounded-lg text-xl justify-start p-5 transition-all duration-300 transform ${showDetails ? 'bg-blue-500 text-black scale-105' : 'bg-white text-gray-800'}`}
              onClick={() => {
                setShowDetails(true);
                setShowCalendar(false); // Hide calendar section
                setShowTable(false); // Hide table section
              }} // Show details section
            >
              <span className="w-8 h-8">📝</span>
              <div className="flex flex-col ml-2">
                <div className="text-left font-semibold">Personal Details</div>
                <div className="text-left text-sm text-gray-500">Manage your user-account settings</div>
              </div>
            </button>

            <button
              className={`flex items-center gap-2 hover:text-blue-600 hover:bg-orange-200 h-20 w-full drop-shadow-lg rounded-lg text-xl justify-start p-5 transition-all duration-300 transform ${showCalendar ? 'bg-blue-500 text-black scale-105' : 'bg-white text-gray-800'} ${role === 'admin' ? '' : 'hidden'}`}
              onClick={() => {
                setShowDetails(false); // Hide details section
                setShowCalendar(true); // Show calendar section
                setShowTable(false); // Hide table section
                setIsEditing(false);
              }} // Show calendar section
            >
              <span className="w-8 h-8">⚙️</span>
              <div className="flex flex-col ml-2">
                <div className="text-left font-semibold">Admin Setting</div>
                <div className="text-left text-sm text-gray-500">Manage your personal calendar</div>
              </div>
            </button>

            <button
              className={`flex items-center gap-2 hover:text-blue-600 hover:bg-orange-200 h-20 w-full drop-shadow-lg rounded-lg text-xl justify-start p-5 transition-all duration-300 transform ${showTable ? 'bg-blue-500 text-black scale-105' : 'bg-white text-gray-800'} ${role === 'admin' ? '' : 'hidden'}`}
              onClick={() => {
                setShowDetails(false); // Hide details section
                setShowCalendar(false); // Hide calendar section
                setShowTable(true); // Show table section
                setIsEditing(false);
              }} // Show table section
            >
              <span className="w-8 h-8">⚙️</span>
              <div className="flex flex-col ml-2">
                <div className="text-left font-semibold">Table Setting</div>
                <div className="text-left text-sm text-gray-500">Manage your personal calendar</div>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className={`bg-white rounded-lg p-8 shadow-xl transition-all duration-300 transform ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} scale-95 hover:scale-100`}
            onClick={(e) => {
              // หยุดการกระจายเหตุการณ์เพื่อป้องกันการปิด modal
              e.stopPropagation();
            }}
          >
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={(e) => {
                  // หยุดการกระจายเหตุการณ์และปิด modal
                  e.stopPropagation();
                  setShowLogoutModal(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  // หยุดการกระจายเหตุการณ์และออกจากระบบ
                  e.stopPropagation();
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
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
          className={`flex-1 p-8 sm:p-12 ${nightMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'} transition-all duration-500 shadow-xl rounded-xl ${showDetails ? '' : 'hidden'}`}
        >
          <form className="space-y-8">
            {/* ปุ่ม Edit */}
            <div className="flex justify-end mb-6 mt-4">
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  checked={isEditing}
                  onChange={() => {
                    if (isEditing) {
                      handleCanselEdit();
                    }
                    setIsEditing(!isEditing);
                  }}
                />
                <div className="swap-on text-3xl text-red-500 rounded-full h-12 w-12 flex justify-center items-center transition-all">
                  {isEditing ? <TbPencilCancel /> : <FaEdit />}
                </div>
                <div className="swap-off text-2xl text-yellow-500 rounded-full h-12 w-12 flex justify-center items-center transition-all">
                  {isEditing ? <TbPencilCancel /> : <FaEdit />}
                </div>
              </label>
            </div>

            {/* Email Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">Email Address</h3>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg border ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  readOnly
                />
                <span className="absolute right-4 top-3 text-sm text-gray-500">Read-Only</span>
              </div>
            </div>

            {/* Reset Password Button */}
            <div className="flex justify-center mt-4 sm:mt-8">
              <button
                className="py-2 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 w-full sm:w-auto"
                type="button"
              >
                Reset Password
              </button>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name || ''}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg border ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  readOnly={!isEditing}
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name || ''}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg border ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="phonenumber"
                  placeholder="Phone Number"
                  value={formData.phonenumber || ''}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg border ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Organization Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">Organization Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="student_id"
                  placeholder="Student ID"
                  value={formData.student_id || ''}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg border ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  readOnly={!isEditing}
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg border ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-center mt-8">
                <button
                  className="py-2 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
                  type="button"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </CSSTransition>


      {/* Calendar Section */}
      <CSSTransition key="calendar-section" timeout={500} classNames="fade">
        <div
          className={`flex-1 p-10 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} transition-all duration-500 shadow-lg rounded-lg ${showCalendar ? '' : 'hidden'}`}
        >
          <CoAdmin/>
        </div>



      </CSSTransition>

      {/* TableConfig Section */}
      <CSSTransition key="TableConfig" timeout={500} classNames="fade">
        <div
          className={`flex-1 p-10 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} transition-all duration-500 shadow-lg rounded-lg ${showTable ? '' : 'hidden'}`}
        >
          <CoTableSetting />
        </div>
      </CSSTransition>
    </TransitionGroup>


  );
}


export default ProfilePage;