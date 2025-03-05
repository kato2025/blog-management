import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const fetchUser = useCallback(async () => {
    if (!token) {
      console.log("No token found.");
      return;
    }

    try {
      console.log("Token before decoding:", token);
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User fetched:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      const decoded = jwtDecode(token); // Decode token immediately
      setUser(decoded); // Set user from decoded token

      await fetchUser(); // Fetch user details from the backend
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
