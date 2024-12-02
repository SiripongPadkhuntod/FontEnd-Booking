import React, { useState } from 'react';

function AdminConfig() {
  const [desks, setDesks] = useState([
    { desk: 'A01', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A02', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A03', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A04', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A05', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A06', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A07', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A08', status: 'LOCKED', from: '09:00', to: '16:00' },
    { desk: 'A09', status: 'LOCKED', from: '09:00', to: '16:00' },
  ]);

  const [selectedDesk, setSelectedDesk] = useState(desks[0]);

  const handleRowClick = (desk) => {
    setSelectedDesk(desk);
  };

  const toggleStatus = () => {
    setDesks((prevDesks) =>
      prevDesks.map((desk) =>
        desk.desk === selectedDesk.desk
          ? { ...desk, status: desk.status === 'LOCKED' ? 'UNLOCKED' : 'LOCKED' }
          : desk
      )
    );
    setSelectedDesk((prev) => ({
      ...prev,
      status: prev.status === 'LOCKED' ? 'UNLOCKED' : 'LOCKED',
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Config</h1>
        <div className="flex space-x-2">
          <div className="flex items-center text-green-600">
            <span className="font-semibold">
              {desks.filter((desk) => desk.status === 'UNLOCKED').length}
            </span>{' '}
            Total Desks Used
          </div>
          <div className="flex items-center text-red-600">
            <span className="font-semibold">
              {desks.filter((desk) => desk.status === 'LOCKED').length}
            </span>{' '}
            LOCKED
          </div>
        </div>
      </div>

      {/* Maps Section */}
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

      {/* Main Content */}
      <div className="flex space-x-8">
        {/* Editing Section */}
        <div className="w-1/3">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Editing</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Desk</label>
              <input
                type="text"
                value={selectedDesk.desk}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">From</label>
              <input
                type="time"
                value={selectedDesk.from}
                onChange={(e) =>
                  setSelectedDesk({ ...selectedDesk, from: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">To</label>
              <input
                type="time"
                value={selectedDesk.to}
                onChange={(e) =>
                  setSelectedDesk({ ...selectedDesk, to: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <span className="block text-sm text-gray-600">
                Status: {selectedDesk.status}
              </span>
            </div>
            <button
              onClick={toggleStatus}
              className={`w-full p-2 mt-4 text-white ${selectedDesk.status === 'LOCKED' ? 'bg-red-500' : 'bg-green-500'
                } rounded-lg`}
            >
              {selectedDesk.status === 'LOCKED' ? 'UNLOCK' : 'LOCK'}
            </button>
          </div>
        </div>

        {/* Desks Section */}
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
              {desks.map((desk) => (
                <tr
                  key={desk.desk}
                  onClick={() => handleRowClick(desk)}
                  className={`cursor-pointer hover:bg-gray-100  ${desk.desk === selectedDesk.desk ? 'bg-gray-300' : ''
                    }`}
                >
                  <td className="py-2 px-4">{desk.desk}</td>
                  <td
                    className={`py-2 px-4  w-44  ${desk.status === 'LOCKED' ? 'text-red-600' : 'text-green-600'
                      }`}
                  >
                    {desk.status}
                  </td>
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
