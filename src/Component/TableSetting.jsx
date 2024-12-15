import React, { useState } from 'react';
import { Lock, Unlock, MapPin, Calendar } from 'lucide-react';

function AdminConfig({nightMode}) {
  const [desks, setDesks] = useState([
    { desk: 'A01', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A02', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A03', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A04', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A05', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A06', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A07', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A08', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
    { desk: 'A09', status: 'LOCKED', from: '2024-03-15', to: '2024-03-15', timeFrom: '09:00', timeTo: '16:00' },
  ]);

  const [selectedDesk, setSelectedDesk] = useState(desks[0]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  // Responsive handling
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  // Mobile view rendering
  if (isMobileView) {
    return (
      <div className="bg-gray-100 min-h-full p-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Admin Config</h1>
            <div className="flex space-x-2">
              <div className="flex items-center text-green-600">
                <Unlock size={16} className="mr-1" />
                {desks.filter((desk) => desk.status === 'UNLOCKED').length}
              </div>
              <div className="flex items-center text-red-600">
                <Lock size={16} className="mr-1" />
                {desks.filter((desk) => desk.status === 'LOCKED').length}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {desks.map((desk) => (
              <div 
                key={desk.desk} 
                onClick={() => handleRowClick(desk)}
                className={`p-3 rounded-lg border flex justify-between items-center ${
                  desk.desk === selectedDesk.desk ? 'bg-gray-200' : 'bg-white'
                }`}
              >
                <div>
                  <div className="font-semibold">{desk.desk}</div>
                  <div className={`${desk.status === 'LOCKED' ? 'text-red-600' : 'text-green-600'}`}>
                    {desk.status}
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>{desk.fromDate} - {desk.toDate}</div>
                  <div>{desk.timeFrom} - {desk.timeTo}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Desk Details</h2>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="mb-2">
                <label className="text-sm text-gray-600">Desk</label>
                <input
                  type="text"
                  value={selectedDesk.desk}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-white"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                      type="date"
                      value={selectedDesk.fromDate}
                      onChange={(e) => setSelectedDesk({ ...selectedDesk, fromDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">End Date</label>
                    <input
                      type="date"
                      value={selectedDesk.toDate}
                      onChange={(e) => setSelectedDesk({ ...selectedDesk, toDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">From</label>
                    <input
                      type="time"
                      value={selectedDesk.timeFrom}
                      onChange={(e) => setSelectedDesk({ ...selectedDesk, timeFrom: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">To</label>
                    <input
                      type="time"
                      value={selectedDesk.timeTo}
                      onChange={(e) => setSelectedDesk({ ...selectedDesk, timeTo: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={toggleStatus}
                className={`w-full p-3 mt-4 text-white rounded-lg transition-colors ${
                  selectedDesk.status === 'LOCKED' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {selectedDesk.status === 'LOCKED' ? 'Unlock Desk' : 'Lock Desk'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="min-h-full p-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Config</h1>
        <div className="flex space-x-4">
          <div className="flex items-center text-green-600">
            <Unlock size={20} className="mr-2" />
            <span className="font-semibold">
              {desks.filter((desk) => desk.status === 'UNLOCKED').length}
            </span>{' '}
            Total Desks Used
          </div>
          <div className="flex items-center text-red-600">
            <Lock size={20} className="mr-2" />
            <span className="font-semibold">
              {desks.filter((desk) => desk.status === 'LOCKED').length}
            </span>{' '}
            LOCKED
          </div>
        </div>
      </div>

      {/* Maps Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, "Coming soon...", "Coming soon..."].map((mapNum, index) => (
          <div key={`map-${index}`} className="flex flex-col items-center">
            <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <MapPin size={48} className="text-gray-400" />
            </div>
            <div className="mt-2 text-center text-gray-600">Map {mapNum}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Editing Section */}
        <div className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Editing</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Desk</label>
              <input
                type="text"
                value={selectedDesk.desk}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={selectedDesk.fromDate}
                  onChange={(e) => setSelectedDesk({ ...selectedDesk, fromDate: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  value={selectedDesk.toDate}
                  onChange={(e) => setSelectedDesk({ ...selectedDesk, toDate: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">From</label>
                <input
                  type="time"
                  value={selectedDesk.timeFrom}
                  onChange={(e) => setSelectedDesk({ ...selectedDesk, timeFrom: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">To</label>
                <input
                  type="time"
                  value={selectedDesk.timeTo}
                  onChange={(e) => setSelectedDesk({ ...selectedDesk, timeTo: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 mb-4">
              <span className="block text-sm text-gray-600">
                Status: <span className={selectedDesk.status === 'LOCKED' ? 'text-red-600' : 'text-green-600'}>
                  {selectedDesk.status}
                </span>
              </span>
            </div>
            <button
              onClick={toggleStatus}
              className={`w-full p-3 text-white rounded-lg transition-colors ${
                selectedDesk.status === 'LOCKED' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {selectedDesk.status === 'LOCKED' ? 'UNLOCK' : 'LOCK'}
            </button>
          </div>
        </div>

        {/* Desks Section */}
        <div className="col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Desks</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left text-gray-600">Desk</th>
                  <th className="py-3 px-4 text-left text-gray-600">Start Date</th>
                  <th className="py-3 px-4 text-left text-gray-600">End Date</th>
                  <th className="py-3 px-4 text-left text-gray-600">Time</th>
                  <th className="py-3 px-4 text-left text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {desks.map((desk) => (
                  <tr 
                    key={desk.desk} 
                    onClick={() => handleRowClick(desk)}
                    className={`cursor-pointer ${desk.desk === selectedDesk.desk ? 'bg-gray-100' : 'bg-white'}`}
                  >
                    <td className="py-3 px-4">{desk.desk}</td>
                    <td className="py-3 px-4">{desk.from}</td>
                    <td className="py-3 px-4">{desk.to}</td>
                    <td className="py-3 px-4">{desk.timeFrom} - {desk.timeTo}</td>
                    <td className="py-3 px-4">
                      <span className={desk.status === 'LOCKED' ? 'text-red-600' : 'text-green-600'}>
                        {desk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

                  
                  
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminConfig;