import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../App.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <>&#10005;</> : <>&#9776;</>}
        </button>
        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          {user ? (
            <>
              <Link to="/" 
                className="nav-links" 
                onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link
                to="/manage"
                className="nav-links"
                onClick={() => setIsOpen(false)}
              >
                Manage Posts
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="nav-links"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" 
                className="nav-links" 
                onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link
                to="/login"
                className="nav-links"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-links"
                onClick={() => setIsOpen(false)}
              >
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
