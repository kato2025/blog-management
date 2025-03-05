import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../components/styles/Welcome.css"; // Import the login.css stylesheet/

const Welcome = () => {
  const { user } = useContext(AuthContext);
  const username = user ? user.email.split('@')[0] : null;

  return (
    <div className="welcome">
    <img className="applogo" src="namuenetecLogo.png" alt="App logo" />
    
    <div className="welcome-wrapper">
      {/* Left-side image (hidden on mobile) */}
      <div className="image-section">
        <img src="blogpic.jpg" alt="People discussing" />
      </div>

      {/* Right-side content */}
      <div className="content-section">
        <h1 className="headline">Tech Posts</h1>
        <p className="intro-text">
        Step into your tech blog management hub, a streamlined platform where you create, edit, and schedule content that illuminates innovation. Whether you're here to craft compelling posts or refine your editorial strategy, our intuitive tools empower you to manage every step of the process. Embrace a new era of content control and let your tech insights drive the conversation!
        </p>

        {/* If not logged in, encourage users to join */}
        {!user && (
          <Link to="/login">
            <button className="start-button">Manage Posts</button>
          </Link>
        )}

        {/* Optionally display a special message for logged-in users */}
        {user && (
          <div className="user-content">
            <p>Welcome back, {username}! Your next great post awaits.</p>
          </div>
        )}
      </div>
    </div>
    {/* Other content */}
    <footer>
        <p style={{ marginBottom: "-10px", fontSize: "1.1rem", textAlign: "center" }}>
          <strong>Developed by:</strong> Dr. Kato Samuel Namuene
        </p>
        <p style={{ marginBottom: "-10px", fontSize: "1.1rem", textAlign: "center" }}>
          <strong>Email:</strong> kato.namuene@ubuea.cm
        </p>
    </footer>
</div>
  );
};

export default Welcome;
