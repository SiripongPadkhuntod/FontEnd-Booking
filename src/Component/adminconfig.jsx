import React, { useState } from 'react';

function AdminConfig() {
  const [status, setStatus] = useState('LOCKED');

  const toggleStatus = () => {
    setStatus(status === 'LOCKED' ? 'UNLOCKED' : 'LOCKED');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Config</h1>
        <div className="flex space-x-2">
          <div className="flex items-center text-green-600">
            <span className="font-semibold">35</span> Total Desks Used
          </div>
          <div className="flex items-center text-red-600">
            <span className="font-semibold">17</span> LOCKED
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex flex-col items-center w-1/4">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
          <div className="mt-2 text-center">Map 1</div>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
          <div className="mt-2 text-center">Map 2</div>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
          <div className="mt-2 text-center">Map 3</div>
        </div>
      </div>

      <div className="flex space-x-8">
        <div className="w-1/3">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Editing</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Desk</label>
              <input
                type="text"
                value="A01"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">From</label>
              <input
                type="time"
                value="09:00"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">To</label>
              <input
                type="time"
                value="16:00"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <span className="block text-sm text-gray-600">Status: {status}</span>
            </div>
            <button
              onClick={toggleStatus}
              className={`w-full p-2 mt-4 text-white ${status === 'LOCKED' ? 'bg-red-500' : 'bg-green-500'} rounded-lg`}
            >
              {status === 'LOCKED' ? 'UNLOCK' : 'LOCK'}
            </button>
          </div>
        </div>

        <div className="w-2/3">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Desks</h2>
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Desk</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09'].map((desk) => (
                <tr key={desk}>
                  <td className="py-2 px-4">{desk}</td>
                  <td className="py-2 px-4 text-red-600">Locked</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminConfig;
