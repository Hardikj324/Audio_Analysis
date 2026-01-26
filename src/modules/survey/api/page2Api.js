const BASE_URL = "https://alaine-nonpursuant-adhesively.ngrok-free.dev/api";
// const BASE_URL = "http://localhost:8000/api";

export const createUser = async (payload) => {
  const response = await fetch(`${BASE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
};
