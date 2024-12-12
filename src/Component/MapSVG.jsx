import React, { useEffect, useState } from 'react';
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้


const CircleButton = ({ cx, cy, tableNumber, onClick, disabled, tableID, showBookingDetails }) => {
    const handleMouseEnter = (e) => { if (!disabled) e.target.setAttribute("fill", "#2E8B57") };
    const handleMouseLeave = (e) => { if (!disabled) e.target.setAttribute("fill", "#40AD0E") };

    return (
        <circle
            cx={cx}
            cy={cy}
            r="14.5"
            fill={disabled ? "#aaa" : "#40AD0E"}
            stroke="#000"
            onClick={() => {
                if (disabled) {

                    document.getElementById('bookingModalDetail').showModal();
                    onClick(tableNumber, tableID);

                } else {
  
                    document.getElementById('availabilityModal').showModal();
                    onClick(tableNumber, tableID);
 
                }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
};



function timeToMinutes(timeString) {
    if (!timeString) return;
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
}

function isBetweenTimes(time, startTime, endTime) {
    const timeInMinutes = timeToMinutes(time);
    const startInMinutes = timeToMinutes(startTime);
    const endInMinutes = timeToMinutes(endTime);
    // console.log(`Comparing time: ${timeInMinutes} with range ${startInMinutes} - ${endInMinutes}`);
    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
}



function MapSVG({ time, date, onSelectNumbertable, onSelectNumbertableID }) {

    const [booking, setBooking] = useState(new Set());
    useEffect(() => {
        const Bookings = async () => {
            const currentDate = date.toISOString().split('T')[0]; // กำหนด currentDate เป็นวันที่ปัจจุบันในรูปแบบ yyyy-mm-dd
            console.log('Current Date:', currentDate);
            console.log('Time from props:', time);
            console.log('Date from props:', date);
            try {
                const response = await API.get(`/reservations/day/${currentDate}`);

                // ตรวจสอบการตอบกลับจาก API
                if (response && response.data) {
                    console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
                    if (response.data.status === 404) {
                        console.log("No bookings found for the selected date.");
                        setBooking(new Set());
                    }
                    else {
         
                        const timeMap = response.data

                            .filter(item => new Date(item.reservation_date).toDateString() === new Date(date).toDateString())

                            .map(item => ({
                                disabled: isBetweenTimes(time, item.reservation_time_from, item.reservation_time_to),
                                table: item.table_number

                            }));

                        const bookingTableSet = new Set(timeMap.filter(item => item.disabled).map(item => item.table));
                        setBooking(bookingTableSet);
                        console.log(bookingTableSet, date, time);


                    }



                } else {
                    console.error("No data found in the response.");
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        Bookings();
    }, [time, date]); // ใช้เวลาและวันที่ใน dependency


    const setNumbertable = (tableNumber, tableID) => {
        onSelectNumbertable(tableNumber);  // ตั้งค่าหมายเลขโต๊ะใน Map.jsx
        onSelectNumbertableID(tableID);
        console.log('Selected table:', tableNumber, tableID);
    };
    

    const hasBooking = (tablename) => {
        return booking.has(tablename);
    };


    return (
        <div>
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

                {/* Reusable Circle Buttons */}
                <g className="cursor-pointer">
                    <CircleButton cx={228} cy={355} tableNumber="A06" tableID="10" onClick={setNumbertable} disabled={hasBooking('A06')} />
                    <CircleButton cx={226} cy={164} tableNumber="A03" tableID="3" onClick={setNumbertable} disabled={hasBooking('A03')} />
                    <CircleButton cx={464} cy={387} tableNumber="B01" tableID="6" onClick={setNumbertable} disabled={hasBooking('B01')} />
                    <CircleButton cx={556} cy={387} tableNumber="B02" tableID="7" onClick={setNumbertable} disabled={hasBooking('B02')} />
                    <CircleButton cx={539} cy={104} tableNumber="C01" tableID="8" onClick={setNumbertable} disabled={hasBooking('C01')} />
                    <CircleButton cx={157} cy={354} tableNumber="A05" tableID="5" onClick={setNumbertable} disabled={hasBooking('A05')} />
                    <CircleButton cx={157} cy={164} tableNumber="A02" tableID="2" onClick={setNumbertable} disabled={hasBooking('A02')} />
                    <CircleButton cx={86} cy={354} tableNumber="A04" tableID="4" onClick={setNumbertable} disabled={hasBooking('A04')} />
                    <CircleButton cx={88} cy={164} tableNumber="A01" tableID="1" onClick={setNumbertable} disabled={hasBooking('A01')} />
                    <CircleButton cx={469} cy={104} tableNumber="C02" tableID="9" onClick={setNumbertable} disabled={hasBooking('C02')} />
                </g>

                {/* Defining clip paths */}
                <defs>
                    <clipPath id="a">
                        <path fill="#fff" d="M0 508V0h931v508z" />
                    </clipPath>
                    {/* Other clipPaths */}
                </defs>

            </svg>
        </div>

    );
}

export default MapSVG;


