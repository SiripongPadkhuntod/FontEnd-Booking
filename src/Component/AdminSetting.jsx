import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Dialog } from '@mui/material';

function UserRoles() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newRole, setNewRole] = useState('USER');
  
  useEffect(() => {
    const fetchedUsers = [
      { id: 1, name: 'John Doe', role: 'USER' },
      { id: 2, name: 'Jane Smith', role: 'ADMIN' },
      { id: 3, name: 'Alice Johnson', role: 'USER' },
      { id: 4, name: 'Bob Brown', role: 'USER' },
      { id: 5, name: 'Charlie Davis', role: 'USER' },
    ];
    setUsers(fetchedUsers);
  }, []);

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
    const updatedUsers = users.map((user) =>
      selectedUsers.includes(user.id)
        ? { ...user, role: newRole }
        : user
    );

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

  // Clear the selected users
  const handleClearSelect = () => {
    setSelectedUsers([]);
  };

  return (
    <div className="bg-gray-100 min-h-full p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center sm:text-left">Manage User Roles</h1>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 max-h-[500px] overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-gray-600">Select</th>
              <th className="py-3 px-4 text-left text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="cursor-pointer hover:bg-gray-50">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserChange(user.id)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Editing Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select New Role</h2>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={handleConfirmChange}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
        >
          Confirm Role Change
        </button>

        {/* Clear Select Button */}
        <button
          onClick={handleClearSelect}
          className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mt-4"
        >
          Clear Select
        </button>
      </div>

      {/* Confirm Modal */}
      <dialog id="confirmModal" className="modal">
        <div className="modal-box rounded-lg w-full sm:w-auto bg-black">
          <h3 className="text-lg font-semibold mb-4 text-white">Confirm Role Change</h3>
          <p className="text-white">Are you sure you want to change the role for the selected users?</p>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleRoleChange}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Yes, Confirm
            </button>
            <button
              onClick={() => document.getElementById('confirmModal').close()}
              className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Success Modal */}
      <dialog id="successModal" className="modal">
        <div className="modal-box rounded-lg w-full sm:w-auto bg-black">
          <h3 className="text-lg font-semibold mb-4 text-white">Success!</h3>
          <p className="text-white">The selected users' roles have been updated successfully.</p>
          <button
            onClick={() => document.getElementById('successModal').close()}
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 mt-4"
          >
            Close
          </button>
        </div>
      </dialog>

      {/* Error Modal */}
      <dialog id="errorModal" className="modal">
        <div className="modal-box rounded-lg w-full sm:w-auto bg-black">
          <h3 className="text-lg font-semibold mb-4 text-white">Error!</h3>
          <p className="text-white">Please select at least one user before confirming the role change.</p>
          <button
            onClick={() => document.getElementById('errorModal').close()}
            className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 mt-4"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default UserRoles;
