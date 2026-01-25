const BASE_URL = "https://alaine-nonpursuant-adhesively.ngrok-free.dev/api/";


export const getAudios = async () => {
  const res = await fetch(`${BASE_URL}/audios/`);
  if (!res.ok) throw new Error("Failed to fetch audios");
  return res.json();
};

export const saveAudioEvaluation = async (payload) => {
  const res = await fetch(`${BASE_URL}/evaluations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to save evaluation");
  return res.json();
};
