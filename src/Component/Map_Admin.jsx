import React, { useState } from 'react';

const CoMap = () => {
  const [time, setTime] = useState(17);
  const [date, setDate] = useState(new Date('2024-09-30'));

  // State สำหรับการลากและซูม
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1); // ค่าเริ่มต้นของการซูม
  const [tables, setTables] = useState([]); // State สำหรับจัดเก็บตำแหน่งโต๊ะ

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  // ฟังก์ชันสำหรับการลากบน Desktop
  const handleMapMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX - offsetX);
    setStartY(e.clientY - offsetY);
  };

  const handleMapMouseMove = (e) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - startX);
    setOffsetY(e.clientY - startY);
  };

  const handleMapMouseUp = () => {
    setIsDragging(false);
  };

  // ฟังก์ชันสำหรับการลากบนอุปกรณ์มือถือ
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

  // ฟังก์ชันสำหรับการซูมด้วยการเลื่อนสกอลล์เมาส์
  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prevScale) => {
      const newScale = e.deltaY < 0 ? prevScale + 0.1 : prevScale - 0.1;
      return Math.min(Math.max(newScale, 0.5), 3); // จำกัดการซูมระหว่าง 0.5 ถึง 3
    });
  };

  // ฟังก์ชันสำหรับเพิ่มตำแหน่งโต๊ะใหม่
  const addTable = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left - offsetX) / scale).toFixed(2);
    const y = ((e.clientY - rect.top - offsetY) / scale).toFixed(2);
    setTables([...tables, { x, y }]);
  };

  return (
    <div className="w-full h-full relative bg-white overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center"
        onMouseDown={handleMapMouseDown}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
        onMouseLeave={handleMapMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={addTable} // เพิ่มฟังก์ชันเพิ่มโต๊ะเมื่อคลิก
        style={{
          backgroundImage: "url('https://img5.pic.in.th/file/secure-sv1/Screenshot-2024-11-05-205010.png')",
          backgroundPositionX: `${offsetX}px`,
          backgroundPositionY: `${offsetY}px`,
          backgroundSize: `${scale * 100}%`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'white',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {tables.map((table, index) => (
          <button
            key={index}
            className="absolute bg-blue-500 text-white rounded p-1"
            style={{
              left: `${(table.x * scale) + (offsetX)}px`, // คำนวณตำแหน่ง x
              top: `${(table.y * scale) + (offsetY)}px`, // คำนวณตำแหน่ง y
            }}
            onClick={() => alert(`Table ${index + 1} booked!`)} // ฟังก์ชันเมื่อกดจองโต๊ะ
          >
            Table {index + 1}
          </button>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] md:w-[30%] h-[5%] bg-gray-200 flex items-center justify-center p-2 rounded-md">
        <input
          type="range"
          min="0"
          max="24"
          value={time}
          onChange={handleTimeChange}
          className="w-[80%]"
        />
      </div>
      <div className="absolute bottom-4 right-4 flex items-center flex-col md:flex-row">
        <button
          onClick={() => setDate(new Date(date.getTime() - 86400000))}
          className="mr-0 mb-2 md:mr-4 md:mb-0 p-1 bg-gray-300 rounded"
        >
          -
        </button>
        <input
          type="date"
          value={date.toISOString().slice(0, 10)}
          onChange={handleDateChange}
          className="mr-0 md:mr-4 p-1 rounded"
        />
        <button
          onClick={() => setDate(new Date(date.getTime() + 86400000))}
          className="p-1 bg-gray-300 rounded"
        >
          +
        </button>
      </div>
      <div className="absolute bottom-16 right-4 flex flex-col items-center">
        <button onClick={() => setScale(Math.min(scale + 0.1, 3))} className="mb-2 p-2 bg-gray-200 rounded">+</button>
        <button onClick={() => setScale(Math.max(scale - 0.1, 0.5))} className="p-2 bg-gray-200 rounded">-</button>
      </div>
    </div>
  );
};

export default CoMap;
