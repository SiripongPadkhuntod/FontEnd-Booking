// src/Component/Skeleton.js
import React from "react";
import "./Skeleton.css"; // นำเข้า CSS

const Skeleton = () => (
  <div className="skeleton">
    <div className="skeleton-circle"></div>
    <div className="skeleton-line"></div>
    <div className="skeleton-line"></div>
  </div>
);

export default Skeleton;
