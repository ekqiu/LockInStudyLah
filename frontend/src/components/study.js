import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authcontext";
import axios from "axios";
import config from "../config";

const StudySessionTracker = () => {
  const { user } = useContext(AuthContext);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(
    user ? user.total_study_time : 0
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isTracking) {
      timer = setInterval(() => {
        const currentTime = new Date();
        setElapsedTime(Math.floor((currentTime - startTime) / 1000)); // Calculate elapsed time in seconds
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTracking, startTime]);

  const startSession = () => {
    setIsTracking(true);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const stopSession = async () => {
    setIsTracking(false);
    const endTime = new Date();
    const sessionDuration = Math.floor((endTime - startTime) / 1000); // Convert milliseconds to seconds
    console.log(sessionDuration);
    const newTotalSeconds = totalSeconds + sessionDuration;
    setTotalSeconds(newTotalSeconds);

    try {
      await axios.put(`${config.apiUrl}/user/`, {
        total_study_time: newTotalSeconds,
      });
    } catch (error) {
      console.error("Failed to update total time", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container">
      <h2>Study Session Tracker</h2>
      <p>Total Minutes: {(totalSeconds / 60).toFixed(2)}</p>
      <p>Elapsed Time: {formatTime(elapsedTime)}</p>
      {isTracking ? (
        <button onClick={stopSession}>Stop Session</button>
      ) : (
        <button onClick={startSession}>Start Session</button>
      )}
    </div>
  );
};

export default StudySessionTracker;
