import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/page1.css";

import logo from "../../../assets/Front_Page.jpeg";

const Page1 = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/user"); // Page2 route
  };

  return (
    <div className="page-container">
      {/* Logo */}
      <img src={logo} alt="IIT Roorkee Logo" className="logo" />

      {/* Text */}
      <p className="subtitle">Survey based on</p>

      <h1 className="title">
        Assessment of emotional changes caused due to environmental noise exposure
      </h1>

      <p className="warning">
        Please use standard quality headphones for completing the experiment
      </p>

      <p className="warning-hi">
        कृपया सर्वेक्षण पूरा करने के लिए अच्छे हेडफोन का उपयोग करें
      </p>

      {/* Button */}
      <button className="enter-btn" onClick={handleEnter}>
        Enter
      </button>
    </div>
  );
};

export default Page1;
