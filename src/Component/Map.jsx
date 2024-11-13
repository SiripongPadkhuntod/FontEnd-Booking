import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';

const CoMap = ({ nightMode }) => {
    const [time, setTime] = useState("17:00");
    const [bookingTime, setBookingTime] = useState("");
    const [date, setDate] = useState(new Date());
    const mapRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [scale, setScale] = useState(1);
    let [numbertable, setNumbertable] = useState(0);
    const [selectedTime, setSelectedTime] = useState(0);
    const [displayTime, setDisplayTime] = useState("08:00");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const initialTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
    const moreTimes = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
    const [showMore, setShowMore] = useState(false);

    // เพิ่ม event listener สำหรับตรวจจับขนาดหน้าจอ
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            // ปรับ scale เริ่มต้นสำหรับมือถือ
            if (window.innerWidth <= 768 && scale === 1) {
                setScale(0.5);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // เรียกครั้งแรกเพื่อตั้งค่าเริ่มต้น

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTimeChange = (e) => {
        const selectedValue = parseInt(e.target.value);
        setSelectedTime(selectedValue);
        const hours = Math.floor(selectedValue / 2) + 8;
        const minutes = (selectedValue % 2 === 0) ? "00" : "30";
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        setDisplayTime(formattedTime);
    };

    // ปรับการทำงานของ touch events สำหรับมือถือ
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setStartX(touch.clientX - offsetX);
        setStartY(touch.clientY - offsetY);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        setOffsetX(touch.clientX - startX);
        setOffsetY(touch.clientY - startY);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Mouse events สำหรับ desktop
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

    const getSliderValueFromTime = (time) => {
        const timeParts = time.split(":");
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        return (hours - 8) * 2 + (minutes === 30 ? 1 : 0);
    };

    return (
        <div className={`w-full h-full relative rounded-lg overflow-hidden ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div
                ref={mapRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheelZoom}
                onMouseLeave={() => setIsDragging(false)}
                className="w-full h-full bg-center"
                style={{
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none', // ป้องกันการ scroll บนมือถือ
                }}
            >
                {/* SVG Map content remains the same */}
                <svg xmlns="http://www.w3.org/2000/svg" width="931" height="508" fill="none" viewBox="0 0 931 508" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    
                    <g clipPath="url(#a)">
                        <path fill="#DCEAF7" stroke="#366286" strokeWidth="5" d="M2.5 505.5V2.5h711v503z" />
                        <path fill="#DCEAF7" stroke="#366286" d="M710.525 339.484V161.597h4.975v177.887z" />
                        <rect width="141" height="212" x="49.5" y="329.5" fill="#FCFCFC" stroke="#C0BECA" rx="14.5" transform="rotate(-90 49.5 329.5)" />
                        <rect width="76" height="212" x="406.5" y="490.5" fill="#FCFCFC" stroke="#C0BECA" rx="14.5" transform="rotate(-90 406.5 490.5)" />
                        <path fill="#D9D9D9" d="M302 503V382h32v121z" />
                        <path fill="#fff" stroke="#C0BECA" d="M373.5 73.5v-64h239v64z" />
                        <path fill="#fff" stroke="#C0BECA" d="M344.5 219.5V9.5h55v210z" />
                        <path fill="#D9D9D9" stroke="#000" d="M227.5 56.5v-47h48v47z" />
                        <path fill="#D9D9D9" stroke="#000" d="M289.5 56.5v-47h48v47z" />
                        <path fill="#D9D9D9" stroke="#000" d="M108.5 333.5V363c0 8.008-6.492 14.5-14.5 14.5H79c-8.008 0-14.5-6.492-14.5-14.5v-29.5h44Z" />
                        <path fill="#D9D9D9" d="M18 325V193h23v132z" />
                        <path fill="#D9D9D9" stroke="#000" d="M150 377.5c-8.008 0-14.5-6.492-14.5-14.5v-29.5h44V363c0 8.008-6.492 14.5-14.5 14.5h-15Z" />
                        <path fill="#D9D9D9" stroke="#000" d="M462 126.5c-8.008 0-14.5-6.492-14.5-14.5V82.5h44V112c0 8.008-6.492 14.5-14.5 14.5h-15Z" />

                        <path fill="#D9D9D9" stroke="#000" d="M150 141.5c-8.008 0-14.5 6.492-14.5 14.5v29.5h44V156c0-8.008-6.492-14.5-14.5-14.5h-15Z" />
                        <path fill="#D9D9D9" stroke="#000" d="M457 365.5c-8.008 0-14.5 6.492-14.5 14.5v29.5h44V380c0-8.008-6.492-14.5-14.5-14.5h-15Z" />
                        <path fill="#D9D9D9" stroke="#000" d="M64.5 155v30.5h45V155c0-8.008-6.492-14.5-14.5-14.5H79c-8.008 0-14.5 6.492-14.5 14.5Z" />
                        <path fill="#D9D9D9" stroke="#000" d="M218 140.5c-8.008 0-14.5 6.492-14.5 14.5v29.5h44V155c0-8.008-6.492-14.5-14.5-14.5h-15Z" />
                        <path fill="#D9D9D9" stroke="#000" d="M549 365.5c-8.008 0-14.5 6.492-14.5 14.5v29.5h44V380c0-8.008-6.492-14.5-14.5-14.5h-15Z" />
                        <path fill="#D9D9D9" stroke="#000" d="M220 377.5c-8.008 0-14.5-6.492-14.5-14.5v-29.5h44V363c0 8.008-6.492 14.5-14.5 14.5h-15Z" />
                        <path fill="#D9D9D9" stroke="#000" d="M532 126.5c-8.008 0-14.5-6.492-14.5-14.5V82.5h44V112c0 8.008-6.492 14.5-14.5 14.5h-15Z" />
                        <circle cx="458" cy="453" r="13" fill="#D9D9D9" />
                        <g clipPath="url(#b)">
                            <path fill="#374957" d="M467 458.25v-9.75a2.25 2.25 0 0 0-2.25-2.25h-13.5a2.25 2.25 0 0 0-2.25 2.25v9.75h8.25v.75h-3v1.5h7.5V459h-3v-.75H467Zm-16.5-9.75c0-.199.079-.39.22-.53a.747.747 0 0 1 .53-.22h13.5c.199 0 .39.079.53.22.141.14.22.331.22.53v8.25h-15v-8.25Z" />
                        </g>

                        <g clipPath="url(#c)">
                            <path fill="#374957" d="M367.75 111.958h-1.583a3.168 3.168 0 0 0-3.167 3.167v4.75a3.17 3.17 0 0 0 3.167 3.167h1.583a3.962 3.962 0 0 0 3.958 3.958h3.959a3.962 3.962 0 0 0 3.958-3.958 2.375 2.375 0 0 0 2.375-2.375v-6.334a2.375 2.375 0 0 0-2.375-2.375 3.962 3.962 0 0 0-3.958-3.958h-3.959a3.962 3.962 0 0 0-3.958 3.958Zm-1.583 9.5a1.583 1.583 0 0 1-1.584-1.583v-4.75a1.584 1.584 0 0 1 1.584-1.583h1.583v7.916h-1.583Zm13.458-7.916a.79.79 0 0 1 .792.791v6.334a.791.791 0 0 1-.792.791h-3.167a.787.787 0 0 1-.559-.232.787.787 0 0 1-.232-.559v-6.334c0-.21.083-.411.232-.559a.787.787 0 0 1 .559-.232h3.167Zm-3.958-3.959a2.375 2.375 0 0 1 2.375 2.375h-1.584a2.375 2.375 0 0 0-2.375 2.375v6.334a2.375 2.375 0 0 0 2.375 2.375h1.584a2.375 2.375 0 0 1-2.375 2.375h-3.959a2.375 2.375 0 0 1-2.375-2.375v-11.084a2.375 2.375 0 0 1 2.375-2.375h3.959Z" />
                            <path fill="#374957" d="M370.917 112.75v1.583a.79.79 0 0 0 .792.792.79.79 0 0 0 .791-.792v-1.583a.79.79 0 1 0-1.583 0Z" />
                        </g>
                        <circle cx="539" cy="42" r="13" fill="#D9D9D9" />
                        <g clipPath="url(#d)">
                            <path fill="#374957" d="M548 47.25V37.5a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 530 37.5v9.75h8.25V48h-3v1.5h7.5V48h-3v-.75H548Zm-16.5-9.75a.749.749 0 0 1 .75-.75h13.5a.748.748 0 0 1 .75.75v8.25h-15V37.5Z" />
                        </g>
                        <circle cx="556" cy="453" r="13" fill="#D9D9D9" />
                        <g clipPath="url(#e)">
                            <path fill="#374957" d="M565 458.25v-9.75a2.25 2.25 0 0 0-2.25-2.25h-13.5a2.25 2.25 0 0 0-2.25 2.25v9.75h8.25v.75h-3v1.5h7.5V459h-3v-.75H565Zm-16.5-9.75c0-.199.079-.39.22-.53a.747.747 0 0 1 .53-.22h13.5c.199 0 .39.079.53.22.141.14.22.331.22.53v8.25h-15v-8.25Z" />
                        </g>
                        <path fill="#D9D9D9" d="M769 261v-27h64v27z" />
                        <path fill="#D9D9D9" d="m719 247.5 50.25-29.012v58.024L719 247.5Z" />
                        <path fill="#000" d="M756.826 254v-10.909h7.606v2.141h-4.97v2.237h4.581v2.147h-4.581v2.243h4.97V254h-7.606Zm18.542-10.909V254h-2.237l-4.342-6.296h-.069V254h-2.637v-10.909h2.27l4.293 6.285h.091v-6.285h2.631Zm1.301 2.141v-2.141h9.22v2.141h-3.307V254h-2.6v-8.768h-3.313ZM787.177 254v-10.909h4.507c.816 0 1.521.147 2.114.442.597.291 1.057.71 1.38 1.257.323.543.485 1.188.485 1.934 0 .756-.165 1.399-.496 1.928-.33.526-.799.927-1.406 1.204-.607.273-1.326.41-2.157.41h-2.85v-2.077h2.36c.397 0 .729-.052.996-.155.27-.106.474-.266.612-.479.139-.217.208-.494.208-.831 0-.338-.069-.616-.208-.837a1.248 1.248 0 0 0-.612-.5c-.27-.114-.602-.171-.996-.171h-1.3V254h-2.637Zm6.142-4.986 2.717 4.986h-2.877l-2.663-4.986h2.823Zm2.763-5.923h2.946l2.306 4.565h.096l2.307-4.565h2.945l-3.989 7.266V254h-2.621v-3.643l-3.99-7.266Z" />

                    </g>

                    <g className="cursor-pointer">
                        <circle cx="228" cy="355" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("A6"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="226" cy="164" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("A3"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="464" cy="387" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("B1"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="556" cy="387" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("B2"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="539" cy="104" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("C1"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="157" cy="354" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("A5"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="157" cy="164" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("A2"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="86" cy="354" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("A4"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="88" cy="164" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("A1"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                        <circle cx="469" cy="104" r="14.5" fill="#40AD0E" stroke="#000" onClick={() => { document.getElementById('availabilityModal').showModal(); setNumbertable("C2"); }}
                            onMouseEnter={(e) => e.target.setAttribute("fill", "#2E8B57")} // สีเมื่อ Hover
                            onMouseLeave={(e) => e.target.setAttribute("fill", "#40AD0E")} // คืนค่าสีเดิม
                        />
                    </g>
                    <defs>
                        <clipPath id="a">
                            <path fill="#fff" d="M0 508V0h931v508z" />
                        </clipPath>
                        <clipPath id="b">
                            <path fill="#fff" d="M449 444h18v18h-18z" />
                        </clipPath>
                        <clipPath id="c">
                            <path fill="#fff" d="M363 127v-19h19v19z" />
                        </clipPath>
                        <clipPath id="d">
                            <path fill="#fff" d="M530 33h18v18h-18z" />
                        </clipPath>
                        <clipPath id="e">
                            <path fill="#fff" d="M547 444h18v18h-18z" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            {/* Responsive controls for mobile */}
            <div className={`absolute top-0 left-0 right-0 ${isMobile ? 'flex flex-col p-2' : 'hidden'}`}>
                <div className={`w-full p-2 rounded-lg shadow-lg mb-2 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold">Time:</label>
                            <span className="text-sm font-semibold">{displayTime}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="28"
                            step="1"
                            value={selectedTime}
                            onChange={handleTimeChange}
                            className="w-full"
                        />
                        <input
                            type="date"
                            value={date.toISOString().slice(0, 10)}
                            onChange={(e) => setDate(new Date(e.target.value))}
                            className="w-full p-1 rounded border text-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Desktop controls */}
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 ${isMobile ? 'hidden' : 'flex'} flex-col md:flex-row items-center p-4 rounded-lg shadow-lg ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                    <label className="font-semibold mr-2">Time:</label>
                    <input
                        type="range"
                        min="0"
                        max="28"
                        step="1"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="w-64"
                    />
                    <span className="ml-2 font-semibold">{displayTime}</span>
                </div>
                <div className="flex items-center">
                    <label className="font-semibold mr-2">Date:</label>
                    <input
                        type="date"
                        value={date.toISOString().slice(0, 10)}
                        onChange={(e) => setDate(new Date(e.target.value))}
                        className="p-2 border rounded-md text-gray-900"
                    />
                </div>
            </div>

            {/* Zoom controls - ปรับตำแหน่งสำหรับมือถือ */}
            <div className={`absolute ${isMobile ? 'bottom-4 right-4' : 'bottom-4 right-4'} flex ${isMobile ? 'flex-row space-x-2' : 'flex-col items-center'}`}>
                <button 
                    onClick={() => setScale(Math.min(scale + 0.1, 3))} 
                    className="p-2 bg-gray-200 rounded"
                >
                    <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button 
                    onClick={() => setScale(Math.max(scale - 0.1, 0.5))} 
                    className="p-2 bg-gray-200 rounded"
                >
                    <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                {!isMobile && <span className="text-sm mt-2">Zoom: {Math.round(scale * 100)}%</span>}
            </div>

            {/* Availability Modal */}
            <dialog id="availabilityModal" className="modal">
                <div className="modal-box rounded-lg w-full max-w-md p-6 bg-gray-900 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                                {numbertable}
                            </div>
                            <h3 className="ml-3 text-lg font-semibold">This space is available!</h3>
                        </div>
                        <button
                            onClick={() => document.getElementById('availabilityModal').close()}
                            className="text-gray-500 hover:text-gray-300"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="text-center mb-6">
                        <div className="bg-gray-800 rounded-lg py-6 px-4 mb-2">
                            <p className="text-3xl font-bold">{displayTime}</p>
                            <p className="text-gray-400">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <button className="btn btn-success w-24" onClick={() => document.getElementById('bookingModal').showModal()}>
                            BOOK
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="font-semibold mb-2 text-gray-300">Select available time</p>
                        {/* Times displayed directly */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {initialTimes.map((timeOption) => (
                                <button
                                    key={timeOption}
                                    onClick={() => {
                                        setDisplayTime(timeOption);
                                        setSelectedTime(getSliderValueFromTime(timeOption)); // Sync slider value
                                    }}
                                    className={`btn btn-outline btn-sm ${displayTime === timeOption ? "bg-gray-500 text-white" : "text-gray-300"}`}
                                >
                                    {timeOption}
                                </button>
                            ))}
                        </div>

                        {/* More button directly after 11:30 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                onClick={() => setShowMore(!showMore)}
                                className="btn btn-outline btn-sm text-gray-300"
                            >
                                MORE ▼
                            </button>
                        </div>

                        {/* Show remaining times directly after "MORE" button is clicked */}
                        {showMore && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {moreTimes.map((timeOption) => (
                                    <button
                                        key={timeOption}
                                        onClick={() => {
                                            setDisplayTime(timeOption);
                                            setSelectedTime(getSliderValueFromTime(timeOption)); // Sync slider value
                                        }}
                                        className={`btn btn-outline btn-sm ${displayTime === timeOption ? "bg-gray-500 text-white" : "text-gray-300"}`}
                                    >
                                        {timeOption}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default CoMap;