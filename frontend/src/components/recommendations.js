import React, { useEffect, useState } from "react";
import { getRecommendations } from "../api";
import { Link } from "react-router-dom";

const Recommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getRecommendations(userId);
        setRecommendations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return <p>Loading recommendations...</p>;
  }

  return (
    <div>
      <h2>People Like You</h2>
      <ul>
        {recommendations.map((user) => (
          <li key={user.id}>
            {user.user.username} ({user.subjects}, {user.study_time_preference},{" "}
            {user.learning_style})
          </li>
        ))}
      </ul>
      Don't see anyone that matches you?{" "}
      <Link to="/profile">Update your profile</Link> to get better
      recommendations.
    </div>
  );
};

export default Recommendations;
