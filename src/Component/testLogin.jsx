import { GoogleLogin } from '@react-oauth/google';

function Logintest() {
  const handleLoginSuccess = (response) => {
    console.log('Google token:', response.credential); // ตรวจสอบ token

    // ส่ง token ไปยัง backend
    fetch('http://localhost:8080/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Login successful') {
          console.log('Login successful');
        }

        else if (data.message === 'Register successful') {
            console.log('Register successful');
        }

        else if (data.message === 'Invalid email domain') {
            console.log('Invalid email domain');
        }
         else {
          console.log('Login failed with message:', data.message);
        }
      })
      .catch(err => {
        console.log('Error:', err);
      });
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}

export default Logintest;
