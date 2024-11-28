import React from "react";

const CoDay = () => {
  const desks = ["A01", "A02", "A03", "A04", "A05", "B01", "B02", "C01", "C02"];

  const bookings = [
    { desk: "A01", name: "Theeraphat (Tle)", start: 10, end: 12 },
    { desk: "A01", name: "Siripong (Stop)", start: 13, end: 18 },
    { desk: "A02", name: "Tonkla", start: 11, end: 14 },
    { desk: "A03", name: "P'Koon", start: 9, end: 12 },
    { desk: "A04", name: "Chanon (Tee)", start: 12, end: 15 },
    { desk: "A05", name: "P'Ray", start: 9, end: 12 },
    { desk: "B01", name: "Warodom (Ryu)", start: 9, end: 18 },
    { desk: "B02", name: "John Doe", start: 10, end: 13 },
    { desk: "B02", name: "Jane Smith", start: 14, end: 17 },
    { desk: "C01", name: "Alex Johnson", start: 9, end: 11 },
    { desk: "C01", name: "Emily Davis", start: 12, end: 16 },
    { desk: "C02", name: "Michael Brown", start: 10, end: 14 }
  ];

  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

  const getColor = (name) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500",
      "bg-orange-500", "bg-red-500", "bg-teal-500", "bg-yellow-500",
    ];
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="p-10 h-full w-full bg-gradient-to-b from-[#87CEEB] to-[#ADD8E6]">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Desk Booking Schedule</h1>
      <div className="overflow-x-auto border rounded-lg shadow w-full bg-white">
        <div className="flex bg-gray-50 border-b">
          <div className="w-52 p-3 text-center font-bold text-lg">Desk</div>
          {hours.map((hour, index) => (
            <div
              key={index}
              className="flex-1 border-l text-center text-base font-semibold p-2"
              style={{
                borderRight: "1px solid rgba(0, 0, 0, 0.1)", // เพิ่มเส้นคั่นระหว่างเวลา
              }}
            >
              {`${hour}:00`}
            </div>
          ))}
        </div>
        <div className="bg-gray-100">
          {desks.map((desk, idx) => {
            const deskBookings = bookings
              .filter((booking) => booking.desk === desk)
              .sort((a, b) => a.start - b.start);

            return (
              <div key={idx} className="flex items-top">
                <div className="w-52 p-3 border-r text-base font-bold text-gray-700">
                  {desk}
                </div>
                <div className="flex-1 relative">
                  {deskBookings.map((booking, bookingIdx) => {
                    const startTime = Math.max(9, booking.start); // เวลาที่เริ่มต้นไม่ต่ำกว่า 9
                    const endTime = Math.min(18, booking.end);   // เวลาที่สิ้นสุดไม่เกิน 18
                    const gridStart = (startTime - 9) * (100 / hours.length); // คำนวณตำแหน่งเริ่มต้น
                    const gridEnd = (endTime - 8) * (100 / hours.length);   // คำนวณตำแหน่งสิ้นสุด

                    // เพิ่มช่องว่างระหว่างกราฟ
                    const marginRight = 1; // เพิ่มช่องว่าง 2% จากกราฟแรก

                    return (
                      <div
                        key={bookingIdx}
                        className={`absolute text-base rounded px-6 py-3 ${getColor(
                          booking.name
                        )} text-white`}
                        style={{
                          left: `${gridStart}%`, // เพิ่มช่องว่างที่กราฟเริ่มต้น
                          width: `${gridEnd  - gridStart}%`, // ความกว้างของกราฟที่แสดง
                          overflow: "hidden", // ป้องกันการล้นของกราฟ
                          clipPath: "inset(0)", // ทำให้กราฟไม่เกินกรอบ
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
