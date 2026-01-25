import React from "react";
import "../style/page3.css";
import { useNavigate } from "react-router-dom";

const Page3 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/sensitivity");  // questionnaire page
    console.log("Go to sensitivity questions");
  };

  return (
    <div className="page3-container">
      <h1 className="page3-title">Sensitivity Analysis</h1>

      <p className="page3-subtitle">
        Please reply to the following question <br />
        as per your normal daily experiences
      </p>

      <button className="next-btn" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default Page3;
