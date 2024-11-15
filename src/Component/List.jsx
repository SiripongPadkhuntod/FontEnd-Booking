import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// ลงทะเบียนภาษาไทย
registerLocale('th', th);

const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, showSearch, setShowSearch }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

    const searchRef = useRef(null);

    // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบภาษาไทย
    const formatDateToThai = (date) => {
        const day = date.toLocaleDateString('th-TH', { weekday: 'long' });
        const dayNumber = date.getDate();
        const month = date.toLocaleDateString('th-TH', { month: 'long' });
        const year = date.getFullYear() + 543;
        return `วัน${day} ที่ ${dayNumber} ${month} ${year}`;
    };

    // ปิดกล่องค้นหาเมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowSearch]);

    return (
        <div className="flex items-center space-x-4 mb-4">
            <button
                className={`px-4 py-2 rounded ${activeTab === 'all' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('all')}
            >
                All Booking
            </button>
            <button
                className={`px-4 py-2 rounded ${activeTab === 'my' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('my')}
            >
                My Booking
            </button>

            <div className="relative" ref={searchRef}>
                <button
                    className="px-4 py-2 rounded bg-gray-200"
                    onClick={() => setShowSearch(!showSearch)}
                >
                    Other
                </button>
                {showSearch && (
                    <div
                        className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg"
                        style={{ minWidth: '200px', zIndex: 50 }}
                    >
                        <input
                            type="text"
                            placeholder="ค้นหาผู้จอง..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                )}
            </div>

            <div className="ml-auto flex items-center space-x-2 text-gray-600 font-semibold">
                {/* ตัวเลือกวันที่ */}
               <div className="relative">
                    <button
                        onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                        className="px-4 py-2 bg-gray-100 rounded-md flex items-center"
                    >
                        <span>{formatDateToThai(startDate)}</span>
                        <span className="ml-2">▼</span>
                    </button>
                    {isStartDatePickerOpen && (
                        <div className="absolute top-full mt-2">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    setIsStartDatePickerOpen(false);
                                }}
                                inline
                                locale="th"
                            />
                        </div>
                    )}
                </div>
                <span> - </span>
                <div className="relative">
                    <button
                        onClick={() => setIsEndDatePickerOpen(!isEndDatePickerOpen)}
                        className="px-4 py-2 bg-gray-100 rounded-md flex items-center"
                    >
                        <span>{formatDateToThai(endDate)}</span>
                        <span className="ml-2">▼</span>
                    </button>
                    {isEndDatePickerOpen && (
                        <div className="absolute top-full mt-2">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                    setEndDate(date);
                                    setIsEndDatePickerOpen(false);
                                }}
                                inline
                                locale="th"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Component สำหรับ All Booking (หน้า CoList)
const CoList = ({ searchQuery, data }) => {
    const filteredData = data.map(day => ({
        ...day,
        bookings: day.bookings.filter(booking =>
            booking.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(day => day.bookings.length > 0);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Booking List</h2>
            <div className="bg-white shadow-md rounded overflow-hidden">
                <div className="grid grid-cols-4 bg-purple-400 text-white font-semibold">
                    <div className="p-2">หมายเลขที่นั่ง</div>
                    <div className="p-2">เวลา</div>
                    <div className="p-2">ชื่อผู้จอง</div>
                    <div className="p-2">หมายเหตุ</div>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '690px' }}>
                    {(searchQuery ? filteredData : data).map((day, index) => (
                        <div key={index}>
                            <div className="bg-red-100 text-red-700 font-semibold p-2">
                                {day.date}
                            </div>
                            {day.bookings.map((booking, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-4 border-b border-gray-200"
                                >
                                    <div className="p-2">{booking.desk}</div>
                                    <div className="p-2">{booking.time}</div>
                                    <div className="p-2">{booking.name || " "}</div>
                                    <div className="p-2">{booking.note || " "}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Component สำหรับ My Booking (อีกหน้า)
const MyBooking = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Booking Page</h2>
            <p>หน้านี้คือหน้า My Booking</p>
        </div>
    );
};

// Main component สำหรับจัดการการแสดงผล
const BookingApp = () => {
    const [activeTab, setActiveTab] = useState('all'); // จัดการหน้าแสดงผลระหว่าง all และ my
    const [searchQuery, setSearchQuery] = useState(''); // ข้อความค้นหา
    const [showSearch, setShowSearch] = useState(false); // แสดง/ซ่อนช่องค้นหา

    const data = [
        {
            date: "วันจันทร์ ที่ 1 กันยายน 2567",
            bookings: [
                { desk: "Desk 1", time: "09:00 - 18:00 (9 ชม.)", name: "Theerapath (Tle)", note: "จองแล้ว" },
                { desk: "Desk 2", time: "09:00 - 18:00 (9 ชม.)", name: "Siripong (Stop)", note: "จองแล้ว" },
                { desk: "Desk 3", time: "09:00 - 18:00 (9 ชม.)", name: "Warodom (Ryu)", note: "จองแล้ว" },
                { desk: "Room 1", time: "09:00 - 18:00 (9 ชม.)", name: "Sudarat (Mint)", note: "อ่านหนังสือ" },
                { desk: "Desk 5", time: "09:00 - 18:00 (9 ชม.)", name: "Anutida (Dawan)", note: "จองแล้ว" },
                { desk: "Desk 6", time: "09:00 - 18:00 (9 ชม.)", name: "Walaiphan (Baimon)", note: "จองแล้ว" },
                { desk: "Desk 7", time: "09:00 - 18:00 (9 ชม.)", name: "Chayut (Po)", note: "จองแล้ว" },
                { desk: "Desk 8", time: "09:00 - 18:00 (9 ชม.)", name: "Koon Koon", note: "จองแล้ว" },
                { desk: "Room 2", time: "09:00 - 18:00 (9 ชม.)", name: "P' Tle", note: "Meeting CS" },
                { desk: "Desk 10", time: "09:00 - 18:00 (9 ชม.)", name: "P' May", note: "จองแล้ว" },
                { desk: "Desk 11", time: "09:00 - 18:00 (9 ชม.)", name: "P' Stop", note: "Meeting Final" },
                { desk: "Desk 12", time: "09:00 - 18:00 (9 ชม.)", name: "P' Tangmo", note: "จองแล้ว" },
                { desk: "Desk 13", time: "09:00 - 18:00 (9 ชม.)", name: "P' Witoon", note: "จองแล้ว" },
                { desk: "Desk 14", time: "09:00 - 18:00 (9 ชม.)", name: "P' Q", note: "จองแล้ว" }
            ]
        },
        {
            date: "วันอังคาร ที่ 2 กันยายน 2567",
            bookings: [
                { desk: "Desk 1", time: "09:00 - 18:00 (9 ชม.)", name: "Theerapath (Tle)", note: "จองแล้ว" },
                { desk: "Desk 5", time: "09:00 - 18:00 (9 ชม.)", name: "Sudarat (Mint)", note: "จองแล้ว" },
                { desk: "Desk 8", time: "09:00 - 18:00 (9 ชม.)", name: "Chayut (Po)", note: "จองแล้ว" },
                { desk: "Desk 9", time: "09:00 - 18:00 (9 ชม.)", name: "Anutida (Dawan)", note: "จองแล้ว" },
                { desk: "Desk 11", time: "09:00 - 18:00 (9 ชม.)", name: "Warodom (Ryu)", note: "จองแล้ว" }
            ]
        }
    ];

    return (
        <div className="p-4">
            {/* แสดง Header component ที่มีปุ่ม All Booking, My Booking, Other และตัวเลือกวันที่ */}
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
            />
            {/* การแสดงผลระหว่างหน้า All Booking และ My Booking */}
            {activeTab === 'all' ? (
                <CoList searchQuery={searchQuery} data={data} />
            ) : (
                <MyBooking />
            )}
        </div>
    );
};

export default BookingApp;
