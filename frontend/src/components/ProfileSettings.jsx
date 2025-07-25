import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [skillsData, setSkillsData] = useState({});
  const navigate = useNavigate();

  const [offeredCategory, setOfferedCategory] = useState("");
  const [offeredSkill, setOfferedSkill] = useState("");

  const [wantedCategory, setWantedCategory] = useState("");
  const [wantedSkill, setWantedSkill] = useState("");

  useEffect(() => {
    alert("Hello");
    const token = localStorage.getItem("token");
    console.log("Checking token:", token); // keep this for debug
    if (!token) {
    console.error("Fetch error:", err.response?.data || err.message);
    toast.error("Session expired. Please login again.");
    navigate("/login");
    return;
    }


    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Validate token first
        await axios.get("http://localhost:5000/api/auth/validate", { headers });

        // Then fetch user and skills
        const userRes = await axios.get("http://localhost:5000/api/user/me", { headers });
        const skillsRes = await axios.get("http://localhost:5000/api/skills", { headers });

        setUser(userRes.data);
        setSkillsData(skillsRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`http://localhost:5000/api/user/${user._id}`, user, {
        headers: { Authorization: `Bearer ${token}` }
        });

      toast.success("Profile updated");
      setEditMode(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const addSkill = (type) => {
    const skill = type === "offered" ? offeredSkill : wantedSkill;
    const list = type === "offered" ? user.skillsOffered : user.skillsWanted;

    if (!skill || list.includes(skill)) return;

    setUser((prev) => ({
      ...prev,
      [type === "offered" ? "skillsOffered" : "skillsWanted"]: [...list, skill],
    }));
  };

  const removeSkill = (type, skill) => {
    setUser((prev) => ({
      ...prev,
      [type === "offered" ? "skillsOffered" : "skillsWanted"]:
        prev[type === "offered" ? "skillsOffered" : "skillsWanted"].filter((s) => s !== skill),
    }));
  };

  if (!user) return <p>Loading...</p>;

  const skillCategories = Object.keys(skillsData);

  return (
    <div className="profile-settings">
      <h2>My Profile</h2>

      {editMode ? (
        <>
          <input name="name" value={user.name} onChange={handleChange} />
          <input name="location" value={user.location} onChange={handleChange} />

          {/* Skills Offered */}
          <div>
            <h4>Skills Offered:</h4>
            <ul>
              {user.skillsOffered.map((s, i) => (
                <li key={i}>
                  {s} <button onClick={() => removeSkill("offered", s)}>❌</button>
                </li>
              ))}
            </ul>
            <select
              value={offeredCategory}
              onChange={(e) => {
                setOfferedCategory(e.target.value);
                setOfferedSkill("");
              }}
            >
              <option value="">Select Category</option>
              {skillCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              disabled={!offeredCategory}
            >
              <option value="">Select Skill</option>
              {skillsData[offeredCategory]?.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button onClick={() => addSkill("offered")}>Add</button>
          </div>

          {/* Skills Wanted */}
          <div>
            <h4>Skills Wanted:</h4>
            <ul>
              {user.skillsWanted.map((s, i) => (
                <li key={i}>
                  {s} <button onClick={() => removeSkill("wanted", s)}>❌</button>
                </li>
              ))}
            </ul>
            <select
              value={wantedCategory}
              onChange={(e) => {
                setWantedCategory(e.target.value);
                setWantedSkill("");
              }}
            >
              <option value="">Select Category</option>
              {skillCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={wantedSkill}
              onChange={(e) => setWantedSkill(e.target.value)}
              disabled={!wantedCategory}
            >
              <option value="">Select Skill</option>
              {skillsData[wantedCategory]?.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button onClick={() => addSkill("wanted")}>Add</button>
          </div>

          <select name="availability" value={user.availability} onChange={handleChange}>
            <option value="">Select Availability</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
          </select>

          <label>
            <input
              type="checkbox"
              name="profilePublic"
              checked={user.profilePublic}
              onChange={handleChange}
            />
            Make Profile Public
          </label>

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Skills Offered:</strong> {user.skillsOffered.join(", ")}</p>
          <p><strong>Skills Wanted:</strong> {user.skillsWanted.join(", ")}</p>
          <p><strong>Availability:</strong> {user.availability}</p>
          <p><strong>Public:</strong> {user.profilePublic ? "Yes" : "No"}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
}
