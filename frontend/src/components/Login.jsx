import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/Login.css"; // 👈 create this file in the same folder

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      console.log("Checking token:", token);
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Token valid:", res.data);
        navigate("/");
      } catch (err) {
        console.error("Invalid token:", err.response?.data || err.message);
        localStorage.removeItem("token");
      }
    };
    validateToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Trying login with:", email);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log("Login success:", res.data);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <p className="subtitle">Login to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="john@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
             // placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
      <p className="bottom-text">
        Don’t have an account?{" "}
        <Link to="/register" className="register-link">
          Register here
        </Link>
      </p>
    </div>
  );
}
