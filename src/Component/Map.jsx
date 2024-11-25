import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import MapSVG from './MapSVG';
import AdminConfigModal from './AdminModal';

import { GrCaretPrevious, GrCaretNext } from 'react-icons/gr'; // import ไอคอน
import { FaRegWindowClose } from "react-icons/fa";


const CoMap = ({ nightMode }) => {
  const [time, setTime] = useState("08:00");
  const [bookingTime, setBookingTime] = useState("");
  const [date, setDate] = useState(new Date());
  const mapRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const [numbertable, setNumbertable] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [displayTime, setDisplayTime] = useState("08:00");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [timeModal, setTimeModal] = useState(displayTime);
  const [timeModalTo, setTimeModalTo] = useState(displayTime);

  // รวมเวลาทั้งหมดในที่เดียว
  const allTimes = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00"
  ];


  const getSelectedTimeIndex = (selectedTime) => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const selectedTimeIndex = (hours - 8) * 2 + (minutes === 30 ? 1 : 0);
    return selectedTimeIndex;
  };

  const [showMore, setShowMore] = useState(false);

  // การเริ่มต้นการลาก
  const handleDragStart = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setStartX(clientX - offsetX);
    setStartY(clientY - offsetY);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setOffsetX(clientX - startX);
    setOffsetY(clientY - startY);
  };

  // การหยุดการลาก
  const handleDragEnd = () => setIsDragging(false);

  // การซูมเข้า/ออก
  // const handleWheelZoom = (e) => {
  //   e.preventDefault();
  //   const zoomIntensity = 0.1;
  //   if (e.deltaY > 0) {
  //     setScale(Math.max(scale - zoomIntensity, 0.5));
  //   } else {
  //     setScale(Math.min(scale + zoomIntensity, 3));
  //   }
  // };

  const handleBook = () => {
    setBookingTime(selectedTime); // ส่งเวลาที่เลือกไปที่ bookingModal
    document.getElementById('availabilityModal').close(); // ปิด availabilityModal
    document.getElementById('bookingModal').showModal(); // เปิด bookingModal
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768 && scale === 1) {
        setScale(0.5);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTimeChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    setSelectedTime(selectedValue);
    const hours = Math.floor(selectedValue / 2) + 8;
    const minutes = (selectedValue % 2 === 0) ? "00" : "30";
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
    setDisplayTime(formattedTime);
    // add this line
    setTime(formattedTime)
    setTimeModal(formattedTime);
  };



  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartX(touch.clientX - offsetX);
    setStartY(touch.clientY - offsetY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setOffsetX(touch.clientX - startX);
    setOffsetY(touch.clientX - startY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX - offsetX);
    setStartY(e.clientY - offsetY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - startX);
    setOffsetY(e.clientY - startY);
  };

  const cancelBooking = () => {
    document.getElementById('bookingModal').close();
    setTimeModal(displayTime);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheelZoom = (e) => {
    e.preventDefault(); // This triggers the warning if the listener is passive
    const zoomIntensity = 0.1;
    if (e.deltaY > 0) {
      setScale(Math.max(scale - zoomIntensity, 0.5));
    } else {
      setScale(Math.min(scale + zoomIntensity, 3));
    }
  };

  const getSliderValueFromTime = (time) => {
    const timeParts = time.split(":");
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    return (hours - 8) * 2 + (minutes === 30 ? 1 : 0);
  };

  return (
    <div className={`w-full h-full relative rounded-lg overflow-hidden ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div
        ref={mapRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={isMobile ? handleDragStart : undefined}
        onTouchMove={isMobile ? handleDragMove : undefined}
        onTouchEnd={isMobile ? handleDragEnd : undefined}
        onWheel={handleWheelZoom}
        onMouseLeave={() => setIsDragging(false)}
        className="w-full h-full bg-center"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        {/* SVG Map content remains the same */}
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

          // initialTimes={initialTimes}
          // moreTimes={moreTimes}
          showMore={showMore}
          setShowMore={setShowMore}
          getSliderValueFromTime={getSliderValueFromTime}
        />
      </div>

      {/* Responsive controls for mobile */}
      <div className={`absolute top-0 left-0 right-0 ${isMobile ? 'flex flex-col p-4 space-y-4' : 'hidden'}`}>
        <div className={`w-full p-4 rounded-lg shadow-lg ${nightMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-black'}`}>
          <div className="flex flex-col space-y-4">
            {/* Time Selector */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Time:</label>
              <span className="text-sm font-semibold">{displayTime}</span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="1"
              value={selectedTime}
              onChange={handleTimeChange}
              className="w-full"
            />

            {/* Date Selector */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
                className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              >
                <GrCaretPrevious size={20} />
              </button>
              <input
                type="date"
                value={date.toISOString().slice(0, 10)}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="w-full p-2 rounded border bg-gray-700 text-white"
              />
              <button
                onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
                className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              >
                <GrCaretNext size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop controls */}
      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 ${isMobile ? 'hidden' : 'flex'} flex-col md:flex-row items-center p-6 space-x-6 rounded-lg shadow-lg ${nightMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-black'}`}>
        {/* Time Selector */}
        <div className="flex items-center">
          <label className="font-semibold mr-2">Time:</label>
          <input
            type="range"
            min="0"
            max="28"
            step="1"
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-64"
          />
          <span className="ml-2 font-semibold">{displayTime}</span>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            <GrCaretPrevious size={20} />
          </button>
          <input
            type="date"
            value={date.toISOString().slice(0, 10)}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="p-2 rounded-md border bg-gray-700 text-white"
          />
          <button
            onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            <GrCaretNext size={20} />
          </button>
        </div>
      </div>



      {/* Zoom controls - ปรับตำแหน่งสำหรับมือถือ */}
      <div className={`absolute ${isMobile ? 'bottom-4 right-4' : 'bottom-4 right-4'} flex ${isMobile ? 'flex-row space-x-2' : 'flex-col items-center'}`}>
        <button
          onClick={() => setScale(Math.min(scale + 0.1, 3))}
          className="p-2 bg-gray-200 rounded"
        >
          <FontAwesomeIcon icon={faSearchPlus} />
        </button>
        <button
          onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
          className="p-2 bg-gray-200 rounded"
        >
          <FontAwesomeIcon icon={faSearchMinus} />
        </button>
        {!isMobile && <span className="text-sm mt-2">Zoom: {Math.round(scale * 100)}%</span>}
      </div>

      {/* Availability Modal */}
      <dialog id="availabilityModal" className="modal">
        <div className="modal-box rounded-lg w-full max-w-md p-5 bg-gray-900 text-white h-[600px] ">
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
              <FaRegWindowClose className='text-2xl rotate-90' />
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
                <span className="text-red-500 font-bold">🔴</span> 13:00 - 18:00
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
                <select
                  className="select select-bordered w-full text-white"
                  value={timeModalTo}
                  onChange={(e) => setTimeModalTo(e.target.value)} // Handle time change
                >
                  {allTimes.slice(allTimes.indexOf(timeModal) + 1).map((time, index) => (
                    <option key={index} value={time}>
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

      {/* Booking Modal */}
      <dialog id="bookingModal2" className="modal">
        <form method="dialog" className="modal-box rounded-lg w-full max-w-md p-6 bg-gray-900 text-white">
          <h3 className="text-2xl font-bold mb-2">Desk A1</h3>
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
                <select className="select select-bordered w-full text-white"
                  value={timeModal + 1}>
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

      {/* Modal admin config
      <dialog id="adminModal" className="modal">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-[80%] h-[90%]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-white font-semibold">Admin Config</h2>
              <button className="text-gray-400 hover:text-white">

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

            <div className="mt-6 bg-lime-300 overflow-y-scroll h-[30]">
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
      </dialog> */}

      {/* Modal admin config */}
      <dialog id="adminModal" className="modal">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-[90%] h-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-white font-semibold">Admin Config</h2>
              <button onClick={() => document.getElementById('adminModal').close()} className="text-gray-400 hover:text-white">
                <FaRegWindowClose className="text-2xl rotate-90" />
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

            {/* Editing and Desks Side by Side */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Editing Section */}
              <div className="w-full md:w-1/2">
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
              </div>

              {/* Desks Table Section */}
              <div className="w-full md:w-1/2 overflow-y-scroll h-[28rem] bg-gray-700 rounded-lg p-5 text-black">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-100">
                      <th className="py-2 text-left">Desks</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09'].map(desk => (
                      <tr key={desk} className="border-t border-gray-500">
                        <td className="py-3 text-white">{desk}</td>
                        <td className="py-3 text-right text-red-500">• Locked</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CoMap;