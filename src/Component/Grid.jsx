import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
//   align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px
`;

const Header = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000000;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  padding: 10px;
  padding: 10px;
  margin-bottom: 20px; /* Add bottom margin for spacing */
`;

const TableHeader = styled.th`
  background-color: #ffe8e3;
  padding: 5px;
  font-weight: bold;
  text-align: center;
  border-radius: 30px 30px 0px 0px;
  color: #000000;
`;
const TimeSlotHeader2 = styled.th`
  padding: 10px;
  font-weight: bold;
  width: 4%;
  text-align: center;
  border-radius: 20px 0px 0px 20px;
`;

const TimeSlotHeader = styled.th`
  background-color: #f0e5d8;
  padding: 10px;
  font-weight: bold;
  width: 4%;
  text-align: center;
  border-radius: 15px 0px 0px 15px;
  color: #000000;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 60px;
  color: #000000;
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 70px;
  right: 70px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  
  display: flex; /* ใช้ flexbox เพื่อจัดตำแหน่ง */
  align-items: center; /* จัดให้อยู่กลางในแนวตั้ง */
  justify-content: center; /* จัดให้อยู่กลางในแนวนอน */
`;

const ProfilePage = () => {
  return (
    <Wrapper>
      <Header>วันอาทิตย์ที่ 1 กันยายน ค.ศ.2024</Header>
      <Table>
        <thead>
          <tr>
            
            <TimeSlotHeader2></TimeSlotHeader2>
            <TableHeader>Desk A1</TableHeader>
            <TableHeader>Desk A2</TableHeader>
            <TableHeader>Desk A3</TableHeader>
            <TableHeader>Desk A4</TableHeader>
            <TableHeader>Desk A5</TableHeader>
            <TableHeader>Desk A6</TableHeader>
            <TableHeader>Desk A7</TableHeader>
            <TableHeader>Desk A8</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TimeSlotHeader>อา.1</TimeSlotHeader>
            <TableCell>Threeraph</TableCell>
            <TableCell>siri</TableCell>
            <TableCell>cjitipat</TableCell>
            <TableCell>Tanadon</TableCell>
            <TableCell></TableCell>
            <TableCell>Boonypapong</TableCell>
            <TableCell>Thor</TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TimeSlotHeader>จ.2</TimeSlotHeader>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TimeSlotHeader>อ.3</TimeSlotHeader>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TimeSlotHeader>พ.4</TimeSlotHeader>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TimeSlotHeader>พฤ.5</TimeSlotHeader>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TimeSlotHeader>ศ.6</TimeSlotHeader>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
          <tr>
            <TimeSlotHeader>ส.7</TimeSlotHeader>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </tr>
        </tbody>
      </Table>
      <AddButton>+</AddButton>
    </Wrapper>
  );
}

export default ProfilePage;
