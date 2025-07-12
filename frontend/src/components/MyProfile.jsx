// src/pages/MyProfile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    skillsOffered: [],
    skillsWanted: [],
    availability: "",
    isPublic: true,
    profilePhoto: "",
  });

  const [newOfferedSkill, setNewOfferedSkill] = useState("");
  const [newWantedSkill, setNewWantedSkill] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addSkill = (type) => {
    if (type === "offered" && newOfferedSkill.trim()) {
      setForm({
        ...form,
        skillsOffered: [...form.skillsOffered, newOfferedSkill.trim()],
      });
      setNewOfferedSkill("");
    } else if (type === "wanted" && newWantedSkill.trim()) {
      setForm({
        ...form,
        skillsWanted: [...form.skillsWanted, newWantedSkill.trim()],
      });
      setNewWantedSkill("");
    }
  };

  const removeSkill = (type, index) => {
    const skills = [...form[type]];
    skills.splice(index, 1);
    setForm({ ...form, [type]: skills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, availability, skillsOffered, skillsWanted } = form;
    if (!name || !availability || skillsOffered.length === 0 || skillsWanted.length === 0) {
      toast.error("Please fill all required fields and add at least one skill in both lists.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/user/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name *</label>
            <input
              type="text"
              name="name"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              className="w-full border p-2 rounded"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-medium">Skills Offered *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newOfferedSkill}
                onChange={(e) => setNewOfferedSkill(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => addSkill("offered")}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skillsOffered.map((skill, i) => (
                <span key={i} className="bg-blue-100 px-2 py-1 rounded text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill("skillsOffered", i)}
                    className="ml-1 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium">Skills Wanted *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newWantedSkill}
                onChange={(e) => setNewWantedSkill(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => addSkill("wanted")}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skillsWanted.map((skill, i) => (
                <span key={i} className="bg-green-100 px-2 py-1 rounded text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill("skillsWanted", i)}
                    className="ml-1 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium">Availability *</label>
            <input
              type="text"
              name="availability"
              className="w-full border p-2 rounded"
              value={form.availability}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Profile *</label>
            <select
              name="isPublic"
              value={form.isPublic ? "public" : "private"}
              onChange={(e) => setForm({ ...form, isPublic: e.target.value === "public" })}
              className="w-full border p-2 rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
