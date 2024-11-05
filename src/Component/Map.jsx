import React, { useState, useEffect, useRef } from 'react';
import mapImage from '../assets/image.svg'; // Import the map image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';

const CoMap = ({ nightMode }) => {
    const [time, setTime] = useState(17);
    const [date, setDate] = useState(new Date());
    const mapRef = useRef(null);

    // State for dragging and zooming
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(100);
    const [scale, setScale] = useState(1);

    // Original map size
    const originalMapSize = { width: 1024, height: 768 };
    const [mapSize, setMapSize] = useState({ width: originalMapSize.width, height: originalMapSize.height });

    const tables = [
        { id: 1, x: 704, y: 294, status: 'ว่าง', initials: '' },
        { id: 2, x: 300, y: 200, status: 'ปิด', initials: '' },
        { id: 3, x: 500, y: 250, status: 'มีคนจ้อง', initials: 'SP' },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (mapRef.current) {
                setMapSize({
                    width: mapRef.current.offsetWidth,
                    height: mapRef.current.offsetHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call when the component mounts

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(new Date(e.target.value));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX - offsetX);
        setStartY(e.clientY - offsetY);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setOffsetX(e.clientX - startX);
        setOffsetY(e.clientY - startY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
        if (e.touches.length > 0) {
            setIsDragging(true);
            setStartX(e.touches[0].clientX - offsetX);
            setStartY(e.touches[0].clientY - offsetY);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        setOffsetX(e.touches[0].clientX - startX);
        setOffsetY(e.touches[0].clientY - startY);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        setScale((prevScale) => {
            const newScale = e.deltaY < 0 ? prevScale + 0.1 : prevScale - 0.1;
            return Math.min(Math.max(newScale, 0.5), 3);
        });
    };

    const handleTableClick = (id) => {
        alert(`Table ${id} booked!`);
    };

    const getColorByStatus = (status) => {
        switch (status) {
            case 'ว่าง':
                return 'green';
            case 'ปิด':
                return 'gray';
            case 'มีคนจ้อง':
                return 'lightgray';
            default:
                return 'red';
        }
    };

    return (
        <div className={`w-full h-full relative rounded-lg overflow-hidden ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div
                ref={mapRef}
                className="w-full h-full bg-cover bg-center "
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
                style={{
                    backgroundImage: `url(${mapImage})`,
                    backgroundPositionX: `${offsetX}px`,
                    backgroundPositionY: `${offsetY}px`,
                    backgroundSize: `${scale * 100}%`,
                    backgroundRepeat: 'no-repeat',
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
            >
                {tables.map((table) => {
                    const xRatio = mapSize.width / originalMapSize.width;
                    const yRatio = mapSize.height / originalMapSize.height;
                    const circleX = (table.x * xRatio * scale) + offsetX - (13 * scale) / 2;
                    const circleY = (table.y * yRatio * scale) + offsetY - (13 * scale) / 2;

                    return (
                        <div
                            key={table.id}
                            className="absolute flex items-center justify-center rounded-full cursor-pointer"
                            style={{
                                left: `${circleX}px`,
                                top: `${circleY}px`,
                                width: `${13 * scale}px`,
                                height: `${13 * scale}px`,
                                backgroundColor: getColorByStatus(table.status),
                                border: `${2 * scale}px solid ${nightMode ? 'black' : 'white'}`,
                            }}
                            onClick={() => handleTableClick(table.id)}
                        >
                            {table.status === 'มีคนจ้อง' && (
                                <span
                                    className="text-white font-bold"
                                    style={{ fontSize: `${14 * scale}px` }}
                                >
                                    {table.initials}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Zoom buttons */}
            {/* <div className="absolute bottom-4 right-4 flex flex-col md:flex-row items-center">
                <button onClick={() => setScale(Math.min(scale + 0.1, 3))} className="mr-2 p-2 bg-gray-200 rounded text-black">
                    <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button onClick={() => setScale(Math.max(scale - 0.1, 0.5))} className="p-2 bg-gray-200 rounded text-black">
                    <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <span className="ml-2 text-black">Zoom: {Math.round(scale * 100)}%</span>
                <span className="ml-2 text-black">Offset: {offsetX}, {offsetY}</span>
            </div> */}

            <div className={`absolute bottom-4 right-4 flex flex-col items-end ${nightMode ? 'text-gray-200' : 'text-black'}`}>
                <div className="flex items-center mb-2">
                    <button onClick={() => setScale(Math.min(scale + 0.1, 3))} className="mr-2 p-2 bg-transparent	 rounded text-black">
                        <FontAwesomeIcon icon={faSearchPlus} />
                    </button>
                    <button onClick={() => setScale(Math.max(scale - 0.1, 0.5))} className="p-2 bg-transparent	 rounded text-black">
                        <FontAwesomeIcon icon={faSearchMinus} />
                    </button>
                </div>
                <span className="ml-2 text-black">Zoom: {Math.round(scale * 100)}% | Offset: X {offsetX}, Y {offsetY}</span>
                {/* <span className="ml-2 text-black">Offset: {offsetX}, {offsetY}</span> */}
            </div>


            {/* Time and date display */}
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row items-center justify-center p-3 rounded-lg shadow-md space-x-4 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                <label className="font-semibold">Time:</label>
                <input
                    type="range"
                    min="0"
                    max="24"
                    value={time}
                    onChange={handleTimeChange}
                    className="w-32 accent-blue-500"
                />
                <label className="font-semibold">Date:</label>
                <input
                    type="date"
                    value={date.toISOString().slice(0, 10)}
                    onChange={handleDateChange}
                    className={`p-1 border rounded-md ${nightMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-black'}`}
                />
            </div>
        </div>
    );
};

export default CoMap;
