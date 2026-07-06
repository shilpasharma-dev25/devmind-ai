import { useState } from "react";
import {
  deleteError,
  updateError,
  analyzeError,
} from "../services/api";

import "./ErrorList.css";

const ErrorList = ({ errors, setErrors }) => {
  const [loadingId, setLoadingId] = useState(null);

  const [aiResults, setAiResults] = useState({});

  const handleDelete = async (id) => {
    try {
      await deleteError(id);

      setErrors(errors.filter((err) => err._id !== id));
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  const handleSolve = async (id) => {
    try {
      const res = await updateError(id, {
        status: "Solved",
      });

      setErrors(
        errors.map((err) =>
          err._id === id ? res.data.data : err
        )
      );
    } catch (error) {
      console.log("Update Error:", error);
    }
  };

  const handleAI = async (err) => {
    // Collapse if already open
    if (aiResults[err._id]) {
      setAiResults((prev) => {
        const updated = { ...prev };
        delete updated[err._id];
        return updated;
      });

      return;
    }

    try {
      setLoadingId(err._id);

      const res = await analyzeError({
        errorMessage: err.errorMessage,
      });

      setAiResults((prev) => ({
        ...prev,
        [err._id]: res.data.data,
      }));
    } catch (error) {
      setAiResults((prev) => ({
        ...prev,
        [err._id]: "AI analysis failed.",
      }));

      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  if (errors.length === 0) {
    return (
      <p className="empty-message">
        🚀 No errors found. Add your first error.
      </p>
    );
  }

  return (
    <div className="error-list">
      {errors.map((err) => (
        <div className="error-card" key={err._id}>
          <h3>{err.title}</h3>

          <p className="error-message">
            {err.errorMessage}
          </p>

          <p className="technology">
            <strong>Technology:</strong>{" "}
            {err.technology}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                err.status === "Solved"
                  ? "status solved"
                  : "status pending"
              }
            >
              {err.status}
            </span>
          </p>

          <div className="button-group">
            <button
              className="solve-btn"
              onClick={() =>
                handleSolve(err._id)
              }
            >
              ✔ Mark Solved
            </button>

            <button
              className="delete-btn"
              onClick={() =>
                handleDelete(err._id)
              }
            >
              🗑 Delete
            </button>

            <button
              className="ai-btn"
              disabled={loadingId === err._id}
              onClick={() => handleAI(err)}
            >
              {loadingId === err._id
                ? "Analyzing..."
                : aiResults[err._id]
                ? "Hide AI"
                : "✨ Explain with AI"}
            </button>
          </div>

      {aiResults[err._id] && (
  <div className="ai-box">
    <h4>🤖 AI Analysis</h4>

    {typeof aiResults[err._id] === "object" ? (
      <>
        <div className="ai-section">
          <h5>📖 Explanation</h5>

          <p>
            {aiResults[err._id].explanation}
          </p>
        </div>

        <div className="ai-section">
          <h5>🔍 Root Cause</h5>

          <p>
            {aiResults[err._id].rootCause}
          </p>
        </div>

        <div className="ai-section">
          <h5>🛠 Solution</h5>

          <ol>
            {aiResults[err._id].solution
              ?.split(/\d+\)/)
              .filter((item) => item.trim() !== "")
              .map((step, index) => (
                <li key={index}>
                  {step.trim()}
                </li>
              ))}
          </ol>
        </div>
      </>
    ) : (
      <p>{aiResults[err._id]}</p>
    )}
  </div>
)}
        </div>
      ))}
    </div>
  );
};

export default ErrorList;