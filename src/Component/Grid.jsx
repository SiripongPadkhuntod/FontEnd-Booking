import React from 'react';

const CoGrid = ({ searchQuery, data }) => {
    const filteredData = data.map(day => ({
        ...day,
        bookings: day.bookings.filter(booking =>
            booking.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(day => day.bookings.length > 0);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Booking Grid</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {(searchQuery ? filteredData : data).map((day, index) => (
                    <div key={index} className="bg-white shadow-md rounded overflow-hidden">
                        <div className="bg-red-100 text-red-700 font-semibold p-2">
                            {day.date}
                        </div>
                        <div className="grid gap-2 p-4">
                            {day.bookings.map((booking, idx) => (
                                <div key={idx} className="border border-gray-200 rounded p-2">
                                    <div className="font-semibold">{booking.desk}</div>
                                    <div>{booking.time}</div>
                                    <div>{booking.name || " "}</div>
                                    <div>{booking.note || " "}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoGrid;
