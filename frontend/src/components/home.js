import React from "react";
import { Link } from "react-router-dom";
import "./home.css"; // Import the CSS file for styling
import "./index.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to LockInStudyLah!</h1>
      <p>Your collaborative learning platform.</p>
      <div className="home-buttons">
        <Link to="/register" className="home-button">
          Register
        </Link>
        <Link to="/login" className="home-button">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
