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
import { IoMdClose } from "react-icons/io";
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
  const navigate = useNavigate();

  // Existing useEffect and fetchUserData methods remain the same...
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("Token not found");
      navigate("/");
      return;
    }

    fetch("https://backend-6ug4.onrender.com/verifyToken", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data?.user?.email) {
          setEmail(data.user.email);
          setRole(data.user.role);
        }
      })
      .catch(error => {
        console.error("Error:", error.message);
        navigate("/");
      });

    fetchUserData();
  }, [navigate, email]);

  const fetchUserData = async () => {
    if (!email) return;

    try {
      const response = await API.get(`/users/email/${email}`);
      if (response.status !== 200) throw new Error('Failed to fetch user data');

      const data = response.data;
      setFirstname(data.first_name);
      setLastname(data.last_name);
      setImg(data.photo);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "Map": return <CoMap nightMode={isNightMode} />;
      case "Profile": return <CoProfile nightMode={isNightMode} useremail={email} />;
      case "List": return <CoList fullname={first_name + " " + last_name} nightMode={isNightMode} />;
      case "Grid": return <CoGrid nightMode={isNightMode} />;
      case "Month": return <CoMonth nightMode={isNightMode} />;
      case "Day": return <CoDay nightMode={isNightMode} />;
      default: return null;
    }
  };

  const menuItems = [
    { id: "Map", icon: HiMiniMap, label: "Map" },
    { id: "Day", icon: HiSun, label: "Day" },
    { id: "Month", icon: MdCalendarMonth, label: "Month" },
    { id: "Grid", icon: IoGrid, label: "Grid" },
    { id: "List", icon: CiBoxList, label: "List" },
    { id: "Profile", icon: CgProfile, label: "Profile" }
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
            {first_name?.[0]}{last_name?.[0]}
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
          <div className="hidden md:flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{first_name?.[0]}{last_name?.[0]}</span>
              )}
            </div>

            <div>
              <div className="font-bold">{first_name} {last_name}</div>
              {/* <div className="text-sm uppercase">{role || 'Admin'}</div> */}
              <div className="badge badge-primary uppercase text-sm">{role || 'Admin'}</div>

            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2 flex-grow">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`
                  w-full p-2 rounded-lg flex items-center
                  ${activeComponent === item.id
                    ? currentColorScheme.activeItem
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
                onClick={() => {
                  setActiveComponent(item.id);
                  setIsMenuOpen(false);
                }}
              >
                <item.icon className="mr-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto space-y-4 pb-4">
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`
                w-full p-2 rounded-lg flex items-center justify-center
                ${isNightMode
                  ? 'bg-gray-700 text-yellow-400'
                  : 'bg-gray-100 text-gray-800'}
              `}
            >
              {isNightMode ? <HiSun className="mr-2" /> : <HiMoon className="mr-2" />}
              {isNightMode ? 'Light Mode' : 'Dark Mode'}
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
          <div className="h-full w-full">
            {renderComponent()}
          </div>
        </CSSTransition>
      </div>

      {/* Backdrop for Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;