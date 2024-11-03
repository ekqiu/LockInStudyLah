import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import config from "../config";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const location = useLocation();

  useEffect(() => {
    if (
      token &&
      location.pathname !== "/register" &&
      location.pathname !== "/login"
    ) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${config.apiUrl}/user/`);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      };
      fetchUser();
    }
  }, [token, location.pathname]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${config.apiUrl}/login/`, {
        username,
        password,
      });
      setToken(response.data.access);
      localStorage.setItem("token", response.data.access);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;
      const userResponse = await axios.get(`${config.apiUrl}/user/`);
      setUser(userResponse.data);
    } catch (error) {
      throw new Error("Invalid username or password");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
