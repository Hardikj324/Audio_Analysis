import React, { useEffect, useRef, useState } from "react";
import { getAudios, saveAudioEvaluation } from "../api/audioApi";
import "../style/page6.css";
import { useNavigate } from "react-router-dom";

const dominanceLabels = [
  "Not at all",
  "A little",
  "Moderately",
  "A lot",
  "Dominates completely",
];

// Slider definitions (matches backend fields)
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

// Value → text mapping
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

  const user = JSON.parse(localStorage.getItem("userProfile"));

  const [audios, setAudios] = useState([]);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    if (!user) {
      navigate("/user");
      return;
    }
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    const data = await getAudios();
    setAudios(data);
  };

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
    console.log("Audio object:", audios[index]);
    console.log("Audio file URL:", audios[index]?.file);
    console.log(audio);

    const payload = {
      audio: audio.id,
      user: user.id,
      ...ratings,
      ...dominance,
    };
    console.log(audio);
    try {
      await saveAudioEvaluation(payload);

      if (index < audios.length - 1) {
        setIndex(index + 1);
        resetForm();
      } else {
        navigate("/thank-you");
      }
    } catch {
      alert("Failed to save evaluation");
    }
  };

  if (!audios.length) return <p>Loading...</p>;

  return (
    <div className="page6-container">
      {/* Header */}
      <div className="page6-header">
        <span>ID: {user.user_id}</span>
        <span>Gender: {user.gender.toUpperCase()}</span>
        <span>Age: {user.age}</span>
      </div>

      <h3>AUDIO {index + 1}</h3>

      <audio
        ref={audioRef}
        controls
        src={audios[index].file}
        className="audio-player"
      />

      {/* Sliders */}
      {sliderItems.map(({ key, label }) => (
        <div className="slider-group" key={key}>
          {/* Dynamic heading (like image) */}
          <h4 className="slider-heading">
            {label} — <span>{getAgreementLabel(ratings[key])}</span>
          </h4>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={ratings[key]}
            onChange={(e) =>
              handleSliderChange(key, Number(e.target.value))
            }
          />
          <span className="slider-value">{ratings[key]}</span>
        </div>
      ))}

      {/* Dominance matrix */}
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
        <button className="back-btn" onClick={() => setIndex(index - 1)}>
          Back
        </button>
        <button className="next-btn" onClick={handleSaveAndNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Page6;
