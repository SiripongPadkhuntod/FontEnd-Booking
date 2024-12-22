import React, { useEffect, useState } from 'react';
import API from '../api'; // ถ้าใช้ axios แบบที่เราสร้างไว้
import { th } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
registerLocale("th", th);



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



function MapSVG({ time, date, onSelectNumbertable, onSelectNumbertableID , onSelectRoom}) {

    const [booking, setBooking] = useState(new Set());
    useEffect(() => {
        const Bookings = async () => {
            const currentDate = date.toISOString().split('T')[0]; // กำหนด currentDate เป็นวันที่ปัจจุบันในรูปแบบ yyyy-mm-dd
            try {
                const response = await API.get(`/reservations?day=${currentDate}`);

                // ตรวจสอบการตอบกลับจาก API
                if (response && response.data) {
                    // console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
                    if (response.data.status === 404) {
                        console.log("No bookings found for the selected date.");
                        setBooking(new Set());
                    }
                    else {

                        const timeMap = response.data.data

                            .filter(item => new Date(item.reservation_date).toDateString() === new Date(date).toDateString())

                            .map(item => ({
                                disabled: isBetweenTimes(time, item.reservation_time_from, item.reservation_time_to),
                                table: item.table_number

                            }));

                        const bookingTableSet = new Set(timeMap.filter(item => item.disabled).map(item => item.table));
                        setBooking(bookingTableSet);

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
        onSelectRoom(2);
        console.log('Selected table:', tableNumber, tableID);
    };


    const hasBooking = (tablename) => {
        return booking.has(tablename);
    };


    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="861" height="646" fill="none" viewBox="0 0 861 646" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <path fill="#D9D9D9" stroke="#000" stroke-width="5" d="M7.5 512.5V9.5h711v503z" />
                <path fill="#D9D9D9" stroke="#000" d="M709.5 138.5v-127h5v127zm-572 369h-127v-5h127z" />
                <rect width="141" height="452" x="124.5" y="317.5" fill="#FCFCFC" stroke="#C0BECA" rx="14.5" transform="rotate(-90 124.5 317.5)" />
                <rect width="56" height="426" x="285.5" y="507.5" fill="#FCFCFC" stroke="#C0BECA" rx="14.5" transform="rotate(-90 285.5 507.5)" />
                <path fill="#D9D9D9" d="M33 313V181h23v132zM792 84V57h64v27z" />
                <path fill="#D9D9D9" d="m742 70.5 50.25-29.012v58.024L742 70.5Z" />
                <path fill="#000" d="M779.826 77V66.09h7.606v2.142h-4.97v2.237h4.581v2.147h-4.581v2.243h4.97V77h-7.606Zm18.542-10.91V77h-2.237l-4.342-6.296h-.069V77h-2.637V66.09h2.27l4.293 6.286h.091v-6.285h2.631Zm1.301 2.142v-2.141h9.22v2.141h-3.307V77h-2.6v-8.768h-3.313ZM810.177 77V66.09h4.507c.816 0 1.521.148 2.114.443a3.18 3.18 0 0 1 1.38 1.257c.323.543.485 1.188.485 1.934 0 .756-.165 1.399-.496 1.928-.33.526-.799.927-1.406 1.204-.607.273-1.326.41-2.157.41h-2.85v-2.077h2.36c.397 0 .729-.052.996-.155.27-.106.474-.266.612-.48.139-.216.208-.493.208-.83 0-.338-.069-.616-.208-.837a1.246 1.246 0 0 0-.612-.5c-.27-.114-.602-.17-.996-.17h-1.3V77h-2.637Zm6.142-4.986L819.036 77h-2.877l-2.663-4.986h2.823Zm2.763-5.923h2.946l2.306 4.565h.096l2.307-4.565h2.945l-3.989 7.266V77h-2.621v-3.644l-3.99-7.265Z" />
                <path fill="#D9D9D9" d="M48.5 581.5h27v64h-27z" />
                <path fill="#D9D9D9" d="m62 531.5 29.012 50.25H32.988L62 531.5Z" />
                <path fill="#000" d="M55.5 569.326h10.91v7.606h-2.142v-4.97H62.03v4.581h-2.147v-4.581H57.64v4.97H55.5v-7.606Zm10.91 18.542H55.5v-2.237l6.296-4.342v-.069H55.5v-2.637h10.91v2.27l-6.286 4.293v.091h6.285v2.631Zm-2.142 1.301h2.141v9.22h-2.141v-3.307H55.5v-2.6h8.768v-3.313ZM55.5 599.677h10.91v4.507c0 .816-.148 1.521-.443 2.114a3.18 3.18 0 0 1-1.257 1.38c-.543.323-1.188.485-1.934.485-.756 0-1.399-.165-1.928-.496-.526-.33-.927-.799-1.204-1.406-.273-.607-.41-1.326-.41-2.157v-2.85h2.077v2.36c0 .397.052.729.155.996.106.27.266.474.48.612.216.139.493.208.83.208.338 0 .616-.069.837-.208.223-.138.39-.342.5-.612.114-.27.17-.602.17-.996v-1.3H55.5v-2.637Zm4.986 6.142-4.986 2.717v-2.877l4.986-2.663v2.823Zm5.923 2.763v2.946l-4.565 2.306v.096l4.565 2.307v2.945l-7.266-3.989H55.5v-2.621h3.644l7.265-3.99Z" />
                <path fill="#D9D9D9" stroke="#000" d="M302.5 355v-29.5h44V355c0 8.008-6.492 14.5-14.5 14.5h-15c-8.008 0-14.5-6.492-14.5-14.5Z" />
                <circle cx="325" cy="347" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M551.427 426v24.597h39.097V426c0-8.008-6.492-14.5-14.5-14.5h-10.097c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="570.53" cy="430.603" r="12.866" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M633.403 426v24.597H672.5V426c0-8.008-6.492-14.5-14.5-14.5h-10.097c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="652.506" cy="430.603" r="12.866" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M387.476 426v24.597h39.097V426c0-8.008-6.492-14.5-14.5-14.5h-10.097c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="406.579" cy="430.603" r="12.866" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M305.5 426v24.597h39.097V426c0-8.008-6.492-14.5-14.5-14.5H320c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="324.603" cy="430.603" r="12.866" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M469.452 426v24.597h39.097V426c0-8.008-6.492-14.5-14.5-14.5h-10.097c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="488.555" cy="430.603" r="12.866" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M232.5 355v-29.5h44V355c0 8.008-6.492 14.5-14.5 14.5h-15c-8.008 0-14.5-6.492-14.5-14.5Z" />
                <circle cx="254" cy="346" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M205.5 325.5V355c0 8.008-6.492 14.5-14.5 14.5h-15c-8.008 0-14.5-6.492-14.5-14.5v-29.5h44Z" />
                <circle cx="183" cy="346" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M508.5 355v-29.5h44V355c0 8.008-6.492 14.5-14.5 14.5h-15c-8.008 0-14.5-6.492-14.5-14.5Z" />
                <circle cx="531" cy="347" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M438.5 355v-29.5h44V355c0 8.008-6.492 14.5-14.5 14.5h-15c-8.008 0-14.5-6.492-14.5-14.5Z" />
                <circle cx="460" cy="346" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M411.5 325.5V355c0 8.008-6.492 14.5-14.5 14.5h-15c-8.008 0-14.5-6.492-14.5-14.5v-29.5h44Z" />
                <circle cx="389" cy="346" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M300.5 139v29.5h44V139c0-8.008-6.492-14.5-14.5-14.5h-15c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="323" cy="148" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M232.5 140v29.5h44V140c0-8.008-6.492-14.5-14.5-14.5h-15c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="254" cy="148" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M161.5 139v30.5h45V139c0-8.008-6.492-14.5-14.5-14.5h-16c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="185" cy="148" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M506.5 138v29.5h44V138c0-8.008-6.492-14.5-14.5-14.5h-15c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="529" cy="147" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M438.5 139v29.5h44V139c0-8.008-6.492-14.5-14.5-14.5h-15c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="460" cy="147" r="14.5" fill="#40AD0E" stroke="#000" />
                <path fill="#D9D9D9" stroke="#000" d="M367.5 138v30.5h45V138c0-8.008-6.492-14.5-14.5-14.5h-16c-8.008 0-14.5 6.492-14.5 14.5Z" />
                <circle cx="391" cy="147" r="14.5" fill="#40AD0E" stroke="#000" />

                 {/* Reusable Circle Buttons */}
            <g className="cursor-pointer">
                <CircleButton cx="325" cy="347" tableNumber="A09" onClick={setNumbertable} disabled={hasBooking('A09')} tableID={22} />
                <CircleButton cx="570.53" cy="430.603" tableNumber="B04" onClick={setNumbertable} disabled={hasBooking('B04')} tableID={29} />
                <CircleButton cx="652.506" cy="430.603" tableNumber="B05" onClick={setNumbertable} disabled={hasBooking('B05')} tableID={30} />
                <CircleButton cx="406.579" cy="430.603" tableNumber="B02" onClick={setNumbertable} disabled={hasBooking('B02')} tableID={27} />
                <CircleButton cx="324.603" cy="430.603" tableNumber="B01" onClick={setNumbertable} disabled={hasBooking('B01')} tableID={26} />
                <CircleButton cx="488.555" cy="430.603" tableNumber="B03" onClick={setNumbertable} disabled={hasBooking('B03')} tableID={28} />
                <CircleButton cx="254" cy="346" tableNumber="A08" onClick={setNumbertable} disabled={hasBooking('A08')} tableID={21} />
                <CircleButton cx="183" cy="346" tableNumber="A07" onClick={setNumbertable} disabled={hasBooking('A07')} tableID={20} />
                <CircleButton cx="531" cy="347" tableNumber="A12" onClick={setNumbertable} disabled={hasBooking('A12')} tableID={25} />
                <CircleButton cx="460" cy="346" tableNumber="A11" onClick={setNumbertable} disabled={hasBooking('A11')} tableID={24} />
                <CircleButton cx="389" cy="346" tableNumber="A10" onClick={setNumbertable} disabled={hasBooking('A10')} tableID={23} />
                <CircleButton cx="323" cy="148" tableNumber="A03" onClick={setNumbertable} disabled={hasBooking('A03')} tableID={16} />
                <CircleButton cx="254" cy="148" tableNumber="A02" onClick={setNumbertable} disabled={hasBooking('A02')} tableID={15} />
                <CircleButton cx="185" cy="148" tableNumber="A01" onClick={setNumbertable} disabled={hasBooking('A01')} tableID={14} />
                <CircleButton cx="529" cy="147" tableNumber="A06" onClick={setNumbertable} disabled={hasBooking('A06')} tableID={19} />
                <CircleButton cx="460" cy="147" tableNumber="A05" onClick={setNumbertable} disabled={hasBooking('A05')} tableID={18} />
                <CircleButton cx="391" cy="147" tableNumber="A04" onClick={setNumbertable} disabled={hasBooking('A04')} tableID={17} />
            </g>


           

            </svg>

        


           


           


        </div>

    );
}

export default MapSVG;
