import React, { useState } from "react";

const CoMonth = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

  // ข้อมูลตัวอย่าง
  const bookings = [
    { name: "John Doe", time: "10:00 AM", note: "Team meeting", date: new Date("2024-11-16") },
    { name: "Alice Brown", time: "3:00 PM", note: "Client call", date: new Date("2024-11-15") },
    { name: "David Black", time: "5:00 PM", note: "Review", date: new Date("2024-11-20") },
    { name: "Emma White", time: "9:00 AM", note: "Brainstorming", date: new Date("2024-02-29") },
    { name: "James Green", time: "1:00 PM", note: "Project Update", date: new Date("2024-03-01") },
    { name: "James Green", time: "1:00 PM", note: "Project Update", date: new Date("2024-03-01") },
  ];

  // ฟังก์ชันสำหรับดึงจำนวนวันในเดือน
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  // ฟังก์ชันแปลงวันในสัปดาห์เป็นภาษาไทย
  const getDayInThai = (date) => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    return days[date.getDay()];
  };

  // ฟังก์ชันแปลงเดือนเป็นภาษาไทย
  const getMonthInThai = (monthIndex) => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return months[monthIndex];
  };

  // ฟังก์ชันแสดงข้อมูลการจอง
  const renderBookingNames = (bookings) => {
    if (bookings.length === 0) return <div className="text-gray-400">ว่าง</div>;

    return bookings.slice(0, 2).map((booking, index) => (
      <div key={index} className="text-sm flex items-center space-x-2">
        {bookings.length > 2 && index === 1 && (
          <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">+</div>
        )}
        <span className="font-medium">{booking.name}</span> ({booking.time})
      </div>
    ));
  };

  // ฟังก์ชันหาวันที่ 1 ของเดือนและวันที่ของสัปดาห์ที่เดือนนั้นเริ่ม
  const getFirstDayOfMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    return firstDay.getDay();
  };

  // ฟังก์ชันค้นหาการจองสำหรับวันที่ที่ระบุ
  const getBookingsForDate = (year, month, day) => {
    const date = new Date(year, month, day);
    return bookings.filter(booking => 
      booking.date.getFullYear() === date.getFullYear() &&
      booking.date.getMonth() === date.getMonth() &&
      booking.date.getDate() === date.getDate()
    );
  };

  // ฟังก์ชันเรียงลำดับการจองตามวันที่
  const getSortedBookingsForMonth = () => {
    const selectedYear = parseInt(selectedMonth.split("-")[0], 10);
    const selectedMonthIndex = parseInt(selectedMonth.split("-")[1], 10) - 1;

    return bookings
      .filter(booking => 
        booking.date.getFullYear() === selectedYear &&
        booking.date.getMonth() === selectedMonthIndex
      )
      .sort((a, b) => a.date - b.date);
  };

  // คำนวณจำนวนวันที่ในเดือนที่เลือก
  const selectedYear = parseInt(selectedMonth.split("-")[0], 10);
  const selectedMonthIndex = parseInt(selectedMonth.split("-")[1], 10) - 1;
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex);
  const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonthIndex);

  // ฟังก์ชันคำนวณวันที่จากเดือนก่อนหน้า
  const getLastDateOfPreviousMonth = (year, month) => {
    const lastDate = new Date(year, month, 0);
    return lastDate.getDate();
  };

  // คำนวณวันที่ก่อนหน้านี้จากเดือนก่อนหน้า
  const previousMonthDateCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const lastDateOfPreviousMonth = getLastDateOfPreviousMonth(selectedYear, selectedMonthIndex);
  
  // เติมวันที่จากเดือนก่อนหน้า
  const previousMonthDates = Array.from(
    { length: previousMonthDateCount },
    (_, i) => lastDateOfPreviousMonth - previousMonthDateCount + i + 1
  );

  // เติมวันที่จากเดือนถัดไป
  const nextMonthDateCount = (7 - ((daysInMonth + previousMonthDateCount) % 7)) % 7;
  const nextMonthDates = Array.from({ length: nextMonthDateCount }, (_, i) => i + 1);

  const weeks = Array.from({ length: Math.ceil((daysInMonth + previousMonthDateCount + nextMonthDateCount) / 7) }, (_, i) => i * 7);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Monthly Desk Booking</h2>

      <div className="lg:flex lg:space-x-4 space-y-4 lg:space-y-0">
        {/* ส่วนปฏิทิน */}
        <div className="lg:w-2/3">
          {/* เลือกเดือน */}
          <div className="mb-4">
            <label className="mr-2">เลือกเดือน:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Grid แสดงข้อมูล */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px] p-6 bg-purple-200 rounded-lg">
              <div className="grid grid-cols-7 gap-4">
                {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"].map((day, idx) => (
                  <div key={idx} className="font-semibold text-left">{day}</div>
                ))}

                {weeks.map((weekStart, weekIndex) => (
                  <React.Fragment key={weekIndex}>
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const day = weekStart + dayIndex + 1;
                      if (day > daysInMonth + previousMonthDateCount) return null;

                      const isInPreviousMonth = day <= previousMonthDateCount;
                      const currentDay = isInPreviousMonth 
                        ? previousMonthDates[day - 1] 
                        : day - previousMonthDateCount;

                      let bookingYear = selectedYear;
                      let bookingMonth = selectedMonthIndex;

                      if (isInPreviousMonth) {
                        if (selectedMonthIndex === 0) {
                          bookingYear--;
                          bookingMonth = 11;
                        } else {
                          bookingMonth--;
                        }
                      }

                      const dayBookings = getBookingsForDate(bookingYear, bookingMonth, currentDay);

                      const isInNextMonth = day > daysInMonth + previousMonthDateCount;

                      return (
                        <div key={day} className={`text-left p-2 min-h-[80px] ${isInNextMonth || isInPreviousMonth ? "text-gray-400" : ""} border border-purple-300 rounded`}>
                          <div className={`font-medium ${isInNextMonth || isInPreviousMonth ? "text-gray-400" : ""}`}>
                            {currentDay}
                          </div>
                          {renderBookingNames(dayBookings)}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}

                {/* วันที่จากเดือนถัดไป */}
                {nextMonthDates.map((nextDay, idx) => {
                  let nextMonthYear = selectedYear;
                  let nextMonth = selectedMonthIndex + 1;
                  
                  if (nextMonth > 11) {
                    nextMonthYear++;
                    nextMonth = 0;
                  }

                  const dayBookings = getBookingsForDate(nextMonthYear, nextMonth, nextDay);

                  return (
                    <div key={idx} className="text-left p-2 min-h-[80px] text-gray-400 border border-purple-300 rounded">
                      <div className="font-medium">{nextDay}</div>
                      {renderBookingNames(dayBookings)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนแสดงรายละเอียดการจอง */}
        <div className="lg:w-1/3 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            การจองประจำเดือน {getMonthInThai(selectedMonthIndex)} {selectedYear}
          </h3>
          <div className="space-y-4">
            {getSortedBookingsForMonth().map((booking, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition">
                <div className="font-medium text-lg text-blue-600">
                  วันที่ {booking.date.getDate()} {getMonthInThai(booking.date.getMonth())}
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="font-semibold">{booking.name}</span>
                  <span className="text-gray-600">{booking.time}</span>
                </div>
                {booking.note && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">หมายเหตุ: </span>{booking.note}
                  </div>
                )}
                <div className="border-t border-gray-200 mt-3 pt-3 text-sm text-gray-400">
                  <span>หมายเหตุเพิ่มเติม: {booking.note ? booking.note : 'ไม่มี'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoMonth;
