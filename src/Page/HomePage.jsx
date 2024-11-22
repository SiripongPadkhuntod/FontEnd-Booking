import React, { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom";

// Import components
import CoMap from "../Component/Map";
import CoProfile from "../Component/Profile";
import CoTest from "../Component/TestModal";
import CoList from "../Component/List";
import CoGrid from "../Component/Grid";
import CoMonth from "../Component/Month";

// Import icons
import { HiMiniMap } from "react-icons/hi2";
import { HiMoon, HiSun } from "react-icons/hi";
import { IoGrid } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { CiBoxList } from "react-icons/ci";
import { MdCalendarMonth } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { RiMenu3Fill } from "react-icons/ri";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("Map");
  const [isNightMode, setIsNightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [first_name, setFirstname] = useState("System");
  const [last_name, setLastname] = useState("Admin");
  const [img, setImg] = useState("");
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("Token not found");
      navigate("/");
      return;
    }

    fetch("http://localhost:8080/verifyToken", {
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
          setRole(data.role);
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
      const response = await fetch(`http://localhost:8080/users/email/${email}`);
      if (!response.ok) throw new Error('Failed to fetch user data');

      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const data = await response.json();
        setFirstname(data.first_name);
        setLastname(data.last_name);
        setImg(data.photo);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "Map": return <CoMap nightMode={isNightMode} />;
      case "Profile": return <CoProfile nightMode={isNightMode} useremail={email} />;
      case "Day": return <CoTest />;
      case "List": return <CoList />;
      case "Grid": return <CoGrid />;
      case "Month": return <CoMonth />;
      default: return null;
    }
  };

  // Menu items configuration
  const menuItems = [
    { id: "Map", icon: HiMiniMap, label: "Map" },
    { id: "Day", icon: HiSun, label: "Day" },
    { id: "Month", icon: MdCalendarMonth, label: "Month" },
    { id: "Grid", icon: IoGrid, label: "Grid" },
    { id: "List", icon: CiBoxList, label: "List" },
    { id: "Profile", icon: CgProfile, label: "Profile" }
  ];

  return (
    <div className={`h-screen w-screen ${isNightMode ? "bg-gray-800" : "bg-blue-800"}`}>
      {/* Mobile Header */}
      <div className="md:hidden w-full px-4 py-3 flex items-center justify-between bg-white shadow-lg">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMenuOpen ? <IoMdClose size={24} /> : <RiMenu3Fill size={24} />}
        </button>

        <div className="flex items-center space-x-3">
          <div className="text-sm font-bold">{first_name} {last_name}  </div>
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-sm">
            {first_name?.[0]}{last_name?.[0]}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen md:p-10">
        {/* Sidebar */}
        <div className={`
          fixed md:relative w-full md:w-1/5 h-full z-50 transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isNightMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}
        `}>
          <div className="p-5">
            {/* Desktop Profile Section - Hidden on Mobile */}
            <div className="hidden md:flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-2xl overflow-hidden">
                {img ? (
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100  rounded-full ring ring-offset-2">
                      <img
                        src={img}
                        alt="profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; // ป้องกัน loop error
                          e.target.style.display = "none"; // ซ่อน <img>
                          e.target.parentNode.textContent = `${first_name?.[0] || ''}${last_name?.[0] || ''}`; // แสดงตัวย่อ
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  `${first_name?.[0] || ''}${last_name?.[0] || ''}`
                )}
              </div>
              <div className="text-sm font-bold text-left ml-2">
                {first_name}<br />{last_name}
              </div>
            </div>

            <hr className={`w-full ${isNightMode ? "border-gray-600" : "border-gray-300"} mb-4 hidden md:block`} />

            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-300 flex items-center
                    ${activeComponent === item.id ?
                      `${isNightMode ? "bg-red-800 text-red-600" : "bg-red-100 text-red-600"}` :
                      `${isNightMode ? "text-gray-400" : "text-gray-600"}`
                    }`
                  }
                  onClick={() => {
                    setActiveComponent(item.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center
                    ${activeComponent === item.id ? "border border-red-600" : ""}`
                  }>
                    <item.icon className={activeComponent === item.id ? "text-red-600" : ""} />
                  </div>
                  <span className={`ml-2 font-medium ${activeComponent === item.id ? "text-red-600" : ""}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer - Hidden on Mobile */}
            <div className={`mt-auto hidden md:flex flex-col items-center space-y-4 pt-8 
              ${isNightMode ? "text-gray-400" : "text-gray-500"}` 
            }>
              <div className="flex space-x-4 text-xs">
                <button className={`px-3 py-1 rounded ${isNightMode ? "bg-red-700 text-gray-200" : "bg-red-600 text-white"}`}>
                  RSU LAB
                </button>
                <button>User Mode</button>
                <button>Contact</button>
                <button>Term</button>
              </div>



              {/* <div class="inline-flex rounded-md shadow-sm">
                <a href="#" aria-current="page" class="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                RSU LAB
                </a>
                <a href="#" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                User Mode
                </a>
                <a href="#" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                Contact
                </a>
                <a href="#" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                Term
                </a>

              </div> */}

              <div className="text-xs underline">Privacy</div>

              {/* Night Mode Toggle */}
              <button
                onClick={() => setIsNightMode(!isNightMode)}
                className={`p-2 rounded-full transition-all duration-300 ${isNightMode ? "bg-yellow-500" : "bg-gray-300"}`}
              >
                {isNightMode ? <HiSun className="text-white" /> : <HiMoon className="text-gray-800" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 md:ml-5 h-full rounded-lg transition-all duration-500 ${isNightMode ? "bg-white" : "bg-white"}`}>
          <CSSTransition key={activeComponent} timeout={500} classNames="menu-slide">
            <div className="relative w-full h-full">
              {renderComponent()}
            </div>
          </CSSTransition>
        </div>

        {/* Mobile Night Mode Toggle - Fixed at bottom right */}
        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className={`md:hidden fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-50 transition-all duration-300 
            ${isNightMode ? "bg-yellow-500" : "bg-gray-300"}`
          }>
          {isNightMode ? <HiSun className="text-white" /> : <HiMoon className="text-gray-800" />}
        </button>
      </div>
    </div>
  );
};

export default Home;