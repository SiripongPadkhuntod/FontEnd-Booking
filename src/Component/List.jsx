import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('th', th);

const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, showSearch, setShowSearch }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
    const searchRef = useRef(null);

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
                    <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg">
                        <input
                            type="text"
                            placeholder="ค้นหาโต๊ะ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                )}
            </div>

            <div className="ml-auto flex items-center space-x-2 text-gray-600 font-semibold">
                <div className="relative">
                    <button
                        onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                        className="px-4 py-2 bg-gray-100 rounded-md flex items-center"
                    >
                        <span>{formatDateToThai(startDate)}</span>
                        <span className="ml-2">▼</span>
                    </button>
                    {isStartDatePickerOpen && (
                        <div className="absolute top-full mt-2 z-50">
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
                        <div className="absolute top-full mt-2 z-50">
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

const CoList = ({ searchQuery, tableData }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'text-green-600';
            case 'reserved':
                return 'text-red-600';
            case 'maintenance':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'ว่าง';
            case 'reserved':
                return 'จองแล้ว';
            case 'maintenance':
                return 'ปิดปรับปรุง';
            default:
                return status;
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Booking List</h2>
            <div className="bg-white shadow-md rounded overflow-hidden">
                <div className="grid grid-cols-6 bg-purple-400 text-white font-semibold">
                    <div className="p-2">หมายเลขโต๊ะ</div>
                    <div className="p-2">ห้อง</div>
                    <div className="p-2">ความจุ</div>
                    <div className="p-2">ตำแหน่ง</div>
                    <div className="p-2">สถานะ</div>
                    <div className="p-2">การจัดการ</div>
                </div>
                <div className="overflow-y-auto text-black" style={{ maxHeight: '690px' }}>
                    {tableData
                        .filter(table => 
                            table.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            table.location.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((table) => (
                            <div
                                key={table.table_id}
                                className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50"
                            >
                                <div className="p-2">{table.table_number}</div>
                                <div className="p-2">Room {table.room_id}</div>
                                <div className="p-2">{table.capacity} ที่นั่ง</div>
                                <div className="p-2">{table.location}</div>
                                <div className={`p-2 ${getStatusColor(table.status)}`}>
                                    {getStatusText(table.status)}
                                </div>
                                <div className="p-2">
                                    <button
                                        className={`px-3 py-1 rounded ${
                                            table.status.toLowerCase() === 'available'
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={table.status.toLowerCase() !== 'available'}
                                    >
                                        จอง
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const MyBooking = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Booking Page</h2>
            <p>หน้านี้คือหน้า My Booking</p>
        </div>
    );
};

const BookingApp = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch('http://localhost:8080/tables', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('API did not return JSON. Please check the server configuration.');
                }

                if (!response.ok) {
                    // Try to get error message from response
                    let errorMessage;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
                    } catch (e) {
                        errorMessage = `HTTP error! status: ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setTableData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tables:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    // Error component
    const ErrorMessage = ({ message }) => (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                        เกิดข้อผิดพลาดในการโหลดข้อมูล
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{message}</p>
                        <p className="mt-2">
                            กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    โหลดข้อมูลใหม่
                </button>
            </div>
        </div>
    );

    // Loading component
    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
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
            {activeTab === 'all' ? (
                <CoList searchQuery={searchQuery} tableData={tableData} />
            ) : (
                <MyBooking />
            )}
        </div>
    );
};

export default BookingApp;