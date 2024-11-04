// src/Home.js
import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group"; // นำเข้า Transition Group
import "./Home.css";
import CoMap from "./Component/Map";
import CoProfile from "./Component/Profile";
import CoTest from "./Component/TestModal";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("Map");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Map":
        return <CoMap />;
      case "Profile":
        return <CoProfile />;
      case "Day":
        return <CoTest />;
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="user-profile">
          <div className="user-icon">SP</div>
          <div className="user-name">
            Firstname<br />Lastname
          </div>
        </div>

        <div className="join join-vertical lg:join-horizontal menu">
          {["Day", "Month", "Grid", "List", "Map", "Profile"].map((item) => (
            <button
              key={item}
              className={`btn join-item ${activeComponent === item ? "active" : ""}`}
              onClick={() => setActiveComponent(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="footer">
          <div>RSU LAB</div>
          <div>User Mode</div>
          <div>Contact</div>
          <div>Term</div>
        </div>
      </div>

      <div className="main-content">
        {/* <TransitionGroup>
          <CSSTransition
            key={activeComponent}
            timeout={300} // เวลาของเอฟเฟกต์ (300 ms)
            classNames="fade" // ชื่อของคลาส CSS ที่จะใช้
          > */}
            <div className="component-wrapper">
              {renderComponent()}
            </div>
          {/* </CSSTransition>
        </TransitionGroup> */}
      </div>
    </div>
  );
};

export default Home;
