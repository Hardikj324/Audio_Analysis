import React, { useState } from "react";
import "../style/page2.css";
import { createUser } from "../api/page2Api";
import { useNavigate } from "react-router-dom";

const Page2 = () => {
  const [userId, setUserId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleNext = async () => {
    if (!userId || !age || !gender) {
      alert("Please fill all fields");
      return;
    }
    const numericAge = parseInt(age);
    const payload = {
      user_id: userId,
      age: numericAge,
      gender,
    };

    if(isNaN(numericAge || numericAge <= 0)){
      alert("Age must be a positive number"); 
      return;
    }

    try {
      setLoading(true);

      const data = await createUser(payload);

      console.log("User saved:", data);

      localStorage.setItem("userProfile", JSON.stringify(data));

      navigate("/sensitivity-intro");

      alert("User saved successfully");

    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page2-container">
      <label className="label">ID</label>
      <input
        className="input"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="ID"
      />

      <label className="label">age</label>
      <input
        type="number"
        className="input"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="age"
        onKeyDown={(e)=>{
          if(e.key==='-' || e.key === "e") e.preventDefault();
        }}
        min={1}
      />

      <label className="label">gender</label>
      <div className="gender-container">
        <button
          className={`gender-btn ${gender === "male" ? "active" : ""}`}
          onClick={() => setGender("male")}
        >
          MALE
        </button>

        <button
          className={`gender-btn ${gender === "female" ? "active" : ""}`}
          onClick={() => setGender("female")}
        >
          FEMALE
        </button>
      </div>

      <button className="next-btn" onClick={handleNext} disabled={loading}>
        {loading ? "Saving..." : "Next"}
      </button>
    </div>
  );
};

export default Page2;
