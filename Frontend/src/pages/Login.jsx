import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    alert("Login UI is working. Backend authentication will be connected later.");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <span>Sentiment</span>Serve AI
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue to your account.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="auth-group">
            <label>Email</label>

            <div className="auth-input">
              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-group">
            <label>Password</label>

            <div className="auth-input">
              <Lock size={18} />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="auth-btn" type="submit">
            <LogIn size={18} />
            Login
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;