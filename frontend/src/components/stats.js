import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authcontext";
import axios from "axios";
import config from "../config";

const StudyStats = () => {
  const { user } = useContext(AuthContext);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    const fetchTotalMinutes = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/user/`);
        setTotalMinutes(response.data.total_study_time);
      } catch (error) {
        console.error("Failed to fetch total study time", error);
      }
    };

    if (user) {
      fetchTotalMinutes();
    }
  }, [user]);

  return (
    <div>
      <h2>Study Stats</h2>
      <div className="row">
        <div className="stats">
          <p className="heading">Total Minutes Spent Studying:</p>
          <p className="data">{(totalMinutes / 60).toFixed(2)}</p>
        </div>
        <div className="stats">
          <p className="heading">Total Hours Spent Studying:</p>
          <p className="data">{(totalMinutes / 60 / 60).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default StudyStats;
