import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../pages/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchIn, setSearchIn] = useState("both");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profiles", {
        params: {
          availability: availabilityFilter,
          search,
          searchIn,
          page,
        },
      });
      setProfiles(res.data.profiles);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      toast.error("Failed to fetch profiles.");
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [availabilityFilter, search, searchIn, page]);

  const handleRequest = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("You need to login to send a request.");
      return navigate("/login");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/swap/request",
        { toUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Swap request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <div className="home-screen">
      <div className="container">
        <h1 className="page-title">Skill Swap Platform</h1>

        <div className="filter-bar">
          <select
            className="select-input"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="">All Availability</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
          </select>

          <select
            className="select-input"
            value={searchIn}
            onChange={(e) => setSearchIn(e.target.value)}
          >
            <option value="both">Search in: Both</option>
            <option value="offered">Skills Offered</option>
            <option value="wanted">Skills Wanted</option>
          </select>

          <input
            type="text"
            placeholder="Search by name or skill"
            className="text-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="search-btn" onClick={fetchProfiles}>
            Search
          </button>
        </div>

        {profiles.map((user) => (
          <div key={user._id} className="profile-card">
            <div className="profile-header">
              <div className="profile-info">
                {(() => {
                    const imageUrl = user.profilePhoto
                        ? `http://localhost:5000/uploads/${user.profilePhoto}`
                        : "/default-avatar.png";
                    console.log(`Image for ${user.name}:`, imageUrl);
                    return (
                        <img
                        src={imageUrl}
                        alt="Profile"
                        className="avatar"
                        />
                    );
                    })()}

                <div>
                  <h2 className="user-name">{user.name}</h2>
                  <p className="availability">Availability: {user.availability}</p>
                </div>
              </div>

              <button
                onClick={() => handleRequest(user._id)}
                className="request-btn"
              >
                Request
              </button>
            </div>

            <div className="profile-body">
              <p>
                <strong>Skills Offered:</strong>{" "}
                {user.skillsOffered.map((s, i) => (
                  <span key={i} className="tag tag-offered">{s}</span>
                ))}
              </p>
              <p>
                <strong>Skills Wanted:</strong>{" "}
                {user.skillsWanted.map((s, i) => (
                  <span key={i} className="tag tag-wanted">{s}</span>
                ))}
              </p>
              <p className="rating">Rating: {user.rating || "N/A"}/5</p>
            </div>
          </div>
        ))}

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`page-btn ${page === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
