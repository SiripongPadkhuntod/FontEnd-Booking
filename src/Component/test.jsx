import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// ลงทะเบียนภาษาไทย
registerLocale('th', th);

const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, showSearch, setShowSearch, startDate, setStartDate, endDate, setEndDate }) => {
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
                {/* เพิ่มฟังก์ชันการเลือกวันที่เริ่มต้น */}
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
                                    setStartDate(date); // อัพเดต startDate เมื่อมีการเลือกวันที่
                                    setIsStartDatePickerOpen(false);
                                }}
                                inline
                                locale="th"
                            />
                        </div>
                    )}
                </div>
                <span> - </span>
                {/* เพิ่มฟังก์ชันการเลือกวันที่สิ้นสุด */}
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
                                    setEndDate(date); // อัพเดต endDate เมื่อมีการเลือกวันที่
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

const CoList = ({ searchQuery, data, startDate, endDate }) => {
    // ฟิลเตอร์ข้อมูลตามช่วงวันที่และค้นหาชื่อผู้จอง
    const filteredData = data.filter(day => {
        const dayDate = new Date(day.date.replace(/วัน[^ ]+ ที่ /, '')); // แปลงวันที่จาก data เป็นรูปแบบ Date เพื่อตรวจสอบ
        return dayDate >= startDate && dayDate <= endDate; // กรองตามช่วง startDate และ endDate
    }).map(day => ({
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
                    {(searchQuery || startDate || endDate ? filteredData : data).map((day, index) => (
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

const BookingApp = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [startDate, setStartDate] = useState(new Date()); // state สำหรับวันที่เริ่มต้น
    const [endDate, setEndDate] = useState(new Date()); // state สำหรับวันที่สิ้นสุด

    const data = [
        {
            date: "วันจันทร์ ที่ 1 กันยายน 2567",
            bookings: [
                { desk: "Desk 1", time: "09:00 - 18:00 (9 ชม.)", name: "Theerapath (Tle)", note: "จองแล้ว" },
                { desk: "Desk 2", time: "09:00 - 18:00 (9 ชม.)", name: "Siripong (Stop)", note: "จองแล้ว" },
                { desk: "Desk 3", time: "09:00 - 18:00 (9 ชม.)", name: "Warodom (Ryu)", note: "จองแล้ว" },
                { desk: "Room 1", time: "09:00 - 18:00 (9 ชม.)", name: "Sudarat (Mint)", note: "อ่านหนังสือ" },
                { desk: "Desk 5", time: "09:00 - 18:00 (9 ชม.)", name: "Anutida (Dawan)", note: "จองแล้ว" },
            ]
        },
        {
            date: "วันอังคาร ที่ 2 กันยายน 2567",
            bookings: [
                { desk: "Desk 1", time: "09:00 - 18:00 (9 ชม.)", name: "Theerapath (Tle)", note: "จองแล้ว" },
                { desk: "Desk 5", time: "09:00 - 18:00 (9 ชม.)", name: "Sudarat (Mint)", note: "จองแล้ว" },
                { desk: "Desk 8", time: "09:00 - 18:00 (9 ชม.)", name: "Chayut (Po)", note: "จองแล้ว" },
                { desk: "Desk 9", time: "09:00 - 18:00 (9 ชม.)", name: "Anutida (Dawan)", note: "จองแล้ว" },
            ]
        }
    ];

    return (
        <div className="p-4">
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                startDate={startDate} // ส่ง startDate ให้ Header
                setStartDate={setStartDate} // ส่งฟังก์ชัน setStartDate ให้ Header
                endDate={endDate} // ส่ง endDate ให้ Header
                setEndDate={setEndDate} // ส่งฟังก์ชัน setEndDate ให้ Header
            />
            {activeTab === 'all' ? (
                <CoList searchQuery={searchQuery} data={data} startDate={startDate} endDate={endDate} /> // ส่ง startDate และ endDate ให้ CoList
            ) : (
                <MyBooking />
            )}
        </div>
    );
};

export default BookingApp;
