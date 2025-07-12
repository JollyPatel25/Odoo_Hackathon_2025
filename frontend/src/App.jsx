import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ProfileSettings from "./components/ProfileSettings"; // ✅ new import
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar"; // ✅ import


function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAuthorized(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setAuthorized(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return authorized ? children : <Navigate to="/login" replace />;
}


export default function App() {
  return (
    <BrowserRouter>
    <Navbar /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <Home />} />

        <Route
          path="/myprofile"
          element={
              <ProfileSettings />
          }
        />
        <Route
        path="*"
        element={<div>
          <center>
            <h1>No Page Found</h1>
          </center>
        </div>}
      ></Route>
      </Routes>
      

      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}
