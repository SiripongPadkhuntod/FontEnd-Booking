import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "../css/ProfilePage.css";

function ProfilePage({ nightMode }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <TransitionGroup component="div" className={`flex flex-col md:flex-row w-full h-full p-5 transition-all duration-300 ${nightMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg shadow-md`}>
      
      {/* Profile Section */}
      <CSSTransition key="profile-section" timeout={500} classNames="fade">
        <div className={`w-full md:w-1/3 p-5 text-center ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-black'} transition-all duration-500`}>
          <div className="w-24 h-24 rounded-full bg-purple-600 mx-auto mb-5 transition-all duration-300"></div>
          <h2 className={`text-xl mb-5 ${nightMode ? 'text-gray-200' : 'text-black'}`}>Firstname Lastname</h2>
          <div>
            <p className={`cursor-pointer mb-2 ${nightMode ? 'text-gray-200 hover:underline' : 'text-black hover:underline'}`}>Personal Details</p>
            <p className={`cursor-pointer mb-2 ${nightMode ? 'text-gray-200 hover:underline' : 'text-black hover:underline'}`}>Personal Calendar Feed</p>
          </div>
          <div className="flex flex-col items-center">
            <button className={`py-2 px-4 mt-5 rounded-lg bg-yellow-500 text-white hover:bg-red-600 transition-all duration-300`} onClick={toggleEdit}>Edit</button>
            <button className={`py-2 px-4 mt-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300`}>Logout</button>
          </div>
        </div>
      </CSSTransition>
      
      {/* Main Content Section */}
      <CSSTransition key="main-content-section" timeout={500} classNames="fade">
        <div className={`flex-1 p-5 ${nightMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'} transition-all duration-500 ${isEditing ? 'block' : 'hidden md:block'}`}>
          <h3 className={`text-lg mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Login</h3>
          <input type="email" placeholder="example@gmail.com" className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} />
          <button className={`py-2 px-4 mt-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300`}>Change</button>
          <button className={`py-2 px-4 mt-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300`}>Reset Password</button>

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Service Logins</h3>

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Contact</h3>
          <input type="text" placeholder="Firstname" className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} />
          <input type="text" placeholder="Lastname" className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} />

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Telephone</h3>
          <input type="text" placeholder="(TH) e.g. 081 234 5678" className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} />

          <h3 className={`text-lg mt-5 mb-2 ${nightMode ? 'text-gray-300' : 'text-gray-800'}`}>Organization</h3>
          <input type="text" placeholder="Optional" className={`w-full max-w-md p-2 mb-3 rounded-lg border ${nightMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`} />

          <button className={`py-2 px-4 mt-5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300`}>Save all Changes</button>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default ProfilePage;
