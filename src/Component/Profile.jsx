import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate เพื่อเปลี่ยนหน้า
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ErrorDisplay from './ErrorDisplay';
import Skeleton from 'react-loading-skeleton'; // นำเข้า Skeleton
import CoTableSetting from "../Component/TableSetting";
import CoAdmin from "../Component/AdminSetting";
import ProfileDetailsSection from './PersonalDetails';
import { RiImageEditFill } from "react-icons/ri";
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้\
import { CheckCircle } from 'lucide-react';

import { FaKey, FaEye, FaSave, FaTimes, FaSignOutAlt, FaExclamationCircle } from 'react-icons/fa';
function ProfilePage({ nightMode, userid }) {
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

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // เก็บข้อความข้อผิดพลาด

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form submitted'); // Debug log
    console.log('Password and Confirm Password:', password, confirmPassword); // Debug log
    if (!password || !confirmPassword) {
      console.log('Please fill out both fields.'); // Debug log
      setErrorMessage('Please fill out both fields.');
      document.getElementById('ErrModal').showModal(); // แสดง modal ข้อผิดพลาด
    } else if (password !== confirmPassword) {
      console.log('Passwords do not match!'); // Debug log
      setErrorMessage('Passwords do not match!');
      document.getElementById('ErrModal').showModal(); // แสดง modal ข้อผิดพลาด
    } else {
      document.getElementById('confirmSaveModal').showModal(); // แสดง modal ยืนยันการบันทึก
    }
  };

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

  const handleCancelSvae = () => {
    setPassword('');
    setConfirmPassword('');
    document.getElementById('setPasswordModal').close();
    // document.getElementById('confirmSaveModal').close();
  };

  const handleSavePassword = async () => {
    const jsonData = {
      email: userData.email,
      password: password,
    };
    console.log('Edit user data:', jsonData);
    try {
      const response = await API.put('/setpassword', jsonData);

      if (response.status === 200) {
        console.log('Edit user data:', response.data);
        setFormData(jsonData);
        document.getElementById('setPasswordModal').close();
        document.getElementById('confirmSaveModal').close();
        document.getElementById('successSaveModal').showModal();
        // fetchUserData();
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (err) {
      setError(err.message);
    }

    console.log('Updated user data:', formData);
  };

 

  const handleCanselEdit = () => {
    setIsEditing(false);
    setFormData({ ...userData }); // รีเซ็ต userData2 ให้เหมือน userData
    setProfileImage(userData.photo); // รีเซ็ตภาพโปรไฟล์
  };


  const handldShowModalSetpassword = () => {
    console.log('set password');
    document.getElementById('setPasswordModal').showModal();
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
      const response = await API.get(`/users?id=${userid}`);
      // console.log('User data:', response.data);
      if (response.status === 200) {
        const userData = response.data.data;

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
  }, [userid]);


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
      <CSSTransition key="profile-section" timeout={500} classNames="fade" onExited={() => console.log('Exited')}>
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
              <div className="badge badge-primary">
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase()}
              </div>
              <div className="badge badge-secondary">
                {userData.status.charAt(0).toUpperCase() + userData.status.slice(1).toLowerCase()}
              </div>
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
                <div className="text-left text-sm text-gray-500">Manage Administrative Settings</div>
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
                <div className="text-left text-sm text-gray-500">Set Up Table Preferences</div>
              </div>
            </button>
          </div>


          {/* Logout Button - Centered on desktop */}
          <button
            onClick={() => document.getElementById('confirmModal1').showModal()}
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
          <ProfileDetailsSection
            userData={userData}
            nightMode={nightMode}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            formData={formData}
            handleInputChange={handleInputChange}
            handleCanselEdit={handleCanselEdit}
            handleSave={handleSave}
            handldShowModalSetpassword={handldShowModalSetpassword}
          />
        </div>
      </CSSTransition>


      {/* Calendar Section */}
      <CSSTransition key="calendar-section" timeout={500} classNames="fade">
        <div
          className={`flex-1  ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} transition-all duration-500 shadow-lg rounded-lg ${showCalendar ? '' : 'hidden'}`}
        >
          <CoAdmin nightMode={nightMode} />
        </div>
      </CSSTransition>


      {/* TableConfig Section */}
      <CSSTransition key="TableConfig" timeout={500} classNames="fade">
        <div className={`flex-1 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} transition-all duration-500 shadow-lg rounded-lg ${showTable ? '' : 'hidden'}`} >
          <CoTableSetting nightMode={nightMode} />
        </div>
      </CSSTransition>

      <dialog id="confirmModal1" className="modal">
        <div
          className={`${nightMode ? 'bg-gray-800' : 'bg-gradient-to-r from-red-500 to-gray-600'} modal-box rounded-lg w-full sm:w-auto p-6`}
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <FaSignOutAlt className="w-6 h-6 text-red-400" /> Confirm Logout
          </h3>
          <p className="text-white mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-200"
            >
              <FaSignOutAlt className="w-5 h-5 inline-block mr-2" />
              Logout
            </button>
            <button
              onClick={() => document.getElementById('confirmModal1').close()}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all duration-200"
            >
              <FaTimes className="w-5 h-5 inline-block mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </dialog>



       {/* Password Set Modal */}
       <dialog id="setPasswordModal" className="modal">
        <div className={`modal-box rounded-lg w-full sm:w-[480px] p-8 shadow-lg border border-gray-300 ${nightMode ? 'bg-gray-100' : 'bg-white'}`}>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
            <FaKey className="w-6 h-6 text-blue-500" />
            Set Password
          </h3>
          <form id="setPasswordForm" className="space-y-6" >
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-400 focus:outline-none focus:ring focus:ring-blue-400 rounded-full transition-all duration-300"
                >
                  <FaEye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-400 focus:outline-none focus:ring focus:ring-blue-400 rounded-full transition-all duration-300"
                >
                  <FaEye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 flex items-center gap-2"
                onClick={(e) => handleSubmit(e)}
              >
                <FaSave className="w-5 h-5" />
                Save
              </button>
              <button
                type="button"
                onClick={() => handleCancelSvae()}
                className="bg-gray-200 text-gray-700 font-medium py-3 px-8 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 flex items-center gap-2"
              >
                <FaTimes className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Error Modal */}
      <dialog id="ErrModal" className="modal">
        <div className="modal-box rounded-lg w-full sm:w-[480px] p-8 shadow-lg border border-red-300 bg-red-50">
          <h3 className="text-2xl font-semibold mb-6 text-red-800 flex items-center gap-3">
            <FaExclamationCircle className="w-6 h-6 text-red-500" />
            Error
          </h3>
          <p className="text-red-700 mb-6">{errorMessage}</p>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => document.getElementById('ErrModal').close()} className="bg-red-200 text-red-700 font-medium py-3 px-8 rounded-lg hover:bg-red-300 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 flex items-center gap-2">
              <FaTimes className="w-5 h-5" />
              Close
            </button>
          </div>
        </div>
      </dialog>

      



      {/* dialog confirm save */}
      <dialog id="confirmSaveModal" className="modal">
        <div
          className="
      bg-white modal-box rounded-lg w-full sm:w-[480px] p-8 shadow-lg border border-gray-300
    "
        >
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
            <FaExclamationCircle className="w-6 h-6 text-red-500" />
            Confirm Save
          </h3>
          <p className="text-gray-700 mb-6">
            You can only set your password once. If you need to change it, please contact the system administrator.
          </p>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => document.getElementById('confirmSaveModal').close()}
              className="bg-gray-200 text-gray-700 font-medium py-3 px-8 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 flex items-center gap-2"
            >
              <FaTimes className="w-5 h-5" />
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 flex items-center gap-2"
              onClick={() => {
                // Add save functionality here
                
                handleSavePassword();
              }}
            >
              <FaSave className="w-5 h-5" />
              Confirm
            </button>
          </div>
        </div>
      </dialog>


      {/* dialog success save */}
      <dialog id="successSaveModal" className="modal">
        <div
          className= {`${nightMode ? 'bg-gray-800' : 'bg-gradient-to-r from-green-500 to-gray-600'} modal-box rounded-lg w-full sm:w-[480px] p-8 shadow-lg border border-gray-300`} 
        >

          <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Success
          </h3>
          <p className="text-white mb-6">Your password has been set successfully.</p>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                document.getElementById('successSaveModal').close();
                setPassword('');
                setConfirmPassword('');
                fetchUserData();
              }}
              className="bg-gray-200 text-gray-700 font-medium py-3 px-8 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 flex items-center gap-2"
            >
              <FaTimes className="w-5 h-5" />
              Close
            </button>
          </div>
        </div>
      </dialog>





    </TransitionGroup>
  );
}


export default ProfilePage;