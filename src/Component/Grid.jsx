import React, { useState,useEffect } from "react";

const CoGrid = () => {
  const desks = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"];
  
  // ข้อมูลตัวอย่าง
  // const bookings = [
  //   { desk: "A01", name: "John Doe", time: "10:00 AM", note: "Team meeting", date: new Date("2024-11-01") },
  //   { desk: "A01", name: "John Doe", time: "10:00 AM", note: "Team meeting", date: new Date("2024-11-01") },
  //   { desk: "A01", name: "John Doe", time: "10:00 AM", note: "Team meeting", date: new Date("2024-11-01") },
  //   { desk: "A02", name: "Jane Smith", time: "1:00 PM", note: "Project review", date: new Date("2024-11-15") },
  //   { desk: "B01", name: "Alice Brown", time: "3:00 PM", note: "Client call", date: new Date("2024-11-20") },
  //   { desk: "C01", name: "Bob Wilson", time: "2:00 PM", note: "Daily standup", date: new Date("2024-11-10") },
  // ];

  const [bookings, setBookings] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

  // แปลงข้อมูลจาก JSON ให้เป็น Object
  const transformData = (text) => {
    const data = JSON.parse(text);
    
    const transformedData = data.map((item) => ({
      desk: item.table_number,
      name: `${item.first_name} ${item.last_name}`,
      time: new Date(item.reservation_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      note: item.note,
      date: new Date(item.reservation_date),
    }));

    console.log(transformedData);
    setBookings(transformedData);
  };

  // ดึงข้อมูลจาก API
  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);
  

  const fetchData = async (test) => {
    try {
      console.log(test);
      const response = await fetch(`http://localhost:8080/reservations/${test}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log(text);
      transformData(text);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  // สร้างวันที่ทั้งหมดในเดือน
  const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month - 1, 1);

    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // แปลงวันที่เป็นวันในสัปดาห์
  const getDayInThai = (date) => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    return days[date.getDay()];
  };

  // แปลงเดือนที่เลือกเพื่อแสดงวันที่
  const [year, month] = selectedMonth.split("-");
  const daysInMonth = getDaysInMonth(Number(year), Number(month));

  // ฟังก์ชันแสดงข้อมูลในแต่ละช่อง
  const renderBookingNames = (bookings) => {
    if (bookings.length === 0) return <div className="text-gray-400 text-sm">ว่าง</div>;

    if (bookings.length <= 2) {
      return bookings.map((booking, index) => (
        <div key={index} className="truncate text-sm">
          <span className="font-bold">{booking.name.split(" ")[0]}</span>
          <span> ({booking.time})</span>
        </div>
      ));
    } else {
      return (
        <>
          {bookings.slice(0, 2).map((booking, index) => (
            <div key={index} className="truncate text-sm">
              <span className="font-bold">{booking.name.split(" ")[0]}</span>
              <span> ({booking.time})</span>
            </div>
          ))}
          <div className="text-gray-500 text-sm">+{bookings.length - 2} more...</div>
        </>
      );
    }
  };

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Monthly Desk Bookings</h2>

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

      {/* ตาราง */}
      <div className="p-5 bg-purple-200 rounded-lg overflow-auto" style={{ maxHeight: "700px" }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${desks.length + 1}, minmax(100px, 1fr))`,
          }}
        >
          {/* Header แถวแรก */}
          <div className="font-semibold text-center bg-purple-300 p-2">วันที่</div>
          {desks.map((desk, index) => (
            <div key={index} className="font-semibold text-center bg-purple-300 p-2">
              {desk}
            </div>
          ))}

          {/* Rows */}
          {daysInMonth.map((date, index) => (
            <React.Fragment key={index}>
              {/* วันที่และวันในสัปดาห์ */}
              <div className="font-medium text-left bg-purple-100 p-2">
                {getDayInThai(date)} {date.getDate()}
              </div>
              {desks.map((desk, deskIndex) => {
                // กรองข้อมูลสำหรับช่องนั้น ๆ
                const bookingsForDeskAndDate = bookings.filter(
                  (booking) => booking.desk === desk && booking.date.toDateString() === date.toDateString()
                );

                return (
                  <div
                    key={`${index}-${deskIndex}`}
                    className="bg-white w-full h-20 p-3 rounded-lg shadow-sm border relative group"
                  >
                    {renderBookingNames(bookingsForDeskAndDate)}

                    {/* Tooltip */}
                    {bookingsForDeskAndDate.length > 0 && (
                      <div
                        className="absolute hidden group-hover:block bg-white border shadow-lg rounded-lg p-3 z-50 w-64"
                        style={{
                          top: "50%",
                          left: "calc(100% + 10px)",
                          transform: "translateY(-50%)",
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
