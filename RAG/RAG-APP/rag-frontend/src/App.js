import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { login } from "./services/api";
import { toast } from "react-toastify";
import "./styles/main.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      const userData = {
        email,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
        <Route
          path="/chat/:chat_id"
          element={
            user ? <MainPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={
            user ? <MainPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
