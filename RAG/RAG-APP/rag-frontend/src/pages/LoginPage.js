import React, { useState } from "react";
import { Link } from "react-router-dom";

const Loginpage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="auth-container">
      <form aria-label="form" className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button id="login-btn" type="submit">
          Login
        </button>
        <div className="auth-link">
          <Link to="/signup">New User? Signup</Link>
        </div>
      </form>
    </div>
  );
};

export default Loginpage;
