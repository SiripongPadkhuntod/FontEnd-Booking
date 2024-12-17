import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import API from '../api';

// Import components and icons (same as before)
import CoMap from "../Component/Map";
import CoProfile from "../Component/Profile";
import CoList from "../Component/List";
import CoGrid from "../Component/Grid";
import CoMonth from "../Component/Month";
import CoDay from "../Component/Day";

import { HiMiniMap } from "react-icons/hi2";
import { HiMoon, HiSun } from "react-icons/hi";
import { IoGrid } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { CiBoxList } from "react-icons/ci";
import { MdCalendarMonth } from "react-icons/md";
import { IoMdClose, IoMdSettings } from "react-icons/io";
import { RiMenu3Fill } from "react-icons/ri";


const Home = () => {
  const colorSchemes = {
    light: {
      background: "bg-blue-50",
      sidebar: "bg-white shadow-xl",
      text: "text-gray-800",
      activeItem: "bg-blue-100 text-blue-600",
      menuHover: "hover:bg-blue-50"
    },
    dark: {
      background: "bg-gray-900",
      sidebar: "bg-gray-800 bg-opacity-90",
      text: "text-gray-200",
      activeItem: "bg-blue-900 text-blue-400",
      menuHover: "hover:bg-gray-700"
    }
  };

  const [activeComponent, setActiveComponent] = useState("Map");
  const [isNightMode, setIsNightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [first_name, setFirstname] = useState("System");
  const [last_name, setLastname] = useState("Admin");
  const [imageUrl, setImg] = useState("");
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [userid, setUserId] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  // Existing useEffect and fetchUserData methods remain the same...
  useEffect(() => {
    const fetchTokenData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("Token not found");
        navigate("/");
        return;
      }

      try {
        const response = await API.post("/verifyToken", {}, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data?.user?.email) {
          setEmail(response.data.user.email);
          setRole(response.data.user.role);
          setUserId(response.data.user.user_id);
        }
      } catch (error) {
        console.error("Error:", error.message);
        navigate("/");
      }
    };

    const fetchUserData = async () => {
      if (!email) return;

      try {
        const response = await API.get(`/users?id=${userid}`);

        if (response.status === 200) {
          const data = response.data.data;
          setFirstname(data.first_name);
          setLastname(data.last_name);
          setImg(data.photo);
          setEmail(data.email);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchTokenData();
    fetchUserData();
  }, [navigate, email]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Map": return <CoMap nightMode={isNightMode} userid={userid} />;
      case "Setting": return <CoProfile nightMode={isNightMode} userid={userid} />;
      case "List": return <CoList fullname={first_name + " " + last_name} nightMode={isNightMode} />;
      case "Grid": return <CoGrid nightMode={isNightMode} userid={userid} />;
      case "Month": return <CoMonth nightMode={isNightMode} userid={userid} />;
      case "Day": return <CoDay nightMode={isNightMode} userid={userid} />;
      default: return null;
    }
  };

  const menuItems = [
    { id: "Map", icon: HiMiniMap, label: "Map" },
    { id: "Day", icon: HiSun, label: "Day" },
    { id: "Month", icon: MdCalendarMonth, label: "Month" },
    { id: "Grid", icon: IoGrid, label: "Grid" },
    { id: "List", icon: CiBoxList, label: "List" },
    { id: "Setting", icon: IoMdSettings, label: "Setting" }
  ];

  const currentColorScheme = isNightMode ? colorSchemes.dark : colorSchemes.light;

  return (
    <div
      className={`
        ${currentColorScheme.background} 
        flex flex-col md:flex-row 
        h-screen w-screen 
        overflow-hidden
      `}
    >
      {/* Mobile Menu Toggle */}
      <div
        className={`
          md:hidden 
          fixed top-0 left-0 right-0 z-50 
          flex justify-between items-center 
          p-4 
          ${isNightMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
        `}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg"
        >
          {isMenuOpen ? <IoMdClose size={24} /> : <RiMenu3Fill size={24} />}
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{first_name} {last_name}</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{first_name?.[0]}{last_name?.[0]}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 
          fixed md:relative 
          top-0 left-0 bottom-0 
          w-64 md:w-1/5 
          z-40 
          transition-transform duration-300
          ${currentColorScheme.sidebar} 
          ${currentColorScheme.text}
          pt-16 md:pt-0
        `}
      >
        <div className="h-full flex flex-col p-5 space-y-4">
          {/* Profile Section */}
          <div className="hidden md:flex items-center space-x-6 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="font-semibold text-xl">{first_name?.[0]}{last_name?.[0]}</span>
              )}
            </div>

            <div>
              <div className="font-bold text-lg text-gray-800">{first_name} {last_name}</div>
              <div className="badge badge-primary text-sm font-medium text-white uppercase mt-1">{role || 'Admin'}</div>
            </div>
          </div>


          {/* Menu Items */}
          <nav className="space-y-2 flex-grow">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`
        w-full p-3 rounded-lg flex items-center transition-all duration-200 ease-in-out
        ${activeComponent === item.id
                    ? `${currentColorScheme.activeItem} transform scale-105`
                    : 'hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white'}
      `}
                onClick={() => {
                  setActiveComponent(item.id);
                  setIsMenuOpen(false);
                }}
              >
                <item.icon className="mr-4 text-lg" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>


          {/* Footer */}



          <footer
            className={`mt-8 p-4 text-center rounded-t-md shadow-md ${isNightMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-100 text-gray-800"
              }`}
          >
            <div className="text-sm">&copy; {new Date().getFullYear()} RSU Booking</div>
            <div className="mt-2 text-xs flex justify-center space-x-4">
              <button
                onClick={() => openModal("Privacy Policy")}
                className={`hover:underline ${isNightMode ? "text-blue-400" : "text-blue-500"
                  }`}
              >
                Privacy Policy
              </button>
              <span className={`${isNightMode ? "text-gray-600" : "text-gray-400"}`}>|</span>
              <button
                onClick={() => openModal("Terms of Service")}
                className={`hover:underline ${isNightMode ? "text-blue-400" : "text-blue-500"
                  }`}
              >
                Terms of Service
              </button>
            </div>
          </footer>


          <div className="mt-auto space-y-4 pb-4">
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`
                  w-full p-3 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out
                  ${isNightMode
                  ? 'bg-gray-700 text-yellow-400 shadow-lg hover:scale-105'
                  : 'bg-gray-100 text-gray-800 shadow-md hover:scale-105'}
              `}
            >
              {isNightMode ? <HiSun className="mr-2 text-xl" /> : <HiMoon className="mr-2 text-xl" />}
              <span className="font-medium">{isNightMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>


        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`
          flex-1 
          pt-16 md:pt-0 
          h-full 
          overflow-hidden
          ${isNightMode ? 'bg-gray-800 text-white' : 'bg-white'}
        `}
      >
        <CSSTransition
          key={activeComponent}
          timeout={300}
          classNames="fade"
        >
          <div className="h-full w-full overflow-auto">
            {renderComponent()}
          </div>


        </CSSTransition>
        {/* Footer */}



      </div>

      {/* Backdrop for Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative
                        transform transition-transform duration-300 ease-out
                        ${isModalOpen ? "scale-100 translate-y-0" : "scale-95 -translate-y-10"}
                      `}
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
          >
            <h2 className="text-lg font-bold mb-4">{modalContent}</h2>
            <div className="text-sm text-gray-600">
              {modalContent === "Privacy Policy" ? (
                <p>
                  This is the Privacy Policy content. You can add detailed
                  information about how user data is collected, used, and
                  protected here.
                </p>
              ) : (
                <p>
                  This is the Terms of Service content. Provide the terms and
                  conditions for using your service here.
                </p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;