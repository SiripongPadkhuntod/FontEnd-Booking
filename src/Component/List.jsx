import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import ErrorDisplay from './ErrorDisplay';

// ลงทะเบียนภาษาไทย
registerLocale("th", th);

const Header = ({ activeTab, setActiveTab }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);


    return (
        <div className="flex items-center space-x-4 mb-4">
            <button
                className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTab("all")}
            >
                All Booking
            </button>
            <button
                className={`px-4 py-2 rounded ${activeTab === "my" ? "bg-gray-500 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTab("my")}
            >
                My Booking
            </button>
        </div>
    );
};

const CoList = ({ searchQuery, data }) => {
    const filteredData = data.map((day) => ({
        ...day,
        bookings: day.bookings.filter((booking) =>
            booking.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((day) => day.bookings.length > 0);

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
                <div className="overflow-y-auto" style={{ maxHeight: "690px" }}>
                    {(searchQuery ? filteredData : data).map((day, index) => (
                        <div key={index}>
                            <div className="bg-red-100 text-red-700 font-semibold p-2">
                                {day.date}
                            </div>
                            {day.bookings.map((booking, idx) => (
                                <div key={idx} className="grid grid-cols-4 border-b border-gray-200">
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
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);  // เพิ่ม loading state
    const [error, setError] = useState(null);      // เพิ่ม error state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);  // เริ่มต้น loading
                setError(null);    // reset error state
                const response = await fetch("http://localhost:8080/reservationsall");
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const result = await response.json();
                const transformedData = transformData(result);
                setData(transformedData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);  // เก็บ error message
            } finally {
                setLoading(false);  // สิ้นสุด loading ไม่ว่าจะสำเร็จหรือไม่
            }
        };

        fetchData();
    }, []);

    const transformData = (apiData) => {
        const groupedByDate = apiData.reduce((acc, item) => {
            const date = new Date(item.reservation_date).toLocaleDateString("th-TH", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            if (!acc[date]) {
                acc[date] = { date, bookings: [] };
            }

            acc[date].bookings.push({
                desk: item.table_number,
                time: new Date(item.reservation_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                name: `${item.first_name} ${item.last_name}`,
                note: item.note,
            });

            return acc;
        }, {});

        return Object.values(groupedByDate);
    };

    // เพิ่มเงื่อนไขการแสดงผล Loading และ Error
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <span className="ml-3">กำลังโหลดข้อมูล...</span>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorDisplay
                error={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="p-4">
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
            />
            {activeTab === "all" ? (
                <CoList searchQuery={searchQuery} data={data} />
            ) : (
                <div>My Booking</div>
            )}
        </div>
    );
};

export default BookingApp;
