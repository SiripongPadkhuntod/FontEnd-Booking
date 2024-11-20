{/* Availability Modal */}
<dialog id="availabilityModal" className="modal">
<div className="modal-box rounded-lg w-full max-w-md p-6 bg-gray-900 text-white">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
        {numbertable} {/* Assuming numbertable is your dynamic table number */}
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
      <p className="text-3xl font-bold">{timeModal}</p>
      <p className="text-gray-400">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
    <button className="btn btn-success w-24" onClick={handleBook}>
      BOOK
    </button>
  </div>

  <div className="mb-6">
    <p className="font-semibold mb-2 text-gray-300">Other available time</p>
    <div className="flex flex-wrap gap-2">
      {/* ให้เอาเวลาจากเวลาที่เลือกมาแสดงแค่ 6 ช่อง ที่เหลื่อให้เป็น more */}
      {allTimes.slice(selectedTime, selectedTime + 7).map((time) => (
        <button
          key={time}
          onClick={() => setTimeModal(time)}
          className={`btn btn-outline btn-sm ${timeModal === time ? "bg-gray-500 text-white" : "text-gray-300"
            }`}
        >
          {time}
        </button>
      ))}
      {/* ปุ่ม more ให้เป็น dropdown */}
      <div className="dropdown dropdown-right ">
        <div tabIndex={0} role="button" className="btn btn btn-outline btn-sm text-gray-300">MORE</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          {allTimes.slice(selectedTime + 7, selectedTime + 14).map((time) => (
            <li key={time} onClick={() => setTimeModal(time)} className="menu-item">
              <a>{time}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  <div className="rounded-lg bg-gray-800 p-4">
    <p className="font-semibold text-gray-300">Scheduled Booking (0.10 น.น.)</p>
    <div className="flex items-center justify-between mt-2">
      <p className="text-sm text-gray-300">
        <span className="text-red-500 font-bold">:red_circle:</span> 13:00 - 18:00
      </p>
      <p className="text-sm font-semibold text-gray-300">Firstname Lastname</p>
    </div>
  </div>
</div>
</dialog>


{/* Booking Modal */}
<dialog id="bookingModal" className="modal">
<form method="dialog" className="modal-box rounded-lg w-full max-w-md p-6 bg-gray-900 text-white">
  <h3 className="text-2xl font-bold mb-2">NEW BOOKING</h3>
  <p className="text-gray-500 mb-6">Desk Number ##</p>

  {/* Date & Time */}
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-1">Date & Time</label>
    <input
      type="date"
      className="input input-bordered w-full mb-3 text-white"
      value={date.toISOString().slice(0, 10)}
    />
    <div className="flex gap-2">
      <div className="flex-1">
        <label className="block text-sm font-semibold">From</label>
        {/* "From" Time Select with the current time pre-selected */}
        <select
          className="select select-bordered w-full text-white"
          value={timeModal} // Bind to the selected time
          onChange={(e) => setTimeModal(e.target.value)} // Handle time change
        >
          {allTimes.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold">To</label>
        {/* "To" Time Select based on the selected "From" time */}
        <select className="select select-bordered w-full text-white" value={timeModal + 1}>
          {allTimes.slice(allTimes.indexOf(timeModal) + 1).map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>

  <div className="flex justify-end gap-2">
    <button className="btn btn-primary">Confirm Booking</button>
    <button
      className="btn btn-outline"
      onClick={() => cancelBooking()}
    >
      Cancel Booking
    </button>
  </div>
</form>
</dialog>