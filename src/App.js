import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import PostList from "./components/PostList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome"; // Import Welcome Page
import axios from "axios";
import Navbar from "./components/Navbar"; // Import the Navbar component
import "./App.css";

function App() {
  const { token, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [token]);

  // Filter posts to show only those created by the logged-in user
  const userPosts = user ? posts.filter((post) => post.authorId === user.id) : [];

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Always render Welcome.js for the Home route */}
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/manage"
            element={
              <div>
                <div className="page-header">
                  <img className="App-logo" src="namuenetecLogo.png" alt="App logo" />
                  {user && user.username && (
                    <h2 className="greeting">
                      Welcome, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!
                </h2>
                  )}
              </div>
                  <PostList posts={userPosts} />
              </div>
            }
          />
        </Route>

        {/* Redirect any unknown route to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
