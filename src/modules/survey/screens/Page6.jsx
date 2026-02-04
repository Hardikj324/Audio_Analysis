import React, { useContext , useEffect, useRef, useState } from "react";
import { getAudios, saveAudioEvaluation } from "../api/audioApi";
import { getUserProfile } from "../utils/storage";
import "../style/page6.css";
import { useNavigate } from "react-router-dom";
import {BASE_URL} from "../api/url"
import translations from "../i18n/translations.json";

const dominanceLabelKeys = [
  "not_at_all",
  "a_little",
  "moderately",
  "a_lot",
  "dominates",
];

const sliderItems = [
  { key: "pleasantness", labelKey: "pleasant" },
  { key: "chaotic", labelKey: "chaotic" },
  { key: "vibrant", labelKey: "vibrant" },
  { key: "uneventful", labelKey: "uneventful" },
  { key: "calm", labelKey: "calm" },
  { key: "annoyance", labelKey: "annoying" },
  { key: "eventfulness", labelKey: "eventful" },
  { key: "monotonous", labelKey: "monotonous" },
];

const Page6 = () => {
  const availableLanguages = Object.keys(translations);
  const [lang, setLang] = useState(availableLanguages[0]);
  const t = (key) => translations[lang]?.[key] || key;

  const audioRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null); 
  const [audios, setAudios] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [audioError, setAudioError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

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

  // Get user profile
  useEffect(() => {
    const userProfile = getUserProfile();
    if (!userProfile) {
      navigate("/user");
      return;
    }
    setUser(userProfile);
  }, [navigate]);

  // Fetch audios
  useEffect(() => {
    if (!user) return;

    const fetchAudios = async () => {
      try {
        const data = await getAudios();
        console.log("Fetched audios:", data);
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

  // Load audio using Blob URL method (more reliable for CORS)
  useEffect(() => {
    if (!audioRef.current || !audios[index]) return;

    const audio = audioRef.current;
    const currentAudio = audios[index];
    
    // TRY BOTH URLs - stream endpoint and original file
    const streamUrl = `${BASE_URL}/stream-audio/${currentAudio.id}/`;
    const directUrl = currentAudio.file;
    
    console.log("🎵 Audio URLs:", {
      index,
      id: currentAudio.id,
      title: currentAudio.title,
      streamUrl: streamUrl,
      directUrl: directUrl
    });
    
    // TEMPORARY: Try direct URL first to verify audio files work
    const audioUrl = streamUrl; // Change to directUrl if stream fails

    setAudioError(null);
    setAudioLoading(true);

    // Fetch audio as blob, then create object URL
    fetch(audioUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    .then(response => {
      console.log("🎵 Response status:", response.status);
      console.log("🎵 Response headers:", {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
        acceptRanges: response.headers.get('accept-ranges')
      });

      // CHECK: Is server returning audio or error page?
      const contentType = response.headers.get('content-type');
      console.log("🎵 Content-Type received:", contentType);
      
      if (!contentType || !contentType.includes('audio')) {
        console.error("❌ Server didn't return audio! Content-Type:", contentType);
        // Read response as text to see what Django sent
        return response.text().then(text => {
          console.error("❌ Response body (first 500 chars):", text.substring(0, 500));
          throw new Error(`Expected audio/*, got ${contentType || 'no content-type'}. Check Django logs.`);
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.blob();
    })
    .then(blob => {
      console.log("🎵 Blob received:", blob.size, "bytes, type:", blob.type);
      
      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);
      console.log("🎵 Created blob URL:", blobUrl);
      
      // Set audio source to blob URL
      audio.src = blobUrl;
      audio.load();
      
      setAudioLoading(false);
      
      // Cleanup: revoke blob URL when component unmounts or index changes
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    })
    .catch(error => {
      console.error("🎵 Failed to load audio:", error);
      setAudioError(`Failed to load audio: ${error.message}`);
      setAudioLoading(false);
    });

    // Error handler for audio element
    const handleError = (e) => {
      console.error("🎵 Audio element error:", {
        error: e,
        audioError: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
      
      let errorMsg = "Failed to play audio";
      if (audio.error) {
        switch (audio.error.code) {
          case 1: errorMsg = "Audio loading aborted"; break;
          case 2: errorMsg = "Network error"; break;
          case 3: errorMsg = "Audio decoding failed"; break;
          case 4: errorMsg = "Audio format not supported"; break;
          default: errorMsg = "Unknown audio error";
        }
      }
      setAudioError(errorMsg);
      setAudioLoading(false);
    };

    const handleCanPlay = () => {
      console.log("🎵 Audio ready to play");
      setAudioError(null);
      setAudioLoading(false);
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
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

  if (loading) return <div className="page6-container"><p>Loading...</p></div>;
  if (!user) return <div className="page6-container"><p>Loading user...</p></div>;
  if (!audios.length) return <div className="page6-container"><p>No audios available</p></div>;

  

  return (
    <div className="page6-container">
      <div className="page6-header">
        <span>ID: {user.user_id || user.id}</span>
        <span>Gender: {user.gender?.toUpperCase()}</span>
        <span>Age: {user.age}</span>
      </div>

      <div style={{ marginBottom: "12px" }}>
      {availableLanguages.map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            disabled={lang === code}
          >
            {translations[code].language_name}
          </button>
        ))}
      </div>

      <h3>AUDIO {index + 1} of {audios.length}</h3>
    
      {audioLoading && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e3f2fd',
          marginBottom: '10px',
          borderRadius: '4px'
        }}>
          Loading audio...
        </div>
      )}

      <audio
        ref={audioRef}
        controls
        preload="metadata"
        className="audio-player"
      />

      {audioError && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          border: '1px solid red',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: '#ffe6e6'
        }}>
          <strong>⚠ Audio Error:</strong> {audioError}
          <br />
          <small>Check console for details. Try refreshing the page.</small>
        </div>
      )}

      {sliderItems.map(({ key, labelKey }) => (
        <div className="slider-group" key={key}>
          <h4 className="slider-heading">
            {t(labelKey)} : <span className="slider-value">{ratings[key]}</span>
          </h4>
          <div className="slider-row">
            <span className="slider-end">0</span>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={ratings[key]}
              onChange={(e) => handleSliderChange(key, Number(e.target.value))}
              className="scale-slider"
            />

            <span className="slider-end">100</span>
          </div>
          <div className="scale-labels">
            <span>{t("Strongly agree")}</span>
            <span>{t("Somewhat agree")}</span>
            <span>{t("Neither agree nor disagree")}</span>
            <span>{t("Somewhat disagree")}</span>
            <span>{t("Strongly disagree")}</span>
          </div>
        </div>
      ))}

      <table className="dominance-table">
        <thead>
          <tr>
            <th></th>
            {dominanceLabelKeys.map((l) => (
              <th key={l}>{t(l)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["traffic_noise", t("traffic_noise")],
            ["other_noise", t("other_noise")],
            ["human_sounds", t("human_sounds")],
            ["natural_sounds", t("natural_sounds")],
          ].map(([key, label]) => (
            <tr key={key}>
              <td>{label}</td>
              {dominanceLabelKeys.map((_, i) => (
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