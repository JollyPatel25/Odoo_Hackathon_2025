import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.get("http://localhost:5000/api/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate("/");
      } catch (err) {
        localStorage.removeItem("token");
      }
    };
    validateToken();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Sign up</h2>
        <p className="subtitle">Sign up to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
  <label>Confirm Password</label>
  <input
    name="confirm"
    type="password"
    value={form.confirm}
    onChange={handleChange}
    required
  />
</div>

          <button type="submit" className="signup-btn">Sign up</button>

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember"> Remember me</label>
          </div>

          
        </form>
      </div>

      <p className="signin-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
