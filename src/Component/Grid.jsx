import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, MapPin, Moon, Sun } from 'lucide-react';
import API from '../api';


const CoGrid = ({nightMode}) => {
  // const [desks, setDesks] = useState([]);
  const desks = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"];
  
  const [bookings, setBookings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

 



  useEffect(() => {
    fetchTable();
    fetchData(selectedMonth);
    
  }, [selectedMonth]);

  const fetchData = async (month) => {
    try {
      const response = await API.get(`/reservations/${month}`);

      if (response.status === 200) {
        console.log("Data fetched successfully!" , response.data);
        transformData(response.data);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTable = async () => {
    try {
      const response = await API.get(`/tables`);
      if (response.status === 200) {
        console.log("Data fetched successfully!" , response.data);
        //เอาแค่ table_number
        const desk = response.data.map((item) => item.table_number);
        setDesks(desk); 
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const transformData = (data) => {
    const transformedData = data.map((item) => ({
      desk: item.table_number,
      name: `${item.first_name} ${item.last_name}`,
      timeform: item.reservation_time_from.slice(0, 5),
      timeto: item.reservation_time_to.slice(0, 5),
      note: item.note,
      date: new Date(item.reservation_date),
    }));
  
    console.log(transformedData);
    setBookings(transformedData);
  };

  const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month - 1, 1);

    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getDayInThai = (date) => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    return days[date.getDay()];
  };

  const [year, month] = selectedMonth.split("-");
  const daysInMonth = getDaysInMonth(Number(year), Number(month));

  const renderBookingNames = (bookings) => {
    if (bookings.length === 0) return (
      <div className={`text-sm flex items-center justify-center h-full opacity-50 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <MapPin size={16} className="mr-1" /> ว่าง
      </div>
    );

    if (bookings.length <= 2) {
      return bookings.map((booking, index) => (
        <div key={index} className="truncate text-sm flex items-center">
          <User size={14} className={`mr-1 ${nightMode ? 'text-blue-300' : 'text-blue-600'}`} />
          <span className={`font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {booking.name.split(" ")[0]}
          </span>
          <span className={`ml-1 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>
            ({booking.timeform})
          </span>
        </div>
      ));
    } else {
      return (
        <>
          {bookings.slice(0, 2).map((booking, index) => (
            <div key={index} className="truncate text-sm flex items-center">
              <User size={14} className={`mr-1 ${nightMode ? 'text-blue-300' : 'text-blue-600'}`} />
              <span className={`font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {booking.name.split(" ")[0]}
              </span>
              <span className={`ml-1 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ({booking.timeform})
              </span>
            </div>
          ))}
          <div className={`text-xs mt-1 ${nightMode ? 'text-gray-500' : 'text-gray-500'}`}>
            +{bookings.length - 2} more...
          </div>
        </>
      );
    }
  };

  return (
    <div className={`w-full h-full p-6 ${nightMode
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100'
      : 'bg-gradient-to-b from-blue-100 to-blue-200'
      }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-3xl font-extrabold mb-6 text-center flex items-center justify-center ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {nightMode ? <Moon size={32} className="mr-3 text-indigo-400" /> : <Calendar size={32} className="mr-3 text-indigo-600" />}
          Monthly Desk Bookings
        </h2>

        {/* Month Selector */}
        <div className="mb-6 flex justify-center items-center">
          <label className={`mr-3 font-medium ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>
            เลือกเดือน:
          </label>
          <div className="relative">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`p-3 border-2 rounded-lg focus:ring-2 transition-all duration-300 ${
                nightMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-600' 
                  : 'border-indigo-200 text-gray-800 focus:ring-indigo-400'
              }`}
            />
          </div>
        </div>

        {/* Booking Grid */}
        <div 
          className={`shadow-xl rounded-2xl border overflow-auto ${
            nightMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`} 
          style={{ maxHeight: "700px" }}
        >
          <div 
            className="grid overflow-x-auto"
            style={{
              gridTemplateColumns: `repeat(${desks.length + 1}, minmax(100px, 1fr))`,
            }}
          >
            {/* Header Row */}
            <div 
              className={`font-bold text-center p-3 ${
                nightMode 
                  ? 'bg-gray-700 text-gray-200' 
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              วันที่
            </div>
            {desks.map((desk, index) => (
              <div 
                key={index} 
                className={`font-bold text-center p-3 ${
                  nightMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                } transition-colors`}
              >
                {desk}
              </div>
            ))}

            {/* Booking Rows */}
            {daysInMonth.map((date, index) => (
              <React.Fragment key={index}>
                {/* Date and Day */}
                <div 
                  className={`font-semibold text-left p-3 ${
                    nightMode 
                      ? 'bg-gray-900 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {getDayInThai(date)} {date.getDate()}
                </div>
                {desks.map((desk, deskIndex) => {
                  const bookingsForDeskAndDate = bookings.filter(
                    (booking) => booking.desk === desk && booking.date.toDateString() === date.toDateString()
                  );

                  return (
                    <div
                      key={`${index}-${deskIndex}`}
                      className={`w-full h-24 p-3 border-b border-r group relative ${
                        nightMode 
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      } transition-colors`}
                    >
                      {renderBookingNames(bookingsForDeskAndDate)}

                      {/* Detailed Tooltip */}
                      {bookingsForDeskAndDate.length > 0 && (
                        <div
                          className={`absolute hidden group-hover:block border-2 shadow-lg rounded-lg p-4 z-50 w-72 ${
                            nightMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200' 
                              : 'bg-white border-indigo-200 text-gray-800'
                          }`}
                          style={{
                            top: "50%",
                            left: "calc(100% + 15px)",
                            transform: "translateY(-50%)",
                          }}
                        >
                          {bookingsForDeskAndDate.map((booking, index) => (
                            <div 
                              key={index} 
                              className={`mb-3 pb-3 border-b last:border-b-0 ${
                                nightMode ? 'border-gray-600' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center mb-1">
                                <User 
                                  size={18} 
                                  className={`mr-2 ${
                                    nightMode ? 'text-indigo-400' : 'text-indigo-600'
                                  }`} 
                                />
                                <span className={`font-bold truncate ${
                                  nightMode ? 'text-gray-200' : 'text-gray-800'
                                }`}>
                                  {booking.name}
                                </span>
                              </div>
                              <div 
                                className={`flex items-center text-sm mb-1 ${
                                  nightMode ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                <Clock size={14} className="mr-2" /> 
                                {booking.timeform} - {booking.timeto}
                              </div>
                              <div 
                                className={`flex items-center text-sm ${
                                  nightMode ? 'text-gray-500' : 'text-gray-500'
                                }`}
                              >
                                <MapPin size={14} className="mr-2" />
                                {booking.note || 'No additional details'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoGrid;