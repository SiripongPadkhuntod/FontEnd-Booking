import React, { useState, useEffect } from "react";
import { Calendar, Search, Filter, Users, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { th } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from '../api';
import { motion, AnimatePresence } from "framer-motion";

registerLocale("th", th);


const ConfirmationModal = ({ isOpen, onConfirm, onCancel, nightMode }) => {
    if (!isOpen) return null;

    const bgClass = nightMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900";
    const cardBgClass = nightMode ? "bg-gray-800" : "bg-gray-100";
    const buttonBgClass = nightMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className={`w-full max-w-md rounded-lg ${bgClass} p-8 relative shadow-2xl text-center`}
            >
                <AlertTriangle className="mx-auto w-16 h-16 text-yellow-500 mb-4" />

                <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
                    Confirm Cancellation
                </h2>

                <p className="mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className={`py-3 px-8 rounded-full text-lg font-semibold ${nightMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} text-gray-800`}
                    >
                        No, Keep Booking
                    </button>
                    <button
                        onClick={onConfirm}
                        className="py-3 px-8 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-500 text-white"
                    >
                        Yes, Cancel Booking
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const FeedbackModal = ({ isOpen, type, message, onClose, nightMode }) => {
    if (!isOpen) return null;

    const bgClass = nightMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900";
    const cardBgClass = nightMode ? "bg-gray-800" : "bg-gray-100";
    const buttonBgClass = nightMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className={`w-full max-w-md rounded-lg ${bgClass} p-8 relative shadow-2xl text-center`}
            >
                {type === 'success' ? (
                    <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />
                ) : (
                    <XCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
                )}

                <h2 className={`text-2xl font-semibold mb-4 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {type === 'success' ? 'Cancellation Successful' : 'Cancellation Failed'}
                </h2>

                <p className="mb-6">{message}</p>

                <button
                    onClick={onClose}
                    className={`py-3 px-8 rounded-full text-lg font-semibold ${buttonBgClass} text-white`}
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    );
};

const BookingDetailModal = ({ booking, nightMode, onClose, onDelete , fullname  }) => {
    if (!booking) return null;
    console.log(fullname);
    console.log(booking);

    const bgClass = nightMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900";
    const cardBgClass = nightMode ? "bg-gray-800" : "bg-gray-100";
    const buttonBgClass = nightMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";

    // ตรวจสอบว่าเป็นการจองของผู้ใช้หรือไม่
    const isMyBooking = booking.name === fullname;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className={`w-full max-w-lg rounded-lg ${bgClass} p-8 relative shadow-2xl`}
            >
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 text-3xl font-bold ${nightMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-800 hover:text-gray-900'}`}
                >
                    ×
                </button>

                <h2 className="text-3xl font-semibold text-center mb-8">Booking Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-lg ${cardBgClass} max-w-full`}>
                        <label className="text-sm font-medium text-gray-500">Seat Number</label>
                        <p className="text-lg font-semibold">{booking.desk}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${cardBgClass} max-w-full`}>
                        <label className="text-sm font-medium text-gray-500">Date & Time</label>
                        <p className="text-sm font-semibold">{booking.date}</p>
                        <p className="text-sm font-semibold">{booking.timeform} - {booking.timeto}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${cardBgClass} max-w-full`}>
                        <label className="text-sm font-medium text-gray-500">Booker Name</label>
                        <p className="text-lg font-semibold">{booking.stdID ? `${booking.stdID} ${booking.name}` : booking.name}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${cardBgClass} max-w-full`}>
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="text-lg italic break-words">{booking.note || "No additional notes"}</p>
                    </div>
                </div>

                {isMyBooking && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => onDelete(booking.id)}
                            className={`py-3 px-8 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-500 text-white`}
                        >
                            Cancel Booking
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className={`py-3 px-8 rounded-full text-lg font-semibold ${buttonBgClass} text-white`}
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};




const Header = ({
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setSortOrder,
    nightMode
}) => {
    const bgClass = nightMode ? "bg-gray-800 text-gray-200" : "bg-white";
    const cardClass = nightMode ? "bg-gray-900 text-gray-300" : "bg-white";
    const borderClass = nightMode ? "border-gray-700" : "border-gray-300";
    const hoverClass = nightMode ? "hover:bg-gray-700" : "hover:bg-gray-200";

    return (
        <div className={`${cardClass} shadow-md rounded-lg p-4 mb-6 ${borderClass} border`}>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <button
                        className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${activeTab === "all"
                                ? `${nightMode ? "bg-red-900 text-white" : "bg-red-700 text-white"} shadow-md`
                                : `${nightMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"} ${hoverClass}`
                            }`}
                        onClick={() => setActiveTab("all")}
                    >
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">All Bookings</span>
                    </button>
                    <button
                        className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${activeTab === "my"
                                ? `${nightMode ? "bg-red-900 text-white" : "bg-red-700 text-white"} shadow-md`
                                : `${nightMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"} ${hoverClass}`
                            }`}
                        onClick={() => setActiveTab("my")}
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">My Bookings</span>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-4 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border ${borderClass} rounded-lg focus:ring-2 ${nightMode
                                    ? "bg-gray-800 text-gray-200 focus:ring-red-900"
                                    : "bg-white focus:ring-red-500"
                                } transition-all`}
                        />
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${nightMode ? "text-gray-500" : "text-gray-400"} w-5 h-5`} />
                    </div>

                    <div className="relative flex-grow">
                        <select
                            onChange={(e) => setSortOrder(e.target.value)}
                            className={`appearance-none w-full pl-4 pr-10 py-2 border ${borderClass} rounded-lg ${nightMode
                                    ? "bg-gray-800 text-gray-200 focus:ring-red-900"
                                    : "bg-white focus:ring-red-500"
                                }`}
                        >
                            <option value="asc">Oldest First</option>
                            <option value="desc">Newest First</option>



                        </select>
                        <Filter className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${nightMode ? "text-gray-500" : "text-gray-400"} w-5 h-5 pointer-events-none`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookingList = ({
    searchQuery,
    data,
    isMyBooking = false,
    nightMode,
    onBookingSelect
}) => {
    const filteredData = data
        .map((day) => ({
            ...day,
            bookings: day.bookings.filter((booking) => {
                const lowerSearchQuery = searchQuery.toLowerCase();

                // ตรวจสอบการค้นหาของแต่ละฟิลด์
                const matchesName = (booking.name?.toLowerCase() ?? "").includes(lowerSearchQuery);
                const matchesStdID = (booking.stdID?.toLowerCase() ?? "").includes(lowerSearchQuery);
                const matchesNote = (booking.note?.toLowerCase() ?? "").includes(lowerSearchQuery);
                const matchesDate = booking.date
                    ? new Date(booking.date).toLocaleDateString('th-TH').includes(searchQuery)
                    : false;
                const matchesDesk = (booking.desk?.toLowerCase() ?? "").includes(lowerSearchQuery);  // ค้นหาหมายเลขโต๊ะ
                const matchesTime = (booking.timeform?.toLowerCase() ?? "").includes(lowerSearchQuery) ||
                    (booking.timeto?.toLowerCase() ?? "").includes(lowerSearchQuery);  // ค้นหาเวลา

                // เงื่อนไขการค้นหาตาม isMyBooking
                return isMyBooking
                    ? matchesName
                    : matchesName || matchesStdID || matchesNote || matchesDate || matchesDesk || matchesTime;  // เพิ่ม matchesTime
            }),
        }))
        .filter((day) => day.bookings.length > 0);


    const bgClass = nightMode ? "bg-gray-900 text-gray-300" : "bg-white";
    const headerClass = nightMode ? "bg-red-900 text-gray-200" : "bg-red-700 text-white";
    const rowClass = nightMode ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-800 border-gray-200";
    const hoverClass = nightMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

    return (
        <div className={`${bgClass} shadow-lg rounded-lg overflow-hidden`}>
            <div className={`grid grid-cols-4 ${headerClass} font-semibold p-4`}>
                <div className="col-span-1 truncate">Seat</div>
                <div className="col-span-1 truncate">Time</div>
                <div className="col-span-1 truncate">Name</div>
                <div className="col-span-1 truncate">Details</div>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
                {filteredData.map((day, index) => (
                    <motion.div key={index}>
                        <div className={`${nightMode ? 'bg-gray-700 text-gray-200' : 'bg-red-50 text-red-700'} font-semibold p-4 sticky top-0 z-10`}>
                            {day.date}
                        </div>
                        {day.bookings.map((booking, idx) => {
                            // Add date to the booking object for details modal
                            const bookingWithDate = { ...booking, date: day.date };
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className={`grid grid-cols-4 border-t ${rowClass} ${hoverClass} transition-colors cursor-pointer`}
                                    onClick={() => onBookingSelect(bookingWithDate)}
                                >
                                    <div className="p-2 sm:p-4 truncate">{booking.desk}</div>
                                    <div className="p-2 sm:p-4 truncate">{booking.timeform} - {booking.timeto} น. </div>
                                    <div className="p-2 sm:p-4 truncate">
                                        {booking.stdID ? `${booking.stdID} ${booking.name}` : booking.name || "—"}
                                    </div>
                                    <div className="p-2 sm:p-4 flex items-center justify-center">
                                        {booking.note ?
                                            (booking.note.length > 20 ? `${booking.note.slice(0, 20)}...` : booking.note)
                                            : "—"}
                                    </div>

                                </motion.div>
                            );
                        })}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};




const BookingApp = ({ fullname, nightMode }) => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [data, setData] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        bookingId: null
    });
    const [feedbackModal, setFeedbackModal] = useState({
        isOpen: false,
        type: 'success',
        message: ''
    });


    const fetchData = async () => {
        try {
            const response = await API.get("/reservations/all");
            const transformedData = transformData(response.data, sortOrder);
            setData(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDeleteBooking = async (bookingID) => {
        try {
            const response = await API.put(`/reservations/cancel`, { reservation_id: bookingID });
            
            if (response.status === 200 || response.status.data === 200) {
                fetchData();
                setSelectedBooking(null);
                setConfirmationModal({ isOpen: false, bookingId: null });
                setFeedbackModal({
                    isOpen: true,
                    type: 'success',
                    message: 'Your booking has been successfully cancelled.'
                });
            } else {
                throw new Error('Unexpected response');
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            setConfirmationModal({ isOpen: false, bookingId: null });
            setFeedbackModal({
                isOpen: true,
                type: 'error',
                message: error.response?.data?.message || 'Unable to cancel booking. Please try again later.'
            });
        }
    };

    const openConfirmationModal = (bookingId) => {
        setConfirmationModal({
            isOpen: true,
            bookingId: bookingId
        });
    };

    const closeConfirmationModal = () => {
        setConfirmationModal({
            isOpen: false,
            bookingId: null
        });
    };

    useEffect(() => {
        fetchData();
    }, [sortOrder]);

    const transformData = (apiData, order) => {
        const groupedByDate = apiData.reduce((acc, item) => {
            const dateObj = new Date(item.reservation_date);
            const date = new Intl.DateTimeFormat("th-TH", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(dateObj);

            if (!acc[date]) {
                acc[date] = { date, bookings: [] };
            }

            acc[date].bookings.push({
                desk: item.table_number,
                timeform: item.reservation_time_from.substring(0, 5),
                timeto: item.reservation_time_to.substring(0, 5),
                name: `${item.first_name} ${item.last_name}`,
                stdID: item.student_id,
                note: item.note,
                id: item.reservation_id,  
            });

            return acc;
        }, {});

        return Object.values(groupedByDate).sort((a, b) => {
            const dateA = new Date(a.date.replace(/[^0-9\/]/g, "")).getTime();
            const dateB = new Date(b.date.replace(/[^0-9\/]/g, "")).getTime();
            return order === "desc" ? dateB - dateA : dateA - dateB;
        });
    };

    return (
        <div className={`${nightMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"} min-h-screen py-4 sm:py-8 px-2 sm:px-6 lg:px-8 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto">
                <Header
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setSortOrder={setSortOrder}
                    nightMode={nightMode}
                />
                <BookingList
                    searchQuery={activeTab === "all" ? searchQuery : fullname}
                    data={data}
                    isMyBooking={activeTab === "my"}
                    nightMode={nightMode}
                    onBookingSelect={setSelectedBooking}
                />
                <AnimatePresence>
                    {selectedBooking && (
                        <BookingDetailModal
                            booking={selectedBooking}
                            nightMode={nightMode}
                            onClose={() => setSelectedBooking(null)}
                            onDelete={openConfirmationModal}
                            fullname={fullname}
                        />
                    )}
                    {confirmationModal.isOpen && (
                        <ConfirmationModal
                            isOpen={confirmationModal.isOpen}
                            onConfirm={() => handleDeleteBooking(confirmationModal.bookingId)}
                            onCancel={closeConfirmationModal}
                            nightMode={nightMode}
                        />
                    )}
                    {feedbackModal.isOpen && (
                        <FeedbackModal
                            isOpen={feedbackModal.isOpen}
                            type={feedbackModal.type}
                            message={feedbackModal.message}
                            onClose={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
                            nightMode={nightMode}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookingApp;