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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check fields
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Send signup data to backend
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      // Registration successful
      alert("Account created successfully! ✅");

      // Go to login page
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);

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
                required
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
                required
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
                minLength={6}
                required
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