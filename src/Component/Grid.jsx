import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';

const CoGrid = () => {
  const desks = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"];
  const [bookings, setBookings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - Replace this with your actual API data
  const mockBookings = [
    {
      table_number: "A01",
      first_name: "John",
      last_name: "Doe",
      reservation_date: "2024-11-01T10:00:00",
      note: "Team meeting"
    },
    {
      table_number: "A02",
      first_name: "Jane",
      last_name: "Smith",
      reservation_date: "2024-11-01T13:00:00",
      note: "Project review"
    },
    {
      table_number: "B01",
      first_name: "Alice",
      last_name: "Brown",
      reservation_date: "2024-11-01T15:00:00",
      note: "Client call"
    }
  ];

  const transformData = (data) => {
    const transformedData = data.map((item) => ({
      desk: item.table_number,
      name: `${item.first_name} ${item.last_name}`,
      time: new Date(item.reservation_date).toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
      note: item.note,
      date: new Date(item.reservation_date),
    }));
    setBookings(transformedData);
  };

  const fetchData = async (selectedDate) => {
    setIsLoading(true);
    try {
      // Simulating API call with mock data
      // Replace this with your actual API call:
      // const response = await yourAPI.get(`/reservations/${selectedDate}`);
      // transformData(response.data);
      
      setTimeout(() => {
        transformData(mockBookings);
        setIsLoading(false);
      }, 500); // Simulate network delay
    } catch (error) {
      setError("ไม่สามารถโหลดข้อมูลได้");
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month - 1, 1);
    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getDayInThai = (date) => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    return days[date.getDay()];
  };

  const [year, month] = selectedMonth.split("-");
  const daysInMonth = getDaysInMonth(Number(year), Number(month));

  const renderBookingNames = (bookings) => {
    if (bookings.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <span className="text-sm">ว่าง</span>
        </div>
      );
    }

    if (bookings.length <= 2) {
      return bookings.map((booking, index) => (
        <div key={index} className="flex items-center gap-2 text-sm mb-1">
          <User size={14} className="text-indigo-600" />
          <span className="font-medium">{booking.name.split(" ")[0]}</span>
          <span className="text-gray-500">({booking.time})</span>
        </div>
      ));
    }

    return (
      <>
        {bookings.slice(0, 2).map((booking, index) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <User size={14} className="text-indigo-600" />
            <span className="font-medium">{booking.name.split(" ")[0]}</span>
            <span className="text-gray-500">({booking.time})</span>
          </div>
        ))}
        <div className="text-sm font-medium text-indigo-600">
          +{bookings.length - 2} รายการเพิ่มเติม
        </div>
      </>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <AlertCircle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            ระบบจองโต๊ะทำงาน
          </h2>

          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-600" size={24} />
              <label className="font-medium text-gray-700">เลือกเดือน:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          /* Calendar Grid */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-scroll " style={{ maxHeight: "700px" }}>
            <div className="p-4">
              <div
                className="grid gap-px bg-gray-200"
                style={{
                  gridTemplateColumns: `repeat(${desks.length + 1}, minmax(120px, 1fr))`,
                }}
              >
                {/* Header Row */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium p-3 text-center">
                  วันที่
                </div>
                {desks.map((desk, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium p-3 text-center"
                  >
                    {desk}
                  </div>
                ))}

                {/* Calendar Cells */}
                {daysInMonth.map((date, index) => (
                  <React.Fragment key={index}>
                    <div className="bg-gray-50 p-3 font-medium">
                      <div className="text-gray-900">{date.getDate()}</div>
                      <div className="text-sm text-gray-600">{getDayInThai(date)}</div>
                    </div>
                    
                    {desks.map((desk, deskIndex) => {
                      const bookingsForDeskAndDate = bookings.filter(
                        (booking) =>
                          booking.desk === desk &&
                          booking.date.toDateString() === date.toDateString()
                      );

                      const hasBookings = bookingsForDeskAndDate.length > 0;

                      return (
                        <div
                          key={`${index}-${deskIndex}`}
                          className={`relative bg-white p-3 group transition-all duration-200
                            ${hasBookings ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}
                            border-b border-r border-gray-200
                          `}
                        >
                          {renderBookingNames(bookingsForDeskAndDate)}

                          {/* Tooltip */}
                          {hasBookings && (
                            <div className="absolute hidden group-hover:block bg-white border border-gray-200 
                              shadow-lg rounded-lg p-4 z-50 w-72 left-full top-0 ml-2">
                              {bookingsForDeskAndDate.map((booking, index) => (
                                <div key={index} className="mb-3 last:mb-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <User size={16} className="text-indigo-600" />
                                    <span className="font-medium text-gray-900">
                                      {booking.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Clock size={14} />
                                    <span>{booking.time}</span>
                                  </div>
                                  {booking.note && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                      <FileText size={14} className="mt-1" />
                                      <span>{booking.note}</span>
                                    </div>
                                  )}
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
        )}
      </div>
    </div>
  );
};

export default CoGrid;