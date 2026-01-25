// const BASE_URL = "https://alaine-nonpursuant-adhesively.ngrok-free.dev/api";
const BASE_URL = "http://localhost:8000/api";

/**
 * Fetch all noise sensitivity questions
 */
export const getQuestions = async () => {
  const response = await fetch(`${BASE_URL}/noise-questions/`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
};

/**
 * Save a single response
 */
export const saveQuestionResponse = async (payload) => {
  console.log("Payload for the saveQuestion is :",payload)
  const response = await fetch(`${BASE_URL}/noise-responses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save response");
  }

  return response.json();
};