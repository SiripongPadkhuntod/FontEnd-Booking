import React from "react";

// ฟังก์ชันสุ่มสี
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CoGrid = () => {
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const desks = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"];

  // ตัวอย่างข้อมูลการจอง
  const bookings = [
    { desk: "A01", name: "John Doe", time: "10:00 AM", note: "Team meeting", day: "จันทร์" },
    { desk: "A01", name: "Jane Smith", time: "1:00 PM", note: "Project review", day: "พุธ" },
    { desk: "A02", name: "Alice Brown", time: "3:00 PM", note: "Client call", day: "จันทร์" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Grid View</h2>
      <div className="grid grid-cols-11 gap-4">
        {/* Header สำหรับ Days */}
        <div className="font-semibold text-center">Days</div>
        {desks.map((desk, deskIndex) => (
          <div key={deskIndex} className="font-semibold text-center">
            {desk}
          </div>
        ))}

        {/* แสดงข้อมูลสำหรับแต่ละวันและ Desk */}
        {days.map((day, dayIndex) => (
          <React.Fragment key={dayIndex}>
            {/* ชื่อวัน */}
            <div className="font-medium text-center">{day}</div>
            {desks.map((desk, deskIndex) => {
              // กรองการจองเฉพาะที่ตรงกับวันและ desk นี้
              const bookingsForDeskAndDay = bookings.filter(
                (booking) => booking.desk === desk && booking.day === day
              );

              return (
                <div
                  key={`${dayIndex}-${deskIndex}`}
                  className="bg-white w-35 h-30 p-4 rounded-lg shadow-lg border relative group"
                >
                  {/* ชื่อผู้จอง */}
                  <div className="flex flex-col space-y-1">
                    {bookingsForDeskAndDay.length > 0 ? (
                      bookingsForDeskAndDay.map((booking, index) => (
                        <div
                          key={index}
                          className="flex items-center truncate"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {/* จุดสี */}
                          <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: getRandomColor() }}
                          ></span>
                          {/* ชื่อ */}
                          <span className="truncate">{booking.name.split(" ")[0]}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">ว่าง</div>
                    )}
                  </div>

                  {/* รายละเอียดเมื่อเอาเมาส์ไปวาง */}
                  {bookingsForDeskAndDay.length > 0 && (
                    <div
                      className="absolute bg-gray-800 text-white text-left p-4 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        minWidth: "200px",
                        top: "100%",
                        left: "0",
                        zIndex: 50,
                      }}
                    >
                      {bookingsForDeskAndDay.map((booking, index) => (
                        <div key={index} className="mb-2">
                          <div className="font-semibold">{booking.name}</div>
                          <div>{booking.time}</div>
                          <div className="text-sm">{booking.note}</div>
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
  );
};

export default CoGrid;
