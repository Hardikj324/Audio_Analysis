import React, { useEffect, useRef, useState } from "react";
import { getAudios, saveAudioEvaluation } from "../api/audioApi";
import { getUserProfile } from "../utils/storage"; // ← ADD THIS IMPORT
import "../style/page6.css";
import { useNavigate } from "react-router-dom";

const dominanceLabels = [
  "Not at all",
  "A little",
  "Moderately",
  "A lot",
  "Dominates completely",
];

const sliderItems = [
  { key: "pleasantness", label: "Pleasant" },
  { key: "chaotic", label: "Chaotic" },
  { key: "vibrant", label: "Vibrant" },
  { key: "uneventful", label: "Uneventful" },
  { key: "calm", label: "Calm" },
  { key: "annoyance", label: "Annoying" },
  { key: "eventfulness", label: "Eventful" },
  { key: "monotonous", label: "Monotonous" },
];

const getAgreementLabel = (value) => {
  if (value <= 12) return "Strongly agree";
  if (value <= 37) return "Somewhat agree";
  if (value <= 62) return "Neither agree nor disagree";
  if (value <= 87) return "Somewhat disagree";
  return "Strongly disagree";
};

const Page6 = () => {
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // ← ADD THIS
  const [audios, setAudios] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true); // ← ADD THIS

  const [ratings, setRatings] = useState({
    pleasantness: 50,
    chaotic: 50,
    vibrant: 50,
    uneventful: 50,
    calm: 50,
    annoyance: 50,
    eventfulness: 50,
    monotonous: 50,
  });

  const [dominance, setDominance] = useState({
    traffic_noise: 0,
    other_noise: 0,
    human_sounds: 0,
    natural_sounds: 0,
  });

  // First useEffect: Get user (runs once)
  useEffect(() => {
    const userProfile = getUserProfile();
    if (!userProfile) {
      navigate("/user");
      return;
    }
    setUser(userProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Second useEffect: Fetch audios when user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchAudios = async () => {
      try {
        const data = await getAudios();
        setAudios(data);
      } catch (error) {
        console.error("Failed to fetch audios:", error);
        alert("Failed to load audios");
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [user]);

  // Reset audio when index changes
  useEffect(() => {
    if (audioRef.current && audios[index]) {
      audioRef.current.load();
    }
  }, [index, audios]);

  const handleSliderChange = (key, value) => {
    setRatings({ ...ratings, [key]: value });
  };

  const handleDominanceChange = (key, value) => {
    setDominance({ ...dominance, [key]: value });
  };

  const resetForm = () => {
    setRatings({
      pleasantness: 50,
      chaotic: 50,
      vibrant: 50,
      uneventful: 50,
      calm: 50,
      annoyance: 50,
      eventfulness: 50,
      monotonous: 50,
    });
    setDominance({
      traffic_noise: 0,
      other_noise: 0,
      human_sounds: 0,
      natural_sounds: 0,
    });
  };

  const handleSaveAndNext = async () => {
    const audio = audios[index];

    const payload = {
      audio: audio.id,
      user: user.id,
      ...ratings,
      ...dominance,
    };

    try {
      await saveAudioEvaluation(payload);

      if (index < audios.length - 1) {
        setIndex(index + 1);
        resetForm();
      } else {
        navigate("/thank-you");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save evaluation");
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Loading user...</p>;
  if (!audios.length) return <p>No audios available</p>;

  return (
    <div className="page6-container">
      <div className="page6-header">
        <span>ID: {user.user_id || user.id}</span>
        <span>Gender: {user.gender?.toUpperCase()}</span>
        <span>Age: {user.age}</span>
      </div>

      <h3>AUDIO {index + 1} of {audios.length}</h3>

      <audio
        ref={audioRef}
        controls
        crossOrigin="anonymous"
        className="audio-player"
      >
        <source src={audios[index].file} type="audio/mpeg" />
        <source src={audios[index].file} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {sliderItems.map(({ key, label }) => (
        <div className="slider-group" key={key}>
          <h4 className="slider-heading">
            {label} — <span>{getAgreementLabel(ratings[key])}</span>
          </h4>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={ratings[key]}
            onChange={(e) => handleSliderChange(key, Number(e.target.value))}
          />
          <span className="slider-value">{ratings[key]}</span>
        </div>
      ))}

      <table className="dominance-table">
        <thead>
          <tr>
            <th></th>
            {dominanceLabels.map((l) => (
              <th key={l}>{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["traffic_noise", "Traffic noise"],
            ["other_noise", "Other noise"],
            ["human_sounds", "Human sounds"],
            ["natural_sounds", "Natural sounds"],
          ].map(([key, label]) => (
            <tr key={key}>
              <td>{label}</td>
              {dominanceLabels.map((_, i) => (
                <td key={i}>
                  <input
                    type="radio"
                    name={key}
                    checked={dominance[key] === i}
                    onChange={() => handleDominanceChange(key, i)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="page6-footer">
        <button 
          className="back-btn" 
          onClick={handleBack}
          disabled={index === 0}
        >
          Back
        </button>
        <button className="next-btn" onClick={handleSaveAndNext}>
          {index < audios.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default Page6;