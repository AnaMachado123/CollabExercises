// src/pages/Dashboard.jsx
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const initials =
    user?.name?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "??";

  //  states
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [search, setSearch] = useState(""); 
  const [difficulty, setDifficulty] = useState("All");


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  //  FETCH com search + subject
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (selectedSubject !== "All") params.append("subject", selectedSubject);

        const data = await apiRequest(`/exercises?${params.toString()}`);
        setExercises(data);
      } catch (err) {
        setError(err.message || "Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [search, selectedSubject]);

  const subjects = ["All", ...new Set(
    exercises.map(e => e.subject).filter(Boolean)
  )];

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="dashboard-logo-text">CollabExercises</span>
        </div>

        <div className="header-center">
          <nav className="dashboard-nav">
            <button className="nav-link nav-link--active">Home</button>
            <button className="nav-link">My Exercises</button>
            <button className="nav-link">My Solutions</button>
            <button className="nav-link">My Saved</button>
          </nav>
        </div>

        <div className="header-right">
          <div className="dashboard-user-circle" title={user?.name}>
            {initials}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="dashboard-main">
        {/* LADO ESQUERDO */}
        <section className="dashboard-left">
          {/*  Search */}
          <div className="dashboard-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search Exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="dashboard-filters">
            {subjects.map((subj) => (
              <button
                key={subj}
                className={`filter-pill ${selectedSubject === subj ? "filter-pill--active" : ""}`}
                onClick={() => setSelectedSubject(subj)}
                type="button"
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Estados */}
          {loading && <p>Loading exercises...</p>}
          {error && <p className="error-text">{error}</p>}

          {/* Lista */}
          {!loading && !error && exercises.map((ex) => (
            <article className="exercise-card" key={ex._id}>
              <div className="exercise-card-body">
                <h3 className="exercise-title">{ex.title}</h3>

                <div className="exercise-tags-row">
                  <span className="exercise-tag">{ex.subject}</span>

                  {ex.difficulty && (
                    <span className={`exercise-tag difficulty-pill difficulty-${ex.difficulty.toLowerCase()}`}>
                      {ex.difficulty}
                    </span>
                  )}
                </div>

                <p className="exercise-description clamp-3">
                  {ex.description}
                </p>
              </div>

              <div className="exercise-card-footer">
                <div className="exercise-metrics">
                  <span>
                    <i className="fa-regular fa-bookmark"></i> {ex.savesCount ?? 0}
                  </span>
                  <span>
                    <i className="fa-regular fa-comment"></i> {ex.commentsCount ?? 0}
                  </span>
                  <span>
                    <i className="fa-regular fa-lightbulb"></i> {ex.solutionsCount ?? 0} Solutions
                  </span>
                </div>

                <button
                className="exercise-button"
                onClick={() => navigate(`/exercises/${ex._id}`)}
                >
                    View exercise
                </button>
              </div>
            </article>
          ))}

          {!loading && !error && exercises.length === 0 && (
            <p>No exercises found</p>
          )}
        </section>

        {/* LADO DIREITO */}
        <aside className="dashboard-right">
          <section className="share-card">
            <h2>Share your knowledge</h2>
            <p>
              Post a new exercise and help the community
              <br />
              learn together
            </p>

            <button
              className="share-button"
              onClick={() => navigate("/exercises/new")}
           >
            <span>+ Post new&nbsp;exercise</span>
            </button>

          </section>

          <section className="activity-card">
            <div className="activity-header">
              <span className="activity-icon">
                <i className="fa-regular fa-clock"></i>
              </span>
              <h3>Recent activity</h3>
            </div>

            <div className="activity-item">
              <div className="activity-line">
                <span className="activity-name">Maria Santos</span>
                <span className="activity-action">posted a solution</span>
                <span className="activity-link">QuickSort</span>
              </div>
              <div className="activity-time">2h ago</div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default Dashboard;
