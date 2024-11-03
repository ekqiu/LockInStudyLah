import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import "./index.css";
import Recommendations from "./recommendations";
import { Link } from "react-router-dom";
import StudyStats from "./stats";

const MainPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user.user.username}!</h1>
      <StudyStats />
      <h2>Quick Access</h2>
      <div className="row">
        <div className="fastAccess">
          <Link to="/profile">View Profile</Link>
        </div>
        <div className="fastAccess">
          <Link to="/study">Start Study Session</Link>
        </div>
      </div>
      <Recommendations userId={user.user.id} />
    </div>
  );
};

export default MainPage;
