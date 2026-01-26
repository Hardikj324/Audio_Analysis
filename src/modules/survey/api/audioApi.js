import {BASE_URL} from "./url"

export const getAudios = async () => {
  const res = await fetch(`${BASE_URL}/audios/`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  });
  
  if (!res.ok) throw new Error("Failed to fetch audios");
  return res.json();
};

export const saveAudioEvaluation = async (payload) => {
  const res = await fetch(`${BASE_URL}/evaluations/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to save evaluation");
  return res.json();
};