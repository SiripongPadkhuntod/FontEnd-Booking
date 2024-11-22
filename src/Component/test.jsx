// CoMap.jsx
import React, { useState, useRef, useEffect } from 'react';
// ... existing imports ...

// Sample booking data
const bookingData = [
  {
    name: "John Doe",
    startTime: "16:30",
    endTime: "18:00", 
    date: "2024-11-22",
    tableNumber: "A1"
  }
];

const CoMap = ({ nightMode }) => {
  // ... existing state definitions ...
  const [bookings, setBookings] = useState(bookingData);

  // Add bookings to props passed to MapSVG
  return (
    <div className={`w-full h-full relative rounded-lg overflow-hidden ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* ... existing JSX ... */}
      <MapSVG 
        time={time}
        bookingTime={bookingTime}
        date={date}
        numbertable={numbertable}
        setNumbertable={setNumbertable}
        nightMode={nightMode}
        setBookingTime={setBookingTime}
        setDisplayTime={setDisplayTime}
        setSelectedTime={setSelectedTime}
        handleTimeChange={handleTimeChange}
        showMore={showMore}
        setShowMore={setShowMore}
        getSliderValueFromTime={getSliderValueFromTime}
        bookings={bookings} // Pass bookings data
        selectedTime={timeModal} // Pass selected time
      />
      {/* ... rest of existing JSX ... */}

      {/* Update Availability Modal to show bookings */}
      <dialog id="availabilityModal" className="modal">
        <div className="modal-box rounded-lg w-full max-w-md p-6 bg-gray-900 text-white">
          {/* ... existing modal content ... */}
          
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="font-semibold text-gray-300">Scheduled Booking</p>
            {bookings.map((booking, index) => (
              <div key={index} className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-300">
                  <span className="text-red-500 font-bold">🔴</span> {booking.startTime} - {booking.endTime}
                </p>
                <p className="text-sm font-semibold text-gray-300">{booking.name}</p>
              </div>
            ))}
          </div>
        </div>
      </dialog>
      {/* ... rest of existing code ... */}
    </div>
  );
};

// MapSVG.jsx
const CircleButton = ({ cx, cy, tableNumber, onClick, isBooked }) => {
  const baseColor = isBooked ? "#808080" : "#40AD0E"; // Gray if booked, green if available
  const hoverColor = isBooked ? "#696969" : "#2E8B57"; // Darker shades for hover
  
  const handleMouseEnter = (e) => e.target.setAttribute("fill", hoverColor);
  const handleMouseLeave = (e) => e.target.setAttribute("fill", baseColor);

  return (
    <circle
      cx={cx}
      cy={cy}
      r="14.5"
      fill={baseColor}
      stroke="#000"
      onClick={() => {
        if (!isBooked) {
          document.getElementById('availabilityModal').showModal();
          onClick(tableNumber);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
    />
  );
};

function MapSVG({ selectedTime, bookings, ...props }) {
  const isTableBooked = (tableNumber) => {
    return bookings.some(booking => 
      booking.tableNumber === tableNumber && 
      booking.startTime <= selectedTime && 
      booking.endTime > selectedTime
    );
  };

  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="931" height="508" fill="none" viewBox="0 0 931 508" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* ... existing SVG paths ... */}
        
        {/* Updated Circle Buttons */}
        <g className="cursor-pointer">
          <CircleButton cx={228} cy={355} tableNumber="A6" onClick={props.setNumbertable} isBooked={isTableBooked("A6")} />
          <CircleButton cx={226} cy={164} tableNumber="A3" onClick={props.setNumbertable} isBooked={isTableBooked("A3")} />
          <CircleButton cx={464} cy={387} tableNumber="B1" onClick={props.setNumbertable} isBooked={isTableBooked("B1")} />
          <CircleButton cx={556} cy={387} tableNumber="B2" onClick={props.setNumbertable} isBooked={isTableBooked("B2")} />
          <CircleButton cx={539} cy={104} tableNumber="C1" onClick={props.setNumbertable} isBooked={isTableBooked("C1")} />
          <CircleButton cx={157} cy={354} tableNumber="A5" onClick={props.setNumbertable} isBooked={isTableBooked("A5")} />
          <CircleButton cx={157} cy={164} tableNumber="A2" onClick={props.setNumbertable} isBooked={isTableBooked("A2")} />
          <CircleButton cx={86} cy={354} tableNumber="A4" onClick={props.setNumbertable} isBooked={isTableBooked("A4")} />
          <CircleButton cx={88} cy={164} tableNumber="A1" onClick={props.setNumbertable} isBooked={isTableBooked("A1")} />
          <CircleButton cx={469} cy={104} tableNumber="C2" onClick={props.setNumbertable} isBooked={isTableBooked("C2")} />
        </g>

        {/* ... existing defs ... */}
      </svg>
    </div>
  );
}

export default MapSVG;
