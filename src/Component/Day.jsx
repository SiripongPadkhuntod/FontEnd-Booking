import React, { useState, useEffect } from "react";
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้
const CoDay = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // สำหรับการแสดงสถานะขณะโหลดข้อมูล
  const [error, setError] = useState(null); // สำหรับการจัดการข้อผิดพลาด
  const desks = ["A01", "A02", "A03", "A04", "A05", "B01", "B02", "C01", "C02"];
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

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

  // const bookings = [
  //   { desk: "A01", name: "Theeraphat (Tle)", start: 10, end: 12 },
  //   { desk: "A01", name: "Siripong (Stop)", start: 13, end: 18 },
  //   { desk: "A02", name: "Tonkla", start: 11, end: 14 },
  //   { desk: "A03", name: "P'Koon", start: 9, end: 12 },
  //   { desk: "A04", name: "Chanon (Tee)", start: 12, end: 15 },
  //   { desk: "A05", name: "P'Ray", start: 9, end: 12 },
  //   { desk: "B01", name: "Warodom (Ryu)", start: 9, end: 18 },
  //   { desk: "B02", name: "John Doe", start: 10, end: 13 },
  //   { desk: "B02", name: "Jane Smith", start: 14, end: 17 },
  //   { desk: "C01", name: "Alex Johnson", start: 9, end: 11 },
  //   { desk: "C01", name: "Emily Davis", start: 12, end: 16 },
  //   { desk: "C02", name: "Michael Brown", start: 10, end: 14 },
  // ];

  // ดึงข้อมูลการจองจาก API
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]; // ดึงวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
    API.get(`/reservations/day/${currentDate}`)
      .then((response) => {
        console.log(response.data);
        // setBookings(response.data); // ถ้าคุณได้ทำการแปลงข้อมูลแล้ว
        setLoading(false);
      })
      .catch((error) => {
        setError("An error occurred. Please try again later.");
        console.error("Error fetching data:", error);
      });
  }, []); // useEffect จะทำงานเมื่อ component ติดตั้งครั้งแรก

  if (loading) {
    return <div>Loading...</div>; // แสดงข้อความขณะโหลดข้อมูล
  }

  if (error) {
    return <div>{error}</div>; // แสดงข้อผิดพลาดหากมี
  }



 

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
            const deskBookings = bookings
              .filter((booking) => booking.desk === desk)
              .sort((a, b) => a.start - b.start);

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