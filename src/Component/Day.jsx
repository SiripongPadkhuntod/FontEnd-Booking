import React, { useState, useEffect } from "react";

const CoDay = () => {
  const desks = ["A01", "A02", "A03", "A04", "A05","A06", "B01", "B02", "C01", "C02"];

  // ตัวอย่างข้อมูลใหม่ในรูปแบบที่คุณให้มา
  const [bookings, setBookings] = useState([]);
  
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // เวลาที่จะแสดง (9:00 ถึง 18:00)

  // ตัวอย่างข้อมูลที่ส่งมาจาก API หรือ JSON ใหม่
  const rawBookings = [
    {
      "table_number": "A05",
      "reservation_time_from": "08:00:00",
      "reservation_time_to": "10:00:00",
      "first_name": "FirstName38",
      "last_name": "LastName38"
    },
    {
      "table_number": "A06",
      "reservation_time_from": "15:00:00",
      "reservation_time_to": "17:00:00",
      "first_name": "FirstName40",
      "last_name": "LastName40"
    },
    {
      "table_number": "B02",
      "reservation_time_from": "10:00:00",
      "reservation_time_to": "18:00:00",
      "first_name": "FirstName45",
      "last_name": "LastName45"
    },
    {
      "table_number": "B01",
      "reservation_time_from": "13:00:00",
      "reservation_time_to": "15:00:00",
      "first_name": "FirstName17",
      "last_name": "LastName17"
    }
  ];

  // แปลงข้อมูล JSON ใหม่ให้เป็นรูปแบบที่ใช้งานได้
  useEffect(() => {
    const transformedData = rawBookings.map(item => ({
      desk: item.table_number,
      name: `${item.first_name} ${item.last_name}`,
      start: parseInt(item.reservation_time_from.split(":")[0], 10), // แปลงเวลาเริ่มต้น
      end: parseInt(item.reservation_time_to.split(":")[0], 10), // แปลงเวลาจบ
    }));
    setBookings(transformedData);
  }, []);

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
    <div className="p-4 sm:p-10 h-full w-full bg-gradient-to-b from-[#87CEEB] to-[#ADD8E6]">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-gray-800">Desk Booking Schedule</h1>
      <div className="overflow-x-auto border rounded-lg shadow w-full bg-white">
        <div className="flex bg-gray-50 border-b">
          <div className="w-24 sm:w-52 p-2 sm:p-3 text-center font-bold text-sm sm:text-lg">Desk</div>
          {hours.map((hour, index) => (
            <div
              key={index}
              className="flex-1 border-l text-center text-xs sm:text-base font-semibold p-1 sm:p-2"
              style={{
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {`${hour}:00`}
            </div>
          ))}
        </div>
        <div className="bg-gray-100 relative">
          {desks.map((desk, idx) => {
            // กรองข้อมูลการจองเฉพาะที่ตรงกับโต๊ะนั้น
            const deskBookings = bookings
              .filter((booking) => booking.desk === desk)
              .sort((a, b) => a.start - b.start); // เรียงตามเวลาจอง

            return (
              <div key={idx} className="flex items-top" style={{ marginBottom: '2px' }}>
                <div className="w-24 sm:w-52 p-2 sm:p-3 border-r text-sm sm:text-base font-bold text-gray-700">
                  {desk}
                </div>
                <div className="relative flex-1">
                  {/* Grid Lines */}
                  <div
                    className="absolute inset-0 grid grid-cols-10"
                    style={{
                      gridTemplateColumns: `repeat(${hours.length}, 1fr)`,
                    }}
                  >
                    {hours.map((_, i) => (
                      <div
                        key={i}
                        className="border-l border-gray-300"
                        style={{
                          gridColumn: i + 1,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Booking Slots */}
                  {deskBookings.map((booking, bookingIdx) => {
                    const startTime = Math.max(9, booking.start);
                    const endTime = Math.min(18, booking.end);
                    const gridStart = (startTime - 9) * (100 / hours.length);
                    const gridEnd = (endTime - 8) * (100 / hours.length);

                    return (
                      <div
                        key={bookingIdx}
                        className={`absolute text-xs sm:text-base rounded px-2 sm:px-6 py-1 sm:py-3 ${getColor(
                          booking.name
                        )} text-white`}
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
  );
};

export default CoDay;
