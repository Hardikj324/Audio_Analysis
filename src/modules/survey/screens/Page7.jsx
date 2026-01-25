import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/page7.css";

const Page7 = () => {
  const navigate = useNavigate();

  const finalData =
    localStorage.getItem("finalCsvData") || "No data available";

  const handleCopy = () => {
    navigator.clipboard.writeText(finalData);
    alert("Copied to clipboard");
  };

  const handleRepeat = () => {
    localStorage.clear();
    navigate("/"); // Go back to Page1 safely
  };

  return (
    <div className="page7-container">
      <div className="page7-emoji">😊</div>

      <h1 className="page7-title">
        Thank you for submitting your response.
      </h1>

      <p className="page7-info">
        For further details regarding this survey please contact:
        <br />
        <strong>
          Manish Manohare, PhD Scholar, Department of Architecture and
          Planning, IIT Roorkee.
        </strong>
        <br />
        +91 7743877796&nbsp;
        <a href="mailto:mmanish@ar.iitr.ac.in">
          mmanish@ar.iitr.ac.in
        </a>
      </p>

      <p className="page7-guided">
        Guided by:
        <br />
        Prof. E. Rajasekar (Dept. of Architecture and Planning, IIT Roorkee)
        <br />
        Prof. M. Parida (Dept. of Civil Engineering, IIT Roorkee)
      </p>

      <p className="page7-success">
        Upload your data successfully
      </p>

      <div className="page7-data-box">
        <textarea
          readOnly
          value={finalData}
          className="page7-textarea"
        />
        <button className="copy-btn" onClick={handleCopy}>
          Copy
        </button>
      </div>

      <button className="repeat-btn" onClick={handleRepeat}>
        Repeat
      </button>
    </div>
  );
};

export default Page7;
