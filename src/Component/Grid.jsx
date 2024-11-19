import React, { useState } from "react";

const CoGrid = () => {
  const desks = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"];

  // ข้อมูลตัวอย่าง
  const bookings = [
    { desk: "A01", name: "John Doe", time: "10:00 AM", note: "Team meeting", date: new Date("2024-11-16") },
    { desk: "A01", name: "John Doe", time: "11:00 AM", note: "Team meeting", date: new Date("2024-11-16") },
    { desk: "A01", name: "John Doe", time: "12:00 AM", note: "Team meeting", date: new Date("2024-11-16") },
    { desk: "A01", name: "John Doe", time: "13:00 AM", note: "Team meeting", date: new Date("2024-11-16") },
    { desk: "A01", name: "John Doe", time: "14:00 AM", note: "Team meeting", date: new Date("2024-11-16") },
    { desk: "A01", name: "Jane Smith", time: "1:00 PM", note: "Project review", date: new Date("2024-11-15") },
    { desk: "A02", name: "Alice Brown", time: "3:00 PM", note: "Client call", date: new Date("2024-12-15") },
    { desk: "A02", name: "Bob Wilson", time: "2:00 PM", note: "Daily standup", date: new Date("2024-11-15") },
    { desk: "A02", name: "Bob Wilson", time: "2:00 PM", note: "Daily standup", date: new Date("2024-11-15") },
    { desk: "A02", name: "Bob Wilson", time: "2:00 PM", note: "Daily standup", date: new Date("2024-11-15") },
    { desk: "A02", name: "Bob Wilson", time: "2:00 PM", note: "Daily standup", date: new Date("2024-11-15") },
    { desk: "A02", name: "Carol White", time: "4:00 PM", note: "Planning", date: new Date("2024-11-14") },
    { desk: "A02", name: "David Black", time: "5:00 PM", note: "Review", date: new Date("2024-11-14") },
  ];

  const [selectedDate, setSelectedDate] = useState("");

  // ฟังก์ชันเพื่อแปลงวันที่เป็นรูปแบบที่ต้องการ
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];  // แปลงเป็น 'YYYY-MM-DD'
  };

  // ฟังก์ชันแปลงวันที่เป็นวันในสัปดาห์
  const getDayInThai = (date) => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    return days[date.getDay()];
  };

  // กรองข้อมูลที่ตรงกับวันที่ที่เลือก
  const filteredBookings = bookings.filter((booking) => {
    return selectedDate ? formatDate(booking.date) === selectedDate : true;
  });

  // ฟังก์ชันแสดงรายชื่อและ +more ถ้ามีการจองเกิน 2 คน
  const renderBookingNames = (bookings) => {
    if (bookings.length <= 2) {
      return bookings.map((booking, index) => (
        <div key={index} className="flex items-center truncate" style={{ fontSize: "0.85rem" }}>
          <span className="w-2 h-2 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: "#00f" }}></span>
          <span className="truncate">{booking.name.split(" ")[0]}</span>
        </div>
      ));
    } else {
      return (
        <>
          {bookings.slice(0, 2).map((booking, index) => (
            <div key={index} className="flex items-center truncate" style={{ fontSize: "0.85rem" }}>
              <span className="w-2 h-2 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: "#00f" }}></span>
              <span className="truncate">{booking.name.split(" ")[0]}</span>
            </div>
          ))}
          <div className="text-sm text-gray-500 mt-1">
            +{bookings.length - 2} more...
          </div>
        </>
      );
    }
  };

  return (
    <div className="w-full h-ful p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Grid View</h2>

      {/* Dropdown สำหรับเลือกวันที่ */}
      <div className="mb-4">
        <label className="mr-2">เลือกวันที่:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Grid แสดงข้อมูล */}
      <div className="min-w-[1200px] p-5 bg-purple-200 rounded-lg">
        <div className="grid grid-cols-11 gap-4">
          <div className="font-semibold text-center">Days</div>
          {desks.map((desk, deskIndex) => (
            <div key={deskIndex} className="font-semibold text-center">
              {desk}
            </div>
          ))}

          {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"].map((day, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <div className="font-medium text-center place-content-center">{day}</div>
              {desks.map((desk, deskIndex) => {
                // กรองข้อมูลตามวันที่และ desk
                const bookingsForDeskAndDate = filteredBookings.filter(
                  (booking) => booking.desk === desk && getDayInThai(booking.date) === day
                );

                return (
                  <div
                    key={`${dayIndex}-${deskIndex}`}
                    className="bg-white w-full h-20 p-3 rounded-lg shadow-sm border relative group"
                  >
                    <div className="flex flex-col space-y-1 h-full">
                      {bookingsForDeskAndDate.length > 0 ? (
                        renderBookingNames(bookingsForDeskAndDate)
                      ) : (
                        <div className="text-gray-400">ว่าง</div>
                      )}
                    </div>
                    {bookingsForDeskAndDate.length > 0 && (
                      <div
                        className="absolute hidden group-hover:block bg-white border shadow-lg rounded-lg p-3 z-50 w-48"
                        style={{
                          top: "50%",
                          left: "calc(100% + 5px)",
                          transform: "translateY(-50%)",
                          maxHeight: "200px", // กำหนดความสูงสูงสุด
                          overflowY: "auto", // เพิ่ม Scrollbar เมื่อเนื้อหาเกินความสูง
                        }}
                      >
                        {bookingsForDeskAndDate.map((booking, index) => (
                          <div key={index} className="mb-2 text-gray-800">
                            <div className="font-semibold truncate">{booking.name}</div>
                            <div className="text-sm">{booking.time}</div>
                            <div className="text-sm truncate">{booking.note}</div>
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
  );
};

export default CoGrid;
