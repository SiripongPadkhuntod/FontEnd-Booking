import React, { useState, useMemo } from "react";
import { format } from "date-fns";

const CoGrid = () => {
  const desks = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "C01", "C02"];
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  const [bookings, setBookings] = useState([
    { id: 1, desk: "A01", name: "John Doe", time: "10:00", note: "Team meeting", date: "2024-11-16" },
    { id: 2, desk: "A02", name: "Alice Brown", time: "14:30", note: "Client call", date: "2024-11-15" },
    { id: 3, desk: "A01", name: "Bob Smith", time: "09:00", note: "Interview", date: "2024-11-16" },
    { id: 4, desk: "A03", name: "Charlie Green", time: "11:30", note: "Lunch meeting", date: "2024-11-16" },
    { id: 5, desk: "A02", name: "David White", time: "16:00", note: "Training", date: "2024-11-15" },
    { id: 6, desk: "A01", name: "Eve Black", time: "13:00", note: "Presentation", date: "2024-11-16" },
    { id: 7, desk: "A04", name: "Frank Grey", time: "15:30", note: "Discussion", date: "2024-11-16" },
    { id: 8, desk: "A05", name: "Grace Silver", time: "17:00", note: "Meeting", date: "2024-11-16" },
    { id: 9, desk: "A06", name: "Heidi Gold", time: "18:30", note: "Conference", date: "2024-11-16" },
    { id: 10, desk: "B01", name: "Ivy Orange", time: "19:00", note: "Seminar", date: "2024-11-16" },
    { id: 11, desk: "B02", name: "Jack Blue", time: "20:30", note: "Workshop", date: "2024-11-16" },
    { id: 12, desk: "C01", name: "Kelly Red", time: "21:00", note: "Webinar", date: "2024-11-16" },
    { id: 13, desk: "C02", name: "Liam Pink", time: "22:30", note: "Meeting", date: "2024-11-16" },
  ]);

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [hoveredBooking, setHoveredBooking] = useState(null);

  const filteredBookings = useMemo(() => 
    bookings.filter(booking => 
      booking.date === selectedDate
    ), [bookings, selectedDate]
  );

  const renderBookingNames = (deskBookings) => {
    if (deskBookings.length === 0) return <div className="text-gray-400 text-sm">ว่าง</div>;

    return (
      <div className="space-y-1">
        {deskBookings.slice(0, 2).map(booking => (
          <div 
            key={booking.id} 
            className="flex items-center text-xs truncate"
            onMouseEnter={() => setHoveredBooking(booking)}
            onMouseLeave={() => setHoveredBooking(null)}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {booking.name.split(' ')[0]}
          </div>
        ))}
        {deskBookings.length > 2 && (
          <div className="text-xs text-gray-500">
            +{deskBookings.length - 2} more
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Desk Booking Grid</h2>

      <div className="mb-4 flex justify-center items-center">
        <label className="mr-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="bg-purple-100 rounded-lg p-5 overflow-x-auto">
        <div className="grid grid-cols-11 gap-2 min-w-[1200px] relative">
          <div className="font-semibold text-center">Days</div>
          {desks.map(desk => (
            <div key={desk} className="font-semibold text-center">{desk}</div>
          ))}

          {days.map((day, dayIndex) => (
            <React.Fragment key={day}>
              <div className="font-medium text-center">{day}</div>
              {desks.map(desk => {
                const deskBookings = filteredBookings.filter(
                  booking => booking.desk === desk
                );

                return (
                  <div 
                    key={`${day}-${desk}`} 
                    className="bg-white rounded-lg shadow-sm border p-2 h-20 relative group"
                  >
                    {renderBookingNames(deskBookings)}

                    {/* Tooltip แบบใหม่ */}
                    {deskBookings.length > 0 && (
                      <div 
                        className="absolute hidden group-hover:block z-10 bg-white border rounded-lg shadow-lg p-3 w-48 
                                   left-full top-1/2 transform -translate-y-1/2 ml-2"
                      >
                        {deskBookings.map(booking => (
                          <div key={booking.id} className="mb-2 last:mb-0">
                            <div className="font-semibold text-sm">{booking.name}</div>
                            <div className="text-xs text-gray-600">{booking.time} - {booking.note}</div>
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