import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 20px;
  background-color: #f5f7ff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.div`
  width: 30%;
  padding: 20px;
  text-align: center;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #800080;
  background-size: cover;
  margin: 0 auto;
  margin-bottom: 20px;
`;

// เพิ่ม Styled Components สำหรับข้อความที่ต้องการ
const NameText = styled.h2`
  color: #000; /* สีดำ */
  font-size: 20px;
  margin-bottom: 20px;
`;

const SidebarLink = styled.p`
  color: #000; /* สีดำ */
  font-size: 16px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #e57373;
  cursor: pointer;
  &:hover {
    background-color: #d32f2f;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;
  &:hover {
    background-color: #388e3c;
  }
`;

function ProfilePage() {
  return (
    <ProfileContainer>
      <Sidebar>
        <Avatar />
        <NameText>Firstname Lastname</NameText>
        <div>
          <SidebarLink>Personal Details</SidebarLink>
          <SidebarLink>Personal Calendar Feed</SidebarLink>
        </div>
        <Button>Logout</Button>
      </Sidebar>

      <MainContent>
        <SectionTitle>Login</SectionTitle>
        <Input type="email" placeholder="example@gmail.com" />
        <Button>Change</Button>
        <Button>Reset Password</Button>

        <SectionTitle>Service Logins</SectionTitle>
        {/* สามารถเพิ่ม icon สำหรับ Google, Facebook, ฯลฯ ตรงนี้ได้ */}

        <SectionTitle>Contact</SectionTitle>
        <Input type="text" placeholder="Firstname" />
        <Input type="text" placeholder="Lastname" />

        <SectionTitle>Telephone</SectionTitle>
        <Input type="text" placeholder="(TH) e.g. 081 234 5678" />

        <SectionTitle>Organization</SectionTitle>
        <Input type="text" placeholder="Optional" />

        <SaveButton>Save all Changes</SaveButton>
      </MainContent>
    </ProfileContainer>
  );
}

export default ProfilePage;
