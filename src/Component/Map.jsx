import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import MapSVG from './MapSVG';
import AdminConfigModal from './AdminModal';
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // import ไอคอน

import { GrCaretPrevious, GrCaretNext } from 'react-icons/gr'; // import ไอคอน
import { FaRegWindowClose } from "react-icons/fa";
import { json } from 'react-router-dom';


const CoMap = ({ nightMode, userid }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [time, setTime] = useState("08:00");
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return now;
  });
  const [bookingTime, setBookingTime] = useState("");
  const mapRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const [numbertable, setNumbertable] = useState(0);
  const [TableID, setTableID] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [displayTime, setDisplayTime] = useState("08:00");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [timeModal, setTimeModal] = useState(displayTime);
  const [timeModalTo, setTimeModalTo] = useState(displayTime);
  const [bookDate, setBookDate] = useState()
  const [bookFrom, setBookFrom] = useState()
  const [bookTo, setBookTo] = useState()
  const [conflictdata, setConflictdata] = useState()
  const [sortedBooking, setSortedBooking] = useState([])

  useEffect(() => {
    const sortedReservations = bookings.sort((a, b) => a.reservation_time_from.localeCompare(b.reservation_time_from)).filter(item => numbertable === item.table_number);
    console.log('sortedBooking',sortedBooking);
    
    setSortedBooking(sortedReservations)
  }, [bookings,numbertable])
  const allTimes = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00"
  ];



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

  const handleBook = () => {
    setBookingTime(selectedTime); // ส่งเวลาที่เลือกไปที่ bookingModal
    console.log('Booking selectedTime:', selectedTime);
    console.log('Booking selectedTable:', selectedTable);
    console.log('Booking numbertable:', numbertable);
    console.log('Booking TableID:', TableID);
    console.log('Booking date:', date);
    console.log('Booking time:', time);
    // booking.tableID == numbertable
    console.log('Booking bookings:', JSON.stringify(bookings));

    document.getElementById('availabilityModal').close(); // ปิด availabilityModal
    document.getElementById('bookingModal').showModal(); // เปิด bookingModal
  };

  const fetchBookingDetails = async () => {
    try {
      const currentDate = date.toISOString().split('T')[0];
      const response = await API.get(`/reservations/day/${currentDate}`);
      if (response.status === 200 && response.data) {
        setBookings(response.data);
        
        console.log('Booking details fetched:', bookings);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };



  useEffect(() => {
    fetchBookingDetails();
  }, []);


  const fetchData = async () => {
    // const date = new Date().toISOString().split('T')[0];
    const currentDate = date.toISOString().split('T')[0];
    console.log(currentDate);
    try {
      const currentDate = date.toISOString().split('T')[0];
      console.log(currentDate);

      const response = await API.get(`/reservations/day/${currentDate}`);

      if (response.status === 200) {
        console.log('Data fetched:', response.data);
        // setInitialTimes(response.data);
      } else {
        console.log('Failed to fetch data:', response.status, response.data);
      }
    } catch (error) {
      // กรองเฉพาะ 404 และไม่ log error อื่นๆ
      if (error.response && error.response.status === 404) {
        console.log("No data found for the selected date.");
      } else {
        console.log("An unexpected error occurred." + error); // แสดงข้อความสำหรับข้อผิดพลาดอื่น ๆ
      }
    }
  };

  const renderSchedule = (item,index) => {
    return <div className="flex items-center gap-2" key={index}>
      <span className="font-semibold">{item.reservation_time_from}–{item.reservation_time_to}</span>
      <span className="text-gray-400">{item.first_name} {item.last_name}</span>
    </div>
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768 && scale === 1) {
        setScale(0.5);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    // fetchData()

    return () => window.removeEventListener('resize', handleResize);
  }, [date]);



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768 && scale === 1) {
        setScale(0.5);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    // fetchData()

    return () => window.removeEventListener('resize', handleResize);
  }, [date]);

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
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    tableId: '',
    date: null,
    startTime: '',
    endTime: ''
  });

  const booking = async () => {
    let jsonData = {
      user_id: userid,
      table_id: TableID.toString(),
      reservation_date: bookDate.toISOString(),
      starttime: bookFrom,
      endtime: bookTo,
      roomid: 1,
    };

    console.log('Booking data:', jsonData);

    try {
      const response = await API.post('/reservations', jsonData);

      if (response.status === 200) {
        console.log('Booking successful:', response.data);

        // Set booking success details
        setBookingDetails({
          tableId: TableID.toString(),
          date: bookDate,
          startTime: bookFrom,
          endTime: bookTo
        });

        // Close booking modal
        document.getElementById('bookingModal').close();

        // Show success modal
        setBookingSuccess(true);
        document.getElementById('bookingSuccessModal').showModal();
        fetchBookingDetails();
      }


      else {
        console.error('Booking failed:', response.status, response.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // alert('Booking conflict: The selected time is already booked.');
        setConflictdata(err.response.data);
        console.log('Booking conflict:', err.response.data);
        document.getElementById('bookingModal').close();
        document.getElementById('bookingConflictModal').showModal();
      }
      else {
        console.error('Error occurred:', err.response ? err.response.data : err.message);
      }
    }
  };

  const closeSuccessModal = () => {
    setBookingSuccess(false);
    document.getElementById('bookingSuccessModal').close();
    // fetchData();
    //refresh page
    window.location.reload();
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

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      // หาก input ถูกล้างค่า
      setDate(new Date()); // ตั้งค่ากลับเป็นวันที่ปัจจุบัน
    } else {
      setDate(new Date(value));
    }
  };

  const getSliderValueFromTime = (time) => {
    const timeParts = time.split(":");
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    return (hours - 8) * 2 + (minutes === 30 ? 1 : 0);
  };
  const toTime = (val) => String(val).padStart(2, '0')
  useEffect(() => {
    setBookDate(date)
    setBookFrom(time)
    const [hh, mm] = time.split(":").map(Number)

    setBookTo(`${toTime(hh)}:${toTime(mm + 30)}`)
  }, [date, time])


  const handleTableSelection = (tableNumber) => {
    setSelectedTable(tableNumber); // เก็บค่า tableNumber ลงใน state
    console.log('Selected table stop:', tableNumber);
  };

  return (
    <div className={`w-full h-full relative rounded-lg overflow-hidden ${nightMode
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100'
      : 'bg-gradient-to-b from-blue-100 to-blue-200'
      }`}>
      <div
        ref={mapRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={isMobile ? handleDragStart : undefined}
        onTouchMove={isMobile ? handleDragMove : undefined}
        onTouchEnd={isMobile ? handleDragEnd : undefined}
        onTableSelect={handleTableSelection}
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
          onSelectNumbertable={setNumbertable}
          onSelectNumbertableID={setTableID}    // ส่ง setTableID
          nightMode={nightMode}
          setBookingTime={setBookingTime}
          setDisplayTime={setDisplayTime}
          setSelectedTime={setSelectedTime}
          handleTimeChange={handleTimeChange}
          // currentDate={date}

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
                // onChange={(e) => setDate(new Date(e.target.value))}
                onChange={handleDateChange}
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
          {/* <button
            onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            <GrCaretPrevious size={20} />
          </button> */}

          <button
            onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
            className={`p-2 border rounded-full transition duration-200 shadow-md ${nightMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
              : 'bg-red-700 text-white hover:bg-red-600 border-red-700'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <input
            type="date"
            value={date.toISOString().slice(0, 10)}
            // onChange={(e) => setDate(new Date(e.target.value))}
            onChange={handleDateChange}
            className="p-2 rounded-md border bg-gray-700 text-white"
          />
          {/* <button
            onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            <GrCaretNext size={20} />
          </button> */}

          <button
            onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
            className={`p-2 border rounded-full transition duration-200 shadow-md ${nightMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
              : 'bg-red-700 text-white hover:bg-red-600 border-red-700'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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

          <div className="rounded-lg bg-gray-800 p-4 mt-4 max-w-md mx-auto">
            <p className="font-semibold text-gray-300">การจองโต๊ะ</p>
            {Array.isArray(bookings) ? (
              console.log(bookings),
              bookings.length == 0 ? (
                <p className="text-sm text-gray-400">ไม่มีการจองในวันนี้</p>
              ) : (
                // กรองข้อมูลเฉพาะโต๊ะที่เลือก
                bookings
                  .filter(booking => TableID && booking.table_id == TableID) // กรองเฉพาะโต๊ะที่เลือก
                  .map((booking, index) => (
                    <div key={index} className="flex items-center justify-between mt-2 bg-gray-700 p-2 rounded">
                      <div>
                        <p className="text-sm text-gray-300">
                          <span className="text-red-500 font-bold">🔴</span>{' '}
                          {booking.reservation_time_from} - {booking.reservation_time_to}
                        </p>
                        <p className="text-xs text-gray-400">โต๊ะ {booking.table_number}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-300">
                        {booking.first_name} {booking.last_name}
                      </p>
                    </div>
                  ))
              )
            ) : (
              <p className="text-sm text-gray-400">ไม่มีข้อมูลการจองที่ถูกต้อง</p>
            )}
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
              className="input input-bordered w-full mb-3 text-black"
              onChange={(e) => setBookDate(e.target.value)}
              value={bookDate?.toISOString().slice(0, 10)}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-semibold">From</label>
                {/* "From" Time Select with the current time pre-selected */}
                <select
                  className="select select-bordered w-full text-black"
                  value={timeModal} // Bind to the selected time
                  onChange={(e) => {
                    setBookFrom(e.target.value)
                    setTimeModal(e.target.value)
                  }} // Handle time change
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
                  className="select select-bordered w-full text-black"
                  value={timeModalTo}
                  onChange={(e) => {
                    setBookTo(e.target.value)
                    setTimeModalTo(e.target.value)
                  }} // Handle time change
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
            <button className="btn btn-primary" onClick={booking}>Confirm Booking</button>
            <button
              className="btn btn-outline"
              onClick={() => cancelBooking()}
            >
              Cancel Booking
            </button>
          </div>
        </form>
      </dialog>

      {/* User Booking Modal */}
      <dialog id="bookingModalDetail" className="modal">
        <form method="dialog" className="modal-box rounded-lg w-full max-w-md p-6 bg-gray-900 text-white">
          <h3 className="text-2xl font-bold mb-2">Desk {numbertable}</h3>
          <p className="text-gray-500 mb-6">No available times for bookings on {date.toLocaleDateString('th-TH')}</p>

          <div className="mb-4">
            <p className="text-sm">Scheduled Bookings</p>
            <div className="flex flex-col gap-2">
              {sortedBooking.length > 0 ?sortedBooking.map(renderSchedule): 'Empty Bookings'}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4">
            <button className="btn btn-outline text-white">Close and keep exploring</button>

          </div>
        </form>
      </dialog>


      {/* Booking Success Modal */}
      <dialog id="bookingSuccessModal" className="modal">
        <div className="modal-box rounded-lg w-full max-w-md p-6 bg-green-600 text-white">
          <div className="text-center">
            <FaCheckCircle className="mx-auto text-6xl mb-4 text-white" />
            <h3 className="text-2xl font-bold mb-2">Booking Successful!</h3>

            <div className="bg-green-700 rounded-lg p-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Desk Number:</span>
                <span>{bookingDetails.tableId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Date:</span>
                <span>
                  {bookingDetails.date &&
                    bookingDetails.date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Time:</span>
                <span>{bookingDetails.startTime} - {bookingDetails.endTime}</span>
              </div>
            </div>

            <p className="mt-4">
              The booking details have been sent to your email.
            </p>

            <button
              onClick={closeSuccessModal}
              className="btn btn-white mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>



      {/* Modal conflict */}
      <dialog id="bookingConflictModal" className="modal">
        <div className="modal-box rounded-lg w-full max-w-md p-6 bg-red-600 text-white">
          <div className="text-center">
            <FaTimesCircle className="mx-auto text-6xl mb-4 text-white" />
            <h3 className="text-2xl font-bold mb-2">Booking Conflict!</h3>
            <p className="text-sm text-gray-200">The selected time is already booked.</p>
            <button
              onClick={() => document.getElementById('bookingConflictModal').close()}
              className="btn btn-white mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>



    </div>
  );
};

export default CoMap;