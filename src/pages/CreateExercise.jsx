import "./CreateExercise.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function CreateExercise() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    difficulty: "",
    files: null,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ SUBJECTS
  const subjects = [
    // Engineering & Tech
    "Math",
    "Algorithms",
    "Data Structures",
    "Programming",
    "Software Engineering",
    "Web Development",
    "Databases",
    "Operating Systems",
    "Networks",
    "Computer Architecture",

    // Business & Economics
    "Economics",
    "Management",
    "Accounting",
    "Finance",
    "Marketing",
    "Operations Management",

    // Sciences
    "Physics",
    "Statistics",

    // Languages
    "English",
    "French",

    // General
    "Project Management",
    "Education",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.subject) newErrors.subject = "Subject is required.";
    if (!form.difficulty) newErrors.difficulty = "Difficulty is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("description", form.description);
  formData.append("subject", form.subject);
  formData.append("difficulty", form.difficulty);

  if (form.files) {
    Array.from(form.files).forEach((file) => {
      formData.append("files", file);
    });
  }

  try {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/exercises", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="create-exercise-page">
      <div className="create-exercise-card">
        <h1 className="create-title">Post new exercise</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* TITLE */}
          <label className="field-label">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Exercise title"
            value={form.title}
            onChange={handleChange}
            className="input"
          />
          {errors.title && <p className="error-text">{errors.title}</p>}

          {/* DESCRIPTION */}
          <label className="field-label">Description</label>
          <textarea
            name="description"
            placeholder="Describe the exercise"
            value={form.description}
            onChange={handleChange}
            className="textarea"
          />
          {errors.description && (
            <p className="error-text">{errors.description}</p>
          )}

          {/* SUBJECT + DIFFICULTY */}
          <div className="row">
            <div className="col">
              <label className="field-label">Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="select"
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="error-text">{errors.subject}</p>
              )}
            </div>

            <div className="col">
              <label className="field-label">Difficulty</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="select"
              >
                <option value="">Select difficulty</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="error-text">{errors.difficulty}</p>
              )}
            </div>
          </div>

          {/* ATTACHMENTS */}
          <label className="field-label">Attachments</label>
          <div className="file-box">
            <label className="file-button">
              Select files
              <input
                type="file"
                name="files"
                multiple
                hidden
                onChange={handleChange}
              />
            </label>
            <span className="file-text">
              {form.files
                ? `${form.files.length} file(s) selected`
                : "No files selected"}
            </span>
          </div>
          <p className="file-hint">
            You can add images or PDFs (optional)
          </p>

          {serverError && <p className="error-text">{serverError}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post exercise"}
          </button>

          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/dashboard")}
          >
            ← Go back to dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateExercise;
