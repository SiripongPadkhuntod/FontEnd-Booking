import React, { useState, useEffect } from "react";
import { th } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ลงทะเบียนภาษาไทย
registerLocale("th", th);

const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0  items-center mb-6">
            <div className="flex space-x-4 items-center">
                <button
                    className={`px-6 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${activeTab === "all" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    onClick={() => setActiveTab("all")}
                >
                    All Booking
                </button>
                <button
                    className={`px-6 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${activeTab === "my" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    onClick={() => setActiveTab("my")}
                >
                    My Booking
                </button>
            </div>

            {/* ช่องค้นหา */}
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-4 sm:mt-0 p-2 border border-gray-300 rounded-md"
            />

        </div>
    );
};

const CoList = ({ searchQuery, data }) => {
    const filteredData = data
        .map((day) => ({
            ...day, // คัดลอกข้อมูลวันที่
            bookings: day.bookings.filter((booking) =>
                booking.name.toLowerCase().includes(searchQuery.toLowerCase()) || booking.stdID.toLowerCase().includes(searchQuery.toLowerCase()) // กรองชื่อผู้จอง หรือ รหัสนักศึกษา
            ),
        }))
        .filter((day) => day.bookings.length > 0);

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Booking List</h2>
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-4 bg-red-800 text-white font-semibold p-4">
                    <div>หมายเลขที่นั่ง</div>
                    <div>เวลา</div>
                    <div>ชื่อผู้จอง</div>
                    <div>หมายเหตุ</div>
                </div>
                <div className="overflow-auto" style={{ maxHeight: "600px" }}>
                    {(searchQuery ? filteredData : data).map((day, index) => (
                        <div key={index}>
                            <div className="bg-red-50 text-red-700 font-semibold p-4">
                                {day.date}
                            </div>
                            {day.bookings.map((booking, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 border-t border-gray-200 text-gray-800">
                                    <div className="p-4">{booking.desk}</div>
                                    <div className="p-4">{booking.time}</div>
                                    <div className="p-4">{booking.stdID + " " + booking.name || "—"}</div>
                                    <div className="p-4">{booking.note || "—"}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CoMybooking = ({ searchQuery, data }) => {
    const filteredData = data
        .map((day) => ({
            ...day,
            bookings: day.bookings.filter((booking) =>
                booking.name.toLowerCase().includes(searchQuery.toLowerCase()) // กรองชื่อผู้จอง
            ),
        }))
        .filter((day) => day.bookings.length > 0); // กรองวันที่ที่ไม่มีการจอง

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Booking List</h2>
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-4 bg-red-600 text-white font-semibold p-4">
                    <div>หมายเลขที่นั่ง</div>
                    <div>เวลา</div>
                    <div>ชื่อผู้จอง</div>
                    <div>หมายเหตุ</div>
                </div>
                <div className="overflow-auto" style={{ maxHeight: "600px" }}>
                    {(searchQuery ? filteredData : data).map((day, index) => (
                        <div key={index}>
                            <div className="bg-red-50 text-red-700 font-semibold p-4">
                                {day.date}
                            </div>
                            {day.bookings.map((booking, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 border-t border-gray-200">
                                    <div className="p-4">{booking.desk}</div>
                                    <div className="p-4">{booking.time}</div>
                                    <div className="p-4">{booking.name || "—"}</div>
                                    <div className="p-4">{booking.note || "—"}</div>
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
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/reservationsall");
                const result = await response.json();
                const transformedData = transformData(result);
                setData(transformedData);
                console.log(transformedData);
            } catch (error) {
                console.error("Error fetching data:", error);
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
                stdID: item.student_id,
                note: item.note,
            });

            return acc;
        }, {});

        return Object.values(groupedByDate);
    };

    return (
        <div className="bg-gray-50  py-8 px-4 sm:px-6 lg:px-8 h-full rounded-lg">
            <div className=" mx-auto">
                <Header activeTab={activeTab} setActiveTab={setActiveTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                {activeTab === "all" ? (
                    <CoList searchQuery={searchQuery} data={data} />
                ) : (
                    <CoMybooking searchQuery={"John Doe"} data={data} />
                )}
            </div>
        </div>
    );
};

export default BookingApp;
