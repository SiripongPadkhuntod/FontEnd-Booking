import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, MapPin, Moon, Sun, NotebookPen } from 'lucide-react';
import API from '../api';

import { motion, AnimatePresence } from "framer-motion";


const CoGrid = ({ nightMode }) => {
  // const [desks, setDesks] = useState([]);
  const desks = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"];

  const [bookings, setBookings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

  useEffect(() => {
    // fetchTable();
    fetchData(selectedMonth);

  }, [selectedMonth]);

  const fetchData = async (month) => {
    try {
      const response = await API.get(`/reservations?month=${month}`);

      if (response.data.status === 200) {
        console.log("Data fetched successfully!", response.data);
        transformData(response.data);
      } else if (response.data.status === 404) {
        console.log("No data found for the selected month");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const transformData = (apiResponse) => {
    // ตรวจสอบว่า apiResponse มีคีย์ 'data' และ 'data' เป็นอาร์เรย์หรือไม่
    if (!apiResponse || !Array.isArray(apiResponse.data)) {
      console.error("apiResponse ไม่ใช่อาร์เรย์หรือไม่มีคีย์ 'data':", apiResponse);
      return; // หยุดการทำงานถ้าไม่มีคีย์ data หรือไม่ใช่อาร์เรย์
    }

    const transformedData = apiResponse.data.map((item) => ({
      desk: item.table_number,
      name: `${item.first_name} ${item.last_name}`,
      timeform: item.reservation_time_from.slice(0, 5),
      timeto: item.reservation_time_to.slice(0, 5),
      note: item.note,
      date: new Date(item.reservation_date),
    }));

    // console.log("Transformed Data:", transformedData);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"

    >
      <div className={`w-full h-full p-6 ${nightMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100'
        : 'bg-gradient-to-b from-blue-100 to-blue-200'
        }`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-extrabold mb-6 text-center flex items-center justify-center ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {nightMode ? <Moon size={32} className="mr-3 text-indigo-400" /> : <Calendar size={32} className="mr-3 text-indigo-600" />}
            Grid Desk Bookings
          </h2>

          {/* Month Selector */}
          <div className="mb-6 flex justify-center items-center">
            <label
              className={`mr-4 font-medium ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              เลือกเดือน:
            </label>
            <div className="relative">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`p-3 border-2 rounded-lg focus:ring-2 transition-all duration-300 w-50 ${nightMode
                  ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-600 focus:outline-none'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400 focus:outline-none'
                  }`}
              />
            </div>
          </div>


          {/* Booking Grid */}
          <div
            className={`shadow-xl rounded-2xl border overflow-auto ${nightMode
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
                className={`font-bold text-center p-3  ${nightMode
                  ? 'bg-gray-700 text-gray-200'
                  : 'bg-red-700 text-gray-200'
                  }`}
              >
                วันที่
              </div>
              {desks.map((desk, index) => (
                <div
                  key={index}
                  className={`font-bold text-center p-3 ${nightMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-red-700 text-gray-200 hover:bg-indigo-200'
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
                    className={`font-semibold text-left p-3 ${nightMode
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
                        className={`w-full h-24 p-3 border-b border-r group relative ${nightMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                          } transition-colors`}
                      >
                        {renderBookingNames(bookingsForDeskAndDate)}

                        {/* Detailed Tooltip */}
                        {bookingsForDeskAndDate.length > 0 && (
                          <div
                            className={`absolute hidden group-hover:block border-2 shadow-lg rounded-lg p-4 z-50 w-72 ${nightMode
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
                                className={`mb-3 pb-3 border-b last:border-b-0 ${nightMode ? 'border-gray-600' : 'border-gray-200'
                                  }`}
                              >
                                <div className="flex items-center mb-1">
                                  <User
                                    size={18}
                                    className={`mr-2 ${nightMode ? 'text-indigo-400' : 'text-indigo-600'
                                      }`}
                                  />
                                  <span className={`font-bold truncate ${nightMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                    {booking.name}
                                  </span>
                                </div>
                                <div
                                  className={`flex items-center text-sm mb-1 ${nightMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                  <Clock size={14} className="mr-2" />
                                  {booking.timeform} - {booking.timeto}
                                </div>


                                {/* //table number */}
                                <div
                                  className={`flex items-center text-sm ${nightMode ? 'text-gray-500' : 'text-gray-500'
                                    }`}
                                >
                                  <MapPin size={14} className="mr-2" />
                                  Seat : {booking.desk}

                                </div>

                                <div
                                  className={`flex items-center text-sm ${nightMode ? 'text-gray-500' : 'text-gray-500'
                                    }`}
                                >
                                  <NotebookPen size={14} className="mr-2" />
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
    </motion.div>
  );
};

export default CoGrid;