// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../components/styles/login.css"; // Import the login.css stylesheet

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting to log in..."); // Log when login attempt starts
    
    try {
      console.log("Logging in with credentials:", { email, password }); // Log the credentials being passed
      await login({ email, password });
      console.log("Login successful"); // Log after successful login
      navigate("/manage"); // Redirect on successful login
    } catch (err) {
      console.error("Login error:", err.message); // Log the error message if login fails
      setError(err.message); // Display the error message
    }
  };

  return (
    <div className="loginform">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
      <div className="loginheader">
        <img className="applogo" src="namuenetecLogo.png" alt="App logo" />
        <h3 className="login">Login</h3>
      </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="loginuser" type="submit">Login</button>
      </form>
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

export default Login;
