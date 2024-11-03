import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import "./navbar.css"; // Import the CSS file for styling
import "./index.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          LockInStudyLah
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/main" className="navbar-link">
                Main
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>

              <button onClick={logout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
