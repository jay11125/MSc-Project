import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate("/login");
      toast.success("Signed up successfully");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <form aria-label="form" className="auth-form" onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button id="signup-btn" type="submit">
          Signup
        </button>
        <div className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
