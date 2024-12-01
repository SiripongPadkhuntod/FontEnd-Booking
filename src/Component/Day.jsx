import React, { useState, useEffect } from "react";
import { Clock, Grid, User, Moon, Sun } from "lucide-react";
import API from '../api';

const CoDay = ({ nightMode }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const desks = ["A01", "A02", "A03", "A04", "A05", "B01", "B02", "C01", "C02"];
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

  const getColor = (name, isNightMode) => {
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
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const isTestMode = true; // เปลี่ยนเป็น false เพื่อเชื่อมต่อกับ API จริง

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true); // Show loading status when changing date
  
      if (isTestMode) {
        // Mock data for the current date
        const mockData = [
          { desk: "A01", name: "Mock User 1", start: 9, end: 11, date: "2024-12-01" },
          { desk: "A02", name: "Mock User 1", start: 9, end: 11, date: "2024-12-01" },
          { desk: "A03", name: "Mock User 1", start: 11, end: 12, date: "2024-12-01" },
          { desk: "A01", name: "Mock User 1", start: 9, end: 11, date: "2024-12-01" },
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
        const response = await API.get(`/reservations/day/${formattedDate}`);
        console.log(response.data);
        // Transform API response to match the mock data structure
        const transformedData = response.data.map((booking) => {
          let start = new Date(`${booking.reservation_date.split('T')[0]}T${booking.reservation_time_from}+07:00`);
          let end = new Date(`${booking.reservation_date.split('T')[0]}T${booking.reservation_time_to}+07:00`);


          // console.log(start, end);
          
          console.log(start, end);
          return {
            desk: booking.table_number,
            name: `${booking.first_name} ${booking.last_name}`,
            start: start.getHours(),
            end: end.getHours(),
            date: formattedDate, // Using the formatted date from the current date
          };
        });
        setBookings(transformedData);
      } catch (error) {
        // setError("Unable to fetch bookings. Please try again later.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, [currentDate]);
  



  const handleDateChange = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
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

  return (
    <div className={`p-4 sm:p-10 min-h-screen ${nightMode
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100'
      : 'bg-gradient-to-b from-blue-100 to-blue-200'
      }`}>
      <div className="container mx-auto">
        <div className={`flex sm:flex-row flex-col justify-between items-center mb-6`}>
          <h1 className={`text-2xl sm:text-4xl font-bold flex items-center ${nightMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <Grid className={`mr-3 ${nightMode ? 'text-blue-400' : 'text-blue-600'}`} size={36} />
            Desk Booking Schedule
          </h1>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* ปุ่มเปลี่ยนวันที่ */}
            <button
              onClick={() => handleDateChange(-1)}
              className={`btn p-3 sm:p-2 rounded-full ${nightMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-500'} transition-colors duration-300`}
            >
              ←
            </button>

            {/* วันที่ */}
            <span className={`font-semibold flex items-center ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Clock className={`mr-2 ${nightMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>

            {/* ปุ่มเปลี่ยนวันที่ */}
            <button
              onClick={() => handleDateChange(1)}
              className={`btn p-3 sm:p-2 rounded-full ${nightMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-500'} transition-colors duration-300`}
            >
              →
            </button>
          </div>
        </div>




        <div className={`rounded-2xl shadow-lg overflow-hidden border ${nightMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
          }`}>
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
                      const startTime = Math.max(9, booking.start);
                      const endTime = Math.min(18, booking.end);
                      const gridStart = (startTime - 9) * (100 / hours.length);
                      const gridEnd = (endTime - 8) * (100 / hours.length);
                      const colorClass = getColor(booking.name, nightMode);

                      return (
                        <div
                          key={bookingIdx}
                          className={`absolute text-xs sm:text-sm rounded-md px-2 py-1 
                            ${colorClass.bg} ${colorClass.text}
                            transform transition-all duration-300 
                            hover:scale-105 cursor-pointer
                          `}
                          style={{
                            left: `${gridStart}%`,
                            width: `${gridEnd - gridStart}%`,
                            top: "50%",
                            transform: "translateY(-50%)",
                            overflow: "hidden",
                          }}
                        >
                          {booking.name}
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
