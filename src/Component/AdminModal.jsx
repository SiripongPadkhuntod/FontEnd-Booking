import React, { useState } from 'react';

const AdminConfigModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <button onClick={toggleModal} className="bg-blue-500 text-white p-2 rounded">
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-white font-semibold">Admin Config</h2>
              <button onClick={toggleModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="bg-green-500 rounded px-4 py-2 flex items-center">
                <span className="text-2xl font-bold text-white mr-2">35</span>
                <div className="text-white text-sm leading-tight">
                  Total<br />Desks Used
                </div>
              </div>
              <div className="bg-red-500 rounded px-4 py-2 flex items-center">
                <span className="text-2xl font-bold text-white mr-2">17</span>
                <div className="text-white text-sm leading-tight">
                  LOCKED
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg">Maps</h3>
                <button className="text-gray-300 hover:text-white text-sm">View All →</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 aspect-video">Map01</div>
                <div className="bg-gray-200 rounded-lg p-4 aspect-video">Map02</div>
                <div className="bg-gray-200 rounded-lg p-4 aspect-video">Map03</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white text-lg mb-4">Editing</h3>
              <div className="flex gap-4 mb-4">
                <select className="bg-gray-700 text-white rounded px-3 py-2">
                  <option>A01</option>
                </select>
                <span className="text-white self-center">FROM</span>
                <select className="bg-gray-700 text-white rounded px-3 py-2">
                  <option>09:00</option>
                </select>
                <span className="text-white self-center">TO</span>
                <select className="bg-gray-700 text-white rounded px-3 py-2">
                  <option>16:00</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white text-lg mb-4">Details</h3>
              <div className="text-gray-300 space-y-2">
                <p>Desk : A01</p>
                <p>Map : RSU LAB</p>
                <p>From : 09:00AM TO 16:00PM</p>
                <p>Status : <span className="text-red-500">• LOCKED</span></p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-green-500 text-white px-6 py-2 rounded flex items-center gap-2">
                <span className="text-xl">🔓</span> UNLOCK
              </button>
              <button className="bg-red-500 text-white px-6 py-2 rounded flex items-center gap-2">
                <span className="text-xl">🔒</span> LOCK
              </button>
            </div>

            <div className="mt-6">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-2 text-left">Desks</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09'].map(desk => (
                    <tr key={desk} className="border-t border-gray-700">
                      <td className="py-3 text-white">{desk}</td>
                      <td className="py-3 text-right text-red-500">• Locked</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminConfigModal;
