import React, { useState, useEffect } from "react";

const CoMonth = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'bookings'

  // ข้อมูลตัวอย่าง
  const bookings = [
    { name: "John Doe", Fromtime: "10:00 AM", Totime: "6:00 PM", table: "A1", note: "Team meeting", date: new Date("2024-11-16") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "Alice Brown", Fromtime: "3:00 PM", Totime: "6:00 PM", table: "A1", note: "Client call", date: new Date("2024-11-15") },
    { name: "David Black", Fromtime: "5:00 PM", Totime: "6:00 PM", table: "A1", note: "Review", date: new Date("2024-11-20") },
    { name: "Emma White", Fromtime: "9:00 AM", Totime: "6:00 PM", table: "A1", note: "Brainstorming", date: new Date("2024-02-29") },
    { name: "James Green", Fromtime: "1:00 PM", Totime: "6:00 PM", table: "A1", note: "Project Update", date: new Date("2024-03-01") },
  ];

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/bookings`);
      if (!response.ok) throw new Error('Failed to fetch bookings');

      if (response.status === 204) {
        setBookings([]);
      } else {
        const data = await response.json();
        let formdata = data.map((booking) => {
          return {
            name: booking.name,
            Fromtime: booking.Fromtime,
            note: booking.note,
            date: new Date(booking.date)
          };
        });
        setBookings(formdata);
      }
    }
    catch (err) {
      console.error(err.message);
    }
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
  };

  const handleNextMonth = () => {
    const nextMonthDate = new Date(selectedMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    setSelectedMonth(nextMonthDate.toISOString().split('T')[0].slice(0, 7));
  };

  const handleDateClick = (year, month, day) => {
    const dayBookings = getBookingsForDate(year, month, day);
    setSelectedDateBookings(dayBookings);
    setShowDetailView(true);
  };

  // Responsive check
  useEffect(() => {
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

  // Mobile Layout
  // Mobile Layout
  const renderMobileLayout = () => {
    return (
      <div className="flex flex-col h-full ">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-center text-black">Monthly Desk Booking</h2>

          {/* Month selector */}
          <div className="mb-4 flex justify-between items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 border rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 shadow-md"
            >
              &lt;
            </button>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 transition w-full"
            />
            <button
              onClick={handleNextMonth}
              className="p-2 border rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 shadow-md"
            >
              &gt;
            </button>
          </div>

          {/* Mobile view toggle */}
          <div className="flex mb-4">
            <button
              className={`w-1/2 p-2 ${activeView === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveView('calendar')}
            >
              ปฏิทิน
            </button>
            <button
              className={`w-1/2 p-2 ${activeView === 'bookings' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveView('bookings')}
            >
              รายการจอง
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="flex-grow overflow-auto px-2">
            <div className="bg-gray-200 rounded-lg p-3">
              <div className="grid grid-cols-7 gap-1 text-center">
                {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day, idx) => (
                  <div key={idx} className="font-semibold text-xs p-1">{day}</div>
                ))}

                {/* Previous month dates */}
                {previousMonthDates.map((date, index) => (
                  <div key={`prev-${index}`} className="bg-white rounded-lg p-1 text-gray-400 text-xs h-16">
                    <div className="font-medium">{date}</div>
                  </div>
                ))}

                {/* Current month dates */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const dayBookings = getBookingsForDate(selectedYear, selectedMonthIndex, index + 1);
                  return (
                    <div
                      key={`current-${index}`}
                      className="bg-white rounded-lg h-16 p-1 cursor-pointer hover:bg-blue-100"
                      onClick={() => handleDateClick(selectedYear, selectedMonthIndex, index + 1)}
                    >
                      <div className="font-medium text-xs">{index + 1}</div>
                      <div className="overflow-hidden">
                        {renderBookingNames(dayBookings)}
                      </div>
                    </div>
                  );
                })}

                {/* Next month dates */}
                {nextMonthDates.map((date, index) => (
                  <div key={`next-${index}`} className="bg-white rounded-lg h-16 p-1 text-gray-400 text-xs">
                    <div className="font-medium">{date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings View */}
        {activeView === 'bookings' && (
          <div className="flex-grow overflow-hidden px-2">
            <div className="space-y-4 p-3 h-full overflow-scroll">
              {getGroupedBookingsForMonth().map((group, groupIndex) => (
                <div key={groupIndex} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-base text-blue-600 mb-3">
                    วันที่ {group.date.getDate()} {getMonthInThai(group.date.getMonth())}
                  </div>
                  <div className="space-y-3">
                    {group.bookings.map((booking, bookingIndex) => (
                      <div key={bookingIndex} className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                        <div className="flex justify-between w-full">
                          <div className="font-medium text-sm truncate">{booking.name}</div>
                          <div className="font-medium text-sm ml-2">{booking.Fromtime} - {booking.Totime}</div>
                        </div>
                        {booking.note && (
                          <div className="text-xs text-gray-600 mt-1 truncate">
                            <span className="font-medium">หมายเหตุ: </span>{booking.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail View Modal for Mobile */}
        {showDetailView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80%] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
                <h3 className="text-lg font-semibold">รายละเอียดการจอง</h3>
                <button
                  onClick={() => setShowDetailView(false)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                >
                  ปิด
                </button>
              </div>

              <div className="p-4">
                {selectedDateBookings.length === 0 ? (
                  <div className="text-center text-gray-500">ไม่มีการจอง</div>
                ) : (
                  selectedDateBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:mb-0"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{booking.name}</div>
                        <div className="text-sm text-gray-600">{booking.Fromtime}  -  {booking.Totime}</div>
                      </div>
                      {booking.note && (
                        <div className="text-xs text-gray-500 mt-1">
                          หมายเหตุ: {booking.note}
                        </div>
                      )}
                    </div>
                  ))
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
      <div className="p-4 min-h-full">
        <h2 className="text-xl font-bold mb-4 text-center text-black">Monthly Desk Booking</h2>

        {/* เลือกเดือน */}
        <div className="mb-4 flex justify-between items-center gap-2 ">
          <button
            onClick={handlePrevMonth}
            className="p-2 border rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 shadow-md"
          >
            &lt;
          </button>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 transition w-full"
            />
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 border rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 shadow-md"
          >
            &gt;
          </button>
        </div>

        {/* ลเอาท์สำหรับเดสก์ท็อป */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ส่วนปฏิทิน */}
          <div className="lg:col-span-2">
            <div className={`bg-gray-200 rounded-lg p-5 max-h-[700px] min-h-[700px] drop-shadow-xl`}>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day, idx) => (
                  <div key={idx} className="font-semibold text-xs p-1">{day}</div>
                ))}

                {previousMonthDates.map((date, index) => (
                  <div key={`prev-${index}`} className="bg-white rounded-lg p-1 text-gray-400 text-xs h-24">
                    <div className="font-medium">{date}</div>
                  </div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const dayBookings = getBookingsForDate(selectedYear, selectedMonthIndex, index + 1);
                  return (
                    <div
                      key={`current-${index}`}
                      className="bg-white rounded-lg h-24 p-1 cursor-pointer hover:bg-blue-100"
                      onClick={() => handleDateClick(selectedYear, selectedMonthIndex, index + 1)}
                    >
                      <div className="font-medium text-xs">{index + 1}</div>
                      <div className="overflow-hidden">
                        {renderBookingNames(dayBookings)}
                      </div>
                    </div>
                  );
                })}

                {nextMonthDates.map((date, index) => (
                  <div key={`next-${index}`} className="bg-white rounded-lg h-24 p-1 text-gray-400 text-xs">
                    <div className="font-medium">{date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ส่วนแสดงรายละเอียดการจอง */}
          <div className="bg-slate-600 rounded-lg p-5 shadow-lg overflow-y-hidden max-h-[700px] min-h-[700px] drop-shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-white">
              การจองประจำเดือน {getMonthInThai(selectedMonthIndex)} {selectedYear}
            </h3>

            <div className="ml-2 space-y-4 overflow-y-auto max-h-[610px] min-h-[610px] rounded-lg">
              {getGroupedBookingsForMonth().map((group, groupIndex) => (
                <div key={groupIndex} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-base text-blue-600 mb-3">
                    วันที่ {group.date.getDate()} {getMonthInThai(group.date.getMonth())}
                  </div>
                  <div className="space-y-3">
                    {group.bookings.map((booking, bookingIndex) => (
                      <div key={bookingIndex} className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                        <div className="flex justify-between w-full">
                          <div className="font-medium text-sm truncate">{booking.name}  | {booking.table}</div>
                          <div className="font-medium text-sm ml-2">{booking.Fromtime} - {booking.Totime}  </div>
                        </div>
                        {/* {booking.note && (
                          <div className="text-xs text-gray-600 mt-1 truncate">
                            <span className="font-medium">หมายเหตุ: </span>{booking.note}
                          </div>
                        )} */}
                        {/* {booking.table && ( */}
                          <div className="flex justify-between text-xs text-gray-600 mt-1 truncate">
                              <div className="text-xs text-gray-600 mt-1 truncate">
                            <span className="font-medium">หมายเหตุ: </span>{booking.note}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 truncate">
                            {/* <span className="font-medium"></span>{booking.table} */}
                          </div>
                          </div>
                        {/* )} */}


                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail View Modal for Desktop */}
        {showDetailView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80%] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
                <h3 className="text-lg font-semibold">รายละเอียดการจอง</h3>
                <button
                  onClick={() => setShowDetailView(false)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                >
                  ปิด
                </button>
              </div>

              <div className="p-4">
                {selectedDateBookings.length === 0 ? (
                  <div className="text-center text-gray-500">ไม่มีการจอง</div>
                ) : (
                  selectedDateBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:mb-0"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{booking.name}</div>
                        <div className="text-sm text-gray-600">{booking.Fromtime}  -  {booking.Totime}</div>
                      </div>
                      {booking.note && (
                        <div className="text-xs text-gray-500 mt-1">
                          หมายเหตุ: {booking.note}
                        </div>
                      )}
                    </div>
                  ))
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