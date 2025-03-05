// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/styles/register.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
  const [username, setUsername] = useState("");  // Use "username" per your backend
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/register`, { username, email, password });
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    }
  };

  return (
    <div className="registerform">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
      <div className="registerheader">
        <img className="applogo" src="namuenetecLogo.png" alt="App logo" />
        <h3 className="register">Register</h3>
      </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button className="registeruser" type="submit">Register</button>
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

export default Register;
