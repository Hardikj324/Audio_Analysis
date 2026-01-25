export const saveUserProfile = (userProfile) => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
  };
  
  export const getUserProfile = () => {
    const profile = localStorage.getItem("userProfile");
    try {
      return profile ? JSON.parse(profile) : null;
    } catch (e) {
      console.error("Error parsing user profile", e);
      return null;
    }
  };
  
  export const clearUserProfile = () => {
    localStorage.removeItem("userProfile");
  };