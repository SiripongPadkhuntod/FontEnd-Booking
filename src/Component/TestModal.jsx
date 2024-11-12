import React, { useState } from 'react';

function CoTest() {
  const [selectedTime, setSelectedTime] = useState("09:00 AM");
  const [bookingTime, setBookingTime] = useState(""); // สถานะเวลาสำหรับ bookingModal

  // ฟังก์ชันเปลี่ยนเวลา
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // ฟังก์ชันส่งข้อมูลไปที่ bookingModal
  const handleBook = () => {
    setBookingTime(selectedTime); // ส่งเวลาที่เลือกไปที่ bookingModal
    document.getElementById('availabilityModal').close(); // ปิด availabilityModal
    document.getElementById('bookingModal').showModal(); // เปิด bookingModal
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById('bookingModal').showModal()}
      >
        Open Booking
      </button>

      <button
        className="btn btn-primary"
        onClick={() => document.getElementById('availabilityModal').showModal()}
      >
        Open Availability
      </button>

      {/* Booking Modal */}
      <dialog id="bookingModal" className="modal">
        <form method="dialog" className="modal-box rounded-lg w-full max-w-lg p-6 bg-white">
          <h3 className="text-2xl font-bold mb-2">NEW BOOKING</h3>
          <p className="text-gray-500 mb-6">Desk Number ##</p>

          {/* Date & Time */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Date & Time</label>
            <input type="date" className="input input-bordered w-full mb-3 text-gray-900" />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-semibold ">From</label>
                <select className="select select-bordered w-full text-gray-900">
                  <option>{bookingTime || "08:00 AM"}</option> {/* เวลาเริ่มต้น */}
                  {/* เพิ่มตัวเลือกเวลา */}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold">To</label>
                <select className="select select-bordered w-full text-gray-900">
                  <option>17:00</option>
                  <option>18:00</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn btn-primary">Confirm Booking</button>
            <button
              className="btn btn-outline"
              onClick={() => document.getElementById('bookingModal').close()}
            >
              Cancel Booking
            </button>
          </div>
        </form>
      </dialog>

      {/* Availability Modal */}
      <dialog id="availabilityModal" className="modal">
        <div className="modal-box rounded-lg w-full max-w-md p-6 bg-gray-900 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                J3
              </div>
              <h3 className="ml-3 text-lg font-semibold">This space is available!</h3>
            </div>
            <button
              onClick={() => document.getElementById('availabilityModal').close()}
              className="text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="bg-gray-800 rounded-lg py-6 px-4 mb-2">
              <p className="text-3xl font-bold">{selectedTime}</p>
              <p className="text-gray-400">10 Sat 2024</p>
            </div>
            <button className="btn btn-success w-24" onClick={handleBook}>
              BOOK
            </button>
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-2 text-gray-300">Other available time</p>
            <div className="flex flex-wrap gap-2">
              {["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"].map(
                (time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeChange(time)}
                    className={`btn btn-outline btn-sm ${
                      selectedTime === time ? "bg-gray-500 text-white" : "text-gray-300"
                    }`}
                  >
                    {time}
                  </button>
                )
              )}
              <button className="btn btn-outline btn-sm text-gray-300">More</button>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-4">
            <p className="font-semibold text-gray-300">Scheduled Booking (0.10 น.น.)</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-300">
                <span className="text-red-500 font-bold">🔴</span> 13:00 - 18:00
              </p>
              <p className="text-sm font-semibold text-gray-300">Firstname Lastname</p>
            </div>
          </div>
        </div>
      </dialog>
      
    </div>
  );
}

export default CoTest;
