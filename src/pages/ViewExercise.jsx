// src/pages/ViewExercise.jsx
import "./ViewExercise.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function ViewExercise() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const data = await apiRequest(`/exercises/${id}`);
        setExercise(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <div className="view-page">
        <div className="view-container skeleton">
          <div className="sk-title"></div>
          <div className="sk-tags"></div>
          <div className="sk-meta"></div>
          <div className="sk-grid">
            <div className="sk-block"></div>
            <div className="sk-block"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="view-page">
      <div className="view-container">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <span onClick={() => navigate("/dashboard")}>Home</span>
          <span className="separator">›</span>
          <span onClick={() => navigate("/dashboard")}>Exercises</span>
          <span className="separator">›</span>
          <span className="active">{exercise.title}</span>
        </div>

        {/* TITLE */}
        <h1 className="view-title">{exercise.title}</h1>

        {/* TAGS */}
        <div className="view-tags">
          <span className="pill subject">{exercise.subject}</span>
          <span className="pill difficulty">{exercise.difficulty}</span>
        </div>

        {/* META */}
        <div className="view-meta">
          Created by <strong>{exercise.createdBy?.name}</strong> ·{" "}
          {new Date(exercise.createdAt).toLocaleDateString()}
        </div>

        {/* METRICS */}
        <div className="view-metrics">
          <span>{exercise.upvotes ?? 0} likes</span>
          <span>{exercise.commentsCount ?? 0} comments</span>
          <span>{exercise.solutionsCount ?? 0} solutions</span>
        </div>

        {/* MAIN CONTENT */}
        <div className="view-grid">
          <section className="view-description">
            <h3>Description</h3>
            <p>{exercise.description}</p>
          </section>

          <aside className="view-attachments">
            <h3>Attached files</h3>

            {exercise.attachments.length === 0 && (
              <p className="empty">No attachments</p>
            )}

            {exercise.attachments.map((file, index) => (
              <a
                key={index}
                className="attachment"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.originalName}
              </a>
            ))}
          </aside>
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default ViewExercise;
