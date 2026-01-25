import React from "react";
import "../style/page5.css";
import { useNavigate } from "react-router-dom";


const Page5 = ()=>{
    const navigate = useNavigate();
    const handleNext = () => {
        navigate("/perception"); 
        console.log("Go to audio perception task");
      };

      return(
        <div className="page5-container">
            <h1 className="page5-title">Perception study</h1>
            <ul className="page5-list">
                <li>Play and listen to the audio file</li>
                <li>Rate the audio in terms of eventfulness and pleasantness</li>
                <li>Observe and mark the dominant sound you have noticed</li>
            </ul>

            <button className="next-btn" onClick={handleNext}>
                Next
            </button>
        </div>
      )
}

export default Page5;