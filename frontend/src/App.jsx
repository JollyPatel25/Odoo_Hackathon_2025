import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import MyProfile from "./components/MyProfile";
import Home from "./components/Home";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let didTimeout = false;

    const timeout = setTimeout(() => {
      didTimeout = true;
      controller.abort(); // abort if backend takes too long
      setAuthorized(false);
      setLoading(false);
    }, 8000); // wait for 8 seconds max

    axios
      .get("http://localhost:5000/api/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then(() => {
        if (!didTimeout) {
          setAuthorized(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setAuthorized(false);
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => controller.abort();
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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ToastContainer added globally once */}
      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}
