import React, { useEffect, useState } from "react";
import { getUserProfiles } from "./api";

function App() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getUserProfiles()
      .then((response) => {
        console.log("API response:", response); // Add this line for debugging
        setProfiles(response.data);
      })
      .catch((error) => {
        console.error("API call failed:", error); // Add this line for debugging
      });
  }, []);

  return (
    <div>
      <h1>User Profiles</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>{profile.user}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
