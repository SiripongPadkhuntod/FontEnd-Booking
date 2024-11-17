import React, { useState } from "react";

const CoMonth = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

    // ข้อมูลตัวอย่าง
    const bookings = [
        { name: "John", time: "9:00-19:00", note: "Meeting", date: new Date("2024-03-01") },
        { name: "Tle", time: "12:00-19:00", note: "Meeting", date: new Date("2024-03-01") },
        { name: "David", time: "10:00-17:00", note: "Project work", date: new Date("2024-03-02") },
        { name: "Alice", time: "8:00-18:00", note: "Team Review", date: new Date("2024-03-03") },
        { name: "James", time: "10:00-15:00", note: "Client call", date: new Date("2024-03-03") },
        { name: "James", time: "10:00-15:00", note: "Client call", date: new Date("2024-03-03") },
        { name: "James", time: "10:00-15:00", note: "Client call", date: new Date("2024-03-03") },
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

        // จัดกลุ่มการจองตามวันที่
        const groupedBookings = bookings
            .filter(booking =>
                booking.date.getFullYear() === selectedYear &&
                booking.date.getMonth() === selectedMonthIndex
            )
            .reduce((acc, booking) => {
                const dateKey = booking.date.toISOString().split("T")[0]; // วันที่ในรูปแบบ 'yyyy-mm-dd'
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push(booking);
                return acc;
            }, {});

        // แปลงกลุ่มการจองเป็นอาเรย์และเรียงตามวันที่
        return Object.keys(groupedBookings)
            .sort((a, b) => new Date(a) - new Date(b))
            .map(dateKey => ({
                date: new Date(dateKey),
                bookings: groupedBookings[dateKey],
            }));
    };

    // คำนวณจำนวนวันที่ในเดือนที่เลือก
    const selectedYear = parseInt(selectedMonth.split("-")[0], 10);
    const selectedMonthIndex = parseInt(selectedMonth.split("-")[1], 10) - 1;
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex);
    const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonthIndex);

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
                    <div className="w-full h-full">
                        <div className="p-6 bg-white rounded-lg">
                            <div className="grid grid-cols-7 gap-2 p-2 w-50 h-50">
                                {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"].map((day, idx) => (
                                    <div key={idx} className="font-semibold text-left">{day}</div>
                                ))}
                                {/* แสดงวันที่ */}
                                {Array.from({ length: Math.ceil(daysInMonth / 7) }, (_, weekIndex) => (
                                    <React.Fragment key={weekIndex}>
                                        {Array.from({ length: 7 }, (_, dayIndex) => {
                                            const day = weekIndex * 7 + dayIndex + 1;
                                            if (day <= daysInMonth) {
                                                const dayBookings = getBookingsForDate(selectedYear, selectedMonthIndex, day);
                                                return (
                                                    <div key={day} className="text-left p-2 h-20 w-30 border border-purple-300 rounded">
                                                        <div className="font-medium">{day}</div>
                                                        {dayBookings.length > 0 && (
                                                            <div className="text-sm">
                                                                {dayBookings.slice(0, 2).map((booking, index) => (
                                                                    <div key={index} className="flex items-center space-x-2">
                                                                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                                                        <div className="font-medium">{booking.name}</div>
                                                                    </div>
                                                                ))}
                                                                {dayBookings.length > 2 && (
                                                                    <div className="text-blue-500 font-medium">More</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* ส่วนแสดงรายละเอียดการจอง */}
                <div className="lg:w-1/3 bg-gray-400 rounded-lg p-5 text-sm mt-2 max-h-[800px] overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">
                        การจองประจำเดือน {getMonthInThai(selectedMonthIndex)} {selectedYear}
                    </h3>
                    <div className="space-y-4">
                        {getSortedBookingsForMonth().map((bookingGroup, index) => (
                            <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-sm">
                                <div className="font-medium text-2xl">
                                    วันที่ {bookingGroup.date.getDate()} {getMonthInThai(bookingGroup.date.getMonth())}
                                </div>
                                <div className="text-sm mt-2">
                                    {bookingGroup.bookings.map((booking, idx) => (
                                        <div key={idx} className="text-sm mt-2 bg-red-950 p-4 rounded-lg">
                                            <div className="flex justify-between w-full">
                                                <div className="font-medium text-white text-xl">{booking.name}</div>
                                                <div className="font-medium text-white text-xl">{booking.time}</div>
                                            </div>
                                            <div className="text-white">หมายเหตุ: {booking.note}</div>
                                        </div>
                                    ))}
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
