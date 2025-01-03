import React, { useState, useEffect } from "react";
import { Clock, Grid, User, Moon, Sun, MapPin, NotebookPen } from "lucide-react";
import API from '../api';

const CoDay = ({ nightMode }) => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentRoom, setCurrentRoom] = useState("Room1"); // State สำหรับห้อง
  // const desks = rooms[currentRoom]; // โต๊ะของห้องปัจจุบัน

  const rooms = {
    Room1: ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"],
    Room2: ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10", "A11", "A12", "B01", "B02", "B03", "B04", "B05"]
  };

  const desks = rooms[currentRoom]; // โต๊ะของห้องปัจจุบัน
  const hours = Array.from({ length: 15 }, (_, i) => 8 + i);

  const handleRoomChange = (room) => {
    setCurrentRoom(room);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time); // ชั่วโมง
    const minutes = (time % 1) * 60; // นาที
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; // รูปแบบ hh:mm
  };


  const getColor = (name, index, isNightMode) => {
    const lightColors = [
      { bg: "bg-blue-500/80 hover:bg-blue-500", text: "text-white" },
      { bg: "bg-green-500/80 hover:bg-green-500", text: "text-white" },
      { bg: "bg-purple-500/80 hover:bg-purple-500", text: "text-white" },
      { bg: "bg-pink-500/80 hover:bg-pink-500", text: "text-white" },
      { bg: "bg-orange-500/80 hover:bg-orange-500", text: "text-white" },
      { bg: "bg-red-500/80 hover:bg-red-500", text: "text-white" },
      { bg: "bg-teal-500/80 hover:bg-teal-500", text: "text-white" },
      { bg: "bg-yellow-500/80 hover:bg-yellow-500", text: "text-white" },
    ];

    const darkColors = [
      { bg: "bg-blue-800/80 hover:bg-blue-700", text: "text-blue-200" },
      { bg: "bg-green-800/80 hover:bg-green-700", text: "text-green-200" },
      { bg: "bg-purple-800/80 hover:bg-purple-700", text: "text-purple-200" },
      { bg: "bg-pink-800/80 hover:bg-pink-700", text: "text-pink-200" },
      { bg: "bg-orange-800/80 hover:bg-orange-700", text: "text-orange-200" },
      { bg: "bg-red-800/80 hover:bg-red-700", text: "text-red-200" },
      { bg: "bg-teal-800/80 hover:bg-teal-700", text: "text-teal-200" },
      { bg: "bg-yellow-800/80 hover:bg-yellow-700", text: "text-yellow-200" },
    ];

    const colors = isNightMode ? darkColors : lightColors;
    const randomSeed = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
    const randomIndex = (randomSeed + Math.floor(Math.random() * 1000)) % colors.length;
    return colors[randomIndex];
  };

  const isTestMode = false; // เปลี่ยนเป็น false เพื่อเชื่อมต่อกับ API จริง


  useEffect(() => {
    fetchBookings();
  }, [currentDate]);




  const handleDateChange = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const fetchBookings = async () => {
    setLoading(true); // Show loading status when changing date

    if (isTestMode) {
      // Mock data for the current date
      const mockData = [
        { desk: "A01", name: "Mock User 1", start: 9, end: 11, date: "2024-12-01" },
        { desk: "A02", name: "Mock User 1", start: 9, end: 11, date: "2024-12-01" },
        { desk: "A03", name: "Mock User 1", start: 11, end: 12, date: "2024-12-01" },
        { desk: "A01", name: "Mock User 1", start: 9, end: 11, date: "2024-12-05" },
        { desk: "A02", name: "Mock User 2", start: 12, end: 14, date: "2024-12-02" },
        { desk: "B01", name: "Mock User 3", start: 15, end: 17, date: "2024-12-03" },
      ];
      const formattedDate = currentDate.toISOString().split('T')[0];
      setBookings(mockData.filter(booking => booking.date === formattedDate));
      setLoading(false);
      return;
    }

    try {
      const formattedDate = currentDate.toISOString().split('T')[0];
      // console.log(formattedDate);
      const response = await API.get(`/reservations?day=${formattedDate}`);

      if (response.data.status == 200) {
        // console.log(response.data.data);
        // Check if response.data is an array
        if (Array.isArray(response.data.data)) {
          // Transform API response to match the mock data structure
          const transformedData = response.data.data.map((booking) => {
            let start = new Date(`${booking.reservation_date.split('T')[0]}T${booking.reservation_time_from}+07:00`);
            let end = new Date(`${booking.reservation_date.split('T')[0]}T${booking.reservation_time_to}+07:00`);

            let startHour = start.getHours();
            let startMinutes = start.getMinutes();
            let endHour = end.getHours();
            let endMinutes = end.getMinutes();

            let width;
            if (endMinutes === 0 && startMinutes === 0) {
              width = "100%"; // ถ้าเวลาจองเต็มชั่วโมง
            } else {
              width = "50%"; // ถ้าเป็นครึ่งชั่วโมง
            }

            return {
              desk: booking.table_number,
              name: `${booking.first_name} ${booking.last_name}`,
              start: startHour + (startMinutes / 60),
              end: endHour + (endMinutes / 60),
              date: formattedDate, // Using the formatted date from the current date
              width: width,
            };
          });

          setBookings(transformedData);
        }

      } else {
        console.log('Expected an array but got:', response.data);
        setBookings([]);
      }
    } catch (error) {

      if (error.response && error.response.status === 404) {
        // setBookings([]);
        console.log("Error fetching bookings:", error);
      }
    } finally {
      setLoading(false); // Ensure loading is set to false in the finally block
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${nightMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-800'
        : 'bg-gradient-to-b from-blue-100 to-blue-200'
        }`}>
        <div className="text-center">
          <div className={`animate-spin w-16 h-16 border-4 ${nightMode
            ? 'border-gray-600 border-t-gray-400'
            : 'border-blue-500 border-t-transparent'
            } rounded-full mx-auto mb-4`}></div>
          <p className={`${nightMode ? 'text-gray-300' : 'text-blue-700'} font-semibold`}>
            Loading Bookings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${nightMode
        ? 'bg-gray-900'
        : 'bg-red-50'
        }`}>
        <div className={`text-center p-8 rounded-xl shadow-lg ${nightMode
          ? 'bg-gray-800 text-red-300'
          : 'bg-white text-red-600'
          }`}>
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const formattedDate = currentDate.toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`p-4 sm:p-10 min-h-screen ${nightMode ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-b from-blue-100 to-blue-200'}`}>
      <div className="container mx-auto">
        {/* ส่วนหัว */}
        <div className={`flex sm:flex-row flex-col justify-between items-center mb-6`}>
          <h1 className={`text-2xl sm:text-4xl font-bold flex items-center ${nightMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <Grid className={`mr-3 ${nightMode ? 'text-blue-400' : 'text-blue-600'}`} size={36} />
            Desk Booking Schedule ({currentRoom})
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-x-4 mt-4 sm:mt-0">
            {/* แสดงวันที่ */}
            <div className="text-sm sm:text-lg font-semibold text-gray-700">
              {formattedDate}
            </div>

            {/* ปุ่มเปลี่ยนห้อง */}
            {Object.keys(rooms).map((room) => (
              <button
                key={room}
                onClick={() => handleRoomChange(room)}
                className={`px-4 py-2 rounded-md shadow-md font-semibold transition duration-200 ${currentRoom === room
                    ? nightMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-400 text-white'
                    : nightMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
  <div className="flex items-center space-x-6">
    <button
      onClick={() => handleDateChange(-1)}
      className={`px-4 py-2 rounded-md shadow-md font-semibold transition duration-200 ${nightMode
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } flex items-center`}
    >
      <Clock className="mr-2" size={16} />
      Previous Day
    </button>
    <button
      onClick={() => handleDateChange(1)}
      className={`px-4 py-2 rounded-md shadow-md font-semibold transition duration-200 ${nightMode
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } flex items-center`}
    >
      Next Day
      <Clock className="ml-2" size={16} />
    </button>
  </div>
  <div className="flex items-center space-x-4">
    <button
      onClick={() => handleDateChange(0)}
      className={`px-4 py-2 rounded-md shadow-md font-semibold transition duration-200 ${nightMode
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } flex items-center`}
    >
      Today
    </button>
    <button
      onClick={() => handleDateChange(7)}
      className={`px-4 py-2 rounded-md shadow-md font-semibold transition duration-200 ${nightMode
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } flex items-center`}
    >
      Next 7 Days
    </button>
  </div>
</div>


        {/* ตารางการจองโต๊ะ */}
        <div className={`rounded-2xl shadow-lg overflow-hidden border ${nightMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
          }`}>
          {/* ตารางส่วนหัว */}
          <div className={`flex ${nightMode
            ? 'bg-gray-900 border-b border-gray-700'
            : 'bg-gray-50 border-b'
            }`}>
            <div className={`w-24 sm:w-52 p-2 sm:p-3 text-center font-bold text-sm sm:text-lg flex items-center justify-center ${nightMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              <User className={`mr-2 ${nightMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
              Desk
            </div>
            {hours.map((hour, index) => (
              <div
                key={index}
                className={`flex-1 border-l text-center text-xs sm:text-base font-semibold p-1 sm:p-2 ${nightMode ? 'text-gray-400 border-gray-700' : 'text-gray-600'
                  }`}
              >
                {`${hour}:00`}
              </div>
            ))}
          </div>
          {/* ตารางการจอง */}
          <div className={`relative ${nightMode ? 'bg-gray-800' : 'bg-white'}`}>
            {desks.map((desk, idx) => {
              const deskBookings = bookings
                .filter((booking) => booking.desk === desk)
                .sort((a, b) => a.start - b.start);

              return (
                <div
                  key={idx}
                  className={`flex items-center border-b last:border-b-0 ${nightMode
                    ? 'hover:bg-gray-700 border-gray-700'
                    : 'hover:bg-blue-50 border-gray-200'
                    } transition-colors duration-200`}
                >
                  <div className={`w-24 sm:w-52 p-2 sm:p-3 border-r text-sm sm:text-base font-bold ${nightMode ? 'text-gray-300 border-gray-700' : 'text-gray-700'
                    }`}>
                    {desk}
                  </div>
                  <div className="relative flex-1 h-16">
                    <div
                      className={`absolute inset-0 grid grid-cols-10 ${nightMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      style={{
                        gridTemplateColumns: `repeat(${hours.length}, 1fr)`,
                      }}
                    >
                      {hours.map((_, i) => (
                        <div
                          key={i}
                          className={`border-l ${nightMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                          style={{
                            gridColumn: i + 1,
                          }}
                        ></div>
                      ))}
                    </div>

                    {deskBookings.map((booking, bookingIdx) => {
                      const startTime = Math.max(8, booking.start); // คำนวณเวลาที่เริ่ม (ไม่ต่ำกว่า 9)
                      const endTime = Math.min(22, booking.end); // คำนวณเวลาที่จบ (ไม่เกิน 22)

                      // คำนวณตำแหน่งบนกริด
                      const gridStart = (startTime - 8) * (100 / hours.length);
                      const gridEnd = (endTime - 8) * (100 / hours.length);

                      const colorClass = getColor(booking.name, bookingIdx, nightMode);

                      return (
                        <div
                          key={bookingIdx}
                          className={`
                            absolute rounded-lg shadow-md 
                            text-xs sm:text-sm 
                            px-3 py-2 
                            ${colorClass.bg} ${colorClass.text}
                            transform transition-all duration-300 
                            hover:scale-105 hover:shadow-xl 
                            cursor-pointer 
                            border border-opacity-20 
                            flex items-center justify-center
                            truncate
                          `}
                          style={{
                            left: `${gridStart}%`,
                            width: `${gridEnd - gridStart}%`,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                          title={`${booking.name} ${formatTime(booking.start)} - ${formatTime(booking.end)}`}

                        >
                          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {booking.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoDay;
