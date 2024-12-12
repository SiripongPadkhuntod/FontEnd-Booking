// DetailsSection.js
import React from 'react';
import { TbPencilCancel } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";

const DetailsSection = ({
  isEditing,
  formData,
  handleInputChange,
  handleSave,
  handleCanselEdit,
  nightMode,
}) => {
  return (
    <div
      className={`flex-1 p-8 sm:p-12 ${nightMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'} transition-all duration-500 shadow-xl rounded-xl`}
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
                handleSave();
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
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              value={formData.student_id || ''}
              onChange={handleInputChange}
              className={`w-full p-4 rounded-lg border ${isEditing ? 'border-red-500' : 'border-gray-300'} ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 transition-all`}
              readOnly={!isEditing}
            />
            
          </div>
        </div>
      </form>
    </div>
  );
};

export default DetailsSection;
