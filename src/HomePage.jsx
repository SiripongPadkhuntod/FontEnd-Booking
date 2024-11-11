import React, { useState,useEffect  } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom"; // สำหรับการเปลี่ยนหน้า

// Import file components
import CoMap from "./Component/Map";
import CoProfile from "./Component/Profile";
import CoTest from "./Component/TestModal";

// Import icons
import { HiMiniMap } from "react-icons/hi2";
import { HiMoon, HiSun } from "react-icons/hi";
import { IoGrid } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { CiBoxList } from "react-icons/ci";
import { MdCalendarMonth } from "react-icons/md";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("Map");
  const [isNightMode, setIsNightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const key = localStorage.getItem("authKey"); // ตรวจสอบ key
    if (!key) {
      navigate("/"); // ถ้าไม่มี key ให้กลับไปที่หน้า login
    }
  }, [navigate]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Map":
        return <CoMap nightMode={isNightMode} />;
      case "Profile":
        return <CoProfile nightMode={isNightMode} />;
      case "Day":
        return <CoTest />;
      default:
        return null;
    }
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen w-screen p-5 ${isNightMode ? "bg-gray-800" : "bg-blue-800"}`}>
      <div
        className={`w-full md:w-1/5 flex flex-col items-center p-5 rounded-lg shadow-lg transition-all duration-500 ${
          isNightMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        {/* Profile Section */}
        <div className="flex items-center mb-8 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-2xl">SP</div>
          <div className={`text-sm font-bold text-left ml-2`}>
            Firstname<br />Lastname
          </div>
        </div>
        <hr className={`w-full ${isNightMode ? "border-gray-600" : "border-gray-300"} mb-4`} />

        {/* Toggle Menu Button for Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mb-4 w-full px-4 py-2 rounded-lg transition-all duration-300 text-left bg-gray-200 hover:bg-gray-300 md:hidden"
        >
          {isMenuOpen ? "Hide Menu" : "Show Menu"}
        </button>

        {/* Menu Items with animation */}
        <TransitionGroup className={`w-full mb-5 ${isMenuOpen ? "block" : "hidden md:block"}`}>
          {["Day", "Month", "Grid", "List", "Map", "Profile"].map((item) => (
            <CSSTransition key={item} timeout={300} classNames="menu-fade">
              <button
                className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-300 flex items-center justify-start ${
                  activeComponent === item ? "text-red-600" : isNightMode ? "text-gray-400" : "text-gray-600"
                }`}
                onClick={() => {
                  setActiveComponent(item);
                  setIsMenuOpen(false);
                }}
                style={{
                  backgroundColor: activeComponent === item ? (isNightMode ? "#4a2f2f" : "#ffe5e5") : "transparent",
                }}
              >
                <span className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      activeComponent === item
                        ? isNightMode
                          ? "bg-red-800 border border-red-600"
                          : "bg-red-100 border border-red-600"
                        : ""
                    }`}
                  >
                    {item === "Day" && <HiSun />}
                    {item === "Month" && <MdCalendarMonth />}
                    {item === "Grid" && <IoGrid />}
                    {item === "List" && <CiBoxList />}
                    {item === "Map" && <HiMiniMap />}
                    {item === "Profile" && <CgProfile />}
                  </div>
                  <span className={`ml-2 font-medium ${activeComponent === item ? "text-red-600" : ""}`}>{item}</span>
                </span>
              </button>
            </CSSTransition>
          ))}
        </TransitionGroup>

        {/* Footer with smooth transition */}
        <div className="mt-auto w-full flex flex-col items-center space-y-2">
          <button className={`px-3 py-1 rounded ${isNightMode ? "bg-red-700 text-gray-200" : "bg-red-600 text-white"}`}>
            RSU LAB
          </button>
          <div className={`flex space-x-4 ${isNightMode ? "text-gray-400" : "text-gray-500"}`}>
            <button>User Mode</button>
            <button>Contact</button>
            <button>Term</button>
          </div>
          <div className={`text-xs underline ${isNightMode ? "text-gray-400" : "text-gray-500"}`}>Privacy</div>
        </div>

        {/* Night Mode Toggle Button */}
        <button
          onClick={toggleNightMode}
          className={`mt-4 p-2 rounded-full transition-all duration-300 ${isNightMode ? "bg-yellow-500" : "bg-gray-300"}`}
        >
          {isNightMode ? <HiSun className="text-white" /> : <HiMoon className="text-gray-800" />}
        </button>
      </div>

      {/* Content with animation */}
      <div
        className={`flex-1 ml-0 md:ml-5 rounded-lg flex justify-center items-center shadow-lg transition-all duration-500 ${
          isNightMode ? "bg-gray-600" : "bg-gray-200"
        }`}
      >
        <TransitionGroup>
          <CSSTransition key={activeComponent} timeout={500} classNames="menu-slide">
            <div className="relative w-full h-full">{renderComponent()}</div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default Home;
