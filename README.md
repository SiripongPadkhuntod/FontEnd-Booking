# Frontend Booking System

ระบบจองห้องประชุมออนไลน์ (Frontend)

## รายละเอียดโครงการ

โปรแกรมนี้เป็นส่วน Frontend ของระบบจองห้องประชุมออนไลน์ พัฒนาด้วย React และ Vite โดยมีฟีเจอร์หลักในการจัดการการจองห้องประชุม การดูตารางการจอง และการจัดการข้อมูลผู้ใช้

## เทคโนโลยีที่ใช้

- React
- Vite
- Tailwind CSS
- Axios (สำหรับการเชื่อมต่อ API)
- React Router DOM (สำหรับการจัดการ Routing)

## การติดตั้ง

1. Clone repository:
```bash
git clone https://github.com/SiripongPadkhuntod/FontEnd-Booking.git
```

2. เข้าไปยังโฟลเดอร์โครงการ:
```bash
cd FontEnd-Booking
```

3. ติดตั้ง dependencies:
```bash
npm install
```

4. รันโปรแกรมในโหมด development:
```bash
npm run dev
```

## โครงสร้างโปรเจค

```
Frontend-Booking/
├── src/
│   ├── components/     # React Components
│   ├── pages/         # หน้าต่างๆ ของแอพพลิเคชัน
│   ├── services/      # Service สำหรับเชื่อมต่อ API
│   └── App.jsx        # Component หลัก
├── public/            # Static files
└── index.html         # Entry HTML file
```

## ฟีเจอร์หลัก

- ระบบล็อกอิน/ลงทะเบียน
- การจองห้องประชุม
- การดูตารางการจองห้อง
- การจัดการข้อมูลผู้ใช้
- การแก้ไข/ยกเลิกการจอง

## การใช้งาน

1. ล็อกอินเข้าสู่ระบบ
2. เลือกห้องประชุมที่ต้องการจอง
3. เลือกวันและเวลาที่ต้องการ
4. กรอกรายละเอียดการจอง
5. ยืนยันการจอง

## การพัฒนาเพิ่มเติม

หากต้องการพัฒนาเพิ่มเติม สามารถทำได้ดังนี้:

1. Fork repository นี้
2. สร้าง branch ใหม่สำหรับฟีเจอร์ที่ต้องการพัฒนา
3. Commit การเปลี่ยนแปลงของคุณ
4. สร้าง Pull request

## ข้อกำหนดในการพัฒนา

- ใช้ ESLint ในการตรวจสอบ code style
- เขียน commit message ให้ชัดเจนและเข้าใจง่าย
- ทดสอบฟีเจอร์ให้ครบถ้วนก่อน push code

## ผู้พัฒนา

- ศิริพงษ์ ภักดีกุนทอง

## License

MIT License