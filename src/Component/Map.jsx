import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';

const CoMap = ({ nightMode }) => {
    const [time, setTime] = useState(17);
    const [date, setDate] = useState(new Date());
    const mapRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [scale, setScale] = useState(1);

    // const 

    const tables = [
        { id: 1, x: 704, y: 294, status: 'ว่าง', initials: '' },
        { id: 2, x: 300, y: 200, status: 'ปิด', initials: '' },
        { id: 3, x: 500, y: 250, status: 'มีคนจ้อง', initials: 'SP' },
    ];

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

    const handleMouseUp = () => setIsDragging(false);

    const handleWheelZoom = (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        if (e.deltaY > 0) {
            setScale(Math.max(scale - zoomIntensity, 0.5));
        } else {
            setScale(Math.min(scale + zoomIntensity, 3));
        }
    };

    return (
        <div className={`w-full h-full relative rounded-lg overflow-hidden ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div
                ref={mapRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheelZoom} // ฟังก์ชันสำหรับการซูมด้วยการเลื่อนสกอลล์เมาส์
                onMouseLeave={() => setIsDragging(false)}
                className="w-full h-full bg-center"
                style={{
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="514" height="867" fill="none" viewBox="0 0 514 867">
                    <path fill="#DCEAF7" stroke="#366286" stroke-width="5" d="M2.5 2.5h509v714H2.5z" />
                    <path fill="#DCEAF7" stroke="#366286" d="M170.5 713.5h180v5h-180z" />
                    <rect width="141" height="212" x="178.5" y="49.5" fill="#FCFCFC" stroke="#C0BECA" rx="14.5" />
                    <rect width="76" height="212" x="17.5" y="406.5" fill="#FCFCFC" stroke="#C0BECA" rx="14.5" />
                    <path fill="#D9D9D9" d="M5 302h121v32H5z" />
                    <path fill="#fff" stroke="#C0BECA" d="M434.5 373.5h64v239h-64z" />
                    <path fill="#fff" stroke="#C0BECA" d="M288.5 344.5h210v55h-210z" />
                    <path fill="#D9D9D9" stroke="#F36F56" d="M451.5 227.5h47v48h-47z" />
                    <path fill="#D9D9D9" stroke="#CC2129" d="M451.5 289.5h47v48h-47z" />
                    <path fill="#D9D9D9" stroke="#000" d="M174.5 108.5H145c-8.008 0-14.5-6.492-14.5-14.5V79c0-8.008 6.492-14.5 14.5-14.5h29.5v44Z" />
                    <path fill="#D9D9D9" d="M183 18h132v23H183z" />
                    <path fill="#D9D9D9" stroke="#000" d="M145 135.5h29.5v44H145c-8.008 0-14.5-6.492-14.5-14.5v-15c0-8.008 6.492-14.5 14.5-14.5Z" />
                    <path fill="#D9D9D9" stroke="#934E44" d="M381.5 462c0-8.008 6.492-14.5 14.5-14.5h29.5v44H396c-8.008 0-14.5-6.492-14.5-14.5v-15Z" />
                    <path fill="#D9D9D9" stroke="#D7209A" d="M367.5 150c0-8.008-6.492-14.5-14.5-14.5h-29.5v44H353c8.008 0 14.5-6.492 14.5-14.5v-15Z" />
                    <path fill="#D9D9D9" stroke="#71C3DD" d="M142.5 457c0-8.008-6.492-14.5-14.5-14.5H98.5v44H128c8.008 0 14.5-6.492 14.5-14.5v-15Z" />
                    <path fill="#D9D9D9" stroke="#3DA3ED" d="M367.5 79c0-8.008-6.492-14.5-14.5-14.5h-29.5v44H353c8.008 0 14.5-6.492 14.5-14.5V79Z" />
                    <path fill="#D9D9D9" stroke="#893976" d="M367.5 218c0-8.008-6.492-14.5-14.5-14.5h-29.5v44H353c8.008 0 14.5-6.492 14.5-14.5v-15Z" />
                    <path fill="#D9D9D9" stroke="#5038ED" d="M367.5 218c0-8.008-6.492-14.5-14.5-14.5h-29.5v44H353c8.008 0 14.5-6.492 14.5-14.5v-15Z" />
                    <path fill="#D9D9D9" stroke="#C0B1DC" d="M142.5 549c0-8.008-6.492-14.5-14.5-14.5H98.5v44H128c8.008 0 14.5-6.492 14.5-14.5v-15Z" />
                    <path fill="#D9D9D9" stroke="#0F6" d="M130.5 220c0-8.008 6.492-14.5 14.5-14.5h29.5v44H145c-8.008 0-14.5-6.492-14.5-14.5v-15Z" />
                    <path fill="#D9D9D9" stroke="#DD8EB7" d="M381.5 532c0-8.008 6.492-14.5 14.5-14.5h29.5v44H396c-8.008 0-14.5-6.492-14.5-14.5v-15Z" />
                    <circle cx="55" cy="458" r="13" fill="#D9D9D9" />
                    <g clip-path="url(#a)">
                        <path fill="#374957" d="M64 463.25v-9.75a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 46 453.5v9.75h8.25v.75h-3v1.5h7.5V464h-3v-.75H64Zm-16.5-9.75a.748.748 0 0 1 .75-.75h13.5a.749.749 0 0 1 .75.75v8.25h-15v-8.25Z" />
                    </g>
                    <circle cx="390" cy="372" r="13" fill="#D9D9D9" />
                    <g clip-path="url(#b)">
                        <path fill="#374957" d="M396.042 367.75v-1.583a3.168 3.168 0 0 0-3.167-3.167h-4.75a3.17 3.17 0 0 0-3.167 3.167v1.583a3.962 3.962 0 0 0-3.958 3.958v3.959a3.962 3.962 0 0 0 3.958 3.958 2.375 2.375 0 0 0 2.375 2.375h6.334a2.375 2.375 0 0 0 2.375-2.375 3.962 3.962 0 0 0 3.958-3.958v-3.959a3.962 3.962 0 0 0-3.958-3.958Zm-9.5-1.583a1.583 1.583 0 0 1 1.583-1.584h4.75a1.584 1.584 0 0 1 1.583 1.584v1.583h-7.916v-1.583Zm7.916 13.458a.79.79 0 0 1-.791.792h-6.334a.791.791 0 0 1-.791-.792v-3.167c0-.21.083-.411.232-.559a.787.787 0 0 1 .559-.232h6.334c.21 0 .411.083.559.232a.787.787 0 0 1 .232.559v3.167Zm3.959-3.958a2.375 2.375 0 0 1-2.375 2.375v-1.584a2.375 2.375 0 0 0-2.375-2.375h-6.334a2.375 2.375 0 0 0-2.375 2.375v1.584a2.375 2.375 0 0 1-2.375-2.375v-3.959a2.375 2.375 0 0 1 2.375-2.375h11.084a2.375 2.375 0 0 1 2.375 2.375v3.959Z" />
                        <path fill="#374957" d="M395.25 370.917h-1.583a.79.79 0 0 0-.792.792.79.79 0 0 0 .792.791h1.583a.79.79 0 1 0 0-1.583Z" />
                    </g>
                    <circle cx="466" cy="539" r="13" fill="#D9D9D9" />
                    <g clip-path="url(#c)">
                        <path fill="#374957" d="M475 544.25v-9.75a2.25 2.25 0 0 0-2.25-2.25h-13.5a2.25 2.25 0 0 0-2.25 2.25v9.75h8.25v.75h-3v1.5h7.5V545h-3v-.75H475Zm-16.5-9.75c0-.199.079-.39.22-.53a.747.747 0 0 1 .53-.22h13.5c.199 0 .39.079.53.22.141.14.22.331.22.53v8.25h-15v-8.25Z" />
                    </g>
                    <circle cx="55" cy="556" r="13" fill="#D9D9D9" />
                    <g clip-path="url(#d)">
                        <path fill="#374957" d="M64 561.25v-9.75a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 46 551.5v9.75h8.25v.75h-3v1.5h7.5V562h-3v-.75H64Zm-16.5-9.75a.748.748 0 0 1 .75-.75h13.5a.749.749 0 0 1 .75.75v8.25h-15v-8.25Z" />
                    </g>
                    <path fill="#D9D9D9" d="M247 769h27v64h-27z" />
                    <path fill="#D9D9D9" d="m260.5 719 29.012 50.25h-58.024L260.5 719Z" />
                    <path fill="#000" d="M267 808.174h-10.909v-7.606h2.141v4.97h2.237v-4.581h2.147v4.581h2.243v-4.97H267v7.606Zm-10.909-18.542H267v2.237l-6.296 4.342v.069H267v2.637h-10.909v-2.27l6.285-4.293v-.091h-6.285v-2.631Zm2.141-1.301h-2.141v-9.22h2.141v3.307H267v2.6h-8.768v3.313ZM267 777.823h-10.909v-4.507c0-.816.147-1.521.442-2.114a3.177 3.177 0 0 1 1.257-1.38c.543-.323 1.188-.485 1.934-.485.756 0 1.399.165 1.928.496.526.33.927.799 1.204 1.406.273.607.41 1.326.41 2.157v2.85h-2.077v-2.36c0-.397-.052-.729-.155-.996a1.245 1.245 0 0 0-.479-.612c-.217-.139-.494-.208-.831-.208-.338 0-.616.069-.837.208-.223.138-.39.342-.5.612-.114.27-.171.602-.171.996v1.3H267v2.637Zm-4.986-6.142 4.986-2.717v2.877l-4.986 2.663v-2.823Zm-5.923-2.763v-2.946l4.565-2.306v-.096l-4.565-2.307v-2.945l7.266 3.989H267v2.621h-3.643l-7.266 3.99Z" />
                    <defs>
                        <clipPath id="a">
                            <path fill="#fff" d="M46 449h18v18H46z" />
                        </clipPath>
                        <clipPath id="b">
                            <path fill="#fff" d="M381 363h19v19h-19z" />
                        </clipPath>
                        <clipPath id="c">
                            <path fill="#fff" d="M457 530h18v18h-18z" />
                        </clipPath>
                        <clipPath id="d">
                            <path fill="#fff" d="M46 547h18v18H46z" />
                        </clipPath>
                    </defs>
                </svg>



                {tables.map((table) => (
                    <div
                        key={table.id}
                        className="absolute flex items-center justify-center rounded-full cursor-pointer"
                        style={{
                            left: `${table.x}px`,
                            top: `${table.y}px`,
                            width: '20px',
                            height: '20px',
                            backgroundColor: getColorByStatus(table.status),
                        }}
                        onClick={() => handleTableClick(table.id)}
                    >
                        {table.status === 'มีคนจ้อง' && <span className="text-white font-bold">{table.initials}</span>}
                    </div>
                ))}
            </div>

            {/* Zoom buttons */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center">
                <button onClick={() => setScale(Math.min(scale + 0.1, 3))} className="p-2 bg-gray-200 rounded">
                    <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button onClick={() => setScale(Math.max(scale - 0.1, 0.5))} className="p-2 bg-gray-200 rounded">
                    <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <span>Zoom: {Math.round(scale * 100)}%</span>
            </div>

            {/* Time and date display */}
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row items-center p-3 rounded-lg ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                <label className="font-semibold">Time:</label>
                <input
                    type="range"
                    min="0"
                    max="24"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-32 accent-blue-500"
                />
                <label className="font-semibold">Date:</label>
                <input
                    type="date"
                    value={date.toISOString().slice(0, 10)}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="p-1 border rounded-md"
                />
            </div>
        </div>
    );
};

export default CoMap;
