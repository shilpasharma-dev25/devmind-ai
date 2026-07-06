import { deleteError, updateError, analyzeError } from "../services/api";
import { useState } from "react";

const ErrorList = ({ errors, setErrors }) => {
  const [aiResult, setAiResult] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleDelete = async (id) => {
    try {
      await deleteError(id);

      setErrors(
        errors.filter((err) => err._id !== id)
      );
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

  const handleAI = async (errorMessage) => {
    try {
      setLoadingAI(true);

      const res = await analyzeError({
        errorMessage,
      });

      console.log("AI Response:", res.data);

      setAiResult(res.data.data);
    } catch (err) {
      console.log("AI Error:", err.message);

      setAiResult("AI analysis failed.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div>
      <h2>Errors</h2>

      {/* AI RESULT BOX */}
      {aiResult && (
        <div
          style={{
            background: "#eef",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <h3>🤖 AI Analysis</h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {typeof aiResult === "string"
              ? aiResult
              : JSON.stringify(aiResult, null, 2)}
          </pre>
        </div>
      )}

      {errors.length === 0 && (
        <p>No errors found. Add your first error 🚀</p>
      )}

      {errors.map((err) => (
        <div
          key={err._id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{err.title}</h3>

          <p>{err.errorMessage}</p>

          <small>
            Technology: {err.technology}
          </small>

          <p>
            Status:{" "}
            <strong
              style={{
                color:
                  err.status === "Solved"
                    ? "green"
                    : "orange",
              }}
            >
              {err.status}
            </strong>
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() =>
                handleSolve(err._id)
              }
            >
              Mark as Solved
            </button>

            <button
              onClick={() =>
                handleDelete(err._id)
              }
            >
              Delete
            </button>

            <button
              onClick={() =>
                handleAI(err.errorMessage)
              }
              disabled={loadingAI}
              style={{
                background: "blue",
                color: "white",
              }}
            >
              {loadingAI
                ? "Analyzing..."
                : "Explain with AI"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ErrorList;