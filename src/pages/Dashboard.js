import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar"; // Import Navbar

const Dashboard = () => {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [token, navigate]);

  if (!user) return <p>Loading user...</p>;

  return (
    <div>
      <Navbar /> {/* Include Navbar */}
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
