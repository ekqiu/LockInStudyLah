import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import "./index.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [subjects, setSubjects] = useState("");
  const [studyTimePreference, setStudyTimePreference] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/user/`);
        console.log(response);
        setProfile(response.data);
        setSubjects(response.data.subjects);
        setStudyTimePreference(response.data.study_time_preference);
        setLearningStyle(response.data.learning_style);
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`${config.apiUrl}/user/`, {
        subjects,
        study_time_preference: studyTimePreference,
        learning_style: learningStyle,
      });

      setProfile(response.data);
      setSubjects(response.data.subjects);
      setStudyTimePreference(response.data.study_time_preference);
      setLearningStyle(response.data.learning_style);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h2>Your Profile</h2>
      {isEditing ? (
        <div>
          <div>
            <label>Subjects:</label>
            <select
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
            >
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Literature">Literature</option>
              <option value="Art">Art</option>
            </select>
          </div>
          <div>
            <label>Preferred Study Time:</label>
            <select
              value={studyTimePreference}
              onChange={(e) => setStudyTimePreference(e.target.value)}
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div>
            <label>Learning Style:</label>
            <select
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
            >
              <option value="Visual">Visual</option>
              <option value="Auditory">Auditory</option>
              <option value="Reading/Writing">Reading/Writing</option>
              <option value="Kinesthetic">Kinesthetic</option>
            </select>
          </div>
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div>
          <p>Your Subjects: {profile.subjects}</p>
          <p>Your Preferred Study Time: {profile.study_time_preference}</p>
          <p>Your Learning Style: {profile.learning_style}</p>
          <button onClick={handleEditClick}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
