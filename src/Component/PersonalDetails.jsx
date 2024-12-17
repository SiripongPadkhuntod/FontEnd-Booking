import React, { useState, useEffect } from 'react';
import { FaEdit, FaRedo, FaLock, FaSave, FaPhoneAlt, FaUniversity, FaBuilding } from 'react-icons/fa';
import { TbPencilCancel } from 'react-icons/tb';
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้

function ProfileDetailsSection({
  userData,
  nightMode,
  isEditing,
  setIsEditing,
  formData,
  handleInputChange,
  handleCanselEdit,
  handleSave
}) {

  const [initialFormData, setInitialFormData] = useState(formData);

  const [showPasswordModal, setShowPasswordModal] = useState(false);  // เพิ่มสถานะสำหรับเปิด modal การตั้งรหัสผ่าน
  const [password, setPassword] = useState('');  // สำหรับเก็บรหัสผ่านที่กรอก

  // Function to check if all required fields are filled out
  const isFormValid = () => {
    return formData.first_name && formData.last_name && formData.phonenumber && formData.student_id && formData.department;
  };

  // Check if the form has been modified
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  // Open the modal when the save button is clicked and there are changes
  const handleSaveChanges = () => {
    if (hasChanges()) {
      setShowModal(true);
    } else {
      handleSave();
    }
  };

  const checkPassword = async () => {
    try {
      // ตรวจสอบว่ามี email หรือไม่
      if (!formData.email) {
        throw new Error('Email is required');
      }

      // ส่งข้อมูล email ไปยัง API ผ่าน GET
      const response = await API.get(`/checkpassword?email=${formData.email}`);

      if (response.status === 200) {
        // ตรวจสอบว่ามีรหัสผ่านในระบบหรือไม่
        if (response.data.data) {
          console.log('Password exists');
        } else {
          console.log('Password does not exist');
          setShowPasswordModal(true); // ถ้าไม่มีรหัสผ่านให้แสดง modal
        }
      } else {
        throw new Error('Error checking password');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSetPassword = async () => {
    try {
      if (!password) {
        alert('Please enter a password');
        return;
      }

      // ส่งข้อมูลรหัสผ่านไปยัง API
      const response = await API.post('/setpassword', {
        email: formData.email,
        password: password,
      });

      if (response.status === 200) {
        alert('Password set successfully');
        setShowPasswordModal(false); // ปิด modal หลังจากตั้งรหัสผ่านเสร็จ
      } else {
        alert('Failed to set password');
      }
    } catch (error) {
      console.error('Error setting password:', error.message);
      alert('Error setting password');
    }
  };


  useEffect(() => {
    // console.log(formData); // ดูว่า formData เปลี่ยนแปลงถูกต้องหรือไม่
    setInitialFormData(formData);
    checkPassword();
    console.log("setShowPasswordModal", showPasswordModal);
  }, [formData]);





  return (
    <form className="space-y-8  rounded-xl ">
      {/* Edit Toggle */}
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
          <div className={`swap-on text-3xl ${isEditing ? 'text-red-500' : 'text-yellow-500'} rounded-full h-12 w-12 flex justify-center items-center transition-all`}>
            {isEditing ? <TbPencilCancel /> : <FaEdit />}
          </div>
          <div className={`swap-off text-2xl ${isEditing ? 'text-red-500' : 'text-yellow-500'} rounded-full h-12 w-12 flex justify-center items-center transition-all`}>
            {isEditing ? <TbPencilCancel /> : <FaEdit />}
          </div>
        </label>
      </div>

      {/* Email Section */}
      <div className="space-y-4">
        <h3 className={`text-2xl font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>Email Address</h3>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-lg border-2 ${nightMode ? 'border-gray-600' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 shadow-lg transition-all`}
            readOnly
          />
          <span className={`absolute right-4 top-3 text-sm ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>Read-Only</span>
        </div>
      </div>

      {/* Reset Password Button */}
      <div className="flex justify-start mt-4 sm:mt-8 space-x-4">
        {showPasswordModal && (
          <button
            className="py-2 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            type="button"
          >
            <FaLock className="h-5 w-5" />
            <span>Set Password</span>
          </button>
        )}
        <button
          className="py-2 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
          type="button"
        >
          <FaRedo className="h-5 w-5" />
          <span>Reset Password</span>
        </button>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className={`text-2xl font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <FaEdit className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name || ''}
              onChange={handleInputChange}
              className={`w-full p-4 pl-12 rounded-lg border-2 ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 shadow-sm transition-all`}
              readOnly={!isEditing}
            />
          </div>
          <div className="relative">
            <FaEdit className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name || ''}
              onChange={handleInputChange}
              className={`w-full p-4 pl-12 rounded-lg border-2 ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 shadow-sm transition-all`}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-4">
        <h3 className={`text-2xl font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <FaPhoneAlt className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              name="phonenumber"
              placeholder="Phone Number"
              value={formData.phonenumber || ''}
              onChange={handleInputChange}
              className={`w-full p-4 pl-12 rounded-lg border-2 ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 shadow-sm transition-all`}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Organization Section */}
      <div className="space-y-4">
        <h3 className={`text-2xl font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Organization Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <FaUniversity className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              value={formData.student_id || ''}
              onChange={handleInputChange}
              className={`w-full p-4 pl-12 rounded-lg border-2 ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 shadow-sm transition-all`}
              readOnly={!isEditing}
            />
          </div>
          <div className="relative">
            <FaBuilding className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department || ''}
              onChange={handleInputChange}
              className={`w-full p-4 pl-12 rounded-lg border-2 ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 shadow-sm transition-all`}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-center mt-8">
          <button
            className={`py-2 px-6 rounded-lg ${isFormValid() ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'} text-white hover:bg-green-600 transition-all duration-300`}
            type="button"
            onClick={handleSaveChanges}
            disabled={!isFormValid()}
          >
            <FaSave className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </form>

  );


}

export default ProfileDetailsSection;
