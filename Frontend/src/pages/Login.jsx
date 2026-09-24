import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
} from "lucide-react";

import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      // Store logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful! ✅");

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Cannot connect to backend. Make sure the backend server is running."
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <span>Sentiment</span>Serve AI
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your SentimentServe AI account.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="auth-group">

            <label>Email</label>

            <div className="auth-input">

              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

          </div>

          {/* Password */}
          <div className="auth-group">

            <label>Password</label>

            <div className="auth-input">

              <Lock size={18} />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

          </div>

          {/* Login button */}
          <button
            className="auth-btn"
            type="submit"
          >
            <LogIn size={18} />
            Login
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;