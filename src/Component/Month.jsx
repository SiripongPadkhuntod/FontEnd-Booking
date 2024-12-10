import React, { useState, useEffect } from "react";
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้
import { Calendar, Clock, User, MapPin, Moon, Sun } from 'lucide-react';
import { CSSTransition } from 'react-transition-group';



const CoMonth = ({ nightMode }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'bookings'
  const [bookings, setBookings] = useState([]);


  // ข้อมูลตัวอย่าง

  // Helper function to check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };


  const fetchData = async (month) => {
    try {
      const response = await API.get(`/reservations/${month}`);

      if (response.status === 200) {
        const transformedData = transformData(response.data);
        setBookings(transformedData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set default data in case of error
      setBookings([
        { name: "John Doe", Fromtime: "10:00", Totime: "18:00", table: "A1", note: "Team meeting", date: new Date("2024-11-16") },
        { name: "Alice Brown", Fromtime: "15:00", Totime: "18:00", table: "A1", note: "Client call", date: new Date("2024-11-15") },
        // ... other default bookings
      ]);
    }
  };

  const transformData = (apiData) => {

    // Log ข้อมูลที่ได้จาก API
    console.log(apiData);

    return apiData.map(item => {
      const formatTime = (time) => {
        const [hours, minutes] = time.split(":"); // แยกชั่วโมงและนาทีจากเวลา
        return `${hours}:${minutes}`;
      };

      return {
        name: `${item.first_name} ${item.last_name}`,
        Fromtime: formatTime(item.reservation_time_from), // ใช้ฟังก์ชัน formatTime
        Totime: formatTime(item.reservation_time_to), // ใช้ฟังก์ชัน formatTime
        table: item.table_number,
        note: item.note,
        date: new Date(item.reservation_date)
      };
    });
  };





  // ฟังก์ชันต่างๆ
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const getDayInThai = (date) => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    return days[date.getDay()];
  };

  const getMonthInThai = (monthIndex) => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return months[monthIndex];
  };

  const renderBookingNames = (bookings) => {
    if (bookings.length === 0) return <div className="text-gray-400">ว่าง</div>;

    return (
      <div className="overflow-hidden">
        {bookings.slice(0, 2).map((booking, index) => {
          const firstName = booking.name.split(" ")[0];
          return (
            <div key={index} className="text-xs truncate">
              <span className="font-medium">{firstName}</span>
            </div>
          );
        })}
        {bookings.length > 2 && (
          <div className="text-xs text-red-500">+{bookings.length - 2}</div>
        )}
      </div>
    );
  };

  const getFirstDayOfMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    return firstDay.getDay();
  };

  const getBookingsForDate = (year, month, day) => {
    const date = new Date(year, month, day);
    return bookings.filter(booking =>
      booking.date.getFullYear() === date.getFullYear() &&
      booking.date.getMonth() === date.getMonth() &&
      booking.date.getDate() === date.getDate()
    );
  };

  const getGroupedBookingsForMonth = () => {
    const selectedYear = parseInt(selectedMonth.split("-")[0], 10);
    const selectedMonthIndex = parseInt(selectedMonth.split("-")[1], 10) - 1;

    const filteredBookings = bookings
      .filter(booking =>
        booking.date.getFullYear() === selectedYear &&
        booking.date.getMonth() === selectedMonthIndex
      )
      .sort((a, b) => a.date - b.date);

    const groupedBookings = filteredBookings.reduce((groups, booking) => {
      const dateKey = booking.date.getDate();
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: booking.date,
          bookings: []
        };
      }
      groups[dateKey].bookings.push(booking);
      return groups;
    }, {});

    return Object.values(groupedBookings);
  };

  // การคำนวณวันที่ต่างๆ
  const selectedYear = parseInt(selectedMonth.split("-")[0], 10);
  const selectedMonthIndex = parseInt(selectedMonth.split("-")[1], 10) - 1;
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex);
  const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonthIndex);

  const getLastDateOfPreviousMonth = (year, month) => {
    const lastDate = new Date(year, month, 0);
    return lastDate.getDate();
  };

  const previousMonthDateCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const lastDateOfPreviousMonth = getLastDateOfPreviousMonth(selectedYear, selectedMonthIndex);

  const previousMonthDates = Array.from(
    { length: previousMonthDateCount },
    (_, i) => lastDateOfPreviousMonth - previousMonthDateCount + i + 1
  );

  const nextMonthDateCount = (7 - ((daysInMonth + previousMonthDateCount) % 7)) % 7;
  const nextMonthDates = Array.from({ length: nextMonthDateCount }, (_, i) => i + 1);

  // ฟังก์ชันสำหรับการเปลี่ยนเดือน
  const handlePrevMonth = () => {
    const prevMonthDate = new Date(selectedMonth);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    setSelectedMonth(prevMonthDate.toISOString().split('T')[0].slice(0, 7));
    fetchData(prevMonthDate.toISOString().split('T')[0].slice(0, 7));
  };

  const handleNextMonth = () => {
    const nextMonthDate = new Date(selectedMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    setSelectedMonth(nextMonthDate.toISOString().split('T')[0].slice(0, 7));
    fetchData(nextMonthDate.toISOString().split('T')[0].slice(0, 7));
  };

  const handleDateClick = (year, month, day) => {
    const dayBookings = getBookingsForDate(year, month, day);
    setSelectedDateBookings(dayBookings);
    setShowDetailView(true);
  };

  const handleselectMonth = (e) => {
    setSelectedMonth(e.target.value);
    fetchData(e.target.value);
  };

  // Responsive check
  useEffect(() => {
    fetchData(new Date().toISOString().split('T')[0].slice(0, 7));

    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on initial load
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);


  const renderDateCell = (index, isCurrentMonth = true) => {
    const day = isCurrentMonth ? index + 1 : null;
    const dayBookings = isCurrentMonth
      ? getBookingsForDate(selectedYear, selectedMonthIndex, day)
      : [];

    const isTodayDate = isCurrentMonth && isToday(selectedYear, selectedMonthIndex, day);

    const cellClasses = `
      ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-white'}
      rounded-lg 
      h-24 
      p-1 
      ${isCurrentMonth ? 'cursor-pointer ' + (nightMode ? 'hover:bg-gray-700' : 'hover:bg-blue-100') : 'text-gray-400'}
      ${isTodayDate
        ? (nightMode
          ? 'border-4 border-red-600 font-bold'
          : 'border-4 border-red-500 font-bold'
        )
        : ''
      }
    `;

    return (
      <div
        key={`${isCurrentMonth ? 'current' : 'other'}-${index}`}
        className={cellClasses}
        onClick={() => isCurrentMonth && handleDateClick(selectedYear, selectedMonthIndex, day)}
      >
        <div className={`font-medium text-xs ${nightMode ? 'text-gray-300' : ''}`}>
          {day}
        </div>
        {isCurrentMonth && (
          <div className="overflow-hidden">
            {renderBookingNames(dayBookings)}
          </div>
        )}
      </div>
    );
  };



  // Mobile Layout
  const renderMobileLayout = () => {
    return (
      <div className={`flex flex-col h-full ${nightMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100'
        : 'bg-gradient-to-b from-blue-100 to-blue-200'
        }`}>
        <div className="p-4">
          <h2 className={`text-2xl font-extrabold mb-6 text-center flex items-center justify-center ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {nightMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 text-indigo-300 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 text-indigo-600 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            Monthly Desk Bookings
          </h2>

          {/* Month selector */}
          <div className="mb-4 flex justify-between items-center gap-2">
            <button
              onClick={handlePrevMonth}
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
              type="month"
              value={selectedMonth}
              onChange={(e) => handleselectMonth(e)}
              className={`p-2 border rounded-md shadow-sm transition w-full mx-2 text-center ${nightMode
                ? 'bg-gray-800 text-gray-200 border-gray-700 focus:ring-gray-600 focus:border-gray-500'
                : 'bg-white text-gray-800 focus:ring-red-300 focus:border-red-500'
                }`}
            />
            <button
              onClick={handleNextMonth}
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

          {/* Mobile view toggle */}
          <div className="flex mb-4 rounded-lg overflow-hidden shadow-sm">
            <button
              className={`w-1/2 p-2 transition-all duration-300 ${nightMode
                ? activeView === 'calendar'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                : activeView === 'calendar'
                  ? 'bg-red-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              onClick={() => setActiveView('calendar')}
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                ปฏิทิน
              </div>
            </button>
            <button
              className={`w-1/2 p-2 transition-all duration-300 ${nightMode
                ? activeView === 'bookings'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                : activeView === 'bookings'
                  ? 'bg-red-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              onClick={() => setActiveView('bookings')}
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                รายการจอง
              </div>
            </button>
          </div>

          {/* Calendar View */}
          {activeView === 'calendar' && (
            <div className="flex-grow overflow-auto px-2">
              <div className={`rounded-lg p-3 shadow-md border ${nightMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
                }`}>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day, idx) => (
                    <div
                      key={idx}
                      className={`font-semibold text-xs p-1 ${nightMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                    >
                      {day}
                    </div>
                  ))}

                  {previousMonthDates.map((date, index) => renderDateCell(date, false))}

                  {Array.from({ length: daysInMonth }).map((_, index) => renderDateCell(index))}

                  {nextMonthDates.map((date, index) => renderDateCell(date, false))}
                </div>
              </div>
            </div>
          )}

          {/* Bookings View */}
          {activeView === 'bookings' && (
            <div className="flex-grow overflow-hidden px-2">
              <div className="space-y-4 p-3 h-full overflow-y-auto custom-scrollbar">
                {getGroupedBookingsForMonth().length === 0 ? (
                  <div className={`text-center py-8 rounded-lg ${nightMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>ไม่มีการจอง</p>
                  </div>
                ) : (
                  getGroupedBookingsForMonth().map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className={`p-4 rounded-lg shadow-md border ${nightMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-100'
                        }`}
                    >
                      <div className={`font-medium text-base mb-3 flex items-center ${nightMode ? 'text-indigo-300' : 'text-red-600'
                        }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        วันที่ {group.date.getDate()} {getMonthInThai(group.date.getMonth())}
                      </div>
                      <div className="space-y-3">
                        {group.bookings.map((booking, bookingIndex) => (
                          <div
                            key={bookingIndex}
                            className={`border-b pb-2 last:border-b-0 last:pb-0 hover:bg-opacity-10 rounded-lg p-2 transition-colors duration-200 ${nightMode
                              ? 'border-gray-700 hover:bg-gray-700 text-gray-200'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                              }`}
                          >
                            <div className="flex justify-between w-full items-center">
                              <div className="font-medium text-sm truncate pr-2">{booking.name}</div>
                              <div className={`font-medium text-sm ml-2 flex-shrink-0 ${nightMode ? 'text-indigo-300' : 'text-red-600'
                                }`}>
                                {booking.Fromtime} - {booking.Totime}
                              </div>
                            </div>
                            {booking.note && (
                              <div className={`text-xs mt-1 truncate ${nightMode ? 'text-gray-400 italic' : 'text-gray-600 italic'
                                }`}>
                                <span className="font-medium">หมายเหตุ: </span>{booking.note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Custom scrollbar styles */}
          <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${nightMode ? '#1f2937' : '#f1f1f1'};
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${nightMode ? '#4b5563' : '#888'};
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${nightMode ? '#6b7280' : '#555'};
    }
  `}</style>
        </div>

        {/* Detail View Modal for Mobile */}
        {showDetailView && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80%] overflow-hidden">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 p-4 flex justify-between items-center border-b border-blue-200 shadow-sm">
                <h3 className="text-xl font-bold text-blue-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  รายละเอียดการจอง
                </h3>
                <button
                  onClick={() => setShowDetailView(false)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {selectedDateBookings.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">ไม่มีการจอง</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateBookings.map((booking, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-100 rounded-lg p-3 hover:bg-blue-100 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-semibold text-blue-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {booking.name}
                          </div>
                          <div className="text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                            {booking.Fromtime} - {booking.Totime}
                          </div>
                        </div>
                        {booking.note && (
                          <div className="text-xs text-gray-600 mt-2 pl-7 italic">
                            หมายเหตุ: {booking.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Desktop Layout
  const renderDesktopLayout = () => {
    return (
      <div className={`p-4 min-h-full ${nightMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100'
        : 'bg-gradient-to-b from-blue-100 to-blue-200'
        }`}>
        <h2 className={`text-3xl font-extrabold mb-6 text-center flex items-center justify-center pt-5 ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {nightMode ? <Moon size={32} className="mr-3 text-indigo-400" /> : <Calendar size={32} className="mr-3 text-indigo-600" />}
          Monthly Desk Bookings
        </h2>

        {/* เลือกเดือน */}
        <div className="mb-4 flex justify-between items-center gap-2 ">
          <button
            onClick={handlePrevMonth}
            className={`p-2 border rounded-full transition duration-200 shadow-md ${nightMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
              : 'bg-red-700 text-white hover:bg-red-600 border-red-700'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2 ">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleselectMonth(e)}
              className={`p-2 border rounded-md shadow-sm transition w-full 
                ${nightMode ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-300"} 
                focus:outline-none`}
            />
          </div>
          
          <button
            onClick={handleNextMonth}
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

        {/* ลเอาท์สำหรับเดสก์ท็อป */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ส่วนปฏิทิน */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl p-5 max-h-[700px] min-h-[700px] shadow-lg border border-gray-100 ${nightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map((day, idx) => (
                  <div
                    key={idx}
                    className="font-semibold text-xs text-gray-500 p-1 uppercase tracking-wider"
                  >
                    {day}
                  </div>
                ))}

                {previousMonthDates.map((date, index) => renderDateCell(date, false))}

                {Array.from({ length: daysInMonth }).map((_, index) => renderDateCell(index))}

                {nextMonthDates.map((date, index) => renderDateCell(date, false))}
              </div>
            </div>
          </div>

          {/* ส่วนแสดงรายละเอียดการจอง */}
<div className={`
  ${nightMode 
    ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
    : 'bg-gradient-to-br from-blue-100 to-blue-200'}
  rounded-xl p-5 shadow-2xl overflow-hidden max-h-[700px] min-h-[700px] transition-colors duration-300
`}>
  <div className="flex items-center justify-between mb-4">
    <h3 className={`
      text-lg font-bold 
      ${nightMode ? 'text-white' : 'text-gray-800'} 
      flex items-center
    `}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 mr-2 ${nightMode ? 'text-blue-400' : 'text-blue-600'}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      การจองประจำเดือน {getMonthInThai(selectedMonthIndex)} {selectedYear}
    </h3>
  </div>

  <div className={`
    space-y-4 overflow-y-auto max-h-[610px] min-h-[610px] pr-2 
    ${nightMode ? 'custom-scrollbar-dark' : 'custom-scrollbar'}
  `}>
    {getGroupedBookingsForMonth().length === 0 ? (
      <div className={`
        text-center py-10 rounded-lg
        ${nightMode 
          ? 'bg-white/5 text-gray-400 border border-white/10' 
          : 'bg-gray-100 text-gray-500'}
      `}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-12 w-12 mx-auto mb-4 ${nightMode ? 'text-gray-600' : 'text-gray-400'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">ไม่มีการจองในเดือนนี้</p>
      </div>
    ) : (
      getGroupedBookingsForMonth().map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`
            ${nightMode 
              ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/30' 
              : 'bg-white shadow-sm border-gray-200 hover:shadow-md'}
            rounded-lg border transition-all duration-300
          `}
        >
          <div className={`
            px-4 py-3 
            ${nightMode 
              ? 'border-b border-white/10' 
              : 'border-b border-gray-100'}
          `}>
            <div className={`
              font-medium text-base 
              ${nightMode ? 'text-blue-300' : 'text-blue-600'}
            `}>
              วันที่ {group.date.getDate()} {getMonthInThai(group.date.getMonth())}
            </div>
          </div>
          <div className="p-4 space-y-3">
            {group.bookings.map((booking, bookingIndex) => (
              <div
                key={bookingIndex}
                className={`
                  ${nightMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
                  rounded-md p-3 border transition-all duration-300
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className={`
                    font-medium text-sm truncate flex-grow pr-2 
                    ${nightMode ? 'text-white' : 'text-gray-800'}
                  `}>
                    {booking.name} | {booking.table}
                  </div>
                  <div className={`
                    font-medium text-sm ml-2 flex-shrink-0
                    ${nightMode ? 'text-blue-300' : 'text-blue-600'}
                  `}>
                    {booking.Fromtime} - {booking.Totime}
                  </div>
                </div>
                {booking.note && (
                  <div className={`
                    text-xs mt-1 italic
                    ${nightMode ? 'text-gray-500' : 'text-gray-600'}
                  `}>
                    หมายเหตุ: {booking.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))
    )}
  </div>
</div>
        </div>

        {/* Optional: Add custom scrollbar styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.3);
          }
        `}</style>

        {/* Detail View Modal for Desktop */}

        {showDetailView && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`${nightMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-xl w-full max-w-md max-h-[80%] overflow-hidden`}>
              <div className={`sticky top-0 ${nightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 flex justify-between items-center border-b shadow-sm`}>
                <h3 className={`text-lg font-bold ${nightMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${nightMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  รายละเอียดการจอง
                </h3>
                <button
                  onClick={() => setShowDetailView(false)}
                  className={`${nightMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-100'} p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${nightMode ? 'focus:ring-red-900' : 'focus:ring-red-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {selectedDateBookings.length === 0 ? (
                  <div className={`text-center ${nightMode ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-gray-50'} py-8 rounded-lg`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 mx-auto mb-3 ${nightMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">ไม่มีการจอง</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateBookings.map((booking, index) => (
                      <div
                        key={index}
                        className={`${nightMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} border rounded-lg p-3 transition-colors duration-200`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className={`font-medium ${nightMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${nightMode ? 'text-gray-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {booking.name}
                          </div>
                          <div className={`text-sm ${nightMode ? 'text-gray-300 bg-gray-900 border-gray-700' : 'text-gray-600 bg-white border-gray-200'} border px-2 py-1 rounded`}>
                            {booking.Fromtime} - {booking.Totime}
                          </div>
                        </div>
                        {booking.note && (
                          <div className={`text-xs mt-2 pl-7 italic ${nightMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            หมายเหตุ: {booking.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );

  }

  return isMobile ? renderMobileLayout() : renderDesktopLayout();

};

export default CoMonth;