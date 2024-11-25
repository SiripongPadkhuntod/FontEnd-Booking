import React from "react";

const CoDay = () => {
  // โต๊ะทั้งหมดที่เราต้องการแสดง
  const desks = ["A01", "A02", "A03", "A04", "A05", "B01", "B02", "C01", "C02"];
  
  // ข้อมูลการจอง
  const bookings = [
    { desk: "A01", name: "Theeraphat (Tle)", start: 9, end: 12 },
    { desk: "A01", name: "Siripong (Stop)", start: 12, end: 18 },
    { desk: "A02", name: "Tonkla", start: 11, end: 14 },
    { desk: "A03", name: "P'Koon", start: 9, end: 12 },
    { desk: "A04", name: "Chanon (Tee)", start: 12, end: 15 },
    { desk: "A05", name: "P'Ray", start: 9, end: 12 },
    { desk: "B01", name: "Warodom (Ryu)", start: 9, end: 18 },
  ];

  // เวลาที่เราจะแสดงบนตาราง (9:00 - 18:00)
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // 9:00 - 18:00

  // ฟังก์ชันสุ่มสีให้ผู้ใช้
  const getColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-teal-500",
      "bg-yellow-500",
    ];
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="p-5 bg-gray-300 h-full w-full">
      <h1 className="text-3xl font-bold mb-6">Desk Booking Schedule</h1>
      <div className="overflow-x-auto border rounded-lg shadow w-full">
        {/* Header */}
        <div className="flex bg-gray-50 border-b">
          <div className="w-40 p-2 text-center font-semibold">Desk</div>
          {hours.map((hour, index) => (
            <div key={index} className="flex-1 border-l text-center text-sm font-semibold">
              {`${hour}:00`}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="bg-gray-200">
          {desks.map((desk, idx) => {
            // ดึงข้อมูลการจองของแต่ละโต๊ะ
            const deskBookings = bookings
              .filter((booking) => booking.desk === desk)
              .sort((a, b) => a.start - b.start);

            return (
              <div key={idx} className="flex items-top">
                {/* Desk Info */}
                <div className="w-40 p-2 border-r text-sm font-bold text-gray-700">
                  {desk}
                </div>

                {/* Time Slots */}
                <div className="flex-1 relative">
                  {deskBookings.map((booking, bookingIdx) => {
                    // ปรับเวลาเริ่มต้นและสิ้นสุดให้อยู่ภายใน 9:00 - 18:00
                    const startTime = Math.max(9, booking.start);
                    const endTime = Math.min(18, booking.end);

                    // คำนวณตำแหน่งการแสดงกราฟ
                    const gridStart = (startTime - 9) * (100 / (hours.length - 1)); // คำนวณตำแหน่งเริ่ม
                    const gridEnd = (endTime - 9) * (100 / (hours.length - 1)); // คำนวณตำแหน่งสิ้นสุด

                    return (
                      <div
                        key={bookingIdx}
                        className={`absolute text-sm rounded px-6 py-2 ${getColor(
                          booking.name
                        )}`}
                        style={{
                          left: `${gridStart}%`,
                          width: `${gridEnd - gridStart}%`,
                          // เพิ่มช่องว่างระหว่างการจองในโต๊ะเดียวกัน
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
  );
};

export default CoDay;
