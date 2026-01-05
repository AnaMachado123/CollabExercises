import "./CreateExercise.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

const subjects = [
  "Algebra",
  "Linear Algebra",
  "Calculus",
  "Discrete Mathematics",
  "Statistics",
  "Probability",
  "Math",
  "Algorithms",
  "Data Structures",
  "Programming",
  "Object-Oriented Programming",
  "Software Engineering",
  "Web Development",
  "Mobile Development",
  "Databases",
  "Operating Systems",
  "Networks",
  "Computer Architecture",
  "Cybersecurity",
  "Artificial Intelligence",
  "Machine Learning",
  "Economics",
  "Management",
  "Accounting",
  "Finance",
  "Marketing",
  "Operations Management",
  "Physics",
  "English",
  "French",
  "Project Management",
  "Education",
];

export default function EditExercise() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    difficulty: "",
    files: [], // ✅ novos ficheiros (opcional)
  });

  const [currentFiles, setCurrentFiles] = useState([]); // attachments atuais (array)

  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "null"), []);
  const userId = user?._id || user?.id;

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingPage(true);
        setServerError("");

        const ex = await apiRequest(`/exercises/${id}`);

        const creatorId =
          ex?.createdBy?._id ||
          ex?.createdBy?.id ||
          (typeof ex?.createdBy === "string" ? ex.createdBy : null);

        if (userId && creatorId && String(creatorId) !== String(userId)) {
          navigate(`/exercises/${id}`);
          return;
        }

        setForm({
          title: ex?.title || "",
          description: ex?.description || "",
          subject: ex?.subject || "",
          difficulty: ex?.difficulty || "",
          files: [],
        });

        setCurrentFiles(Array.isArray(ex?.attachments) ? ex.attachments : []);
      } catch (err) {
        console.error(err);
        setServerError(err?.message || "Failed to load exercise.");
      } finally {
        setLoadingPage(false);
      }
    };

    if (id) load();
  }, [id, navigate, userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
      setForm((prev) => ({ ...prev, files: Array.from(files || []) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setServerError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("subject", form.subject);
    formData.append("difficulty", form.difficulty);

    // ✅ só manda se escolheram novos (se mandar, substitui attachments no backend)
    if (form.files?.length) {
      form.files.forEach((f) => formData.append("files", f));
    }

    try {
      setSaving(true);
      await apiRequest(`/exercises/${id}`, { method: "PUT", body: formData });
      navigate(`/exercises/${id}`);
    } catch (err) {
      console.error(err);
      setServerError(err?.message || "Failed to save exercise.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="create-exercise-page">
        <div className="create-exercise-card">
          <h1 className="create-title">Loading…</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="create-exercise-page">
      <div className="create-exercise-card">
        <h1 className="create-title">Edit exercise</h1>

        <form onSubmit={handleSave} noValidate>
          <label className="field-label">Title</label>
          <input className="input" name="title" value={form.title} onChange={handleChange} />

          <label className="field-label">Description</label>
          <textarea
            className="textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="row">
            <div className="col">
              <label className="field-label">Subject</label>
              <select className="select" name="subject" value={form.subject} onChange={handleChange}>
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col">
              <label className="field-label">Difficulty</label>
              <select
                className="select"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option value="">Select difficulty</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <label className="field-label">Attachments (optional)</label>

          <div className="file-box">
            <label className="file-button">
              Replace files
              <input
                type="file"
                name="files"
                multiple
                hidden
                onChange={handleChange}
                accept=".pdf,image/*"
              />
            </label>

            <span className="file-text">
              {form.files?.length
                ? `New: ${form.files.length} file(s) selected`
                : currentFiles?.length
                ? `Current: ${currentFiles.length} file(s)`
                : "No attachments"}
            </span>
          </div>

          {currentFiles?.length > 0 && !form.files?.length && (
            <p className="file-hint">
              Current: {currentFiles.map((a) => a.originalName).filter(Boolean).join(", ")}
            </p>
          )}

          {serverError && <p className="error-text">{serverError}</p>}

          <button type="submit" className="submit-button" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button type="button" className="back-link" onClick={() => navigate(`/exercises/${id}`)}>
            ← Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
