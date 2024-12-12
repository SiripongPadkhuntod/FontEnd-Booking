import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Dialog } from '@mui/material';
import API from '../api';
import { FaRegUser, FaUserShield, FaTimes } from 'react-icons/fa';
import { CheckCircle, XCircle } from 'lucide-react';

function UserRoles({ nightMode }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newRole, setNewRole] = useState('USER');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchedUsersData();
    getRole();
  }, []);

  const fetchedUsersData = async () => {
    try {
      const response = await API.get('/user/role');
      if (response.status === 200) {
        const fetchedUsers = response.data.results.map((user) => ({
          id: user.user_id,
          name: user.first_name + ' ' + user.last_name,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase(),
        }));
        setUsers(fetchedUsers);
      } else {
        throw new Error('Failed to fetch users data');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const putRole = async (userId, role) => {
    try {
      const response = await API.put('/user/setrole', { user_id: userId, role });
      if (response.status === 200) {
        fetchedUsersData();
      } else {
        throw new Error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getRole = async () => {
    try {
      const response = await API.get(`/get/roles`);
      if (response.status === 200) {
        const cleanedRoles = response.data.roles.map(role => {
          const cleanedRole = role.replace(/'/g, '').trim();
          return cleanedRole.charAt(0).toUpperCase() + cleanedRole.slice(1).toLowerCase();
        });
        setRoles(cleanedRoles);
      } else {
        throw new Error('Failed to fetch user roles');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleRoleChange = () => {
    const updatedUsers = users.map((user) => {
      if (selectedUsers.includes(user.id)) {
        putRole(user.id, newRole.toLowerCase());
        return { ...user, role: newRole };
      } else {
        return user;
      }
    });

    setUsers(updatedUsers);
    document.getElementById('confirmModal').close();
    document.getElementById('successModal').show();
    setSelectedUsers([]);
  };

  const handleConfirmChange = () => {
    if (selectedUsers.length === 0) {
      document.getElementById('errorModal').showModal();
    } else {
      document.getElementById('confirmModal').showModal();
    }
  };

  const handleClearSelect = () => {
    setSelectedUsers([]);
    fetchedUsersData();
    getRole();
    setNewRole('USER');
  };

  return (
    <div className={`${nightMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-full p-4 sm:p-10`}>
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
        Manage User Roles
      </h1>

      {/* Users Table */}
      <div className={`${nightMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6 mb-6 max-h-[500px] overflow-auto`}>
        <table className="min-w-full table-auto">
          <thead>
            <tr className={`${nightMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-teal-500'} text-white rounded-t-lg`}>
              <th className="py-3 px-4 text-left font-semibold text-sm">Select</th>
              <th className="py-3 px-4 text-left font-semibold text-sm">Name</th>
              <th className="py-3 px-4 text-left font-semibold text-sm">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`cursor-pointer hover:bg-blue-100 hover:scale-105 transition-all duration-300 ${nightMode ? 'hover:bg-gray-600' : ''}`}
                onClick={() => handleUserChange(user.id)}
              >
                <td className="py-3 px-4">
                  <label className="cursor-pointer flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleUserChange(user.id);
                      }}
                      className="form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out transform"
                    />
                  </label>
                </td>
                <td className={`py-3 px-4 font-medium ${nightMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</td>
                <td className={`py-3 px-4 ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Editing Section */}
      <div className={`${nightMode ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-xl shadow-lg mb-6 transition-all hover:shadow-xl`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaUserShield className="text-blue-500 mr-2" /> Select New Role
        </h2>

        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className={`${nightMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
        >
          {roles.map((role) => (
            <option key={role} value={role} className="capitalize">
              {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-between space-x-4">
          <button
            onClick={handleConfirmChange}
            className="w-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <FaUserShield className="mr-2" /> Confirm Role Change
          </button>

          <button
            onClick={handleClearSelect}
            className="w-1/2 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <FaTimes className="mr-2" /> Clear Select
          </button>
        </div>
      </div>

      {/* Modals (Confirm, Success, Error) */}
      {/* Adjust the modal background colors based on nightMode */}
      <dialog id="confirmModal" className="modal">
        <div className={`${nightMode ? 'bg-gray-800' : 'bg-gradient-to-r from-red-500 to-gray-600'} modal-box rounded-lg w-full sm:w-auto p-6`}>
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Confirm Role Change
          </h3>
          <p className="text-white mb-6">Are you sure you want to change the role for the selected users?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleRoleChange}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={() => document.getElementById('confirmModal').close()}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              No
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="successModal" className="modal">
        <div className={`${nightMode ? 'bg-gray-800' : 'bg-green-400'} modal-box rounded-lg p-6`}>
          <h3 className="text-lg font-semibold mb-4 text-white">Success!</h3>
          <p className="text-white">User roles updated successfully.</p>
          <button
            onClick={() => document.getElementById('successModal').close()}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </dialog>

      <dialog id="errorModal" className="modal">
        <div className={`${nightMode ? 'bg-gray-800' : 'bg-red-500'} modal-box rounded-lg p-6`}>
          <h3 className="text-lg font-semibold mb-4 text-white">Error</h3>
          <p className="text-white">Please select at least one user to proceed.</p>
          <button
            onClick={() => document.getElementById('errorModal').close()}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default UserRoles;
