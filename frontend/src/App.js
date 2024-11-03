import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/register.js";
import Login from "./components/login.js";
import Profile from "./components/profile.js";
import MainPage from "./components/mainPage.js";
import ProtectedRoute from "./components/protectedRoute.js";
import { AuthProvider } from "./context/authcontext.js";
import Home from "./components/home.js";
import Navbar from "./components/navbar.js";
import Study from "./components/study.js";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/main" element={<ProtectedRoute element={MainPage} />} />
        <Route path="/study" element={<ProtectedRoute element={Study} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
