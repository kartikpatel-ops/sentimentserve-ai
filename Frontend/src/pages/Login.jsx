import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

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
      "https://sentimentserve-ai.onrender.com/api/auth/login",
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

    // Save login token
    localStorage.setItem("token", data.token);

    // Save user information
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
    navigate("/");

    alert("Login successful!");

    navigate("/");
  } catch (error) {
    console.error("Login error:", error);
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