import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserPlus,
} from "lucide-react";

import "../App.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    alert("Signup UI is working. Backend registration will be connected later.");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <span>Sentiment</span>Serve AI
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join SentimentServe AI today.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="auth-group">
            <label>Full Name</label>

            <div className="auth-input">
              <User size={18} />

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="auth-btn" type="submit">
            <UserPlus size={18} />
            Create Account
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
}

export default Signup;