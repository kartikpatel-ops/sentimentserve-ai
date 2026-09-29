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
  const [company, setCompany] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

 if (!name || !email || !password || !company) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch(
      "https://sentimentserve-ai.onrender.com/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  name,
  email,
  password,
  company,
})
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Signup failed.");
      return;
    }

    alert("Account created successfully!");

    navigate("/login");
  } catch (error) {
    console.error("Signup error:", error);
    alert("Cannot connect to the server.");
  }
};

  return (
    <div className="auth-page">
      <button
  className="back-home-btn"
  onClick={() => navigate("/")}
>
  ← Back to Home
</button>

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
  <label>Business Name</label>

  <div className="auth-input">
    <User size={18} />

    <input
      type="text"
      placeholder="Enter your business name"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
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